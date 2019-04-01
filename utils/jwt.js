"use strict";
//引入模块依赖
const fs = require('fs');
const path = require('path');
const moment = require('moment'); //时间格式化
const jwt = require('jwt-simple'); //生成token模块
const client = require('../model/redis_database.js').redisClient;
const redis = require('../model/redis_database.js').redis;
class Jwt {
    constructor(data) {
        this.data = data;
    }
    // 生成token
    generateToken() {
        let data = this.data;
        let expr_time = moment().add(7, 'days').valueOf(); //token有效期
        let Secret = fs.readFileSync(path.join(__dirname, '../pem/private_key.pem'));
        let token = jwt.encode({
            data,
            exp: expr_time
        }, Secret, 'RS256');
        //将签发的token存在redis中
        client.set('token-' + data.id, token, redis.print);
        client.expire('token' + data.id, 2 * expr_time); //设置redis有效期
        return token;
    }
    refreshToken() { //刷新token

    }
    //校验token
    verifyToken() {
        let token = this.data;
        let Scert = fs.readFileSync(path.join(__dirname, '../pem/public_key.pem'));
        var res;
        try {
            let result = jwt.decode(token, Scert, false, 'RS256') || {};
            let {
                exp = 0
            } = result, current = Math.floor(Date.now() / 1000);
            if (current <= exp) {
                // client.get('token-'+result.data.id, function (err, reply) { //检测redis中缓存的token是否过期
                //     // if(reply) {
                       
                //     // } else {
                //         res = 'err';
                //         client.quit();
                //     // }
                // });
                res = result.data || {};
            }
        } catch (e) {
            res = 'err';
        }
        return res;
    }
}
//导出
module.exports = Jwt;