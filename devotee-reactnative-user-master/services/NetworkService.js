import { DeviceEventEmitter } from 'react-native';
import Toast from 'react-native-toast-message';
import environment from '../environment';
import { SessionService } from '../services/SessionService'
import { store } from "../stores/store";
import i18n from '../localization/AppLocalization';


export class NetworkService {
    endpoints = {
        users: 'api/users',
        login: 'api/login',
        loginHash: 'api/read-hash',
        google_login: 'login/google',
        usersUpdate: 'api/users/update',
        cid: 'api/cid',
        hospitals: 'api/hospitals',
        medicalProcedures: 'api/medical-procedures',
        drugs: 'api/drugs',
        reports: 'api/reports',
        likes: 'api/likes',
        subscribe: 'api/plan/payment',
        cards: 'api/cards',
        updateImages: 'api/user/pictures/update-by-order',
        likedMe: 'api/liked-me',
        matches: 'api/matches',
        chatRooms: 'api/matches',
        checkEmailExist: 'api/users/registeredEmail',
        messages: 'api/match/messages',
        cancelSubscription: 'api/plan/cancel',
        deleteAccount: 'api/deleteAccount',
        recoveryPassword: 'api/password/email',
        settings: 'api/settings',
        superMatch: 'api/superMatch',
        activity: 'api/activities',
        saveUserPlan: 'api/subscription-info',
        suggestion: 'api/users/suggestion',
        ads: 'api/adverts',
        filters: 'api/filters',
        readMessages: 'api/readMessage',
        thingsIUse: 'api/things-i-use',
        logout: 'api/logout',
        //TODO: endpoint ta errado, pegar o certo com o paulinho
        resetDislikes: 'api/reset-dislikes'
    }
    constructor() {
        this.session = new SessionService()
        this.baseUrl = environment.baseUrl
    }

    makeItMultipartParams(params) {
        var p = new FormData()
        Object.keys(params).forEach(function (key, index) {
            if (Array.isArray(params[key])) {
                params[key].map(r => {
                    p.append(`${key}[]`, r)
                })
            } else {
                p.append(key, params[key])
            }

        });
        return p
    }

    clearSession() {
        this.session.clearSession()
        // store.dispatch({ type: 'DESTROY_SESSION' })
        // store.dispatch({ type: 'DESTROY_USER_INFO' })
        // store.dispatch({ type: 'UPDATE_CHAT_INFO', params: { badge: 0 } })
    }
    postMultipart(endpoint, p, handleError = false) {
        console.log(`-------------------- POST MULTIPART ----------------------`)
        console.log(`ENDPOINT: ${endpoint}`)
        console.log(`PARAMETROS: ${JSON.stringify(p, null, 3)}`)
        console.log(`----------------------------------------------------------`)

        var params = this.makeItMultipartParams(p)
        return fetch(this.baseUrl + endpoint, {
            method: 'POST',
            headers: this.setupHeaders(true),
            body: params
        })
            .then((res) => {
                if (res.status == 401) {
                    this.clearSession()
                    return new Promise((resolve, reject) => resolve({ status: false, message: 'Sessão expirada' }))
                }
                return res.json()

            })
            .then((res) => {
                if (!res.status && !handleError) {
                    console.log(res)
                    var message = ''
                    if (res.errors) {
                        var message = res.errors[Object.keys(res.errors)[0]][0]
                    } else {
                        message = res.message
                    }
                    DeviceEventEmitter.emit('alertMessage', { title: i18n.t('error'), message: message })
                }
                return res
            })
            .catch((e) => {
                console.log(e)
                DeviceEventEmitter.emit('alertMessage', { title: i18n.t('error'), message: e.message })
                return e
            })
    }

    post(endpoint, params, handleError = false, forceToken = null, sendBearerToken = true) {
        console.log(`-------------------- POST  ----------------------`)
        console.log(`ENDPOINT: ${endpoint}`)
        console.log(`PARAMETROS: ${JSON.stringify(params, null, 3)}`)
        console.log(`----------------------------------------------------------`)

        return fetch(this.baseUrl + endpoint, {
            method: 'POST',
            headers: this.setupHeaders(false, forceToken, sendBearerToken),
            body: JSON.stringify(params)
        })
            .then((res) => {
                if (res.status == 401) {
                    this.clearSession()
                    return new Promise((resolve, reject) => resolve({ status: false, message: 'Sessão expirada' }))
                }
                return res.json()

            })
            .then((res) => {
                if (!res.status && !handleError) {
                    var message = ''
                    if (res.errors) {
                        var message = res.errors[Object.keys(res.errors)[0]][0]
                    } else {
                        message = res.message
                    }
                    DeviceEventEmitter.emit('alertMessage', { title: i18n.t('error'), message: res.exception ? 'Ocorreu um erro no servidor' : message })
                }
                return res
            })
            .catch((e) => {
                console.log(e)
                DeviceEventEmitter.emit('alertMessage', { title: i18n.t('error'), message: e.message || 'Ocorreu um erro no servidor' })
                return e
            })
    }
    delete(endpoint, params, handleError = false, forceToken = null, sendBearerToken = true) {
        console.log(`-------------------- DELETE  ----------------------`)
        console.log(`ENDPOINT: ${endpoint}`)
        console.log(`PARAMETROS: ${JSON.stringify(params, null, 3)}`)
        console.log(`----------------------------------------------------------`)

        return fetch(this.baseUrl + endpoint, {
            method: 'DELETE',
            headers: this.setupHeaders(false, forceToken, sendBearerToken),
            body: JSON.stringify(params)
        })
            .then((res) => {
                if (res.status == 401) {
                    this.clearSession()
                    return new Promise((resolve, reject) => resolve({ status: false, message: 'Sessão expirada' }))
                }
                return res.json()

            })
            .then((res) => {
                if (!res.status && !handleError) {
                    var message = ''
                    if (res.errors) {
                        var message = res.errors[Object.keys(res.errors)[0]][0]
                    } else {
                        message = res.message
                    }
                    DeviceEventEmitter.emit('alertMessage', { title: i18n.t('error'), message: res.exception ? 'Ocorreu um erro no servidor' : message })
                }
                return res
            })
            .catch((e) => {
                console.log(e)
                DeviceEventEmitter.emit('alertMessage', { title: i18n.t('error'), message: e.message || 'Ocorreu um erro no servidor' })
                return e
            })
    }

