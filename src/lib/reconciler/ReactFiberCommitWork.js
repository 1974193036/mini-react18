function commitWorker(wip) {
  if (!wip)
    return

  // 整个 commitWorker 里面的提交分三步走：
  // 1. 提交自己
  // 2. 提交子节点
  // 3. 提交兄弟节点
}

export default commitWorker
