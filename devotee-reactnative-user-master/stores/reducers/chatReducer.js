const initialState = {
    badge: 0
}

export default function chatReducer(state = initialState, action) {
    switch (action.type) {
        case 'SAVE_CHAT_INFO':
            return { ...action.params }
        case 'DESTROY_CHAT_INFO':
            return initialState
        case 'UPDATE_CHAT_INFO':
            return { ...state, ...action.params }
        default:
            return state
    }
}