// 应用全局配置
// 对接后端时 baseUrl 需与 PC 一致，如：http://192.168.1.7:8081/dev-api（C 端接口为 /bt10/xxx）
const config = {
  //  baseUrl: 'https://example.com/prod-api',
  baseUrl: 'https://hao.10beihao.com/prod-api',
  // baseUrl: 'http://localhost/prod-api',
  // baseUrl: 'http://localhost:8080',
  // baseUrl: 'http://192.168.1.7:8080',
  // baseUrl: 'http://192.168.1.7:8081/dev-api', // 与 PC 联调时启用
   //cloud后台网关地址
  //  baseUrl: 'http://192.168.10.3:8080',
   // 应用信息
   appInfo: {
     // 应用名称
     name: "10倍好",
     // 应用版本
     version: "1.1.0",
     // 应用logo
     logo: "/static/logo.png",
     // 官方网站
     site_url: "https://www.10beihao.com/",
     // 政策协议
     agreements: [{
         title: "隐私政策",
         url: "https://www.10beihao.com/"
       },
       {
         title: "用户服务协议",
         url: "https://www.10beihao.com/"
       }
     ]
   }
 }

 export default config