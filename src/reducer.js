export const initialState = {
    user: null,
    userProfile: null,
};

export const actionTypes = {
    SET_USER: "SET_USER",
    SET_PROFILE: "SET_PROFILE"
};

const reducer = (state, action) => {
    // console.log(action);
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.user,
            };
        case actionTypes.SET_PROFILE:
            return {
                ...state,
                user: action.user,
                userProfile: action.userProfile,
            };
        default:
            return state;
    }
};

export default reducer;
