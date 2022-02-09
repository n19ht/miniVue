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
                el.addEventListener(key.splice(2).toLowerCase(), value)
            } else {
                el.setAttribute(key, value)
            }
        }
    }
    if (vNode.children) {
        if (typeof vNode.children === 'string') {
            el.textContent = vNode.children
        } else {
            vNode.children.forEach(item => {
                mount(item, el)
            });
        }
    }
    container.appendChild(el)
}