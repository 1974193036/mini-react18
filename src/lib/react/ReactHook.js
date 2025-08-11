import scheduleUpdateOnFiber from '../reconciler/ReactFiberWorkLoop'

let currentlyRenderingFiber = null // 当前渲染的 fiber 对象

/**
 * 该方法主要是对当前这颗 fiber 以及 hooks 进行一个初始化
 * @param {*} wip 接收一个 fiber 对象
 */
export function renderWithHooks(wip) {
  currentlyRenderingFiber = wip // 将当前渲染的 fiber 对象赋值给 currentlyRenderingFiber
}

export function update() {
  // currentlyRenderingFiber是一个全局变量，下一个的函数节点的fiber会覆盖上一次的值
  // 闭包机制 保存当前的 currentlyRenderingFiber
  const currentFiber = currentlyRenderingFiber

  return () => {
    console.log(currentFiber)
    currentFiber.alternate = { ...currentFiber }
    // 将相邻的 fiber 节点置为 null，不去更新相邻的节点，只更新当前函数组件，不影响其他组件
    currentFiber.sibling = null
    scheduleUpdateOnFiber(currentFiber)
  }
}
