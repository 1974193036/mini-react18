/**
 * 该文件就是调度器的具体实现
 */
import { peek, pop, push } from './SchedulerMinHeap'
import { getTimeoutByPriorityLevel } from './SchedulerPriorities'
import { getCurrentTime } from '../shared/utils'

// 任务队列
const taskQueue = []

// 任务 id 计数器
let taskIdCounter = 1

// React每一帧向浏览申请5毫秒用于自己任务执行
// 如果5毫秒内没有完成，React也会放弃控制权，把控制交还给浏览器
const frameInterval = 5

let startTime = -1

// 通过 MessageChannel 来模拟浏览器的 requestIdleCallback
const { port1, port2 } = new MessageChannel()

/**
 * 该函数的作用是为了组装一个任务对象，然后将其放入到任务队列
 * @param {*} priorityLevel 是一个任务优先级
 * @param {*} callback 是一个需要执行的任务，该任务会在每一帧有剩余时间的时候去执行
 */
export function scheduleCallback(priorityLevel, callback) {
  // 获取当前时间
  const currentTime = getCurrentTime()
  // 接下来设置任务过期时间
  // 在 React 源码中，针对不同的任务类型，设定了不同的过期时间
  const timeout = getTimeoutByPriorityLevel(priorityLevel) // 5000, 默认优先级（如渲染）

  // 计算出过期时间
  const expirationTime = currentTime + timeout

  // 组装一个新的任务对象
  const newTask = {
    id: taskIdCounter++,
    callback,
    expirationTime,
    sortIndex: expirationTime, // 回头会根据这个 sortIndex 来进行排序
  }

  // 将新的任务推入到任务队列
  push(taskQueue, newTask)

  // 接下来请求调度，这样会产生一个宏任务
  port1.postMessage(null)
}

port2.onmessage = function () {
  // 该方法的作用就是不停的从任务队列中取出任务，然后执行

  // 获取当前时间
  const currentTime = getCurrentTime()
  startTime = currentTime

  // 是否有更多的工作要做
  let hasMoreWork = true

  try {
    // 执行 workLoop ，并判断有没有返回值
    hasMoreWork = workLoop(currentTime)
  }
  finally {
    // 执行完以后如果为true,说明还有更多工作要做
    if (hasMoreWork) {
      // 继续执行
      port1.postMessage(null)
    }
  }
}

function workLoop(currentTime) {
  // currentTime: onmessage的回调函数中获取的当前任务开始执行的时间

  // 从任务队列中取出第一个任务
  let currentTask = peek(taskQueue)

  while (currentTask !== null) {
    // 首先这里需要做一个时间上面的判断
    // 如果任务的过期时间远大于当前时间（说明当前这个任务不着急，可以延期执行）
    // 并且可能其中某个callback执行时间很长，导致当前帧所剩余的时间也不够了，时间片到期，那么就不执行了
    if (currentTask.expirationTime > currentTime && shouldYieldToHost()) {
      break
    }

    // 没有进入到上面的 if，说明当前的任务是需要执行的
    const callback = currentTask.callback
    currentTask.callback = null
    // 执行callback，传入“是否过期”，过期了就执行吧
    const taskResult = callback(currentTask.expirationTime <= currentTime)
    // 如果返回新的函数，则表示当前的工作没有完成
    if (typeof taskResult === 'function') {
      currentTask.callback = taskResult
      return true // 还有任务要执行 hasMoreWork=true
    }

    // 如果此任务已经完成，则不需要再继续执行了，可以把此任务弹出
    if (currentTask === peek(taskQueue)) {
      pop(taskQueue)
    }

    // 如果当前的任务执行完了，或者当前任务不合法，取出下一个任务执行
    currentTask = peek(taskQueue)
  }

  // 如果循环结束还有未完成的任务，那就表示hasMoreWork=true
  if (currentTask !== null) {
    return true
  }
  // 没有任何要完成的任务了hasMoreWork=false
  return false
}

export function shouldYieldToHost() {
  // 用当前时间减去开始的时间就是过去的时间
  const timeElapsed = getCurrentTime() - startTime
  // 如果流逝或者说经过的时间小于5毫秒，那就不需要放弃执行
  if (timeElapsed < frameInterval) {
    return false
  }
  // 否则就是表示5毫秒用完了，需要放弃执行
  return true
}
