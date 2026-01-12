import React, { useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import { PhGradientButton } from '../../phTemplates/buttons';
import { PhSafeAreaContainer } from '../../phTemplates/containers';
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhPageTitle, PhParagraph } from '../../phTemplates/typography';
import UserService from '../../services/UserService';
import i18n from '../../localization/AppLocalization';

export default function RegisterSuccessScreen(props) {
	const [isSubmitting, setSubmitting] = useState(false)
	const userService = new UserService()
	useEffect(() => {
		props.navigation.setOptions({
			headerShown: false
		})
		props.navigation.addListener('beforeRemove', (e) => {
			e.preventDefault();
			return
		})
	}, [props.navigation])

	async function handleStart() {
		userService.syncUserWithApi()
	}
	return (
		<PhSafeAreaContainer mode={'noTop'}>
			<View style={{ flex: 1, backgroundColor: colors.white, justifyContent: 'space-between', }}>
				<View style={{ flex: 1 }} ></View>
				<View style={{ flex: 1, alignItems: 'center' }} >
					<Image style={{ height: 120, width: 120 }} source={require('../../assets/img/success_icon.png')} />
					<PhPageTitle style={{ textAlign: 'center' }} >{i18n.t('success_title')}</PhPageTitle>
					<PhParagraph style={{ paddingTop: 10, textAlign: 'center' }} >{i18n.t('success_message')}</PhParagraph>
				</View>
				<View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: measures.bottomSpace }} >
					<PhGradientButton onPress={() => handleStart()} containerStyle={{ marginTop: 12 }} >{i18n.t('start')}</PhGradientButton>
				</View>
			</View>
		</PhSafeAreaContainer>
	)
}
