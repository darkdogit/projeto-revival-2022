

import { Formik } from 'formik';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter, View } from 'react-native';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { PhGradientButton } from '../../phTemplates/buttons';
import { PhScrollView } from '../../phTemplates/containers';
import { PhTextInputMask } from '../../phTemplates/inputs';
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhCaption, PhPageTitle, PhParagraph } from '../../phTemplates/typography';
import UserService from '../../services/UserService';
import i18n from '../../localization/AppLocalization';

const userService = new UserService()
export default function RegisterBirthdateScreen(props) {
	const inf = useSelector(state => state.infoReducer?.registerInfo)
	const screenTitle = i18n.t('when_born')
	const [isSubmitting, setSubmitting] = useState(false)
	const validationSchema = Yup.object().shape({
		birthdate: Yup.string().required(i18n.t('birthdate_error')).test('test-birthdate', i18n.t('birthdate_error2'), (value) => {

			if (!value) return false
			const date = moment(value, i18n.t('date_formatter'), true)
			const now = moment()
			const validFormat = date.isValid()
			if (!validFormat) return false
			const diff = now.diff(date, 'years')
			return diff >= 18
		}),
	})

	var refs = {}


	useEffect(() => {
		const refresh = props.navigation.addListener('focus', (r) => {
			DeviceEventEmitter.emit('REGISTER_PROGRESS_BAR_UPDATE', 3)
		});
		return () => {
		}
	}, [])

	async function handleNext(formProps) {
		userService.setRegisterInfo({ ...inf, birthdate: moment(formProps.values.birthdate, i18n.t('date_formatter')).format('YYYY[-]MM[-]DD') })
		props.navigation.navigate('RegisterCompleteNationality')
	}


	return (
		<PhScrollView {...props} screenTitle={screenTitle} safeAreaProps={{ mode: 'noTop' }}>
			<View style={{ paddingHorizontal: measures.xSpace, paddingTop: measures.ySpace }}>
				<PhPageTitle style={{}} >{screenTitle}</PhPageTitle>
			</View>
			<Formik validationSchema={validationSchema} validateOnMount={true} initialValues={
				__DEV__ ? { birthdate: '04-25-1992' } : {}
			} >
				{
					(formProps) => (
						<View style={{ flex: 1 }}>

							<PhTextInputMask
								required
								onRef={(r) => {
									refs.birthdate = r
								}}
								value={formProps.values.birthdate}
								type={'custom'}
								options={{
									mask: i18n.t('date_mask')
								}}
								labelTitle={i18n.t('birthdate')}
								placeholder={i18n.t('date_placeholder')}
								autoComplete={"off"}
								onBlur={formProps.handleBlur('birthdate')}
								maxLength={15}
								keyboardType={'numeric'}
								onChangeText={(text) =>
									formProps.setFieldValue('birthdate', text)
								}
								fieldHasError={{ show: (formProps.touched.birthdate && formProps.errors.birthdate), message: formProps.errors.birthdate }}

							/>
							<PhParagraph style={{ paddingHorizontal: measures.xSpace, paddingTop: 12 }} >{i18n.t('register_birthdate_text')}</PhParagraph>

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
			{
				// userType == 'user' ? <ShowFormForUser /> : <ShowFormForStore />
			}
		</PhScrollView>

	)
}

