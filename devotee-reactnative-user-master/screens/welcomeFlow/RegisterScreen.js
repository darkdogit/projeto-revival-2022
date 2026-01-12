
import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter, Image, Keyboard, Platform, Pressable, TouchableOpacity, View } from 'react-native';
import { PhButton, PhCheckboxButton, PhGradientButton } from '../../phTemplates/buttons';
import { PhScrollView } from '../../phTemplates/containers';
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhPageTitle, PhParagraph, PhSubtitle } from '../../phTemplates/typography';
import { PhRow } from '../../projectsComponents';
import * as RootNavigation from '../../routeStacks/RootNavigation';
import PushNotificationService from '../../services/PushNotificationService';
import { SessionService } from '../../services/SessionService';
import UserService from '../../services/UserService';
import * as Google from 'expo-auth-session/providers/google';
import i18n from '../../localization/AppLocalization';
const pkg = require('../../app.json')


export default function RegisterScreen(props) {
	const [request, response, promptAsync] = Google.useIdTokenAuthRequest(environment.googleSettings.loginCredentials)
	const screenTitle = i18n.t('create_account')
	const [isSubmitting, setSubmitting] = useState(false)
	const [submittingGoogle, setSubmittingGoogle] = useState(false)
	const [submittingApple, setSubmittingApple] = useState(false)
	const [termsChecked, setTermsChecked] = useState(false)
	const [termString, setTermString] = useState('')
	const pushService = new PushNotificationService()
	const userService = new UserService()
	const sessionService = new SessionService()
	const refs = {}

	useEffect(() => {
		if (response?.type === 'success') {
			getGoogleUserInfo(response.params.id_token)
		} else {
			// nao foi possivel fazer login
		}
	}, [response])


	async function getGoogleUserInfo(idToken) {
		try {
			const res = await userService.getGoogleUserInfo(idToken)
			handleRegister({
				email: res.email,
				token: idToken,
				login_type: 'google'
			})
		} catch (e) {
			console.log('getGoogleUserInfo', e)
			setSubmittingGoogle(false)
		}
	}



	function handleRegisterEmail() {
		if (!checkTerms()) { return }
		props.navigation.navigate('RegisterEmail')
	}
	async function handleApple() {
		if (!checkTerms()) { return }
		try {
			const res = await userService.loginWithApple()
			console.log('RES', res)
			handleRegister({ email: res.email, token: res.token, login_type: res.type })
		} catch (e) {
			if (e.code != 'ERR_CANCELED') {
				DeviceEventEmitter.emit('alertMessage', { title: i18n.t('error'), message: e.message })
			}
		}
	}

	async function handleRegister(values) {
		if (!checkTerms()) { return }
		try {
			setSubmitting(true)
			Keyboard.dismiss()
			const res = await userService.register(values)
			if (res.status) {
				setTimeout(() => {
					sessionService.saveSession({ ...res.data, access_token: res.access_token, version: pkg.expo.version })
				}, 500);
			}
		} catch (e) { console.log('handleRegister', e) }
		finally {
			setSubmitting(false)
		}
	}




	const styles = {
		userTypeCard: {
			borderWidth: 3,
			borderColor: colors.lightGray,
			borderRadius: 10,
			padding: measures.xSpace,
			flex: 1,
			minHeight: 115
		},
		userTypeContainer: {
			flex: 1,
			flexDirection: 'row',
			marginTop: 10,
			paddingRight: 25,

		}
	}

	async function handleGoogle() {
		if (!checkTerms()) { return }
		promptAsync()
	}

	function checkTerms() {
		if (termsChecked) {
			setTermString('')
		} else {
			setTermString(i18n.t('accept_terms'))
		}

		console.log(termsChecked)
		return termsChecked
	}

	return (
		<PhScrollView {...props} screenTitle={screenTitle} safeAreaProps={{ mode: 'noTop' }}>
			<View style={{ paddingHorizontal: measures.xSpace, paddingBottom: measures.ySpace }}>
				<PhPageTitle style={{ paddingBottom: measures.ySpace }} >{screenTitle}</PhPageTitle>
				<PhRow justifyCenter alignCenter style={{ paddingTop: measures.ySpace + 90, }}>
					<PhCheckboxButton containerStyle={{ marginRight: 8 }} color={colors.primary} selected={termsChecked} onPress={() => setTermsChecked(!termsChecked)} />
					<View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', flex: 1 }}>
						<Pressable onPress={() => setTermsChecked(!termsChecked)} >
							<PhParagraph style={{ paddingTop: 0, lineHeight: null }} >
								{i18n.t('create_account_message')}
							</PhParagraph>
						</Pressable>
						<TouchableOpacity activeOpacity={1} style={{}} onPress={() => RootNavigation.navigate('WebView', { type: 'terms' })}  >
							<PhSubtitle>{` ${i18n.t('terms_of_use')} `}</PhSubtitle>
						</TouchableOpacity>
						<PhParagraph style={{ textAlign: 'left', lineHeight: null }} >
							{i18n.t('and')}
						</PhParagraph>
						<TouchableOpacity activeOpacity={1} style={{}} onPress={() => RootNavigation.navigate('WebView', { type: 'privacy' })} >
							<PhSubtitle >{` ${i18n.t('privacy_policy')} `}</PhSubtitle>
						</TouchableOpacity>
					</View>
				</PhRow>
				<PhParagraph style={{ textAlign: 'center', paddingTop: 12, color: colors.red }} >{!termsChecked ? termString : ''}</PhParagraph>
			</View>
			<PhButton
				onPress={() => handleGoogle()}
				containerStyle={{ backgroundColor: colors.white, borderColor: colors.lighterGray, borderWidth: 2 }}
				textStyle={{ color: colors.primary }}
				leftIcon={<Image source={require('../../assets/img/google_icon.png')} style={{ height: 16, width: 16 }} />}
			>{` ${i18n.t('using_google')} `}</PhButton>
			{
				Platform.OS == 'ios' ?
					<PhButton
						onPress={() => handleApple()}
						containerStyle={{ marginTop: measures.ySpace, backgroundColor: colors.black }}
						textStyle={{ color: colors.white }}
						leftIcon={<FontAwesome name={'apple'} color={colors.white} size={15} />}
					>{` ${i18n.t('using_apple')} `}</PhButton> : null
			}
			<PhGradientButton
				leftIcon={<FontAwesome size={20} color={colors.white} name={'envelope'} />}
				containerStyle={{ marginTop: measures.ySpace }}
				onPress={() =>
					handleRegisterEmail()}>{` ${i18n.t('using_email')} `}</PhGradientButton>

		</PhScrollView>

	)
}
