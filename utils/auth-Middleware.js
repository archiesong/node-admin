"use strict";
//引入模块依赖
const  JwtUtil = require('./jwt');
module.exports = (req, res, next) => {
    const token =(req.headers['authorization'] && req.headers['authorization'].split(' ')[1])||  (req.body && req.body.access_token)|| (req.body && req.query.token) || (req.headers['x-token']) || (req.headers['x-auth-token']) ;
    if (token) { //请求头中带有token
        try {
            const  jwt  = new JwtUtil(token);
            const  result = jwt.verifyToken(); 
            if (result == 'err') {
                return res.json({
                    code:401,
                    msg:'token已过期,请重新登录'
                })
            }else{
             req.user = result;
              next();
            }
        } catch (error) {
          return  next();
        }
    } else {
       return res.json({
           code:407,
           msg:'请求未带token,认证失败!'
       })
    }

}