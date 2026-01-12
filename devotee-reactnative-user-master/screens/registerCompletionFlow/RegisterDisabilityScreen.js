


import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter, View } from 'react-native';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { PhGradientButton } from '../../phTemplates/buttons';
import { PhScrollView } from '../../phTemplates/containers';
import { PhSelectInput, PhTextInput } from '../../phTemplates/inputs';
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhCaption, PhPageTitle, PhParagraph } from '../../phTemplates/typography';
import * as RootNavigation from '../../routeStacks/RootNavigation';
import UserService from '../../services/UserService';
import i18n from '../../localization/AppLocalization';


const userService = new UserService()
export default function RegisterDisabilityScreen(props) {
	const inf = useSelector(state => state.infoReducer?.registerInfo)
	const SEARCH_LIST_PAGINATION_RESPONSE_ID = "SEARCH_LIST_PAGINATION_RESPONSE_ID_REGISTER";
	const screenTitle = i18n.t('what_disability')
	const [formValues, setFormValues] = useState({})
	const hasError = !formValues.disability_name || (!formValues.cid?.length && !formValues.medical_procedures?.length && !formValues.medicament?.length && !formValues.hospital?.length)
	const [showError, setShowError] = useState(false)
	var refs = {}

	useEffect(() => {
		const refresh = props.navigation.addListener('focus', (r) => {
			DeviceEventEmitter.emit('REGISTER_PROGRESS_BAR_UPDATE', 8)
		});
		return () => {
		}
	}, [])

	useEffect(() => {
		const searchListEmitter = DeviceEventEmitter.addListener(
			SEARCH_LIST_PAGINATION_RESPONSE_ID,
			({ type, item }) => {
				var val = {};
				val[`${type}_values`] = item
				val[`${type}`] = item.map((r) => r.id);
				val[`${type}_text`] = item
					.map((r) => r.name)
					.join(", ");

				setFormValues(values => ({ ...values, ...val }))
			}
		);

		return () => {
			searchListEmitter.remove()
		}
	}, [])

	useEffect(() => {
		if (!hasError) {
			setShowError(false)
		}
	}, [formValues])

	const validationSchema = Yup.object().shape({
		disability_name: Yup.string().required(i18n.t('disability_name_error')),
		cid: Yup.array().test('test-required', 'required', function (value, context) {
			return [
				value,
				this.resolve(Yup.ref('medical_procedures')),
				this.resolve(Yup.ref('medicament')),
				this.resolve(Yup.ref('hospital')),
			].some(r => r)
		}),
		medical_procedures: Yup.array().test('test-required', 'required', function (value, context) {
			return [
				value,
				this.resolve(Yup.ref('cid')),
				this.resolve(Yup.ref('medicament')),
				this.resolve(Yup.ref('hospital')),
			].some(r => r)
		}),
		medicament: Yup.array().test('test-required', 'required', function (value, context) {
			return [
				value,
				this.resolve(Yup.ref('cid')),
				this.resolve(Yup.ref('medical_procedures')),
				this.resolve(Yup.ref('hospital')),
			].some(r => r)
		}),
		hospital: Yup.array().test('test-required', 'required', function (value, context) {
			return [
				value,
				this.resolve(Yup.ref('cid')),
				this.resolve(Yup.ref('medical_procedures')),
				this.resolve(Yup.ref('medicament')),
			].some(r => r)
		}),
	})


	async function handleNext() {
		userService.setRegisterInfo({ ...inf, ...formValues })
		props.navigation.navigate('RegisterCompletePictures')
	}
	function goToSearchPagination(options) {
		RootNavigation.navigate('SelectListStack', { screen: 'SelectListPaginationScreen', params: { options, SEARCH_LIST_RESPONSE_ID: SEARCH_LIST_PAGINATION_RESPONSE_ID } })
	}

	getError = () => {
		setError()
	}

	return (
		<PhScrollView { ...props } screenTitle={ screenTitle } safeAreaProps={ { mode: 'noTop' } }>
			<View style={ { paddingHorizontal: measures.xSpace, paddingTop: measures.ySpace } }>
				<PhPageTitle style={ {} } >{ screenTitle }</PhPageTitle>
			</View>
			<View style={ { flex: 1 } }>
				<PhTextInput
					onRef={ (r) => {
						refs.disability = r
					} }
					labelTitle={ i18n.t('disability') }
					placeholder={ i18n.t('describe') }
					autoCapitalize={ 'sentences' }
					value={ formValues.disability_name }
					autoComplete={ "off" }
					multiline={ true }
					onChangeText={ (text) =>
						setFormValues({
							...formValues,
							disability_name: text

						})
					}
				/>
				<PhParagraph style={ { paddingTop: 30, paddingHorizontal: measures.xSpace } } >{ i18n.t('what_disability_text') }</PhParagraph>
				<PhSelectInput
					value={ formValues.cid_text }
					onPress={ () => goToSearchPagination({
						title: i18n.t('select_cid'),
						type: 'cid',
						allowMultiple: true,
						preSelectedItems: formValues.cid_values,
					}) }
					labelTitle={ i18n.t('cid_label') }
					placeholder={ i18n.t('cid_placeholder') }
				/>

				<PhSelectInput
					value={ formValues.medical_procedures_text }
					onPress={ () => goToSearchPagination({
						title: i18n.t('select_medical_procedures'),
						type: 'medical_procedures',
						allowMultiple: true,
						preSelectedItems: formValues.medical_procedures_values,
					}) }
					labelTitle={ i18n.t('medical_procedures_label') }
					placeholder={ i18n.t('medical_procedures_placeholder') }
				/>
				<PhSelectInput
					value={ formValues.medicament_text }
					onPress={ () => goToSearchPagination({
						title: i18n.t('select_medications'),
						type: 'medicament',
						allowMultiple: true,
						preSelectedItems: formValues.medicament_values,
					}) }
					labelTitle={ i18n.t('medications_label') }
					placeholder={ i18n.t('medications_placeholder') }
				/>
				<PhSelectInput
					value={ formValues.hospital_text }
					onPress={ () => goToSearchPagination({
						title: i18n.t('select_hospitals'),
						type: 'hospital',
						allowMultiple: true,
						preSelectedItems: formValues.hospital_values,
					}) }
					labelTitle={ i18n.t('hospitals_label') }
					placeholder={ i18n.t('hospitals_placeholder') }
				/>

				<View style={ { flex: 1 } } ></View>
				{ showError ? <PhCaption style={ { textAlign: 'center', color: colors.red } } >{ i18n.t('general_form_error') }</PhCaption> : null }
				<PhGradientButton
					style={ { marginTop: measures.ySpace } }
					onPress={ () => handleNext() }
					onPressDisabled={ () => {
						setShowError(true)
					} }
					disabled={ hasError } loading={ false } containerStyle={ { marginTop: 5, marginBottom: measures.bottomSpace } } >{ i18n.t('continue') }</PhGradientButton>
			</View>
		</PhScrollView >

	)
}
