import { initChunkUpload, uploadChunk, completeChunkUpload } from '@/api/system/chunkUpload'
import modal from "@/plugins/modal";
import { UploadOptions, File, UploadData, PartETag } from "@/types/upload";

// 声明微信小程序全局对象
declare const wx: any;

/**
 * 微信小程序分片上传工具类
 * 
 * 该类专门用于在微信小程序环境下处理大文件的分片上传功能
 * 支持自定义分片大小、上传进度显示、错误处理等功能
 */
export class WxChunkUploader {

    /** 分片大小，单位字节 */
    private chunkSize: number;

    /** 上次显示的上传进度百分比 */
    private lastDisplayPercent: number;

    /**
     * 构造函数
     * @param config 配置对象
     * @param config.chunkSize 分片大小（字节），默认15MB
     */
    constructor() {
        this.chunkSize = 15 * 1024 * 1024;  //默认分片大小，为 15MB
        this.lastDisplayPercent = 0;  //初始化上次显示的上传进度百分比为0
    }

    /**
     * 执行分片上传的主方法
     * 
     * @param options - 上传选项配置
     * @param options.file - 要上传的文件对象
     * @param options.onSuccess - 上传成功时的回调函数
     * @param options.onError - 上传失败时的回调函数
     * @returns Promise<boolean> - 上传是否成功
     */
    async upload(options: UploadOptions): Promise<boolean> {
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
            // await new Promise(resolve => setTimeout(resolve, 5000));

            await this._completeUpload(uploadData, partETags);

            setTimeout(() => {
                modal.closeLoading();
                onSuccess?.({ success: true });
            }, 1000);

            return true;
        } catch (error) {
            modal.closeLoading();
            const errorMessage = error instanceof Error ? error.message : '上传失败';
            onError?.(errorMessage);
            return false;
        }
    }
    /**
     * 校验上传参数
     * 
     * @param file - 要上传的文件对象
     * @throws {Error} 当文件路径不存在时抛出错误
     * @throws {Error} 当文件大小不存在时抛出错误
     */
    _validateParams(file: File) {
        if (!file.path) throw new Error("文件路径不存在");
        if (!file.size) throw new Error("文件大小不存在");
    }

    /**
     * 准备上传数据
     * 
     * @param file - 要上传的文件对象
     * @returns Promise<UploadData> - 包含上传ID、文件路径、分片数量等信息的数据对象
     * @throws {Error} 当初始化上传失败时抛出错误
     */
    async _prepareUploadData(file: File) {
        try {
            const fileSize = file.size;
            const filePath = file.path;
            const uploadFileName = `weixin_${Date.now()}.${this.getFileExtension(filePath)}`;
            const chunkCount = Math.ceil(fileSize / this.chunkSize);

            // 初始化分片上传
            const initResult = await initChunkUpload(uploadFileName, fileSize);
            if (initResult.code !== 200) throw new Error("初始化上传失败");

            return {
                uploadId: initResult.data.uploadId,
                saveFilePath: initResult.data.filePath,
                uploadFileName: uploadFileName,
                fileSize: fileSize,
                chunkCount: chunkCount,
                filePath: filePath,
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '准备上传数据失败';
            throw new Error(`${errorMessage}`);
        }

    }


    /**
     * 执行分片上传循环
     * 
     * @param uploadData - 上传数据对象，包含上传ID、文件信息等
     * @returns Promise<PartETag[]> - 返回所有分片的ETag信息数组
     * @throws {Error} 当分片上传失败时抛出错误
     */
    async _uploadChunks(uploadData: UploadData) {
        try {
            const { uploadId, saveFilePath, fileSize, chunkCount, filePath } = uploadData;
            const fileManager = uni.getFileSystemManager();
            const partETags: PartETag[] = [];

            for (let i = 0; i < chunkCount; i++) {
                const start = i * this.chunkSize;
                const end = Math.min(start + this.chunkSize, fileSize);
                const tempChunkPath = `${wx.env.USER_DATA_PATH}/chunk_${i}.tmp`;

                // 读取并写入分片
                await this._processChunk(fileManager, filePath, tempChunkPath, start, end - start);

                // 上传分片
                const response = await uploadChunk(uploadId, saveFilePath, i, tempChunkPath);

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

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : '上传分片失败';
            throw new Error(errorMessage);
        }

    }

    /**
     * 处理单个分片数据
     * 
     * @param fileManager - uni-app文件系统管理器实例
     * @param filePath - 原始文件的完整路径
     * @param tempChunkPath - 临时分片文件的保存路径
     * @param start - 在原始文件中的起始位置
     * @param length - 要读取的数据长度
     * @returns Promise<void> - 操作完成的Promise
     * @throws {Error} 当文件读取或写入失败时抛出错误
     */
    async _processChunk(fileManager: UniApp.FileSystemManager, filePath: string, tempChunkPath: string, start: number, length: number) {
        const readRes = await new Promise<ArrayBuffer | string>((resolve, reject) => {
            fileManager.readFile({
                filePath: filePath,
                position: start,
                length: length,
                success: (res: any) => resolve(res.data as ArrayBuffer | string),
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
     * 清理临时分片文件
     * 
     * @param fileManager - uni-app文件系统管理器实例
     * @param tempChunkPath - 要删除的临时文件路径
     * @throws {Error} 当文件删除失败时抛出错误
     */
    _cleanupTempFile(fileManager: UniApp.FileSystemManager, tempChunkPath: string) {
        try {
            fileManager.unlinkSync(tempChunkPath);
        } catch (e) {
            throw new Error("删除临时文件错误");
        }
    }


    /**
     * 更新上传进度显示
     * 
     * @param currentIndex - 当前完成的分片索引（从0开始）
     * @param totalCount - 总分片数量
     */
    _updateProgress(currentIndex: number, totalCount: number) {
        const percent = Math.floor(((currentIndex + 1) / totalCount) * 100);
        const displayPercent = Math.floor(percent / 20) * 20;
        if (displayPercent !== this.lastDisplayPercent || currentIndex === totalCount - 1) {
            modal.closeLoading();
            modal.loading(`上传中${displayPercent}%`);
            this.lastDisplayPercent = displayPercent;
        }
    }

    /**
     * 完成分片上传并合并文件
     * 
     * @param uploadData - 上传数据对象，包含上传ID等关键信息
     * @param partETags - 所有分片的ETag信息数组，用于验证分片完整性
     * @returns Promise<void> - 合并操作完成的Promise
     * @throws {Error} 当文件合并失败时抛出错误
     */
    async _completeUpload(uploadData: UploadData, partETags: PartETag[]) {
        try {
            const { uploadId, saveFilePath, fileSize, uploadFileName } = uploadData;
            await completeChunkUpload(uploadId, saveFilePath, fileSize, uploadFileName, partETags);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : '上传失败';
            throw new Error(errorMessage);
        }
    }

    /**
     * 获取文件扩展名
     * 
     * @param filePath - 文件的完整路径
     * @returns string - 文件扩展名（不包含点号，如：'jpg', 'mp4', 'pdf'）
     * @example
     * getFileExtension('/path/to/video.mp4') // 返回 'mp4'
     * getFileExtension('/path/to/image.JPG') // 返回 'jpg'
     * getFileExtension('/path/to/file') // 返回 ''
     */
    getFileExtension(filePath: string): string {
        if (!filePath) {
            return "";
        }
        // 查找最后一个点号位置
        const dotIndex = filePath.lastIndexOf(".");
        if (dotIndex === -1) {
            return ""; // 没有找到扩展名
        }
        // 从点号后面提取扩展名
        return filePath.substring(dotIndex + 1).toLowerCase();
    };


}


export const wxChunkUploader = new WxChunkUploader();