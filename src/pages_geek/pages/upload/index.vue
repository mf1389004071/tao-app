<template>
    <view class="upload-page">
        <uni-section class="mb-10" title="视频上传" sub-title="支持大文件分片上传" type="line" />

        <geek-uploadbox @upload="handleUpload" @delete="handleDelete" upload-text="选择视频文件"
            upload-desc="支持 mp4/mov/avi 格式，最大 500M" />

        <view class="upload-actions">
            <button class="upload-btn" :disabled="!videoFile" @click="start">
                {{ videoFile ? '开始上传' : '请先选择文件' }}
            </button>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue'
import modal from '@/plugins/modal'
import { wxChunkUploader } from '@/utils/ChunkUploaderWx'
import appChunkUploader from '@/utils/ChunkUploaderApp'

const videoFile = ref(null)

/**
 * 处理视频上传
 * @param {Object} data - 上传的视频数据
 */
const handleUpload = (data) => {
    videoFile.value = data
    console.log('上传的视频文件:', data)
}

/**
 * 处理视频删除
 */
const handleDelete = () => {
    videoFile.value = null
    console.log('视频文件已删除')
}

/**
 * 校验上传参数
 * @returns {boolean} 校验结果
 */
const validateParams = () => {
    if (videoFile.value) return true
    modal.msg('请先选择视频文件')
    return false
}

/**
 * 微信小程序分片上传
 * @returns {Promise<boolean>} 上传结果
 */
const handleWxChunkUpload = async () => {
    const result = await wxChunkUploader.upload({
        file: videoFile.value,
        onSuccess: () => {
            modal.msgSuccess('上传成功')
        },
        onError: (error) => {
            modal.msg(error)
        }
    });
    return result
}

/**
 * APP端分片上传
 * @returns {Promise<boolean>} 上传结果
 */
const handleAppChunkUpload = async () => {
    try {
        const file = videoFile.value

        const result = await appChunkUploader.upload({
            file: file,
            onSuccess: (result) => {
                console.log('上传成功:', result)
            },
            onError: (error) => {
                console.error('上传失败:', error)
            }
        })

        return result
    } catch (error) {
        console.error('APP上传失败:', error)
        throw error
    }
}

/**
 * 开始上传
 */
const start = async () => {
    if (!validateParams()) return

    try {
        // #ifdef MP-WEIXIN
        await handleWxChunkUpload()
        // #endif

        // #ifdef APP-PLUS
        await handleAppChunkUpload()
        // #endif
    } catch (error) {
        console.error('上传过程出错:', error)
    }
}
</script>

<style lang="scss" scoped>
.upload-page {
    min-height: 100vh;
    background-color: #f6f6f6;
    padding: 20rpx;
}

.upload-actions {
    margin-top: 40rpx;
    padding: 0 20rpx;
}

.upload-btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #1976d2, #42a5f5);
    color: white;
    border: none;
    border-radius: 12rpx;
    font-size: 32rpx;
    font-weight: 500;
    transition: all 0.3s ease;

    &:not(:disabled):active {
        transform: scale(0.98);
        box-shadow: 0 4rpx 12rpx rgba(25, 118, 210, 0.3);
    }

    &:disabled {
        background: #cccccc;
        color: #999999;
        transform: none;
        box-shadow: none;
    }
}
</style>
