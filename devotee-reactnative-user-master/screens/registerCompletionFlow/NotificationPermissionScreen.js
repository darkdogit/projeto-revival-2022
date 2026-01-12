
import React, { useState } from 'react';
import { DeviceEventEmitter, Image, View } from 'react-native';
import { useSelector } from 'react-redux';
import { PhButton, PhGradientButton } from '../../phTemplates/buttons';
import { PhSafeAreaContainer } from '../../phTemplates/containers';
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhPageTitle, PhParagraph } from '../../phTemplates/typography';
import PushNotificationService from '../../services/PushNotificationService';
import UserService from '../../services/UserService';
import i18n from '../../localization/AppLocalization';

export default function NotificationPermissionScreen(props) {
	const [isSubmitting, setSubmitting] = useState(false)
	const userService = new UserService()
	const pushService = new PushNotificationService()
	const inf = useSelector(state => state.infoReducer?.registerInfo)
	var token = ''

	handleSkip = () => {
		setSubmitting(true)
		finishRegistration()
	}
	handleAllow = async () => {
		setSubmitting(true)
		token = await pushService.registerForPushNotificationsAsync()
		if (token) {
			finishRegistration()
		} else {
			setSubmitting(false)
		}
	}
	finishRegistration = async () => {
		try {
			const params = { ...inf, notification_token: token }
			const res = await userService.completeRegistration(params)
			if (res) {
				props.navigation.navigate('RegisterSuccess')
			}
		} catch (e) {
			DeviceEventEmitter.emit('alertMessage', { title: i18n.t('error'), message: `${i18n.t('register_error')}\n ${e?.message || ''}` })
			console.log(e)
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<PhSafeAreaContainer>
			<View style={{ flex: 1, backgroundColor: colors.white, justifyContent: 'space-between', }}>
				<View style={{ flex: 1 }} ></View>
				<View style={{ flex: 2, alignItems: 'center' }} >
					<Image style={{ height: 120, width: 120 }} source={require('../../assets/img/notification__permission_icon.png')} />
					<PhPageTitle style={{ textAlign: 'center' }} >{i18n.t('keep_posted')}</PhPageTitle>
					<PhParagraph style={{ paddingTop: 10, textAlign: 'center' }} >{i18n.t('notification_message')}</PhParagraph>
				</View>
				<View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: measures.bottomSpace }} >
					<PhButton onPress={handleSkip} containerStyle={{ backgroundColor: colors.white, borderColor: colors.disabled, borderWidth: 2 }} textStyle={{ color: colors.primary }} >{i18n.t('skip')}</PhButton>
					<PhGradientButton loading={isSubmitting} onPress={handleAllow} containerStyle={{ marginTop: 12 }} >{i18n.t('activate_notification')}</PhGradientButton>
				</View>
			</View>
		</PhSafeAreaContainer>
	)
}
