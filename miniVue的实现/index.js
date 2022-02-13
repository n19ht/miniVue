/*
 * @Author: yuanchao
 * @Date: 2022-02-10 22:59:13
 * @FilePath: \miniVue\miniVue的实现\index.js
 * @Description: 
 */
const createApp = (rootComponent) => {
    return {
        mount(select) {
            const container = document.querySelector(select)
            let isMount = false
            let oldVnode = null
            watchEffect(() => {
                if (!isMount) {
                    oldVnode = rootComponent.render()
                    mount(oldVnode, container)
                    isMount = true
                } else {
                    const newVnode = rootComponent.render()
                    patch(oldVnode, newVnode)
                    oldVnode = newVnode
                }
            })
        }
    }
}