    get(endpoint, handleError = false, sendBearerToken = true) {
        console.log(`-------------------- GET ----------------------`)
        console.log(`ENDPOINT: ${endpoint}`)
        console.log(`----------------------------------------------------------`)
        return fetch(this.baseUrl + endpoint, {
            method: 'GET',
            headers: this.setupHeaders(false, null, sendBearerToken),
        })
            .then((res) => {
                if (res.status == 401) {
                    this.clearSession()
                    return new Promise((resolve, reject) => resolve({ status: false, message: 'Sessão expirada' }))
                }
                return res.json()

            })
            .then((res) => {
                if (!res.status && !handleError) {
                    DeviceEventEmitter.emit('alertMessage', { title: i18n.t('error'), message: res.message })
                }
                return res
            })
            .catch((e) => {
                console.log(e)
                DeviceEventEmitter.emit('alertMessage', { title: i18n.t('error'), message: e.message })
                return e
            })
    }


    putMultipart(endpoint, p, handleError = false) {
        console.log(`-------------------- PUT MULTIPART ----------------------`)
        console.log(`ENDPOINT: ${endpoint}`)
        console.log(`PARAMETROS: ${JSON.stringify(p, null, 3)}`)
        console.log(`----------------------------------------------------------`)
        var params = this.makeItMultipartParams(p)
        return fetch(this.baseUrl + endpoint, {
            method: 'PUT',
            headers: this.setupHeaders(true),
            body: params
        })
            .then((res) => {
                if (res.status == 401) {
                    this.clearSession()
                    return new Promise((resolve, reject) => resolve({ status: false, message: 'Sessão expirada' }))
                }
                return res.json()

            })
            .then((res) => {
                if (!res.status && !handleError) {
                    DeviceEventEmitter.emit('alertMessage', { title: i18n.t('error'), message: res.message })
                }
                return res
            })
            .catch((e) => {
                console.log(e)
                DeviceEventEmitter.emit('alertMessage', { title: i18n.t('error'), message: e.message })
                return e
            })
    }

    put(endpoint, params, handleError = false, forceToken = null, sendBearerToken = true) {
        console.log(`-------------------- PUT -------------------------------`)
        console.log(`ENDPOINT: ${endpoint}`)
        console.log(`PARAMETROS: ${JSON.stringify(params, null, 3)}`)
        console.log(`----------------------------------------------------------`)

        return fetch(this.baseUrl + endpoint, {
            method: 'PUT',
            headers: this.setupHeaders(false, forceToken, sendBearerToken),
            body: JSON.stringify(params)
        })
            .then((res) => {
                if (res.status == 401) {
                    this.clearSession()
                    return new Promise((resolve, reject) => resolve({ status: false, message: 'Sessão expirada' }))
                }
                return res.json()

            })
            .then((res) => {
                if (!res.status && !handleError) {
                    DeviceEventEmitter.emit('alertMessage', { title: i18n.t('error'), message: res.message })
                }
                return res
            })
            .catch((e) => {
                console.log(e)
                DeviceEventEmitter.emit('alertMessage', { title: i18n.t('error'), message: e.message })
                return e
            })
    }

    setupHeaders(multipart = false, forceToken = null, sendBearerToken = true) {
        var access_token = this.session.getAuthToken()
        // console.log('bearer', access_token)
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        if (multipart) {
            headers['Content-Type'] = 'multipart/form-data'
        }

        if (access_token && sendBearerToken) {
            headers['Authorization'] = `Bearer ${access_token}`
        }

        if (forceToken && sendBearerToken) {
            headers['Authorization'] = `Bearer ${forceToken}`
        }

        console.log('HEADERS: ', headers)

        return headers
    }

    getExternal(url, headers = {}) {
        console.log(`-------------------- GET EXTERNAL----------------------`)
        console.log(`ENDPOINT: ${url}`)
        console.log(`----------------------------------------------------------`)
        console.log(`HEADERS: `, headers)
        console.log(`----------------------------------------------------------`)

        return fetch(url, {
            method: 'GET',
            headers
        })
            .then(res => res.json())
            .then(res => res)
            .catch(e => {
                DeviceEventEmitter.emit('alertMessage', { title: i18n.t('error'), message: e.message })
                return e
            })
    }

    postExternal(url, params) {
        console.log(`-------------------- POST EXTERNAL----------------------`)
        console.log(`ENDPOINT: ${url}`)
        console.log(`----------------------------------------------------------`)

        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => res.json())
            .then(res => res)
            .catch(e => {
                DeviceEventEmitter.emit('alertMessage', { title: i18n.t('error'), message: e.message })
                return e
            })
    }
}