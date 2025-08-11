// 引入 React 原生库
// import ReactDOM from "react-dom/client";

// 引入我们自己的库
import ReactDOM from './lib/react-dom/ReactDOM'
// import React from './lib/react/React'
import { update } from './lib/react/ReactHook'

const root = ReactDOM.createRoot(document.getElementById('root'))

let count = 10
// eslint-disable-next-line react-refresh/only-export-components
function FunctionComponent() {
  const __update = update()
  function handleClick() {
    console.log('点击了')
    count++
    // 因为现在还没有hooks来更新组件，我们暂时造一个update，让react重新渲染组件
    __update()
  }

  return (
    <div className="comp">
      <h1>{count}</h1>
      <button onClick={handleClick}>点击</button>
    </div>
  )
}

root.render(
  <div id="oDiv" className="test">
    <p>React</p>
    <a href="https://www.baidu.com">baidu</a>
    <FunctionComponent />
  </div>,
)

// root.render(111)

// class ClassComponent extends React.Component {
//   constructor(props) {
//     super(props)
//   }
//   render() {
//     return (
//       <div className="class-comp">
//         <h1>0</h1>
//         <button>点击</button>
//       </div>
//     )
//   }
// }
