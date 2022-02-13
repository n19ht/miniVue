/*
 * @Author: yuanchao
 * @Date: 2022-02-08 17:35:25
 * @FilePath: \miniVue\渲染器实现\render.js
 * @Description: 
 */
const h = (tag, props, children) => {
    return {
        tag,
        props,
        children
    }
}

const mount = (vNode, container) => {
    const el = vNode.el = document.createElement(vNode.tag)
    if (vNode.props) {
        for (key in vNode.props) {
            const value = vNode.props[key]
            if (key.startsWith('on')) {
                el.addEventListener(key.substring(2).toLowerCase(), value)
            } else {
                el.setAttribute(key, value)
            }
        }
    }
    if (vNode.children) {
        if (typeof vNode.children === 'string' || typeof vNode.children === 'number') {
            el.textContent = vNode.children
        } else {
            vNode.children.forEach(item => {
                mount(item, el)
            });
        }
    }
    container.appendChild(el)
}

const patch = (vNode1, vNode2) => {
    if (vNode1.tag !== vNode2.tag) {
        //处理tag
        const n1Parent = vNode1.el.parentElement
        n1Parent.removeChild(vNode1.el)
        mount(vNode2, n1Parent)
    } else {
        //处理props
        const el = vNode2.el = vNode1.el
        const newProps = vNode2.props || {}
        const oldProps = vNode1.props || {}
        for (const key in newProps) {
            const newValue = vNode2.props[key]
            const oldValue = vNode1.props[key]
            if (oldValue !== newValue) {
                if (key.startsWith('on')) {
                    const value = newProps[key]
                    el.addEventListener(key.substring(2).toLowerCase(), value)
                } else {
                    const value = newProps[key]
                    el.setAttribute(key, value)
                }
            }
        }
        for (const key in oldProps) {
            if (key.startsWith('on')) {
                const value = oldProps[key]
                el.removeEventListener(key.substring(2).toLowerCase(), value)
            }
            if (!newProps[key]) {
                el.removeAttribute(key)
            }
        }
        //处理children
        const newChildren = vNode2.children || []
        const oldChildren = vNode1.children || []
        // console.log(newChildren, oldChildren);
        if (typeof newChildren === 'string' || typeof newChildren === 'number') {
            if (typeof oldChildren === 'string' || typeof newChildren === 'number') {
                el.textContent = newChildren
            } else {
                el.innerText = newChildren
            }
        } else {
            if (typeof oldChildren === 'string') {
                el.innerText = ''
                newChildren.forEach((item) => {
                    mount(item, el)
                })
            } else {
                //old[v1,v2,v3]
                //new[v4,v5,v6,v7]此处暂未考虑key的情况
                const commonLen = Math.min(newChildren.length, oldChildren.length)
                //前面有相同的元素进行path操作
                for (let i = 0; i < commonLen; i++) {
                    patch(oldChildren[i], newChildren[i])
                }
                //new>old
                if (newChildren.length > oldChildren.length) {
                    newChildren.slice(oldChildren.length).forEach((item) => {
                        mount(item, el)
                    })
                }
                //new<old
                if (newChildren.length < oldChildren.length) {
                    oldChildren.slice(newChildren.length).forEach((item) => {
                        el.removeChild(item.el)
                    })
                }
            }
        }
    }
}