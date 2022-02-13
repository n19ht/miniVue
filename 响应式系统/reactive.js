/*
 * @Author: yuanchao
 * @Date: 2022-02-10 21:08:16
 * @FilePath: \miniVue\响应式系统\reactive.js
 * @Description: 
 */
class Dep {
    constructor() {
        this.subscribers = new Set()
    }
    depend() {
        if (acticeEffect) this.subscribers.add(acticeEffect)
    }
    notify() {
        this.subscribers.forEach((item) => {
            item()
        })
    }
}
const reactObj = new Dep()

let acticeEffect = null

const watchEffect = (effect) => {
    acticeEffect = effect
    effect()
    acticeEffect = null
}

const targetMap = new WeakMap()
const getDep = (target, key) => {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }
    let dep = depsMap.get(key)
    if (!dep) {
        dep = new Dep()
        depsMap.set(key, dep)
    }
    return dep
}

// v2
// const reactive = (raw) => {
//     Object.keys(raw).forEach((key) => {
//         const dep = getDep(raw, key)
//         let value = raw[key]
//         Object.defineProperty(raw, key, {
//             get() {
//                 dep.depend()
//                 return value
//             },
//             set(newValue) {
//                 if (value !== newValue) {
//                     value = newValue
//                 }
//                 dep.notify()
//             }
//         })
//     })
//     return raw
// }

//v3
//优势 在于添加新的属性不需要重新操作，能捕获到更多的行为，更好的性能
const reactive = (raw) => {
    return new Proxy(raw, {
        get(target, key, receiver) {
            let dep = getDep(target, key)
            dep.depend()
            return Reflect.get(...arguments)
        },
        set(target, key, receiver) {
            Reflect.set(...arguments)
            let dep = getDep(target, key)
            dep.notify()
        }
    })
}
// const obj = reactive({
//     name: '李银河',
//     age: 17,
//     sex: '男'
// })

// watchEffect(function a() {
//     console.log(obj.name);
// })

// watchEffect(function b() {
//     console.log(obj.age);
// })

// watchEffect(function c() {
//     console.log(obj.sex);
// })
// console.log('===========');
// obj.name = '张三'
// obj.sex = '女'

