
import { createStore, combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage';
import sessionReducer from './reducers/sessionReducer'
import infoReducer from './reducers/infoReducer'
import chatReducer from './reducers/chatReducer'
import authTokenReducer from './reducers/authTokenReducer'

// const storage = FSStorage();
const config = {
    key: 'DEVOTEE_ROOT',
    storage: AsyncStorage
}

const reducer = persistReducer(config, combineReducers({ sessionReducer, infoReducer, chatReducer, authTokenReducer }));
const store = createStore(reducer)
const persistor = persistStore(store)

export { store, persistor }