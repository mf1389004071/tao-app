import modal from '@/plugins/modal'
import { initChunkUpload, uploadChunk, completeChunkUpload } from '@/api/system/chunkUpload'
import { UploadOptions, PartETag, ChunkTask } from '@/types/upload'

/**
 * APP端分片上传工具类
 * 
 */
class AppChunkUploader {

    /**
     * 分片大小，单位字节
     */
    private chunkSize: number;

    /**
     * 并发上传的分片数量限制
     */
    private concurrentLimit: number;


    /**
     * 构造函数 - 初始化分片上传器
     * 设置默认分片大小为15MB，并发限制为2个分片
     */
    constructor() {
        this.chunkSize = 15 * 1024 * 1024; // 默认分片大小15MB
        this.concurrentLimit = 2;  // 并发上传的分片数量
    }

    /**
     * 主要的分片上传方法
     * @param options 上传配置选项
     * @param options.file 要上传的文件对象，包含path和size属性
     * @param options.onSuccess 上传成功回调函数
     * @param options.onError 上传失败回调函数
     * @returns Promise<boolean> 返回上传是否成功
     */
    async upload(options: UploadOptions): Promise<boolean> {
        const { file, onSuccess, onError } = options
        try {
            const actualFilePath = file.path
            const actualFileSize = file.size

            if (!actualFilePath) throw new Error('文件路径不存在')
            if (!actualFileSize) throw new Error('文件大小不存在')

            //初始化文件状态
            let localFilePath = actualFilePath
            const actualFileName = this.getFileName(localFilePath)

            modal.loading("准备上传...")

            // 1.计算分片数量
            const chunkSize = this.chunkSize
            const chunkCount = Math.ceil(actualFileSize / chunkSize)

            //2.初始化分片上传
            const initResult = await initChunkUpload(actualFileName, actualFileSize)
            if (initResult.code !== 200) throw new Error("初始化上传失败")

            const { uploadId, filePath: serverFilePath } = initResult.data
            const partETags: PartETag[] = [];

            //3.将文件移动到应用 沙盒 目录
            localFilePath = await this.copyFileToSandbox(localFilePath)

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
            const chunkTasks: ChunkTask[] = []
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
                this.concurrentLimit,
                uploadId,
                serverFilePath,
                localFilePath,
                partETags,
                progressInfo
            )

            //合并分片
            modal.closeLoading();
            modal.loading("正在合并分片...")

            //完成分片上传
            await completeChunkUpload(
                uploadId, serverFilePath, actualFileSize, actualFileName, partETags
            )
            
            //将临时文件删除，防止占用空间
            await this.deleteLocalFile(localFilePath) 

            modal.closeLoading()

            // 执行成功回调
            onSuccess?.({ success: true })

            return true
        } catch (error) {
            modal.closeLoading()
            const errorMessage = error instanceof Error ? error.message : `上传失败`
            onError?.(errorMessage)
            return false
        }
    }

    /**
     * 获取切片end位置
     * @param start 切片开始位置
     * @param chunkSize 切片大小
     * @param fileSize 文件总大小
     * @param index 当前切片索引
     * @param totalChunks 总切片数量
     * @returns number 切片结束位置
     */
    getSliceEnd(start: number, chunkSize: number, fileSize: number, index: number, totalChunks: number) {
        return index < totalChunks - 1 ? start + chunkSize - 1 : fileSize
    }

    /**
     * 并发上传分片
     * @param tasks 分片任务数组
     * @param batchSize 批次大小，控制并发数量
     * @param uploadId 上传ID
     * @param filePath 服务器文件路径
     * @param localFilePath 本地文件路径
     * @param partETags 分片ETag数组，用于合并分片
     * @param progressInfo 进度信息对象
     * @returns Promise<any[]> 上传结果数组
     */
    async uploadChunksInBatches(tasks: ChunkTask[], batchSize: number, uploadId: string, filePath: string, localFilePath: string, partETags: PartETag[], progressInfo: any): Promise<any[]> {
        const results = []

        for (let i = 0; i < tasks.length; i += batchSize) {
            const batch = tasks.slice(i, i + batchSize)

            try {
                const batchResults = await Promise.all(
                    batch.map((task) => this.uploadChunkConcurrently(task, uploadId, filePath, localFilePath, partETags, progressInfo))
                )
                results.push(...batchResults)
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : '并发上传失败'
                throw new Error(errorMessage)
            }
        }
        return results
    }




    /**
     * APP端分片上传单个分片
     * @param uploadId 上传ID
     * @param filePath 服务器文件路径
     * @param chunkIndex 分片索引
     * @param chunk 分片数据，可以是ArrayBuffer或字符串
     * @returns Promise<any> 上传响应结果
     */
    async uploadAppChunk(uploadId: string, filePath: string, chunkIndex: number, chunk: ArrayBuffer | string) {
        try {
            const response = await this.startUploadAppChunk(uploadId, filePath, chunkIndex, chunk)
            return response
        } catch (error) {
            throw new Error('分片上传失败')
        }
    }

    /**
     * 执行APP端分片上传
     * @param uploadId 上传ID
     * @param filePath 服务器文件路径
     * @param chunkIndex 分片索引
     * @param chunk 分片数据，可以是ArrayBuffer或字符串
     * @returns Promise 返回上传结果的Promise
     */
    startUploadAppChunk(uploadId: string, filePath: string, chunkIndex: number, chunk: ArrayBuffer | string) {
        return new Promise(async (resolve, reject) => {
            try {
                // 1. 准备临时文件信息
                const tempFileName = `temp_chunk/chunk_${uploadId}_${chunkIndex}.bin`
                const tempDirPath = plus.io.PRIVATE_DOC

                // 2. 创建并写入临时文件
                const tempFilePath = await this.createAndWriteTempFile(
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
                await this.deleteTempFile(tempDirPath, tempFileName)

                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    }


    /**
     * 并发上传单个分片
     * @param chunkTask 分片任务对象，包含index、start、end等信息
     * @param uploadId 上传ID
     * @param filePath 服务器文件路径
     * @param localFilePath 本地文件路径
     * @param partETags 分片ETag数组，用于合并分片
     * @param progressInfo 进度信息对象，包含completedChunks、uploadProgress、chunkCount等
     * @returns Promise<any> 上传响应结果
     */
    async uploadChunkConcurrently(chunkTask: any, uploadId: string, filePath: string, localFilePath: string, partETags: PartETag[], progressInfo: any) {
        const { index, start, end } = chunkTask
        const { chunkCount } = progressInfo

        const chunk = await this.readAppFileChunk(localFilePath, start, end - start)

        const response = await this.uploadAppChunk(uploadId, filePath, index, chunk) as any

        if (response.data && response.data.etag) {
            partETags.push({
                partNumber: index + 1,
                ETag: response.data.etag,
            });
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
     * 获取文件名称
     * @param filePath 完整文件路径
     * @returns string 从路径中提取的文件名
     */
    getFileName(filePath: string): string {
        if (!filePath) {
            return "";
        }
        // 查找最后一个斜杠位置
        const slashIndex = filePath.lastIndexOf("/");
        if (slashIndex === -1) {
            return filePath; // 没有斜杠，整个字符串可能就是文件名
        }
        // 从最后一个斜杠后面提取文件名
        return filePath.substring(slashIndex + 1);
    };

    /**
     * 将文件复制到应用沙盒目录
     * @param srcUrl 源文件URL路径
     * @returns Promise<string> 复制后的文件完整路径
     */
    copyFileToSandbox(srcUrl: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const newName = `file_${Date.now()}.${this.getFileExtension(srcUrl)}`;
            plus.io.requestFileSystem(
                plus.io.PRIVATE_DOC,
                (dstEntry) => {
                    plus.io.resolveLocalFileSystemURL(
                        srcUrl,
                        (srcEntry) => {
                            srcEntry.copyTo(
                                dstEntry.root,
                                newName,
                                (entry) => {
                                    if (entry.fullPath) {
                                        resolve(entry.fullPath);
                                    } else {
                                        reject(new Error('File path is undefined'));
                                    }
                                },
                                (e) => reject(e)
                            );
                        },
                        (e) => reject(e)
                    );
                },
                (e) => reject(e)
            );
        });
    };

    /**
     * 获取文件的扩展名称
     * @param filePath 完整文件路径
     * @returns string 文件扩展名（小写，不包含点号）
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

    /**
     * 删除本地临时文件（临时文件是分片生成的）
     * @param filePath 要删除的文件路径
     * @returns Promise<boolean> 删除是否成功
     */
    deleteLocalFile(filePath: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (!filePath) {
                resolve(false);
                return;
            }
            plus.io.resolveLocalFileSystemURL(
                filePath,
                (entry) => {
                    entry.remove(
                        () => { resolve(true); },
                        (error) => { resolve(false); }
                    );
                },
                (error) => { resolve(false); }
            );
        });
    };

    /**
     * 创建临时文件并写入数据
     * @param dirPath 目录路径标识（plus.io.PRIVATE_DOC等）
     * @param fileName 临时文件名
     * @param data 要写入的数据，可以是ArrayBuffer或字符串
     * @returns Promise<string> 创建的临时文件完整路径
     */
    createAndWriteTempFile(dirPath: number, fileName: String, data: ArrayBuffer | string): Promise<string> {
        return new Promise((resolve, reject) => {
            plus.io.requestFileSystem(
                dirPath,
                (dirEntry: any) => {
                    dirEntry.root.getFile(
                        fileName,
                        { create: true, exclusive: false },
                        (fileEntry: any) => {
                            fileEntry.createWriter(
                                (writer: any) => {
                                    const filePath = fileEntry.fullPath
                                    writer.onwrite = function () { resolve(filePath) }
                                    writer.onerror = function (e: any) { reject(e) }
                                    try {
                                        if (data) writer.writeAsBinary(data)
                                    } catch (e) { reject(e) }
                                },
                                (err: any) => reject(err)
                            )
                        },
                        (err: any) => reject(err)
                    )
                },
                (err) => { reject(err) }
            )
        })
    }

    /**
     * 删除临时文件
     * @param dirPath 目录路径标识（plus.io.PRIVATE_DOC等）
     * @param fileName 要删除的临时文件名
     * @returns Promise<boolean> 删除是否成功
     */
    deleteTempFile(dirPath: number, fileName: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            plus.io.requestFileSystem(
                dirPath,
                (dirEntry) => {
                    if (!dirEntry || !dirEntry.root) {
                        reject(new Error('Directory entry or root is undefined'));
                        return;
                    }
                    dirEntry.root.getFile(
                        fileName,
                        { create: false },
                        (fileEntry) => {
                            fileEntry.remove(
                                () => { resolve(true); },
                                (err) => { resolve(true); }
                            );
                        },
                        () => resolve(true)
                    );
                },
                () => resolve(true)
            );
        });
    }

    /**
     * 读取APP端文件分片的数据
     * @param filePath 本地文件路径
     * @param start 读取开始位置
     * @param length 读取数据长度
     * @returns Promise<string> Base64编码的分片数据
     */
    readAppFileChunk(filePath: string, start: number, length: number): Promise<string> {
        return new Promise((resolve, reject) => {
            plus.io.resolveLocalFileSystemURL(
                filePath,
                (entry: any) => {
                    entry.file(
                        (file: any) => {
                            const reader = new plus.io.FileReader();
                            try {
                                const slice = file.slice(start, start + length);
                                reader.readAsDataURL(slice);
                            } catch (sliceError) {
                                reject(sliceError);
                            }
                            reader.onloadend = (e: any) => {
                                if (e.target.readyState == 2) {
                                    try {
                                        const base64 = e.target.result.split(",")[1];
                                        resolve(base64);
                                    } catch (err) {
                                        reject(err);
                                    }
                                }
                            };
                            reader.onerror = (err) => { reject(err); };
                        },
                        (error: any) => { reject(error); }
                    );
                },
                (error) => { reject(error); }
            );
        });
    };



}


export default new AppChunkUploader()
export { AppChunkUploader }
