// 引入 React 原生库
// import ReactDOM from "react-dom/client";

// 引入我们自己的库
import ReactDOM from './lib/react-dom/ReactDOM'
// import React from './lib/react/React'
// import FunctionComponent from './FunctionComponentDiff'

const root = ReactDOM.createRoot(document.getElementById('root'))

// eslint-disable-next-line react-refresh/only-export-components
function FunctionComponent() {
  function handleClick() {
    console.log('点击了')
  }

  return (
    <div className="comp">
      <h1>0</h1>
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
