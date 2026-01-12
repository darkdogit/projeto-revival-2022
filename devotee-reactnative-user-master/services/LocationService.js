var pkg = require('../app.json')
import * as Location from 'expo-location';
import PermissionsService from './PermissionsService';


export default class LocationService {

	constructor() {
		this.permissionsService = new PermissionsService()
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
		const existingStatus = await Location.getForegroundPermissionsAsync()
		let finalStatus = existingStatus.status;
		if (finalStatus === 'denied') {
			if (existingStatus.canAskAgain && requestIfFirstTime) {
				const { status } = await Location.requestForegroundPermissionsAsync();
				finalStatus = status
			} else {
				if (showAlert) {
					this.permissionsService.showSettingsAlert(this.permissionsService.ALERT_LOCATION)
				}
			}
		}
		if (finalStatus === 'undetermined') {
			if (requestIfFirstTime) {
				const { status } = await Location.requestForegroundPermissionsAsync();
				finalStatus = status
			}
		}
		return finalStatus
	}

	/**
	 * 
	 * @description verifica a permissao mostrando os devidos alerts e retorna a localizacao do usuario
	 * @returns objeto de localizacao retornado pelo aparelho
	 */
	async getCurrentPosition() {
		const status = await this.getPermission()
		if (status === 'granted') {
			let location = await Location.getCurrentPositionAsync({});
			if (!location?.coords || !location?.coords.latitude || !location?.coords.longitude) {
				throw { message: 'location not found' }
			}
			return location
		} else {
			throw { message: 'permission denied' }
		}
	}

}
