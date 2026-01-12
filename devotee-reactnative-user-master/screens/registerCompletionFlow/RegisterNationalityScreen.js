import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter, View } from 'react-native';
import { useSelector } from 'react-redux';
import { measures } from '../../phTemplates/PhStyles';
import { PhGradientButton } from '../../phTemplates/buttons';
import { PhSelectItem } from '../../phTemplates/components';
import { PhScrollView } from '../../phTemplates/containers';
import { PhPageTitle, PhParagraph } from '../../phTemplates/typography';
import UserService from '../../services/UserService';
import i18n from '../../localization/AppLocalization';


export default function RegisterNationalityScreen(props) {
	const userService = new UserService()
	const [selectedCountry, setSelectedCountry] = useState('BR')
	const inf = useSelector(state => state.infoReducer?.registerInfo)
	const screenTitle = i18n.t('what_nationality')
	useEffect(() => {
		const refresh = props.navigation.addListener('focus', (r) => {
			DeviceEventEmitter.emit('REGISTER_PROGRESS_BAR_UPDATE', 4)
		});
		return () => {
		}
	}, [])

	async function handleNext(values) {
		// console.log(values)
		// return 
		let country = selectedCountry
		if (country != 'BR') {
			country = 'US'
		}
		userService.setRegisterInfo({ ...inf, country })
		props.navigation.navigate('RegisterCompleteGender')
	}


	return (
		<PhScrollView { ...props } screenTitle={ screenTitle } safeAreaProps={ { mode: 'noTop' } }>
			<View style={ { paddingHorizontal: measures.xSpace, paddingTop: measures.ySpace } }>
				<PhPageTitle>{ screenTitle }</PhPageTitle>
			</View>

			<View style={ { flex: 1 } }>
				<View style={ { paddingVertical: measures.ySpace } } >
					{
						userService.nationalities.map((n, index) => (
							<PhSelectItem key={ String(index) } selected={ selectedCountry == n.id } onPress={ () => setSelectedCountry(n.id) } >
								<PhParagraph>{ n.name }</PhParagraph>
							</PhSelectItem>
						))
					}
				</View>
			</View>
			<PhGradientButton
				onPress={ () => handleNext() }
				containerStyle={ { marginTop: 5, marginBottom: measures.bottomSpace } } >{ i18n.t('continue') }</PhGradientButton>
		</PhScrollView>

	)
}
