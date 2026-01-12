var pkg = require('../app.json')
// import Constants from 'expo-constants';
import { ActivityAction, startActivityAsync } from 'expo-intent-launcher';
import { Alert, Linking } from 'react-native';
import i18n from '../localization/AppLocalization';
import app from '../app.json';

export default class PermissionsService {
	ALERT_NOTIFICATIONS = 1
	ALERT_MEDIA = 2
	ALERT_LOCATION = 3

	showSettingsAlert(type, onCancelled = () => { }, onConfirmed = () => { }) {
		let title = i18n.t('permission_denied')
		let message
		let action = ActivityAction.APPLICATION_DETAILS_SETTINGS
		switch (type) {
			case this.ALERT_LOCATION:
				message = i18n.t('permission_denied_location_message')
				break;
			case this.ALERT_MEDIA:
				message = i18n.t('permission_denied_media_message')
				break;
			case this.ALERT_NOTIFICATIONS:
				message = i18n.t('permission_denied_media_message')
				break;
			default: return
		}

		Alert.alert(
			title,
			message,
			[
				{
					text: i18n.t('cancel'),
					onPress: () => {
						onCancelled()
					},
					style: 'cancel',
				},
				{
					text: i18n.t('go_to_settings'),
					onPress: () => {
						if (Platform.OS == 'ios') {
							Linking.openURL('app-settings:')
						} else {
							startActivityAsync(action, { data: 'package:' + app.expo.android.package })
						}
						onConfirmed()
					}
				}
			],
			{ cancelable: true },
		)
	}

}
