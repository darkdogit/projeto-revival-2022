

import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter, View } from 'react-native';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { PhGradientButton } from '../../phTemplates/buttons';
import { PhSelectItem } from '../../phTemplates/components';
import { PhScrollView } from '../../phTemplates/containers';
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhCaption, PhPageTitle, PhParagraph } from '../../phTemplates/typography';
import UserService from '../../services/UserService';
import i18n from '../../localization/AppLocalization';

export default function RegisterOrientationScreen(props) {
    const inf = useSelector(state => state.infoReducer?.registerInfo)
    const screenTitle = i18n.t('what_orientation')
    const userService = new UserService()
    const items = userService.sexOrientation
    const validationSchema = Yup.object().shape({
        orientation: Yup.string().required('orientation')
    })
    const [selectedItem, setSelectedItem] = useState('hetero')


    useEffect(() => {
		const refresh = props.navigation.addListener('focus', (r) => {
			DeviceEventEmitter.emit('REGISTER_PROGRESS_BAR_UPDATE', 6)
		});
		return () => {
		}
	}, [])

    async function handleNext(formProps) {
        userService.setRegisterInfo({ ...inf, sexual_orientation: formProps.values.orientation })
        props.navigation.navigate('RegisterCompleteInterest')
    }

    return (
        <PhScrollView {...props} screenTitle={screenTitle} safeAreaProps={{ mode: 'noTop' }}>
            <View style={{ paddingHorizontal: measures.xSpace, paddingTop: measures.ySpace }}>
                <PhPageTitle style={{}} >{screenTitle}</PhPageTitle>
            </View>
            <Formik validationSchema={validationSchema} validateOnMount={true} initialValues={{
                orientation: 'hetero'
            }} >
                {
                    (formProps) => (
                        <View style={{ flex: 1, paddingTop: measures.ySpace }}>
                            <View>
                                {
                                    items.map(it => (
                                        <PhSelectItem key={it.id} selected={formProps.values.orientation == it.id} onPress={() => formProps.setFieldValue('orientation', it.id)} >
                                            <PhParagraph>{it.name}</PhParagraph>
                                        </PhSelectItem>
                                    ))
                                }
                            </View>
                            <View style={{ flex: 1 }} ></View>
                            {
                                formProps.touched.name && formProps.errors.name ? <PhCaption style={{ textAlign: 'center', color: colors.red }} >{i18n.t('general_form_error')}</PhCaption> : null
                            }
                            <PhGradientButton
                                onPress={() => handleNext(formProps)}
                                onPressDisabled={() => {
                                }}
                                disabled={!formProps.isValid} loading={false} containerStyle={{ marginTop: 5, marginBottom: measures.bottomSpace }} >{i18n.t('continue')}</PhGradientButton>

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
