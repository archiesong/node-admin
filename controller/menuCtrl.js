var menuModel = require('../model/menuModel');
var  utils = require('../utils/index');
var entries = require('./jsonRes');
module.exports = {
    getMenuTree(req, res) {
        var roleId = req.body.id;
        menuModel.findAllMenuRouter(roleId, (err, result) => {
            if (err || result.length < 1) {
                entries.code = 303;
                entries.msg = "获取菜单路由失败!";
                entries.data = "";
                return res.json(entries)
            }
            entries.code = 200;
            entries.msg = "获取菜单路由成功!";
            entries.data = utils.filterMenuTree(result);
            return res.json(entries)
        })
    }
}