var connection = require('./basedb.js');
var moment = require('moment');
module.exports = {
    findAllMenuRouter(roleId,callback){
          var sqlStr = `select menus0_.role_id as role_id1_12_0_, menus0_.menu_id as menu_id2_12_0_, menu1_.id as id1_4_1_, menu1_.component as componen2_4_1_, menu1_.create_time as create_t3_4_1_, menu1_.i_frame as i_frame4_4_1_, menu1_.icon as icon5_4_1_, menu1_.name as name6_4_1_, menu1_.path as path7_4_1_, menu1_.pid as pid8_4_1_, menu1_.sort as sort9_4_1_ from roles_menus menus0_ inner join menu menu1_ on menus0_.menu_id=menu1_.id where menus0_.role_id=?`;
          connection.query(sqlStr,roleId,(err,results)=>{
            if (err) return callback(err);
            const dataString = JSON.stringify(results);
           var data =  JSON.parse(dataString).map(item =>{
                var menu = {
                   role_id:item.role_id1_12_0_,
                   menu_id:item.menu_id2_12_0_,
                   id:item.id1_4_1_,
                   component:item.componen2_4_1_,
                   create_time:moment(item.create_t3_4_1_).format('YYYY-MM-DD hh:mm:ss'),
                   i_frame:item.i_frame4_4_1_,
                   icon:item.icon5_4_1_,
                   name:item.name6_4_1_,
                   path:item.path7_4_1_,
                   pid:item.pid8_4_1_,
                   sort:item.sort9_4_1_
                }
                return menu;
            })
            callback(null,data);
          })
    }
}