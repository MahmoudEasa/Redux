import API from "goals-todos-api";

export const ADD_GOAL = "ADD_GOAL";
export const REMOVE_GOAL = "REMOVE_GOAL";
export const TOGGLE_GOAL = "TOGGLE_GOAL";

const addGoal = (goal) => {
  return {
    type: ADD_GOAL,
    goal,
  };
};

const removeGoal = (id) => {
  return {
    type: REMOVE_GOAL,
    id,
  };
};

export const handleAddGoal = (name, cb) => {
  return (dispatch) => {
    API.saveGoal(name)
      .then((goal) => {
        dispatch(addGoal(goal));
        cb();
      })
      .catch(() => {
        alert("There was an error. Try again.");
      });
  };
};

export const handleDeleteGoal = (goal) => {
  return (dispatch) => {
    dispatch(removeGoal(goal.id));

    return API.deleteGoal(goal.id).catch(() => {
      dispatch(addGoal(goal));
      alert("An error occurred. Try again.");
    });
  };
};
