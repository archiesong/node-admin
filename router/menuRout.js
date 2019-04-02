const express = require('express');
// 创建用户路由模块
const router = express.Router();
const menuCtrl = require('../controller/menuCtrl.js');
const authMiddleware = require('../utils/auth-Middleware.js'); //验证token 中间件
router
.post('/menus/build',authMiddleware, menuCtrl.getMenuTree) //获取前端菜单路由

module.exports = router;