function createStore(reducer) {
  let listeners = [];
  let currentState = reducer(undefined, {});

  return {
    getState: () => currentState,
    dispatch: (action) => {
      currentState = reducer(currentState, action);
      listeners.forEach((listener) => {
        listener();
      });
    },
    subscribe: (newListener) => {
      listeners.push(newListener);
      const unsubscribe = () => {
        listeners = listeners.filter((l) => l !== newListener);
      };
      return unsubscribe;
    },
  };
}

function combineReducers(reducers) {
  return (state = {}, action) => {
    return Object.keys(reducers).reduce((newState, key) => {
      newState[key] = reducers[key](state[key], action);
      return newState;
    }, {});
  };
}

const INITIAL_STATE = {
  items: 0,
  count: 0,
};

const actions = {
  increment: { type: "INCREMENT", value: 44 },
  decrement: { type: "DECREMENT", value: 44 },
};

const dummyReducer = (state = {}, action) => {
  console.log(action, "vindo do dummy");
  switch (action.type) {
    case "ANOTHER":
      return state;
  }
};
const countReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actions.increment.type:
      return {
        items: state.items + 1,
        count: state.count + actions.increment.value,
      };

    case actions.decrement.type:
      return {
        items: state.items - 1,
        count: state.count - actions.decrement.value,
      };

    default:
      return state;
  }
};

const rootReducer = combineReducers({ countReducer, dummyReducer });
const store = createStore(rootReducer);

// DOM elements
const incrementButton = document.querySelector(".increment");
const decrementButton = document.querySelector(".decrement");

// Wire click events to actions
incrementButton.addEventListener("click", () => {
  store.dispatch(actions.increment);
});

decrementButton.addEventListener("click", () => {
  store.dispatch(actions.decrement);
});

// Initialize UI display
const counterDisplay = document.querySelector(".total");
const itemsDisplay = document.querySelector(".itemsCounter");

counterDisplay.innerHTML = parseInt(0);
itemsDisplay.innerHTML = parseInt(0);

// Update UI when an action fires
store.subscribe(() => {
  const state = store.getState();
  console.log(state);
  counterDisplay.innerHTML = parseInt(state.countReducer.count);
  itemsDisplay.innerHTML = parseInt(state.countReducer.items);
});
