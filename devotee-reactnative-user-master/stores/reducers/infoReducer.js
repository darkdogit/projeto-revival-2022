const initialState = {
    location: {},
    userInfo: null,
    filtersInfo: {},
    swipedFake: false

}

export default function infoReducer(state = initialState, action) {
    switch (action.type) {
        case 'SAVE_INFO':
            return { ...action.params }
        case 'DESTROY_USER_INFO':
            return {...initialState, swipedFake: state.swipedFake }
        case 'UPDATE_INFO':
            return { ...state, ...action.params }
        default:
            return state
    }
}