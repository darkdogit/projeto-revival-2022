

import { Formik } from 'formik';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, View } from 'react-native';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { PhGradientButton } from '../../phTemplates/buttons';
import { PhSelectItem } from '../../phTemplates/components';
import { PhScrollView } from '../../phTemplates/containers';
import { PhSelectInput, PhTextInput } from '../../phTemplates/inputs';
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhCaption, PhHeader, PhPageTitle, PhParagraph } from '../../phTemplates/typography';
import * as RootNavigation from '../../routeStacks/RootNavigation';
import UserService from '../../services/UserService';
import i18n from '../../localization/AppLocalization';


const userService = new UserService()
export default function RegisterGenderScreen(props) {
	const inf = useSelector(state => state.infoReducer?.registerInfo)
	const SEARCH_LIST_RESPONSE_ID = 'PH_SEARCH_LIST_RESPONSE_REGISTER_GENDER'
	const screenTitle = i18n.t('what_gender')
	const [isSubmitting, setSubmitting] = useState(false)
	const validationSchema = Yup.object().shape({
		gender: Yup.string().required(i18n.t('gender_error')),
		gender_id: Yup.string().required(i18n.t('gender_error')),
		includes: Yup.string().notRequired('not required'),
		gender_other: Yup.string()
			.when("gender_id", {
				is: 'other',
				then: Yup.string().required(i18n.t('gender_error2')),
				otherwise: Yup.string().notRequired('not required'),
			})
	})


	const searchListRef = useRef()

	var refs = {}


	useEffect(() => {
		const refresh = props.navigation.addListener('focus', (r) => {
			DeviceEventEmitter.emit('REGISTER_PROGRESS_BAR_UPDATE', 5)
		});
		return () => {
		}
	}, [])



	async function handleNext(values) {
		// console.log(values)
		// return 
		var gender = ''
		var show_as_gender = ''
		if (values.gender_id != 'male' && values.gender_id != 'female') {
			if (values.gender_id == 'other') {
				gender = values.gender_other
			} else {
				gender = values.gender
			}
			show_as_gender = values.includes
		} else {
			show_as_gender = values.gender_id
			gender = i18n.t(values.gender_id)
		}

		const v = { gender, show_as_gender }

		userService.setRegisterInfo({ ...inf, ...v })
		props.navigation.navigate('RegisterCompleteOrientation')
	}

	function showModal(options) {
		RootNavigation.navigate('SelectListStack', { screen: 'SelectListScreen', params: { options, SEARCH_LIST_RESPONSE_ID } })
	}

	return (
		<PhScrollView {...props} screenTitle={screenTitle} safeAreaProps={{ mode: 'noTop' }}>
			<View style={{ paddingHorizontal: measures.xSpace, paddingTop: measures.ySpace }}>
				<PhPageTitle style={{}} >{screenTitle}</PhPageTitle>
			</View>
			<Formik validationSchema={validationSchema} validateOnMount={true} initialValues={{ includes: 'female' }} >
				{
					(formProps) => {
						DeviceEventEmitter.addListener(SEARCH_LIST_RESPONSE_ID, ({ type, item }) => {
							try {
								formProps.setValues({
									...formProps.values,
									gender: item.name,
									gender_id: item.id
								})
							} catch (e) {
								console.log(e)
							}
						})
						return (
							<View style={{ flex: 1 }}>
								<PhSelectInput
									required
									onRef={(r) => {
										refs.gender = r
									}}
									value={formProps.values.gender}

									onPress={() => showModal({
										title: i18n.t('select_gender'),
										type: 'gender',
										preSelectedItems: [formProps.values.gender]
									})}

									labelTitle={i18n.t('iam')}
									placeholder={i18n.t('select')}
									fieldHasError={{ show: (formProps.touched.gender_id && formProps.errors.gender_id), message: formProps.errors.gender_id }}
									blurOnSubmit={false}
								/>

								{
									formProps.values.gender_id && formProps.values.gender_id != 'male' && formProps.values.gender_id != 'female' ?
										<>
											{
												formProps.values.gender_id == 'other' ?
													<PhTextInput
														required
														onRef={(r) => {
															refs.gender_other = r
														}}
														labelTitle={i18n.t('gender')}
														placeholder={i18n.t('gender_placeholder')}
														autoCapitalize={'words'}
														onBlur={formProps.handleBlur('gender_other')}
														value={formProps.values.name}
														autoComplete={"off"}
														onChangeText={(text) =>
															formProps.setFieldValue('gender_other', text)
														}
														fieldHasError={{ show: (formProps.touched.gender_other && formProps.errors.gender_other), message: formProps.errors.gender_other }}

													/> : null
											}
											<View style={{ paddingVertical: measures.ySpace }} >
												<PhHeader style={{ paddingHorizontal: measures.xSpace }} >{i18n.t('include_me_as')}</PhHeader>
												<PhSelectItem selected={formProps.values.includes == 'female'} onPress={() => formProps.setFieldValue('includes', 'female')} >
													<PhParagraph>{i18n.t('female')}</PhParagraph>
												</PhSelectItem>
												<PhSelectItem selected={formProps.values.includes == 'male'} onPress={() => formProps.setFieldValue('includes', 'male')} >
													<PhParagraph>{i18n.t('male')}</PhParagraph>
												</PhSelectItem>
											</View>
										</> : null
								}
								<View style={{ flex: 1 }} ></View>
								{
									!formProps.isValid && formProps.touched.gender_id ? <PhCaption style={{ textAlign: 'center', color: colors.red }} >{i18n.t('general_form_error')}</PhCaption> : null
								}
								<PhGradientButton
									onPress={() => handleNext(formProps.values)}
									onPressDisabled={() => {
										console.log(formProps.touched)
										formProps.setFieldTouched('gender_id')
									}}
									disabled={!formProps.isValid} loading={isSubmitting} containerStyle={{ marginTop: 5, marginBottom: measures.bottomSpace }} >{i18n.t('continue')}</PhGradientButton>


							</View>
						)
					}
				}
			</Formik>
		</PhScrollView>

	)
}
