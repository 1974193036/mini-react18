// 引入 React 原生库
// import ReactDOM from "react-dom/client";

// 引入我们自己的库
import ReactDOM from './lib/react-dom/ReactDOM'
// import React from './lib/react/React'
// import FunctionComponent from './FunctionComponentDiff'
import { useEffect, useState } from './lib/react/ReactHook'

const root = ReactDOM.createRoot(document.getElementById('root'))

// eslint-disable-next-line react-refresh/only-export-components
function FunctionComponent() {
  // 定义一个状态 count，以及修改状态的方法 setCount
  const [count1, setCount1] = useState(0)
  const [count2, setCount2] = useState(10)

  useEffect(() => {
    console.log('执行副作用方法1')
    // 清理函数，会在下一次执行副作用函数之前执行
    return function () {
      console.log('执行了清理方法1')
    }
  }, [count1])

  useEffect(() => {
    console.log('执行副作用方法2')
    // 清理函数，会在下一次执行副作用函数之前执行
    return function () {
      console.log('执行了清理方法2')
    }
  }, [count2])

  function handleClick() {
    console.log('点击了')
    setCount1(count1 + 1)
  }

  function handleClick2(e) {
    console.log('点击了')
    setCount2(count2 + 1)
    e.stopPropagation()
  }

  return (
    <div className="comp">
      <h1>{count1}</h1>
      <h3>{count2}</h3>
      <button onClick={handleClick}>点击</button>
      <button onClick={handleClick2}>点击2</button>
    </div>
  )
}

function handleClickParent() {
  console.log('点击了 - parent')
}

root.render(
  <div id="oDiv" className="test" onClick={handleClickParent}>
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
