//入口文件 
const express = require('express');
var fs = require('fs');
var path = require('path');
const app = express();
const bodyParser = require('body-parser'); //解析请求体中间件
app.use(bodyParser.urlencoded({ extended: false }));

app.all('*', (req,res,next) => {  
      //告诉浏览器一些额外信息
      //允许跨域
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization,x-token, Accept,x-auth-token,X-Requested-With,X_Requested_With,yourHeaderFeild');
      res.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
      res.setHeader("X-Powered-By",'3.2.1');
      res.setHeader("Content-Type", "application/json;charset=utf-8");
      next();
})

// 需求：实现自动注册路由模块
//  实现思路：
//   1. 使用 fs.readdir 读取 router 文件夹下的所有 路由模块的 名称
//   2. 读取完毕之后，拼接每个路由模块的完整路径
//   3. 拼接出完整的路径之后，forEach 循环，通过 app.use 来注册每一个路由模块
fs.readdir(path.join(__dirname,'./router'),(err,filenames) => {
      if (err) throw err;
      filenames.forEach(filename => {
            // 通过 path.join 方法，拼接每一个 路由模块的 绝对路径
            var filePath = path.join(__dirname, './router',filename);
            // 使用 app.use() 注册每一个路由模块
            app.use('/api',require(filePath));
      });
});
app.use(express.static('./atatic')); //静态一个文件夹，实用的好处这里的文件的路径就可以 用  /   表示

app.listen(3001, () => { //开启服务器
      console.log('at listen http://127.0.0.1:3001');
})
