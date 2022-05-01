// Index
// Create Random Id
const generateId = () => {
  return (
    Math.random().toString(36).substring(2) + new Date().getTime().toString(36)
  );
};

// App Code
const ADD_TODO = "ADD_TODO";
const REMOVE_TODO = "REMOVE_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const ADD_GOAL = "ADD_GOAL";
const REMOVE_GOAL = "REMOVE_GOAL";
const TOGGLE_GOAL = "TOGGLE_GOAL";
const RECEIVE_DATA = "RECEIVE_DATA";

const addTodoAction = (todo) => {
  return {
    type: ADD_TODO,
    todo,
  };
};

const removeTodoAction = (id) => {
  return {
    type: REMOVE_TODO,
    id,
  };
};

const toggleTodoAction = (id) => {
  return {
    type: TOGGLE_TODO,
    id,
  };
};

const addGoalAction = (goal) => {
  return {
    type: ADD_GOAL,
    goal,
  };
};

const removeGoalAction = (id) => {
  return {
    type: REMOVE_GOAL,
    id,
  };
};

const toggleGoalAction = (id) => {
  return {
    type: TOGGLE_GOAL,
    id,
  };
};

const receiveDataAction = (todos, goals) => {
  return {
    type: RECEIVE_DATA,
    todos,
    goals,
  };
};

const handleDeleteTodo = (todo) => {
  return (dispatch) => {
    dispatch(removeTodoAction(todo.id));

    return API.deleteTodo(todo.id).catch(() => {
      dispatch(addTodoAction(todo));
      alert("An error occurred. Try again.");
    });
  };
};

const handleAddItem = (name, cb) => {
  return (dispatch) => {
    API.saveTodo(name)
      .then((todo) => {
        dispatch(addTodoAction(todo));
        cb();
      })
      .catch(() => {
        alert("There was an error. Try again.");
      });
  };
};

const handleToggleItem = (id) => {
  return (dispatch) => {
    dispatch(toggleTodoAction(id));

    return API.saveTodoToggle(id).catch(() => {
      dispatch(toggleTodoAction(id));
      alert("An error occurred. Try again.");
    });
  };
};

const handleAddGoal = (name, cb) => {
  return (dispatch) => {
    API.saveGoal(name)
      .then((goal) => {
        dispatch(addGoalAction(goal));
        cb();
      })
      .catch(() => {
        alert("There was an error. Try again.");
      });
  };
};

const handleDeleteGoal = (goal) => {
  return (dispatch) => {
    dispatch(removeGoalAction(goal.id));

    return API.deleteGoal(goal.id).catch(() => {
      dispatch(addGoalAction(goal));
      alert("An error occurred. Try again.");
    });
  };
};

const handleInitialData = () => {
  return (dispatch) => {
    return Promise.all([API.fetchTodos(), API.fetchGoals()]).then(
      ([todos, goals]) => {
        dispatch(receiveDataAction(todos, goals));
      }
    );
  };
};

const todos = (state = [], action) => {
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
};

const goals = (state = [], action) => {
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
};

const loading = (state = true, action) => {
  switch (action.type) {
    case RECEIVE_DATA:
      return false;
    default:
      return state;
  }
};

// const thunk = (store) => (next) => (action) => {
//   if (typeof action === "function") {
//     return action(store.dispatch);
//   }

//   return next(action);
// };

const store = Redux.createStore(
  Redux.combineReducers({
    todos,
    goals,
    loading,
  }),
  Redux.applyMiddleware(ReduxThunk.default)
);

// App
const List = (props) => {
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
};

class Todos extends React.Component {
  addItem = (e) => {
    e.preventDefault();

    this.props.store.dispatch(
      handleAddItem(this.input.value, () => (this.input.value = ""))
    );
  };

  removeItem = (todo) => {
    this.props.store.dispatch(handleDeleteTodo(todo));
  };

  toggleItem = (id) => {
    this.props.store.dispatch(handleToggleItem(id));
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

    this.props.store.dispatch(
      handleAddGoal(this.input.value, () => (this.input.value = ""))
    );
  };

  removeItem = (goal) => {
    this.props.store.dispatch(handleDeleteGoal(goal));
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

    store.dispatch(handleInitialData());

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
