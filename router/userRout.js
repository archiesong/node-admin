const express = require('express');
// 创建用户路由模块
const router = express.Router();
// 导入用户 controller
const userCtrl = require('../controller/userCtrl.js');
const authMiddleware = require('../utils/auth-Middleware.js'); //验证token 中间件
  router
  .post('/login',userCtrl.login) //登录
  .get('/info',authMiddleware, userCtrl.getUserInfo) //获取用户信息
  .post('/users/list', authMiddleware,userCtrl.getUsersList)  //获取用户列表

module.exports = router;