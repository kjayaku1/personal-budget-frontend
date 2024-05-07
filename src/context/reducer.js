import { LOG_DATA, LOG_IN, SHOW_LOADER, TIMER_COUNT } from "./actions";

const initialState = {
  isLoggedIn: false,
  isLoggedData: {},
  timerCountSeconds: 60,
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case LOG_IN: {
      return {
        ...state,
        isLoggedIn: payload,
      };
    }
    case LOG_DATA: {
      return {
        ...state,
        isLoggedData: payload,
      };
    }
    case TIMER_COUNT: {
      return {
        ...state,
        timerCountSeconds: payload,
      }
    }
    case SHOW_LOADER: {
      return {
        ...state,
        showLoader: payload,
      };
    }
    default:
      throw new Error();
  }
};

export { reducer, initialState };
