import modal from '@/plugins/modal'
import {
    deleteLocalFile,
    copyFileToSandbox,
    readAppFileChunk,
    getFileName,
    deleteTempFile,
    createAndWriteTempFile
} from "@/utils/fileOper"
import { initChunkUpload, uploadChunk, completeChunkUpload } from '@/api/system/chunkUpload'

/**
 * APP端分片上传工具类
 */
class AppChunkUploader {
    constructor(options = {}) {
        this.config = {
            chunkSize: 15 * 1024 * 1024, // 默认分片大小15MB
            concurrentLimit: 2, // 并发上传的分片数量
            ...options
        }
    }

    /**
     * 获取切片end位置
     * @param {number} start - 开始位置
     * @param {number} chunkSize - 分片大小
     * @param {number} fileSize - 文件总大小
     * @param {number} index - 分片索引
     * @param {number} totalChunks - 总分片数
     * @returns {number} end位置
     */
    getSliceEnd(start, chunkSize, fileSize, index, totalChunks) {
        return index < totalChunks - 1 ? start + chunkSize - 1 : fileSize
    }



    /**
     * APP端分片上传单个分片
     * @param {string} uploadId - 上传ID
     * @param {string} filePath - 文件路径
     * @param {number} chunkIndex - 分片索引
     * @param {ArrayBuffer} chunk - 分片数据
     * @returns {Promise} 上传结果
     */
    async uploadAppChunk(uploadId, filePath, chunkIndex, chunk) {
        try {
            const response = await this.startUploadAppChunk(uploadId, filePath, chunkIndex, chunk)
            return response
        } catch (error) {
            throw error
        }
    }

