export const LOGIN_START = "LOGIN_START";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT = "LOGOUT";
export const FOLLOW = "FOLLOW";
export const UNFOLLOW = "UNFOLLOW";
export const UPDATE_IMG = "UPDATE_IMG";
export const UPDATE_DESC = "UPDATE_DESC";


const AuthReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_START:
      return {
        user: null,
        isFetching: true,
        error: false,
      };
    case LOGIN_SUCCESS:
      return {
        user: action.payload,
        isFetching: false,
        error: false,
      };
    case LOGIN_FAILURE:
      return {
        user: null,
        isFetching: false,
        error: true,
      };
    case LOGOUT:
      return {
        user: null,
        isFetching: false,
        error: false,
      };
    case FOLLOW:
      return {
        ...state,
        user: {
          ...state.user,
          followings: [...state.user.followings, action.payload],
        },
      };
    case UNFOLLOW:
      return {
        ...state,
        user: {
          ...state.user,
          followings: state.user.followings.filter(
            (following) => following !== action.payload
          ),
        },
      };
    case UPDATE_IMG:
      return {
          ...state,
          user: {
            ...state.user,
            profileImg: action.payload
          },
      };
    case UPDATE_DESC:
      return {
          ...state,
          user: {
            ...state.user,
            desc: action.payload
          },
      };  
    default:
      return state;
  }
};

export default AuthReducer;
