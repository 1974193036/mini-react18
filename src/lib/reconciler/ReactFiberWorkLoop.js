// 该文件负责整个 React 的一个执行流行
import completeWork from './ReactFiberCompleteWork'
import beginWork from './ReactFiberBeginWork'
import commitWorker from './ReactFiberCommitWork'
import { scheduleCallback, shouldYieldToHost } from '../scheduler/Scheduler'
import { NormalPriority } from '../scheduler/SchedulerPriorities'

// wip 的英语全称为 work in progress，表示正在进行的工作
// 我们使用这个变量来保存当前正在进行的工作 fiber 对象
let wip = null

// 从名字上也可以看出，这是保存当前根节点的 fiber 对象
let wipRoot = null
function scheduleUpdateOnFiber(fiber) {
  // console.log('fiber', fiber)

  wip = fiber
  wipRoot = fiber

  // 目前我们先使用 requestIdleCallback 来进行调用
  // 后期使用 scheduler 包来进行调用
  // 当浏览器的每一帧有空闲时间的时候，就会执行 workloop 函数
  // requestIdleCallback(workloop)
  scheduleCallback(NormalPriority, workloop)
}

// 同步渲染模式
// function workloop() {
//   while (wip) {
//     // 连续执行多次，直到处理完所有的fiber节点，中间不停
//     performUnitOfWork() // 该方法负责处理一个 fiber 节点
//   }
//   if (!wip && wipRoot) {
//     commitRoot()
//   }
// }

// Concurrent Mode（并发模式）
function workloop() {
  // 如果有下一个要构建的fiber，并且时间片没有过期
  while (wip && !shouldYieldToHost()) {
    performUnitOfWork()
  }

  if (!wip && wipRoot) {
    commitRoot()
  }

  if (wip) {
    // 说明fiber树的构建还没有完成
    // 把此函数返回，下次接着干，在MessageChannel的下一个任务队列中接着干
    return workloop
  }

  // 否则，fiber树的构建已经完成，不返回任何东西，直接结束
}

/**
 * 该函数主要负责处理一个 fiber 节点
 * 有下面的事情要做：
 * 1. 处理当前的 fiber 对象
 * 2. 通过深度优先遍历子节点，生成子节点的 fiber 对象，然后继续处理
 * 3. 提交副作用
 * 4. 进行渲染
 */
function performUnitOfWork() {
  beginWork(wip) // 处理当前的 fiber 对象

  // 如果有子节点，将 wip 更新为子节点
  if (wip.child) {
    wip = wip.child
    return
  }

  completeWork(wip)

  // 如果没有子节点，就需要找到兄弟节点
  let next = wip // 先缓存一下当前的 wip
  while (next) {
    if (next.sibling) {
      wip = next.sibling
      return
    }

    // 如果没有进入上面的 if，说明当前节点后面已经没有兄弟节点了
    // 那么就需要将父节点设置为当前正在工作的节点，然后在父亲那一层继续寻找兄弟节点
    next = next.return

    // 在寻找父亲那一辈的兄弟节点之前，先执行一下 completeWork 方法
    completeWork(next)
  }

  // 如果执行到这里，说明整个 fiber 树都处理完了
  // 没有节点需要处理了
  wip = null
}

function commitRoot() {
  console.log('wipRoot', wipRoot)
  commitWorker(wipRoot)
  wipRoot = null
}

export default scheduleUpdateOnFiber
