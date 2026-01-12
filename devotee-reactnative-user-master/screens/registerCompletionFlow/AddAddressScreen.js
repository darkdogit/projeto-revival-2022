
import { FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { Formik } from 'formik';
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, DeviceEventEmitter, KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Yup from 'yup';
import * as RootNavigation from '../../routeStacks/RootNavigation';
import environment from '../../environment';
import { PhButton, PhGradientButton } from '../../phTemplates/buttons';
import { PhSafeAreaContainer } from '../../phTemplates/containers';
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhHeader, PhLabel, PhParagraph } from '../../phTemplates/typography';
import HelperService from '../../services/HelperService';
import i18n from '../../localization/AppLocalization';

export default function AddAddressScreen(props) {
	const helperService = new HelperService()
	const screenTitle = i18n.t('add_address')
	const scrollY = new Animated.Value(0)
	const [isSubmitting, setSubmitting] = useState(false)
	const [cepLoading, setCepLoading] = useState(false)
	const [searchOptions, setSearchOptions] = useState({ visible: false })
	const validationSchema = Yup.object().shape({
		lat: Yup.string().required('Required'),
		lng: Yup.string().required('Required'),
		// state: Yup.string().required('Informe um estado válido').min(2, 'Informe um estado válido'),
		// city: Yup.string().required('Informe uma cidade válida'),
		// street: Yup.string().required('Informe uma rua válida'),
		// neighborhood: Yup.string().required('Informe um bairro válido'),
	})

	const refRBSheet = useRef()

	function handleAddressSubmit(values) {
		props.addressChosen(values)
	}


	function formatPlacesAddress(info) {
		const { address_components, geometry } = info
		var address = {
			lat: geometry.location.lat,
			lng: geometry.location.lng,
		}
		var city = ''
		var state = ''
		address_components.map(r => {
			if (r.types.find(s => s == "administrative_area_level_2")) {
				city = r.long_name
			}
			if (r.types.find(s => s == "administrative_area_level_1")) {
				state = r.long_name
			}
		})

		if (!address.lat || !address.lng) {
			DeviceEventEmitter.emit("alertMessage", {
				title: i18n.t('add_address_error_title'),
				message: i18n.t('add_address_error_message'),
			});
			return
		}
		address.description = `${city} - ${state}`
		return address
	}
	return (
		<PhSafeAreaContainer >

			<TouchableOpacity
				activeOpacity={ 0.8 }
				style={ { paddingLeft: measures.xSpace, paddingTop: measures.bottomSpace + measures.ySpace } }
				onPress={ () => props.onCanceled() }>
				<FontAwesome5 name="chevron-circle-left" size={ 25 } color={ colors.disabled } />
			</TouchableOpacity>

			<Formik validationSchema={ validationSchema } validateOnMount={ true } initialValues={ {} } >
				{
					(formProps) => (
						<>


							<PhHeader style={ { padding: measures.xSpace } } >{ screenTitle }</PhHeader>

							<View style={ { marginHorizontal: 12, flex: 1 } } >
								<PhLabel style={ { paddingLeft: 8 } } >{ i18n.t('add_address_label') }</PhLabel>
								<GooglePlacesAutocomplete
									keepResultsAfterBlur={ true }
									fetchDetails={ true }
									placeholder={ i18n.t('location_placeholder') }
									placeholderTextColor={ colors.placeholder }
									onPress={ (data, details = null) => {
										setSubmitting(true)
										const address = formatPlacesAddress(details)
										formProps.setValues({ ...address })
										setSubmitting(false)
									} }
									query={ {
										key: environment.googleApiKey,
										language: 'pt',
										components: 'country:br|country:us',
									} }
									filterReverseGeocodingByTypes={ [
										'route',
									] }
									styles={ {
										textInputContainer: {
											borderBottomColor: colors.divider,
											borderBottomWidth: 1
										},
										textInput: {
											height: 38,
											color: colors.gray,
											fontSize: 16,
										},
									} }
									onFail={ (r) => console.log('fail', r) }
									renderRow={ (data) => {

										return (

											<View style={ { flexDirection: 'row', flex: 1, alignItems: 'center', flex: 1, } } >
												<FontAwesome name={ 'map-marker' } color={ colors.gray } size={ 20 } />
												<View style={ { flex: 1, paddingLeft: measures.xSpace } } >
													<PhParagraph style={ { color: colors.black } } >{ `${data.structured_formatting.main_text}` }</PhParagraph>
													<PhParagraph style={ { color: colors.gray } } >{ `${data.structured_formatting.secondary_text}` }</PhParagraph>
												</View>
											</View>
										)
									} }
								/>

							</View>
							<PhGradientButton onPress={ () => handleAddressSubmit(formProps.values) } disabled={ !formProps.isValid } loading={ isSubmitting } containerStyle={ { marginTop: 10, marginBottom: 20 } } >Continuar</PhGradientButton>
						</>


					)
				}

			</Formik>
		</PhSafeAreaContainer>
	)
}
