import { HostComponent } from './ReactWorkTags'
import { updateFiberProps } from '../react-dom/SyntheticEvent'

function completeWork(wip) {
  if (!wip) {
    return
  }
  switch (wip.tag) {
    case HostComponent:
      if (wip.stateNode) {
        updateFiberProps(wip.stateNode, wip)
      }
      break
    default:
      break
  }
}

export default completeWork
