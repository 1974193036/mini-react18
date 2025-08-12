const validEventTypeList = ['click']

export function updateFiberProps(node, fiber) {
  // console.log(node, fiber);
  node.__fiber = fiber
}

function getEventCallbackNameFromEventType(eventType) {
  return {
    // click
    click: ['onClickCapture', 'onClick'],
  }[eventType]
}

function collectPaths(eventType, begin) {
  const paths = {
    capture: [], // 捕获
    bubble: [], // 冒泡
  }
  while (begin) {
    // 收集
    const { props } = begin
    if (props) {
      const callbackNameList = getEventCallbackNameFromEventType(eventType)
      // callbackNameList: ['onClickCapture', 'onClick']
      callbackNameList?.forEach((callbackName, i) => {
        const eventCallback = props[callbackName]
        if (eventCallback) {
          if (i === 0) {
            // capture
            paths.capture.unshift(eventCallback)
          }
          else {
            paths.bubble.push(eventCallback)
          }
        }
      })
    }
    begin = begin.return
  }
  return paths
}

function triggerEventFlow(paths, se) {
  for (let i = 0; i < paths.length; i++) {
    const callback = paths[i]
    // eslint-disable-next-line no-useless-call
    callback.call(null, se)

    if (se.__stopPropagation) {
      break
    }
  }
}

/**
 * 合成事件对象类
 */
class SyntheticEvent {
  constructor(e) {
    this.__stopPropagation = false
    // 保存原生的事件对象
    this.nativeEvent = e
  }

  // 合成事件对象需要提供一个和原生 DOM 同名的阻止冒泡的方法
  stopPropagation() {
    // 当开发者调用 stopPropagation 方法，将该合成事件对象的 __stopPropagation 设置为 true
    this.__stopPropagation = true
    if (this.nativeEvent.stopPropagation) {
      // 调用原生事件对象的 stopPropagation 方法来阻止冒泡
      this.nativeEvent.stopPropagation()
    }
  }
}

function dispatchEvent(eventType, e) {
  const targetElement = e.target // button
  if (targetElement === null) {
    console.warn('事件不存在target', e)
    return
  }

  // 实例化一个合成事件对象
  const se = new SyntheticEvent(e)

  const fiber = targetElement.__fiber
  // 找到对应的 fiberNode 之后，接下来我们需要收集路径中该事件类型所对应的所有的回调函数
  const paths = collectPaths(eventType, fiber)
  // console.log(paths)

  const { bubble, capture } = paths

  // 模拟捕获的实现
  triggerEventFlow(capture, se)

  // 模拟冒泡的实现
  // 首先需要判断是否阻止了冒泡，如果没有，那么我们只需要将 paths 进行反向再遍历执行一次即可
  if (!se._stopPropagation) {
    triggerEventFlow(bubble, se)
  }
}

export function initEvent(container, eventType) {
  if (!validEventTypeList.includes(eventType)) {
    console.warn('当前不支持', eventType, '事件')
    return
  }
  container.addEventListener(eventType, (e) => {
    // console.log(e, e.target) // button
    dispatchEvent(eventType, e)
  })
}
