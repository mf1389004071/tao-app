

export interface UploadOptions {
    /**文件 */
    file: File
    /**成功回调 */
    onSuccess?: (result: any) => void;
    /**失败回调 */
    onError?: (error: any) => void;
}

export interface File {
    /**文件路径 */
    path: string;
    /**文件大小 */
    size: number;
}

export interface UploadData {
    /**上传编号 */
    uploadId: string;
    /**文件在云端保存路径 */
    saveFilePath: string;
    /**上传文件的名称 */
    uploadFileName: string;
    /**上传文件的大小 */
    fileSize: number;
    /**分片数量 */
    chunkCount: number;
    /**上传文件的路径 */
    filePath: string;
}

export interface PartETag {
    partNumber: number;
    ETag: string;
}


export interface ChunkTask {
    index: number;
    start: number;
    end: number;
}



