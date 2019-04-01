// 导入操作用户数据的 Model 模块
var userModel = require('../model/userModel.js');
// 导入 MD5 第三方加密模块
var md5 = require('blueimp-md5');
// 导入项目的配置文件
var config = require('../config.js');
var entries = require('./jsonRes');
const JwtUtil = require('../utils/jwt.js');
const client = require('../model/redis_database.js').redisClient;
const redis = require('../model/redis_database.js').redis;
module.exports = {
    login(req, res) {
        var user = req.body;
        var userName = user.username;
        var password = md5(user.password, config.pwdSalt);
        console.log(password)
        userModel.findUserByUsername(userName, (err, results) => {
            if (err || results.length < 1) {
                entries.code = 1;
                entries.msg = "用户名不存在！";
                entries.data = "";
                return res.json(entries)
            }
            if (results[0].password != password) {
                entries.code = 1;
                entries.msg = '密码错误！';
                entries.data = "";
                return res.json(entries)
            }
            if (!results[0].enabled) {
                entries.code = 1;
                entries.msg = "账号已停用，请联系管理员！";
                entries.data = "";
                return res.json(entries)
            }
            // client.get('token-'+results[0].id,function(err, reply){
            //     console.log(reply)
            // })
            //创建 token
            let jwt = new JwtUtil(results[0]);
            let access_token = jwt.generateToken();
            entries.code = 0;
            entries.msg = "验证成功!";
            entries.data = {
                token: access_token
            };
            return res.json(entries);
        });
    },
    getUserInfo(req, res) {
        if (req.user) {
            var uid = req.user.id;
            userModel.findRoleByUserId(uid, (err, results) => {
                if (err || results.length < 1) {
                    entries.code = 1;
                    entries.msg = "获取用户信息失败，请稍后再试！";
                    entries.data = "";
                    return res.json(entries)
                }
                var data = {
                    avatar: req.user.avatar,
                    create_time: req.user.create_time,
                    email: req.user.email,
                    enabled: req.user.enabled,
                    username: req.user.username,
                    roles: []
                }
                results.forEach(item => {
                    data.roles.push({
                        id: item.role_id,
                        name: item.name
                    });
                });
                entries.code = 0;
                entries.msg = "获取用户信息成功！";
                entries.data = data;
                return res.json(entries)
            })
        }
    },
    getUsersList(req, res) {
        console.log(req)
    }
}