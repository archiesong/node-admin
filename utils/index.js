module.exports = {
    filterMenuTree: (array) => {
        const buildMenus = function (array) {
            const list = [];
            array.filter(item => {
                if (!item.i_frame.data[0]) { //如果不是外链
                    if (item.pid == 0) {
                        list.push({
                            id: item.id,
                            pid: item.pid,
                            path: '/' + item.path,
                            name: item.name,
                            alwaysShow: true,
                            redirect: 'noredirect',
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
                                icon: item.icon
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
                    } else {
                        list.push({
                            id: item.id,
                            pid: item.pid,
                            path: item.path,
                            name: item.name,
                            meta: {
                                title: item.name,
                                icon: item.icon
                            }
                        })
                    }
                }
            })
            return list;
        }
        const buildTree = function (array) {
            const list = array.filter(item => {
                const child = array.filter(items => {
                    return item.id == items.pid;
                })
                if (child.length > 0) {
                    item.children = child;
                }
                return item.pid == 0;
            })
            return list;
        }
        const deleteMenusId = function (array) {
            const list = array.filter(item => {
                delete item.pid
                delete item.id
                if (item.children && item.children.length) {
                    deleteMenusId(item.children);
                }
                return item;
            });
            return list;
        }
        return deleteMenusId(buildTree(buildMenus(array)));
    },
    salt: () => {
        var time = Date.now() % 100,
            str = '';
        time = time === 0 ? '00' : String(time);
        for (let i = 0; i < 8; i++) {
            const base = Math.random() < 0.5 ? 65 : 97;
            str += String.fromCharCode(
                base +
                Math.floor(
                    Math.random() * 26
                )
            );
        }
        return time + str;
    }
}