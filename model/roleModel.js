var connection = require('./basedb.js');
var moment = require('moment');
module.exports = {
    findAllRole(callback){
       var sqlStr = 'select id,name from role';
       connection.query(sqlStr,(err,results)=>{
           if (err) return callback(err);
           callback(null,results);
       })
    }
}