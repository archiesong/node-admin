const express = require('express');
// 创建用户路由模块
const router = express.Router();
const roleCtrl = require('../controller/roleCtrl.js');
const authMiddleware = require('../utils/auth-Middleware.js'); //验证token 中间件
router
.get('/roles/tree',authMiddleware, roleCtrl.getRoleTree)
module.exports = router;