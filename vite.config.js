import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig(() => {
    return {
        base: './',
        build: {
            minify: 'terser',
            outDir: 'dist',
            // 微信真机/自动真机调试的 JS 引擎不支持 ??、?. 等，需转译
            target: 'es2015',
        },
        server: {
            port: '80'
        },
        plugins: [
            uni()
        ],
        exclude: [
            /\/README\.md$/,
        ],
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler'
                }
            }
        }
    }
})