const initialState = null
export default function authTokenReducer(state = null, action) {
    switch (action.type) {
        case 'SAVE_AUTH_TOKEN':
            return {...action.params }
        case 'DESTROY_AUTH_TOKEN':
            return initialState
        default:
            return state
    }
}