import React from "react";
import "./App.css";
import Parent from "./Components/Parent";
export const UserContext = React.createContext();

function App() {
  const name = "Tyler";
  return (
    <div className="App">
      <UserContext.Provider value={name}>
        <Parent />
      </UserContext.Provider>
    </div>
  );
}

export default App;
