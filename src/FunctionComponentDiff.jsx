import { update } from './lib/react/ReactHook'

/** diff-案例1  */
let count = 10
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

/** diff-案例2  */
// let showBar = false
// function FunctionComponent() {
//   const __update = update()
//   const foo = <h1>foo</h1>
//   const bar = <h6>bar</h6>
//   function handleShowBar() {
//     console.log('click')
//     showBar = !showBar
//     // 因为现在还没有hooks来更新组件，我们暂时造一个update，让react重新渲染组件
//     __update()
//   }

//   return (
//     <div className="comp">
//       {showBar ? bar : foo}
//       <button onClick={handleShowBar}>click</button>
//     </div>
//   )
// }

/** diff-案例3  */
// let showBar = false
// function FunctionComponent() {
//   const __update = update()
//   const bar = <h1>bar</h1>
//   function handleShowBar() {
//     console.log('click')
//     showBar = !showBar
//     // 因为现在还没有hooks来更新组件，我们暂时造一个update，让react重新渲染组件
//     __update()
//   }

//   return (
//     <div className="comp">
//       {/* 放前面 */}
//       {/* {showBar && bar} */}
//       <button onClick={handleShowBar}>click</button>
//       {/* 放后面 */}
//       {showBar && bar}
//     </div>
//   )
// }

/** diff-案例4  */
// let count = 0;
// function FunctionComponent11() {
//   console.log('render11')

//   const __update = update()
//   function handleClick() {
//     console.log("click");
//     count++;
//     // 因为现在还没有hooks来更新组件，我们暂时造一个update，让react重新渲染组件
//     __update();
//   }

//   return (
//     <div className="comp11">
//       <h1>{count}</h1>
//       <button onClick={handleClick}>click</button>
//     </div>
//   );
// }

// let count2 = 0;

// function FunctionComponent22() {
//   console.log('render22')

//   const __update = update()
//   function handleClick() {
//     console.log("click");
//     count2++;
//     // 因为现在还没有hooks来更新组件，我们暂时造一个update，让react重新渲染组件
//     __update();
//   }

//   return (
//     <div className="comp22">
//       <h6>{count2}</h6>
//       <button onClick={handleClick}>click22</button>
//     </div>
//   );
// }

// function FunctionComponent() {
//   return (
//     <div className="comp">
//       <FunctionComponent11 />
//       <FunctionComponent22 />
//     </div>
//   );
// }


export default FunctionComponent