    /**
     * 执行APP端分片上传
     * @param {string} uploadId - 上传ID
     * @param {string} filePath - 文件路径
     * @param {number} chunkIndex - 分片索引
     * @param {ArrayBuffer} chunk - 分片数据
     * @returns {Promise} 上传结果
     */
    startUploadAppChunk(uploadId, filePath, chunkIndex, chunk) {
        return new Promise(async (resolve, reject) => {
            try {
                // 1. 准备临时文件信息
                const tempFileName = `temp_chunk/chunk_${uploadId}_${chunkIndex}.bin`
                const tempDirPath = plus.io.PRIVATE_DOC

                // 2. 创建并写入临时文件
                const tempFilePath = await createAndWriteTempFile(
                    tempDirPath,
                    tempFileName,
                    chunk
                )

                //设置文件的全路径
                let formattedPath = tempFilePath
                if (tempFilePath && !tempFilePath.startsWith("file://")) {
                    formattedPath = `file://${tempFilePath}`
                }

                // 3. 上传文件
                const result = await uploadChunk(uploadId, filePath, chunkIndex, formattedPath)

                // 4. 删除临时文件
                await deleteTempFile(tempDirPath, tempFileName)

                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * 并发上传分片
     * @param {Array} tasks - 分片任务数组
     * @param {number} batchSize - 批次大小
     * @param {string} uploadId - 上传ID
     * @param {string} filePath - 文件路径
     * @param {string} localFilePath - 本地文件路径
     * @param {Array} partETags - 分片ETag数组
     * @param {Object} progressInfo - 进度信息对象
     * @returns {Promise<Array>} 上传结果数组
     */
    async uploadChunksInBatches(tasks, batchSize, uploadId, filePath, localFilePath, partETags, progressInfo) {
        const results = []
        const { chunkCount } = progressInfo
        
        for (let i = 0; i < tasks.length; i += batchSize) {
            const batch = tasks.slice(i, i + batchSize)
            
            try {
                const batchResults = await Promise.all(
                    batch.map((task) => this.uploadChunkConcurrently(task, uploadId, filePath, localFilePath, partETags, progressInfo))
                )
                results.push(...batchResults)
            } catch (error) {
                // 如果批次中有任何分片失败，立即停止上传
                throw error
            }
        }
        return results
    }

    /**
     * 并发上传单个分片
     * @param {Object} chunkTask - 分片任务
     * @param {string} uploadId - 上传ID
     * @param {string} filePath - 文件路径
     * @param {string} localFilePath - 本地文件路径
     * @param {Array} partETags - 分片ETag数组
     * @param {Object} progressInfo - 进度信息对象
     * @returns {Promise} 上传结果
     */
    async uploadChunkConcurrently(chunkTask, uploadId, filePath, localFilePath, partETags, progressInfo) {
        const { index, start, end } = chunkTask
        const { chunkCount } = progressInfo
        
        const chunk = await readAppFileChunk(localFilePath, start, end - start)
        
        const response = await this.uploadAppChunk(uploadId, filePath, index, chunk)

        if (response.data && response.data.etag) {
            partETags[index] = {
                partNumber: index + 1,
                ETag: response.data.etag,
            }
        }
        
        progressInfo.completedChunks++
        const percent = Math.floor((progressInfo.completedChunks / chunkCount) * 100)
        const displayPercent = Math.floor(percent / 10) * 10 // 每10%更新一次

        if (displayPercent !== progressInfo.uploadProgress || progressInfo.completedChunks === chunkCount) {
            modal.closeLoading()
            modal.loading(`上传中 ${percent}% (请勿离开此页面)`)
            progressInfo.uploadProgress = displayPercent
        }

        return response
    }

    /**
     * 主要的分片上传方法
     * @param {Object} options - 上传选项
     * @param {Object} options.file - 文件对象（包含path和size属性）
     * @param {string} options.filePath - 文件路径（如果提供file，此参数可选）
     * @param {string} options.fileName - 文件名称(可选，会自动从路径提取)
     * @param {number} options.fileSize - 文件大小（如果提供file，此参数可选）
     * @param {Function} options.onProgress - 进度回调函数(可选)
     * @param {Function} options.onSuccess - 成功回调函数(可选)
     * @param {Function} options.onError - 错误回调函数(可选)
     * @returns {Promise<boolean>} 上传结果
     */
    async upload(options) {
        const { 
            file,
            onProgress, 
            onSuccess, 
            onError 
        } = options

        // 优先使用file对象，否则使用单独传入的参数
        const actualFilePath = file.path 
        const actualFileSize = file.size 

        if (!actualFilePath) {
            throw new Error('必须提供 filePath 或包含 path 属性的 file 对象')
        }
        
        if (!actualFileSize) {
            throw new Error('必须提供 fileSize 或包含 size 属性的 file 对象')
        }

        try {
            //初始化文件状态
            let localFilePath = actualFilePath
            const actualFileName = getFileName(localFilePath)

            modal.loading("准备上传...")

            // 1.计算分片数量
            const chunkSize = this.config.chunkSize
            const chunkCount = Math.ceil(actualFileSize / chunkSize)

            //2.初始化分片上传
            const initResult = await initChunkUpload(actualFileName, actualFileSize)
            if (initResult.code !== 200) throw new Error("初始化上传失败")

            const { uploadId, filePath: serverFilePath } = initResult.data
            const partETags = []

            //3.将文件移动到应用 沙盒 目录
            localFilePath = await copyFileToSandbox(localFilePath)

            //4.上传所有分片
            modal.closeLoading()
            modal.loading("上传中...")

            //5.进度信息对象
            const progressInfo = {
                completedChunks: 0,
                uploadProgress: 0,
                chunkCount
            }

            // 创建分片任务队列
            const chunkTasks = []
            for (let i = 0; i < chunkCount; i++) {
                chunkTasks.push({
                    index: i,
                    start: i * chunkSize,
                    end: this.getSliceEnd(i * chunkSize, chunkSize, actualFileSize, i, chunkCount),
                })
            }

            //并发上传数据
            await this.uploadChunksInBatches(
                chunkTasks, 
                this.config.concurrentLimit, 
                uploadId, 
                serverFilePath, 
                localFilePath, 
                partETags, 
                progressInfo
            )

            //合并分片
            modal.msg("正在合并分片...")

            const result = await completeChunkUpload(
                uploadId, serverFilePath, actualFileSize, actualFileName, partETags
            )

            await deleteLocalFile(localFilePath) //将临时文件删除，防止占用空间

            modal.msgSuccess("上传成功")

            // 执行成功回调
            if (onSuccess) {
                onSuccess(result)
            }

            return true

        } catch (error) {
            modal.closeLoading()
            const errorMessage = `上传失败: ${error.message || error}`
            modal.msg(errorMessage)

            // 执行错误回调
            if (onError) {
                onError(error)
            }

            throw error
        }
    }
}

// 创建默认实例
const appChunkUploader = new AppChunkUploader()

export default appChunkUploader
export { AppChunkUploader }
