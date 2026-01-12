import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, DeviceEventEmitter, KeyboardAvoidingView, Modal, Alert } from 'react-native';
import { PhSafeAreaContainer } from '../../phTemplates/containers';
import { PhTextInput } from '../../phTemplates/inputs';
import { PhButton, PhGradientButton } from '../../phTemplates/buttons'
import * as Yup from 'yup';
import { Formik } from 'formik';
import Constants from 'expo-constants';
import UserService from '../../services/UserService';
import { measures } from '../../phTemplates/PhStyles';
import { PhParagraph, PhPageTitle } from '../../phTemplates/typography';
import HelperService from '../../services/HelperService';
import i18n from '../../localization/AppLocalization';

export default function PasswordRecoveryScreen(props) {
	const helperService = new HelperService()
	const userService = new UserService()
	const [isSubmitting, setSubmitting] = useState(false)
	const [showSuccess, setShowSuccess] = useState(false)
	const screenTitle = i18n.t('forgot_password')
	const validationSchema = Yup.object().shape({
		email: Yup.string().required(i18n.t('email_error')).email(i18n.t('email_error'))
	})

	useEffect(() => {
		props.navigation.setOptions({ headerRight: null })
	})

	function handleRecovery(values) {
		setSubmitting(true)
		userService.sendRecoveryPasswordEmail(values).then(r => {
			setSubmitting(false)
			if (r.status) {
				helperService.showToast({
					visibilityTime: 3500,
					text1: i18n.t('email_sent'),
					text2: `${i18n.t('email_sent2')} ${values.email} ${i18n.t('email_sent3')}`,
				});
				props.navigation.goBack()
			}
		}).catch(r => {
			setSubmitting(false)
		})
	}


	return (
		<PhSafeAreaContainer>
			<KeyboardAvoidingView
				behavior={Platform.OS == 'ios' ? 'padding' : null}
				keyboardVerticalOffset={Platform.OS == 'ios' ? Constants.statusBarHeight + 20 : null}
				style={{ flex: 1 }}>
				<Formik validationSchema={validationSchema} validateOnMount={true} initialValues={{}} >
					{
						(formProps) => (
							<>
								<ScrollView>
									<PhPageTitle style={{ paddingHorizontal: measures.xSpace, paddingBottom: measures.ySpace }} >{screenTitle}</PhPageTitle>
									<PhParagraph style={{ paddingHorizontal: measures.xSpace }}>{i18n.t('forgot_password_text')}</PhParagraph>
									<PhTextInput
										labelTitle={i18n.t('email')}
										placeholder={i18n.t('email_placeholder')}
										keyboardType={'email-address'}
										autoCapitalize={'none'}
										onChangeText={(text) =>
											formProps.setFieldValue('email', text)
										}
									/>
									<PhGradientButton onPress={() => handleRecovery(formProps.values)} containerStyle={{ marginVertical: measures.ySpace }} disabled={!formProps.isValid} loading={isSubmitting} >{i18n.t('recover_password')}</PhGradientButton>
								</ScrollView>
							</>
						)}

				</Formik>

			</KeyboardAvoidingView>
		</PhSafeAreaContainer>


	)
}
