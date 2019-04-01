// 向外暴露有个公共的数据库连接实例
var mysql = require('mysql');

var connection = mysql.createConnection({
  host:'127.0.0.1',
  user:'root',
  password:'root',
  database:'sys_admin',
  multipleStatements: true
});
module.exports = connection;

