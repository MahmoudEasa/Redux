import Grandchild from "./Grandchild"

const Child = () => {
  return (
    <div>
      <h1>Child</h1>
      <Grandchild />
    </div>
  )
}

export default Child