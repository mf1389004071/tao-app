import { initChunkUpload, uploadChunk, completeChunkUpload } from '@/api/system/chunkUpload'
import modal from "@/plugins/modal";
import { getFileExtension } from "@/utils/fileOper";


/**
 * 微信小程序分片上传工具类
 */
export class WxChunkUploader {
    constructor(config = {}) {
        this.chunkSize = config.chunkSize || 15 * 1024 * 1024;  //默认分片大小，为 15MB
        this.lastDisplayPercent = 0;  //初始化上次显示的上传进度百分比为0
    }

    /**
   * 执行分片上传
   * @param {Object} options - 上传选项
   * @param {Function} options.onSuccess - 成功回调
   * @param {Function} options.onError - 错误回调
   */
    async upload(options) {
        const { file, onSuccess, onError } = options;

        try {
            // 1. 校验数据
            this._validateParams(file);

            // 2. 准备上传数据
            modal.loading("准备上传...");
            const uploadData = await this._prepareUploadData(file);

            // 3. 执行分片上传
            modal.closeLoading();
            modal.loading("上传中...");
            const partETags = await this._uploadChunks(uploadData);

            // 4. 合并文件
            modal.closeLoading();
            modal.loading("合并文件中...");

            //模仿上传的时间，可删除
            await new Promise(resolve => setTimeout(resolve, 5000));

            await this._completeUpload(uploadData, partETags);

            setTimeout(() => {
                onSuccess?.({ success: true });
            }, 1000);

            return true;
        } catch (error) {
            console.error("分片上传失败:", error);
            modal.closeLoading();
            modal.msgError("上传失败");
            onError?.(error);
            return false;
        }
    }



    /**
     * 校验参数
     */
    _validateParams(file) {
        if (!file.path) throw new Error("文件路径不存在");
        if (!file.size) throw new Error("文件大小不存在");
    }

    /**
     * 准备上传数据
     */
    async _prepareUploadData(file) {
        const fileSize = file.size;
        const tempFilePath = file.path;
        const uploadFileName = `weixin_${Date.now()}.${getFileExtension(tempFilePath)}`;
        const chunkCount = Math.ceil(fileSize / this.chunkSize);

        console.log("分片数量:", chunkCount);

        // 初始化分片上传
        const initResult = await initChunkUpload(uploadFileName, fileSize);
        if (initResult.code !== 200) throw new Error("初始化上传失败");
        return {
            uploadId: initResult.data.uploadId,
            filePath: initResult.data.filePath,
            uploadFileName: uploadFileName,
            fileSize: fileSize,
            chunkCount: chunkCount,
            tempFilePath: tempFilePath,
        };
    }


    /**
     * 上传所有分片
     */
    //     return {
    //     uploadId: initResult.data.uploadId,
    //     filePath: initResult.data.filePath,
    //     fileName:initResult.data.fileName,
    //     fileSize:fileSize,
    //     chunkCount: chunkCount,
    // };

    async _uploadChunks(uploadData) {
        const { uploadId, filePath, fileSize, chunkCount, tempFilePath } = uploadData;
        const fileManager = uni.getFileSystemManager();
        const partETags = [];

        for (let i = 0; i < chunkCount; i++) {
            const start = i * this.chunkSize;
            const end = Math.min(start + this.chunkSize, fileSize);
            const tempChunkPath = `${wx.env.USER_DATA_PATH}/chunk_${i}.tmp`;

            // 读取并写入分片
            await this._processChunk(fileManager, tempFilePath, tempChunkPath, start, end - start);

            // 上传分片
            const response = await uploadChunk(uploadId, filePath, i, tempChunkPath);

            if (response.data?.etag) {
                partETags.push({
                    partNumber: i + 1,
                    ETag: response.data.etag,
                });
            }
            // 清理临时文件
            this._cleanupTempFile(fileManager, tempChunkPath);

            // 更新进度 - 确保完全执行完毕
            this._updateProgress(i, chunkCount);

        }

        return partETags;
    }

    /**
     * 处理单个分片
     */
    async _processChunk(fileManager, tempFilePath, tempChunkPath, start, length) {
        // 读取分片数据
        const readRes = await new Promise((resolve, reject) => {
            fileManager.readFile({
                filePath: tempFilePath,
                position: start,
                length: length,
                success: (res) => resolve(res.data),
                fail: reject,
            });
        });

        // 写入临时文件
        await new Promise((resolve, reject) => {
            fileManager.writeFile({
                filePath: tempChunkPath,
                data: readRes,
                success: resolve,
                fail: reject,
            });
        });
    }


    /**
     * 清理临时文件
     */
    _cleanupTempFile(fileManager, tempChunkPath) {
        try {
            fileManager.unlinkSync(tempChunkPath);
            console.log("删除临时文件成功:", tempChunkPath);
        } catch (e) {
            console.error("删除临时文件错误:", e);
        }
    }


    /**
     * 更新上传进度
     */
    _updateProgress(currentIndex, totalCount) {
        const percent = Math.floor(((currentIndex + 1) / totalCount) * 100);
        const displayPercent = Math.floor(percent / 20) * 20;
        if (displayPercent !== this.lastDisplayPercent || currentIndex === totalCount - 1) {
            modal.closeLoading();
            modal.loading(`上传中${displayPercent}%`);
            this.lastDisplayPercent = displayPercent;
        }
    }

    /**
     * 完成上传
     */
    async _completeUpload(uploadData, partETags) {
        const { uploadId, filePath, fileSize, uploadFileName } = uploadData;
        await completeChunkUpload(uploadId, filePath, fileSize, uploadFileName, partETags);

    }

}
export const wxChunkUploader = new WxChunkUploader();