var connection = require('./basedb.js');
var moment = require('moment');
module.exports = {
    findUserByUsername(username, callback) {
        var sqlStr = `select user0_.id as id1_14_, user0_.avatar as avatar2_14_, user0_.create_time as create_t3_14_, user0_.email as email4_14_, user0_.enabled as enabled5_14_, user0_.last_password_reset_time as last_pas6_14_, user0_.password as password7_14_, user0_.username as username8_14_ from user user0_ where user0_.username='admin'`;
        connection.query(sqlStr, username, (err, results) => {
            if (err) return callback(err);
            const dataString = JSON.stringify(results);
            const data = JSON.parse(dataString).map(item => {
                const User = {
                    id: item.id1_14_,
                    avatar: item.avatar2_14_,
                    create_time: moment(item.create_t3_14_).format('YYYY-MM-DD hh:mm:ss'),
                    email: item.email4_14_,
                    enabled: (item.enabled5_14_ == 1 ? true : false),
                    last_password_reset_time: moment(item.last_pas6_14_).format('YYYY-MM-DD hh:mm:ss'),
                    password: item.password7_14_,
                    username: item.username8_14_
                }
                return User;
            })
            callback(null, data);
        });
    },
    findRoleByUserId(uid, callback) {
        var sqlStr1 = ` select roles0_.user_id as user_id1_15_0_, roles0_.role_id as role_id2_15_0_, role1_.id as id1_11_1_, role1_.create_time as create_t2_11_1_, role1_.name as name3_11_1_, role1_.remark as remark4_11_1_ from users_roles roles0_ inner join role role1_ on roles0_.role_id=role1_.id where roles0_.user_id=?`
        connection.query(sqlStr1, uid, (err, results) => {
            if (err) return callback(err);
            var role_id = results[0].role_id2_15_0_;
            var sqlStr2 = `select permission0_.role_id as role_id1_13_0_, permission0_.permission_id as permissi2_13_0_, permission1_.id as id1_5_1_, permission1_.alias as alias2_5_1_, permission1_.create_time as create_t3_5_1_, permission1_.name as name4_5_1_, permission1_.pid as pid5_5_1_ from roles_permissions permission0_ inner join permission permission1_ on permission0_.permission_id=permission1_.id where permission0_.role_id=?`;
            connection.query(sqlStr2, role_id, (err, results) => {
                var dataString = JSON.stringify(results);
                var data = JSON.parse(dataString).map(item => {
                    const roles = {
                        role_id: item.role_id1_13_0_,
                        permission_id: item.permissi2_13_0_,
                        id: item.id1_5_1_,
                        alias: item.alias2_5_1_,
                        create_time: moment(item.create_t3_5_1_).format('YYYY-MM-DD hh:mm:ss'),
                        name: item.name4_5_1_,
                        pid: item.pid5_5_1_
                    };
                    return roles;
                })
                callback(null, data);
            })
        })
    },
    findAllUsers(params, callback) {
        var pageSize = params.pageSize;
        var pageNo = (params.pageNo - 1) * pageSize; //偏移数
        var enabled = params.enabled;
        var sort = params.sort;
        var username = params.username;
        var email = params.email;
        var sqlStr, queryParam = [];
        if (username) { //使用姓名查询用户列表
            sqlStr = `SELECT 
           user0_.id AS id1_14_,
           user0_.avatar AS avatar2_14_, 
           user0_.create_time AS create_t3_14_,
           user0_.email AS email4_14_, 
           user0_.enabled AS enabled5_14_, 
           user0_.last_password_reset_time AS last_pas6_14_, 
           user0_.password AS password7_14_, 
           user0_.username AS username8_14_
           FROM user user0_
             WHERE user0_.username LIKE ?
               ORDER BY user0_.id DESC
            LIMIT ?;SELECT COUNT(*) FROM  user user0_  WHERE user0_.username LIKE ?`;
        } else if (username && enabled) { //使用姓名和账号是否启用或禁用查询用户列表
            sqlStr = `SELECT user0_.id AS id1_14_, user0_.avatar AS avatar2_14_, user0_.create_time AS create_t3_14_, user0_.email AS email4_14_, user0_.enabled AS enabled5_14_
           , user0_.last_password_reset_time AS last_pas6_14_, user0_.password AS password7_14_, user0_.username AS username8_14_
       FROM user user0_
       WHERE user0_.enabled = ?
           AND user0_.username LIKE ?
       ORDER BY user0_.id DESC;SELECT COUNT(*) FROM  user user0_  WHERE user0_.enabled = ? AND user0_.username LIKE ?`;
        } else if (enabled) { //使用账号是否启用或禁用查询用户列表
            sqlStr = `SELECT user0_.id AS id1_14_, user0_.avatar AS avatar2_14_, user0_.create_time AS create_t3_14_, user0_.email AS email4_14_, user0_.enabled AS enabled5_14_
        ,user0_.last_password_reset_time AS last_pas6_14_, user0_.password AS password7_14_, user0_.username AS username8_14_
    FROM user user0_
    WHERE user0_.enabled = ?
    ORDER BY user0_.id DESC
    LIMIT ?;SELECT COUNT(*) FROM  user user0_  WHERE user0_.enabled = ?`;
        } else if (enabled && email) { //使用账号是否启用或禁用和用户email来查询用户列表
            sqlStr = `SELECT user0_.id AS id1_14_, user0_.avatar AS avatar2_14_, user0_.create_time AS create_t3_14_, user0_.email AS email4_14_, user0_.enabled AS enabled5_14_
        , user0_.last_password_reset_time AS last_pas6_14_, user0_.password AS password7_14_, user0_.username AS username8_14_
    FROM user user0_
    WHERE user0_.enabled = ?
        AND user0_.email LIKE ?
    ORDER BY user0_.id DESC
    LIMIT ?;SELECT COUNT(*) FROM  user user0_  WHERE  user0_.enabled = ? AND user0_.email LIKE ?`;
        } else if (email) { //使用用户email来查询用户列表
            sqlStr = `SELECT user0_.id AS id1_14_, user0_.avatar AS avatar2_14_, user0_.create_time AS create_t3_14_, user0_.email AS email4_14_, user0_.enabled AS enabled5_14_
         , user0_.last_password_reset_time AS last_pas6_14_, user0_.password AS password7_14_, user0_.username AS username8_14_
     FROM user user0_
     WHERE user0_.email LIKE ?
     ORDER BY user0_.id DESC
     LIMIT ?;SELECT COUNT(*) FROM  user user0_  WHERE user0_.email LIKE ?`
        } else { //模糊查询用户列表
            sqlStr = `SELECT user0_.id AS id1_14_, user0_.avatar AS avatar2_14_, user0_.create_time AS create_t3_14_, user0_.email AS email4_14_, user0_.enabled AS enabled5_14_
            , user0_.last_password_reset_time AS last_pas6_14_, user0_.password AS password7_14_, user0_.username AS username8_14_
        FROM user user0_
        WHERE 1 = 1
        ORDER BY user0_.id DESC
        LIMIT ?;SELECT COUNT(*) FROM  user user0_  WHERE 1 = 1`;
        }
        connection.query(sqlStr, queryParam, (err, results) => {
            console.log(results)
        })
    }
}