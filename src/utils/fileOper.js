
/**
 * 将文件复制到应用沙盒目录
 * @param {*} srcUrl 
 * @returns 
 */
export const copyFileToSandbox = (srcUrl) => {
    return new Promise((resolve, reject) => {
        const newName = `file_${Date.now()}.${getFileExtension(srcUrl)}`;
        console.log("文件名称是什么>>>", newName);
        plus.io.requestFileSystem(
            plus.io.PRIVATE_DOC,
            function (dstEntry) {
                plus.io.resolveLocalFileSystemURL(
                    srcUrl,
                    function (srcEntry) {
                        srcEntry.copyTo(
                            dstEntry.root,
                            newName,
                            function (entry) {
                                console.log("文件复制成功:", entry.fullPath);
                                resolve(entry.fullPath);
                            },
                            function (e) {
                                console.error("复制文件失败:", JSON.stringify(e));
                                reject(e);
                            }
                        );
                    },
                    function (e) {
                        console.error("获取目标目录失败:", JSON.stringify(e));
                        reject(e);
                    }
                );
            },
            function (e) {
                console.error("获取源文件失败:", JSON.stringify(e));
                reject(e);
            }
        );
    });
}

/**
 * 删除临时文件
 * @param {string} dirPath - 目录路径
 * @param {string} fileName - 文件名
 * @returns {Promise<void>}
 */
export function deleteTempFile(dirPath, fileName) {
    return new Promise((resolve) => {
        plus.io.requestFileSystem(
            dirPath,
            (dirEntry) => {
                console.log("文件目录:", dirPath);
                console.log("目录存在:", dirEntry);
                dirEntry.root.getFile(
                    fileName,
                    { create: false },
                    (fileEntry) => {
                        console.log("临时文件存在:", fileEntry);
                        fileEntry.remove(
                            () => {
                                console.log("删除成功XXXXX");
                                resolve();
                            },
                            (err) => {
                                console.error("删除失败XXXXX:", err);
                                resolve();
                            }
                        );
                    },
                    () => resolve()
                );
            },
            () => resolve()
        );
    });
}



/**
 * 删除本地临时文件（临时文件是分片生成的）
 * @param {*} filePath 
 * @returns 
 */
export const deleteLocalFile = (filePath) => {
    return new Promise((resolve, reject) => {
        if (!filePath) {
            resolve();
            return;
        }
        console.log("准备删除文件:", filePath);
        plus.io.resolveLocalFileSystemURL(
            filePath,
            (entry) => {
                entry.remove(
                    () => {
                        console.log("文件删除成功:", filePath);
                        resolve(true);
                    },
                    (error) => {
                        console.error("删除文件失败:", JSON.stringify(error));
                        // 失败也视为完成，不中断流程
                        resolve(false);
                    }
                );
            },
            (error) => {
                console.error("获取文件引用失败:", JSON.stringify(error));
                // 失败也视为完成，不中断流程
                resolve(false);
            }
        );
    });
};

/**
 * 根据文件路径获取APP文件信息
 */
export const getAppFileInfo = (filePath) => {
    return new Promise((resolve, reject) => {
        plus.io.resolveLocalFileSystemURL(
            filePath,
            (entry) => {
                entry.file(
                    (file) => {
                        resolve({
                            size: file.size,
                            name: file.name,
                            type: file.type,
                        });
                    },
                    (error) => {
                        reject(error);
                    }
                );
            },
            (error) => {
                reject(error);
            }
        );
    });
};



/*读取分片的数据 */
export const readAppFileChunk = (filePath, start, length) => {
    console.log("读取分片的路径是什么>>>", filePath);
    return new Promise((resolve, reject) => {
        plus.io.resolveLocalFileSystemURL(
            filePath,
            (entry) => {
                entry.file(
                    (file) => {
                        const reader = new plus.io.FileReader();
                        try {
                            const slice = file.slice(start, start + length);
                            reader.readAsDataURL(slice);
                        } catch (sliceError) {
                            reject(sliceError);
                        }
                        reader.onloadend = (e) => {
                            if (e.target.readyState == 2) {
                                try {
                                    const base64 = e.target.result.split(",")[1];
                                    resolve(base64);
                                } catch (err) {
                                    reject(err);
                                }
                            }
                        };

                        reader.onerror = (err) => {
                            reject(err);
                        };
                    },
                    (error) => {
                        reject(error);
                    }
                );
            },
            reject
        );
    });
};


/**
 * 获取文章的扩展名称
 * @param {*} filePath 
 * @returns 
 */
export const getFileExtension = (filePath) => {
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
 * 获取文件名称
 * @param {*} filePath 
 * @returns 
 */

export const getFileName = (filePath) => {
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
 * 创建临时文件并写入数据
 * @param {string} dirPath - 目录路径
 * @param {string} fileName - 文件名
 * @param {ArrayBuffer} data - 要写入的数据
 * @returns {Promise<string>} 临时文件的完整路径
 */
export const createAndWriteTempFile = (dirPath, fileName, data) => {
    return new Promise((resolve, reject) => {
        plus.io.requestFileSystem(
            dirPath,
            (dirEntry) => {
                dirEntry.root.getFile(
                    fileName,
                    { create: true, exclusive: false },
                    (fileEntry) => {
                        fileEntry.createWriter(
                            (writer) => {
                                const filePath = fileEntry.fullPath
                                // 设置写入成功回调
                                writer.onwrite = function () {
                                    resolve(filePath)
                                }
                                // 设置写入失败回调
                                writer.onerror = function (e) {
                                    reject(e)
                                }
                                // 写入数据
                                try {
                                    if (data) {
                                        writer.writeAsBinary(data)
                                    }
                                } catch (e) {
                                    reject(e)
                                }
                            },
                            (err) => reject(err)
                        )
                    },
                    (err) => reject(err)
                )
            },
            (err) => {
                reject(err)
            }
        )
    })
}