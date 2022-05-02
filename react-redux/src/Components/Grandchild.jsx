import { UserContext } from "../App"

const Grandchild = () => {
  return (
    <UserContext.Consumer>
      {name => (
          <div>
            <h1>Grandchild</h1>
            <h3>Name: {name}</h3>
          </div>
      )}
    </UserContext.Consumer>
  )
}

export default Grandchild