var menuModel = require('../model/menuModel.js');
var entries = require('./jsonRes');
module.exports = {
    getMenuTree(req, res) {
        var roleId = req.body.id;
        menuModel.findAllMenuRouter(roleId, (err, result) => {
            if (err || result.length < 1) {
                entries.code = 1;
                entries.msg = "获取菜单路由失败!";
                entries.data = "";
                return res.json(entries)
            }
            entries.code = 0;
            entries.msg = "获取菜单路由成功!";
            entries.data = deleteId(listTree(filterMenu(result)));
            return res.json(entries)
            // console.log(getMenuTree(result))
        })
    }
}
function deleteId(arr) {
    const list = arr.filter(item => {
        delete item.pid
        delete item.id
    if (item.children && item.children.length) {
            deleteId(item.children);
        }
        return item;
    });
    return list;
}                               

function filterMenu(menus) {
    var list = [];
    menus.filter((item, i) => {
        if (!item.i_frame.data[0]) { //如果不是外链
            if (item.pid == 0) {
                list.push({
                    id: item.id,
                    pid: item.pid,
                    path: '/' + item.path,
                    name: item.name,
                    alwaysShow:true,
                    redirect:'noredirect',
                    component: item.component == null || item.component == "" ? 'Layout' : item.component,
                    meta: {
                        title: item.name,
                        icon: item.icon
                    }
                })
            } else {
                list.push({
                    id: item.id,
                    pid: item.pid,
                    path: item.path,
                    name: item.name,
                    component: item.component == null || item.component == "" ? 'Layout' : item.component,
                    meta: {
                        title: item.name,
                        icon:item.icon
                    }
                })
            }
        } else {
            if (item.pid == 0) {
                list.push({
                    id: item.id,
                    pid: item.pid,
                    path: item.path,
                    component: item.component == null || item.component == "" ? 'Layout' : item.component,
                    children: [{
                        path: item.path,
                        meta: {
                            icon: item.icon,
                            title: item.name
                        }
                    }]
                })  
            }else{
                list.push({
                    id: item.id,
                    pid: item.pid,
                    path: item.path,
                    name:item.name,
                    meta: {
                        title: item.name,
                        icon:item.icon
                    }
                })  
            }
           
        }
    });
    return list;
}
function listTree(menu) {
    const list = menu.filter(item => {
        const child = menu.filter(items => {
            return item.id == items.pid;
        })
        if (child.length > 0) {
            item.children = child;
        }
        return item.pid == 0;
    })
    return list;
}