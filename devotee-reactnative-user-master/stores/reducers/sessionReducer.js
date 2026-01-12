export default function sessionReducer(state = null, action) {
    switch (action.type) {
        case 'SAVE_SESSION':
            return {...action.params }
        case 'DESTROY_SESSION':
            return null
        case 'UPDATE_SESSION':
            return {...state, ...action.params }
        default:
            return state
    }
}