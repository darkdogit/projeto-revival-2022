

import { Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, View } from 'react-native';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { PhGradientButton } from '../../phTemplates/buttons';
import { PhCameraContainer, PhScrollView } from '../../phTemplates/containers';
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhCaption, PhPageTitle, PhParagraph } from '../../phTemplates/typography';
import { PictureContainer } from '../../projectsComponents';
import LocationService from '../../services/LocationService';
import PushNotificationService from '../../services/PushNotificationService';
import { SessionService } from '../../services/SessionService';
import UserService from '../../services/UserService';
import i18n from '../../localization/AppLocalization';

const sessionService = new SessionService()
const userService = new UserService()
export default function RegisterPicturesScreen(props) {
	const inf = useSelector(state => state.infoReducer?.registerInfo)
	const locationService = new LocationService()
	const pushNotificationService = new PushNotificationService()
	const screenTitle = i18n.t('add_pics')
	const [isSubmitting, setSubmitting] = useState(false)
	const [imageIndex, setImageIndex] = useState()
	const [pics, setPics] = useState([])

	const validationSchema = Yup.object().shape({
		pictures: Yup.array().required(i18n.t('pics_error')).min(1, i18n.t('pics_error'))
	})
	const cameraRef = useRef()
	var refs = {}


	useEffect(() => {
		const refresh = props.navigation.addListener('focus', (r) => {
			DeviceEventEmitter.emit('REGISTER_PROGRESS_BAR_UPDATE', 9)
		});
		return () => {
		}
	}, [])


	async function handleNext(values) {
		userService.setRegisterInfo({ ...inf, image: values.pictures })
		props.navigation.navigate('PermissionsStack', { screen: 'LocationPermission', initial: true })
	}

	function handleImagePressed(index) {
		setImageIndex(index)
		cameraRef.current.openSheet()
	}


	return (
		<PhScrollView {...props} screenTitle={screenTitle} safeAreaProps={{ mode: 'noTop' }}>
			<Formik validationSchema={validationSchema} validateOnMount={true} initialValues={{ pictures: [] }} >

				{
					(formProps) => (
						<>
							<View style={{ flex: 1, }}>
								<View style={{ paddingHorizontal: measures.xSpace, paddingTop: measures.ySpace }}>
									<PhPageTitle style={{}} >{screenTitle}</PhPageTitle>
								</View>
								<PhParagraph style={{ paddingHorizontal: measures.xSpace, paddingVertical: 12 }} >{i18n.t('pics_error')}</PhParagraph>
								<View style={{ flexWrap: 'wrap', flex: 1, flexDirection: 'row', paddingTop: 12, paddingHorizontal: measures.xSpace / 2 }} >
									{
										Array(6).fill('').map((r, i) => <PictureContainer key={`${i}`} image={formProps.values.pictures[i]} onPress={() => handleImagePressed(i)} />)
									}
								</View>

								<View style={{ flex: 1 }} ></View>
								{
									formProps.values.pictures?.length == 0 && formProps.touched.pictures ? <PhCaption style={{ textAlign: 'center', color: colors.red }} >{i18n.t('pics_error')}</PhCaption> : null
								}
								<PhGradientButton
									onPress={() => handleNext(formProps.values)}
									onPressDisabled={() => {
										formProps.setFieldTouched('pictures')
									}}
									disabled={!formProps.isValid} loading={isSubmitting} containerStyle={{ marginTop: 5, marginBottom: measures.bottomSpace }} >{i18n.t('continue')}</PhGradientButton>

							</View>
							<PhCameraContainer cancelTitle={i18n.t('cancel')} libraryTitle={i18n.t('select_library')} cameraTitle={i18n.t('take_pic')} ref={cameraRef} onImageInfoReturned={(image) => {
								var p = formProps.values.pictures
								p[imageIndex] = image
								formProps.setFieldValue('pictures', p)
							}} />
						</>
					)
				}

			</Formik>
			{
				// userType == 'user' ? <ShowFormForUser /> : <ShowFormForStore />
			}
		</PhScrollView>

	)
}

