import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
//import apiClient from "./api-client";

function App() {
  const [count, setCount] = useState(0);

  // const { data, isLoading } = apiClient.todos.getAll.useQuery(["todos"]);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <div>Todo List:</div>
      <div style={{ display: "flex", gap: "3px", justifyContent: "center" }}>
        {/* {isLoading
          ? "loading todos..."
          : data?.body.map((todo) => (
              <div key={todo.id} style={{ padding: "10px" }}>
                <div>{todo.title}</div>
                <div>{todo.description}</div>
              </div>
            ))} */}
      </div>
    </>
  );
}

export default App;
