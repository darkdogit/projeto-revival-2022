import { store } from "../stores/store";
export class SessionService {
    constructor() { }

    getSession() {
        return store.getState().sessionReducer
    }
    getAuthToken() {
        return store.getState().authTokenReducer?.token
    }
    saveAuthToken(token) {
        store.dispatch({ type: 'SAVE_AUTH_TOKEN', params: { token } })
    }
    saveSession(params) {
        store.dispatch({ type: 'SAVE_SESSION', params })
    }
    clearSession(params) {
        store.dispatch({ type: 'DESTROY_SESSION' })
        store.dispatch({ type: 'DESTROY_AUTH_TOKEN' })
        store.dispatch({ type: 'DESTROY_USER_INFO' })
        store.dispatch({ type: 'UPDATE_CHAT_INFO', params: { badge: 0 } })
    }
}