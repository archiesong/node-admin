var roleModel = require('../model/roleModel.js');
var entries = require('./jsonRes');
module.exports = {
    getRoleTree(req, res) {
        roleModel.findAllRole((err, results) => {
            if (err || results.length < 1) {
                entries.code = 303;
                entries.msg = "获取所有角色失败，请稍后再试！";
                entries.data = "";
                return res.json(entries)
            }
            entries.code = 200;
            entries.msg = "获取所有角色成功！";
            var roleArr = [];
            results.forEach(item => {
                roleArr.push({
                    id: item.id,
                    label: item.name
                })
            });
            entries.data = roleArr;
            return res.json(entries)
        })
    }
}