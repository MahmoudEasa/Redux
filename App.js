// Index
// Create Random Id
function generateId() {
  return (
    Math.random().toString(36).substring(2) + new Date().getTime().toString(36)
  );
}

// App Code
const ADD_TODO = "ADD_TODO";
const REMOVE_TODO = "REMOVE_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const ADD_GOAL = "ADD_GOAL";
const REMOVE_GOAL = "REMOVE_GOAL";
const TOGGLE_GOAL = "TOGGLE_GOAL";
const RECEIVE_DATA = "RECEIVE_DATA";

function addTodoAction(todo) {
  return {
    type: ADD_TODO,
    todo,
  };
}

function removeTodoAction(id) {
  return {
    type: REMOVE_TODO,
    id,
  };
}

function toggleTodoAction(id) {
  return {
    type: TOGGLE_TODO,
    id,
  };
}

function addGoalAction(goal) {
  return {
    type: ADD_GOAL,
    goal,
  };
}

function removeGoalAction(id) {
  return {
    type: REMOVE_GOAL,
    id,
  };
}

function toggleGoalAction(id) {
  return {
    type: TOGGLE_GOAL,
    id,
  };
}

function receiveDataAction(todos, goals) {
  return {
    type: RECEIVE_DATA,
    todos,
    goals,
  };
}

function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return state.concat([action.todo]);
    case REMOVE_TODO:
      return state.filter((todo) => todo.id !== action.id);
    case TOGGLE_TODO:
      return state.map((todo) =>
        todo.id !== action.id
          ? todo
          : Object.assign({}, todo, { complete: !todo.complete })
      );
    case RECEIVE_DATA:
      return action.todos;
    default:
      return state;
  }
}

function goals(state = [], action) {
  switch (action.type) {
    case ADD_GOAL:
      return state.concat([action.goal]);
    case REMOVE_GOAL:
      return state.filter((goal) => goal.id !== action.id);
    case TOGGLE_GOAL:
      return state.map((goal) =>
        goal.id !== action.id
          ? goal
          : Object.assign({}, goal, { complete: !goal.complete })
      );
    case RECEIVE_DATA:
      return action.goals;
    default:
      return state;
  }
}

function loading(state = true, action) {
  switch (action.type) {
    case RECEIVE_DATA:
      return false;
    default:
      return state;
  }
}

const store = Redux.createStore(
  Redux.combineReducers({
    todos,
    goals,
    loading,
  })
);

// App
function List(props) {
  return (
    <ul>
      {props.items.map((item) => (
        <li key={item.id}>
          <span
            onClick={() => props.toggle && props.toggle(item.id)}
            style={{ textDecoration: item.complete ? "line-through" : "none" }}
          >
            {item.name}
          </span>
          <button onClick={() => props.remove(item)}>X</button>
        </li>
      ))}
    </ul>
  );
}

class Todos extends React.Component {
  addItem = (e) => {
    e.preventDefault();

    return API.saveTodo(this.input.value)
      .then((todo) => {
        this.props.store.dispatch(addTodoAction(todo));
        this.input.value = "";
      })
      .catch(() => {
        alert("There was an error. Try again.");
      });
  };

  removeItem = (todo) => {
    this.props.store.dispatch(removeTodoAction(todo.id));

    return API.deleteTodo(todo.id).catch(() => {
      this.props.store.dispatch(addTodoAction(todo));
      alert("An error occurred. Try again.");
    });
  };
  toggleItem = (id) => {
    this.props.store.dispatch(toggleTodoAction(id));
    return API.saveTodoToggle(id).catch(() => {
      this.props.store.dispatch(toggleTodoAction(id));
      alert("An error occurred. Try again.");
    });
  };

  render() {
    return (
      <div>
        <div className="todos">
          <h1>Todo List</h1>
          <input
            type="text"
            placeholder="Add Todo"
            ref={(input) => (this.input = input)}
          />
          <button onClick={this.addItem}>Add Todo</button>
        </div>
        <List
          toggle={this.toggleItem}
          items={this.props.todos}
          remove={this.removeItem}
        />
      </div>
    );
  }
}

class Goals extends React.Component {
  addItem = (e) => {
    e.preventDefault();

    return API.saveGoal(this.input.value)
      .then((goal) => {
        this.props.store.dispatch(addGoalAction(goal));
        this.input.value = "";
      })
      .catch(() => {
        alert("There was an error. Try again.");
      });
  };
  removeItem = (goal) => {
    this.props.store.dispatch(removeGoalAction(goal.id));
    return API.deleteGoal(goal.id).catch(() => {
      this.props.store.dispatch(addGoalAction(goal));
      alert("An error occurred. Try again.");
    });
  };
  render() {
    return (
      <div>
        <div className="goals">
          <h1>Goals</h1>
          <input
            type="text"
            placeholder="Add Goal"
            ref={(input) => (this.input = input)}
          />
          <button onClick={this.addItem}>Add Goal</button>
        </div>
        <List items={this.props.goals} remove={this.removeItem} />
      </div>
    );
  }
}

class App extends React.Component {
  componentDidMount() {
    const { store } = this.props;

    Promise.all([API.fetchTodos(), API.fetchGoals()]).then(([todos, goals]) => {
      store.dispatch(receiveDataAction(todos, goals));
    });

    store.subscribe(() => this.forceUpdate());
  }
  render() {
    const { store } = this.props;
    const { todos, goals, loading } = store.getState();

    if (loading === true) {
      return <h3>Loading...</h3>;
    }
    return (
      <div>
        <Todos todos={todos} store={this.props.store} />
        <Goals goals={goals} store={this.props.store} />
      </div>
    );
  }
}
ReactDOM.render(<App store={store} />, document.getElementById("root"));
