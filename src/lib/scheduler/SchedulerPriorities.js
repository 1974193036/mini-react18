// 任务优先级
// 优先级越高，值越小

// 无优先级
export const NoPriority = 0

// 紧急任务（如用户交互）
export const ImmediatePriority = 1

// 用户阻塞型任务（如动画）
export const UserBlockingPriority = 2

// 默认优先级（如渲染）
export const NormalPriority = 3

// 低优先级任务（如数据分析）
export const LowPriority = 4

// 空闲时执行（如非紧急后台任务）
export const IdlePriority = 5

export function getTimeoutByPriorityLevel(priorityLevel) {
  let timeout

  switch (priorityLevel) {
    case ImmediatePriority: // 1
      timeout = -1
      break
    case UserBlockingPriority: // 2
      timeout = 250
      break
    case IdlePriority: // 5
      timeout = 1073741823
      break
    case LowPriority: // 4
      timeout = 10000
      break
    case NormalPriority: // 3
    default:
      timeout = 5000
      break
  }

  return timeout
}
