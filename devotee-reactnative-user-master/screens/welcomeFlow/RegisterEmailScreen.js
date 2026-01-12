
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Animated, Keyboard, View, DeviceEventEmitter } from 'react-native';
import * as Yup from 'yup';
import { PhGradientButton } from '../../phTemplates/buttons';
import { PhScrollView } from '../../phTemplates/containers';
import { PhTextInput } from '../../phTemplates/inputs';
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhCaption, PhPageTitle } from '../../phTemplates/typography';
import HelperService from '../../services/HelperService';
import PushNotificationService from '../../services/PushNotificationService';
import UserService from '../../services/UserService';
import i18n from '../../localization/AppLocalization';

export default function RegisterEmailScreen(props) {
	const screenTitle = i18n.t('what_is_email')
	const [isSubmitting, setSubmitting] = useState(false)
	const userService = new UserService()
	const validationSchema = Yup.object().shape({
		email: Yup.string().required(i18n.t('email_error')).email(i18n.t('email_error')),
	})

	var refs = {}

	async function handleNext(values) {
		try {
			Keyboard.dismiss()
			setSubmitting(true)
			const res = await userService.checkEmailExist(values)
			if (res.registered) {
				DeviceEventEmitter.emit('alertMessage', { title: i18n.t('error'), message: 'Este email já está em uso' })
			} else {
				props.navigation.navigate('RegisterPassword', { formValues: { email: values.email } })
			}
		} catch (e) {
			console.log(e)
		} finally {
			setSubmitting(false)
		}
	}


	return (
		<PhScrollView { ...props } screenTitle={ screenTitle }>
			<View style={ { paddingHorizontal: measures.xSpace, } }>
				<PhPageTitle style={ {} } >{ screenTitle }</PhPageTitle>
			</View>
			<Formik validationSchema={ validationSchema } validateOnMount={ true } initialValues={
				__DEV__ ? { email: `and${Math.floor(Math.random() * 1000) + 1}@phurshell.com` } : {}
			} >
				{
					(formProps) => (
						<View style={ { flex: 1 } }>

							<PhTextInput
								required
								onRef={ (r) => {
									refs.email = r
								} }
								labelTitle="Email"
								placeholder={ i18n.t('email_placeholder') }
								keyboardType={ 'email-address' }
								autoCapitalize={ 'none' }
								onBlur={ formProps.handleBlur('email') }
								value={ formProps.values.email }
								autoComplete={ "off" }
								onChangeText={ (text) =>
									formProps.setFieldValue('email', text)
								}
								fieldHasError={ { show: (formProps.touched.email && formProps.errors.email), message: formProps.errors.email } }
							/>
							<View style={ { flex: 1 } } ></View>
							{
								formProps.touched.email && formProps.errors.email ? <PhCaption style={ { textAlign: 'center', color: colors.red } } >{ i18n.t('general_form_error') }</PhCaption> : null
							}
							<PhGradientButton
								onPress={ () => handleNext(formProps.values) }
								onPressDisabled={ () => {
									const field = Object.keys(formProps.errors)[0]
									setTimeout(() => {
										formProps.setFieldTouched(field)
										refs[field].focus()
									}, 200);

								} }
								disabled={ !formProps.isValid } loading={ isSubmitting } containerStyle={ { marginTop: 5, marginBottom: measures.bottomSpace } } >{ i18n.t('continue') }</PhGradientButton>


						</View>
					)
				}
			</Formik>
			{
				// userType == 'user' ? <ShowFormForUser /> : <ShowFormForStore />
			}
		</PhScrollView>

	)
}
