var pkg = require('../app.json')
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useRef } from 'react';
import { NetworkService } from './NetworkService';
import PermissionsService from './PermissionsService';
import { SessionService } from './SessionService';
import { Platform } from 'react-native';

export default class PushNotificationService {

	constructor() {
		this.network = new NetworkService()
		this.sessionService = new SessionService()
		this.permissionsService = new PermissionsService()
		// this.userService = new UserService()
		this.notificationListener = useRef();
		this.responseListener = useRef();
		Notifications.setNotificationHandler({
			handleNotification: async () => ({
				shouldShowAlert: false,
				shouldPlaySound: false,
				shouldSetBadge: false,
			}),
		});

	}

	setupNotificationReceivers(notificationReceived, notificationTapped) {


		this.notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
			// fired whenever a notification is received while the app is foregrounded
			if (notificationReceived) {
				notificationReceived(notification.request.content.data)
			}
		});

		this.responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
			// This listener is fired whenever a user taps the notification
			if (notificationTapped) {
				notificationTapped(response.notification.request.content)
			}

		});

	}

	/**
 * 
 * @description verifica a permissao do usuário, 
 * Se nao foi determinada pergunta se deseja aceitar ou nao.
 * Se for denied, verifica se pode perguntar de novo ( pq no aparelho da pra vc escolher pra nunca mais perguntar) e entao pergunta novamente.
 * Passando a função com os parametros default, ele executa com todos os alerts
 * Passando a funcao com os 2 parametros false, ele retorna só o status da permissao, util quando quiser só consultar
 * @param {*} showAlert mostra o alert de configurações do app default: true
 * @param {*} requestIfFirstTime se for a primeira vez que esta verificando a permissao, ja exibe o alert de permitir ou nao
 * @returns status da permissao: granted, undetermined, denied
 */
	async getPermission(showAlert = true, requestIfFirstTime = true) {
		const existingStatus = await Notifications.getPermissionsAsync()
		let finalStatus = existingStatus.status;
		if (finalStatus === 'denied') {
			if (existingStatus.canAskAgain && requestIfFirstTime) {
				const { status } = await Notifications.requestPermissionsAsync();
				finalStatus = status
			} else {
				if (showAlert) {
					this.permissionsService.showSettingsAlert(this.permissionsService.ALERT_NOTIFICATIONS)
				}
			}
		}
		if (finalStatus === 'undetermined') {
			if (requestIfFirstTime) {
				const { status } = await Notifications.requestPermissionsAsync();
				finalStatus = status
			}
		}
		return finalStatus
	}

	/**
	 * 
	 * @description verifica a permissao mostrando os devidos alerts e retorna o push notification token
	 * @returns retorna o token criado pelo expo
	 */
	async registerForPushNotificationsAsync(showAlert = true, requestIfFirstTime = true) {
		let token
		if (Constants.isDevice) {
			const status = await this.getPermission(showAlert, requestIfFirstTime)
			if (status === 'granted') {
				let experienceId = `@phurshell/${pkg.expo.slug}`;
				token = (await Notifications.getExpoPushTokenAsync({ experienceId })).data;
				if (Platform.OS === 'android') {
					Notifications.setNotificationChannelAsync(`${pkg.expo.name}`, {
						name: `${pkg.expo.name}`,
						importance: Notifications.AndroidImportance.MAX,
						vibrationPattern: [0, 250, 250, 250],
					});
				}
			}
			return token
		} else {
			return ''
		}
	}
}
