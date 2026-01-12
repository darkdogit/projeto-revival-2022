import Pusher from 'pusher-js/react-native';
import environment from '../environment';



export default class SocketService {
    constructor() {
        this.pusher = new Pusher(environment.pusherKey, environment.pusherConf)
        this.pusher.connection.bind('connected', () => {
            // console.log('pusher connected')
        })
        this.pusher.connection.bind('failed', () => {
            // console.log('pusher failed')
        })
        this.pusher.connection.bind('unavailable', () => {
            // console.log('pusher unavailable')
        })
    }

    subscribe(value) {
        return this.pusher.subscribe(value)
    }
}