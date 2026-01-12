
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Keyboard, View } from 'react-native';
import * as Yup from 'yup';
import { PhGradientButton } from '../../phTemplates/buttons';
import { PhScrollView } from '../../phTemplates/containers';
import { PhTextInput } from '../../phTemplates/inputs';
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhCaption, PhPageTitle } from '../../phTemplates/typography';
import { SessionService } from '../../services/SessionService';
import UserService from '../../services/UserService';
import i18n from '../../localization/AppLocalization';
const pkg = require('../../app.json')
export default function RegisterPasswordScreen(props) {
	const screenTitle = i18n.t('create_password')
	const userService = new UserService()
	const sessionService = new SessionService()
	const [isSubmitting, setSubmitting] = useState(false)
	const formValues = { ...props.route.params.formValues }
	const validationSchema = Yup.object().shape({
		password: Yup.string().required(i18n.t('password_error')).min(8, i18n.t('password_error2')),
	})

	var refs = {}

	async function handleRegister(values) {
		Keyboard.dismiss()
		const registerObject = { ...formValues, password: values.password }
		try {
			setSubmitting(true)
			Keyboard.dismiss()
			const res = await userService.register(registerObject)
			if (res.status) {
				sessionService.saveSession({ ...res.data, version: pkg.expo.version })
				sessionService.saveAuthToken(res.access_token)
			}
		} catch (e) {
			console.log('erro', e)
		}
		finally {
			setSubmitting(false)
		}

		setSubmitting(false)
	}


	return (
		<PhScrollView {...props} screenTitle={screenTitle}>
			<View style={{ paddingHorizontal: measures.xSpace, }}>
				<PhPageTitle style={{}} >{screenTitle}</PhPageTitle>
			</View>
			<Formik validationSchema={validationSchema} validateOnMount={true} initialValues={
				__DEV__ ? { password: `12345678` } : {}
			} >
				{
					(formProps) => (
						<View style={{ flex: 1 }}>

							<PhTextInput
								required
								onRef={(r) => {
									refs[1] = r
								}}
								labelTitle={i18n.t('password_label')}
								placeholder={i18n.t('password_placeholder')}
								autoCapitalize={'none'}
								textContentType={'oneTimeCode'}
								secureTextEntry={true}
								fieldHasError={{ show: (formProps.errors.password && formProps.touched.password), message: formProps.errors.password }}
								onBlur={formProps.handleBlur('password')}
								onChangeText={(text) =>
									formProps.setFieldValue('password', text)
								}
							/>
							<View style={{ flex: 1 }} ></View>
							{
								formProps.errors.password && formProps.touched.password ? <PhCaption style={{ textAlign: 'center', color: colors.red }} >{i18n.t('general_form_error')}</PhCaption> : null
							}
							<PhGradientButton
								onPress={() => handleRegister(formProps.values)}
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
			{
				// userType == 'user' ? <ShowFormForUser /> : <ShowFormForStore />
			}
		</PhScrollView>

	)
}
