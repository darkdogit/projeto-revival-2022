
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter, Keyboard, View } from 'react-native';
import * as Yup from 'yup';
import { PhGradientButton } from '../../phTemplates/buttons';
import { PhScrollView } from '../../phTemplates/containers';
import { PhTextInput } from '../../phTemplates/inputs';
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhCaption, PhPageTitle, PhParagraph } from '../../phTemplates/typography';
import FormService from '../../services/FormService';
import UserService from '../../services/UserService';
import { useSelector } from 'react-redux';
import i18n from '../../localization/AppLocalization';

const userService = new UserService()
export default function RegisterNameScreen(props) {
	const inf = useSelector(state => state.infoReducer?.registerInfo)
	const formService = new FormService()
	const screenTitle = i18n.t('what_is_name')
	const [isSubmitting, setSubmitting] = useState(false)
	const validationSchema = Yup.object().shape({
		name: Yup.string().required(i18n.t('name_error')).test('test-name', i18n.t('name_error'), (value) => {
			return value && value.trim().length >= 3
		}),
	})

	useEffect(() => {
		const refresh = props.navigation.addListener('focus', (r) => {
			DeviceEventEmitter.emit('REGISTER_PROGRESS_BAR_UPDATE', 2)
		});
		return () => {
		}
	}, [])


	var refs = {}

	async function handleNext(formProps) {
		userService.setRegisterInfo({ ...inf, name: formProps.values.name })
		props.navigation.navigate('RegisterCompleteBirthdate')
	}


	return (
		<PhScrollView {...props} screenTitle={screenTitle} safeAreaProps={{ mode: 'noTop' }}>
			<View style={{ paddingHorizontal: measures.xSpace, paddingTop: measures.ySpace }}>
				<PhPageTitle style={{}} >{screenTitle}</PhPageTitle>
			</View>
			<Formik validationSchema={validationSchema} validateOnMount={true} initialValues={
				__DEV__ ? { name: `Teste Andrews` } : {}
			} >
				{
					(formProps) => (
						<View style={{ flex: 1 }}>

							<PhTextInput
								required
								onRef={(r) => {
									refs.name = r
								}}
								labelTitle={i18n.t('name')}
								placeholder={i18n.t('first_name')}
								autoCapitalize={'words'}
								onBlur={formProps.handleBlur('name')}
								value={formProps.values.name}
								autoComplete={"off"}
								onChangeText={(text) => {
									var reg = /[^a-zA-Z ]/g
									formProps.setFieldValue('name', `${text.normalize('NFD').replace(reg, '')}`)
								}}
								fieldHasError={{ show: (formProps.touched.name && formProps.errors.name), message: formProps.errors.name }}

							/>
							<PhParagraph style={{ paddingHorizontal: measures.xSpace, paddingTop: 12 }} >{i18n.t('register_name_text')}</PhParagraph>
							<View style={{ flex: 1 }} ></View>
							{
								formProps.touched.name && formProps.errors.name ? <PhCaption style={{ textAlign: 'center', color: colors.red }} >{i18n.t('general_form_error')}</PhCaption> : null
							}
							<PhGradientButton
								onPress={() => handleNext(formProps)}
								onPressDisabled={() => {
									console.log(formProps)
									const field = Object.keys(formProps.errors)[0]
									setTimeout(() => {
										formProps.setFieldTouched(field)
										refs[field].focus()
									}, 200);

								}}
								disabled={!formProps.isValid} loading={isSubmitting} containerStyle={{ marginTop: 5, marginBottom: measures.bottomSpace }} >{i18n.t('continue')}</PhGradientButton>


						</View>
					)
				}
			</Formik>
		</PhScrollView>

	)
}
