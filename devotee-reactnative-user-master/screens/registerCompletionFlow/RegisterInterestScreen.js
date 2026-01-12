

import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { View, DeviceEventEmitter } from 'react-native';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { PhGradientButton } from '../../phTemplates/buttons';
import { PhSelectItem } from '../../phTemplates/components';
import { PhScrollView } from '../../phTemplates/containers';
import { measures } from '../../phTemplates/PhStyles';
import { PhPageTitle, PhParagraph } from '../../phTemplates/typography';
import PushNotificationService from '../../services/PushNotificationService';
import UserService from '../../services/UserService';
import i18n from '../../localization/AppLocalization';

export default function RegisterInterestScreen(props) {
    const inf = useSelector(state => state.infoReducer?.registerInfo)
    const userService = new UserService()
    const pushNotificationService = new PushNotificationService()
    const screenTitle = i18n.t('what_interest')
    const [isSubmitting, setSubmitting] = useState(false)
    const validationSchema = Yup.object().shape({
        interest: Yup.string().required('interest')
    })


    const [selectedItem, setSelectedItem] = useState('female')
    const items = [
        {
            id: 'female',
            name: i18n.t('women')
        },
        {
            id: 'male',
            name: i18n.t('men')
        },
        {
            id: 'all',
            name: `${i18n.t('all')}`
        },
    ]

    var refs = {}

    useEffect(() => {
		const refresh = props.navigation.addListener('focus', (r) => {
			DeviceEventEmitter.emit('REGISTER_PROGRESS_BAR_UPDATE', 7)
		});
		return () => {
		}
	}, [])


    async function handleNext(formProps) {
        userService.setRegisterInfo({ ...inf, target_gender: formProps.values.interest })
        console.log(inf)
        if (inf.account_type == 'curious') {
            const perm = await pushNotificationService.getPermission(false, false)
            if (perm === 'granted') {
                finishRegistration()
            } else {
                props.navigation.navigate('PermissionsStack', { screen: 'NotificationPermission', initial: true })
            }

            // if de permissao de notificacao
            // tela de notificacao
        } else if (inf.account_type == 'special') {
            props.navigation.navigate('RegisterCompleteDisability')
        } else if (inf.account_type == 'devotee') {
            props.navigation.navigate('RegisterCompletePictures')
        }
    }



    finishRegistration = async () => {
        setSubmitting(true)
    	try {
            const token = await pushNotificationService.registerForPushNotificationsAsync()
    		const params = { ...inf, notification_token: token }
    		const res = await userService.completeRegistration(params)
    		if (res) {
                props.navigation.navigate('PermissionsStack', { screen: 'RegisterSuccess', initial: true })
    		}
    	} catch (e) {
    		DeviceEventEmitter.emit('alertMessage', { title: i18n.t('error'), message: `${i18n.t('register_error')}\n ${e?.message || ''}` })
    		console.log(e)
    	} finally {
    		setSubmitting(false)
    	}
    }




    return (
        <PhScrollView {...props} screenTitle={screenTitle} safeAreaProps={{ mode: 'noTop' }}>
            <View style={{ paddingHorizontal: measures.xSpace, paddingTop: measures.ySpace }}>
                <PhPageTitle style={{}} >{screenTitle}</PhPageTitle>
            </View>
            <Formik validationSchema={validationSchema} validateOnMount={true} initialValues={{
                interest: 'female'
            }} >
                {
                    (formProps) => (
                        <View style={{ flex: 1, paddingTop: measures.ySpace }}>
                            <View>
                                {
                                    items.map(it => (
                                        <PhSelectItem key={it.id} selected={formProps.values.interest == it.id} onPress={() => formProps.setFieldValue('interest', it.id)} >
                                            <PhParagraph>{it.name}</PhParagraph>
                                        </PhSelectItem>
                                    ))
                                }
                            </View>
                            <View style={{ flex: 1 }} ></View>
                            <PhGradientButton
                                onPress={() => handleNext(formProps)}
                                onPressDisabled={() => {
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
