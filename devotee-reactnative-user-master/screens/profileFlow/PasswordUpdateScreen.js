import { Formik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { PhGradientButton } from '../../phTemplates/buttons';
import { PhScrollView } from '../../phTemplates/containers';
import { PhTextInput } from '../../phTemplates/inputs';
import { measures } from '../../phTemplates/PhStyles';
import { PhHeader } from '../../phTemplates/typography';
import HelperService from '../../services/HelperService';
import UserService from '../../services/UserService';
import i18n from '../../localization/AppLocalization';

export default function PasswordUpdateScreen(props) {
    const [isSubmitting, setSubmitting] = useState(false)
    const helperService = new HelperService()
    const userService = new UserService()
    const validationSchema = Yup.object().shape({
        old_password: Yup.string().required(i18n.t('old_password_error')),
        password: Yup.string().required(i18n.t('password_error')),
        confirm_password: Yup.string().required(i18n.t('password_error'))
            .oneOf([Yup.ref('password'), null], i18n.t('matching_password_error'))
    })
    async function handlePasswordUpdate(values) {
        try {
            setSubmitting(true)
            const res = await userService.update(values)
            if (res.status) {
                helperService.showToast({
                    text1: i18n.t('password_updated'),
                    text2: i18n.t('info_saved'),
                })
                props.navigation.goBack()
            }
        } catch (e) {
            console.log(e)
        } finally {
            setSubmitting(false)
        }
    }

    var refs = {}

    return (

        <PhScrollView screenTitle={''}>

            <PhHeader style={{ paddingHorizontal: measures.xSpace }} >{i18n.t('update_password')}</PhHeader>
            <Formik validationSchema={validationSchema} validateOnMount={true} initialValues={{}} >
                {
                    (formProps) => (
                        <>

                            <PhTextInput
                                onRef={(r) => {
                                    refs.old_password = r
                                }}
                                onSubmitEditing={() => refs.password.focus()}
                                blurOnSubmit={false}
                                labelTitle={i18n.t("current_password")}
                                secureTextEntry={true}
                                textContentType={'oneTimeCode'}
                                placeholder={i18n.t("current_password_placeholder")}
                                autoCapitalize={'none'}
                                value={formProps.values.old_password}
                                onChangeText={(text) =>
                                    formProps.setFieldValue('old_password', text)
                                }
                                onBlur={formProps.handleBlur('old_password')}
                                fieldHasError={{ show: (formProps.touched.old_password && formProps.errors.old_password), message: formProps.errors.old_password }}


                            />
                            <PhTextInput
                                onRef={(r) => {
                                    refs.password = r
                                }}
                                onSubmitEditing={() => refs.confirm_password.focus()}
                                blurOnSubmit={false}
                                labelTitle={i18n.t("new_password")}
                                secureTextEntry={true}
                                textContentType={'oneTimeCode'}
                                placeholder={i18n.t("new_password_placeholder")}
                                autoCapitalize={'none'}
                                value={formProps.values.password}
                                onChangeText={(text) =>
                                    formProps.setFieldValue('password', text)
                                }
                                onBlur={formProps.handleBlur('password')}
                                fieldHasError={{ show: (formProps.touched.new_password && formProps.errors.new_password), message: formProps.errors.new_password }}


                            />
                            <PhTextInput
                                onRef={(r) => {
                                    refs.confirm_password = r
                                }}
                                blurOnSubmit={true}
                                labelTitle={i18n.t("repeat_new_password")}
                                secureTextEntry={true}
                                textContentType={'oneTimeCode'}
                                placeholder={i18n.t("confirm_password_placeholder")}
                                autoCapitalize={'none'}
                                value={formProps.values.confirm_password}
                                onBlur={formProps.handleBlur('confirm_password')}
                                onChangeText={(text) =>
                                    formProps.setFieldValue('confirm_password', text)
                                }
                                fieldHasError={{ show: (formProps.touched.confirm_password && formProps.errors.confirm_password), message: formProps.errors.confirm_password }}

                            />

                            <PhGradientButton
                                onPressDisabled={() => {
                                    console.log(formProps)
                                    const field = Object.keys(formProps.errors)[0]
                                    setTimeout(() => {
                                        formProps.setFieldTouched(field)
                                        refs[field].focus()
                                    }, 200);

                                }}
                                onPress={() => handlePasswordUpdate(formProps.values)} disabled={!formProps.isValid} loading={isSubmitting} containerStyle={{ marginVertical: measures.bottomSpace }} >{i18n.t('continue')}</PhGradientButton>
                        </>
                    )
                }
            </Formik>

        </PhScrollView>

    )
}

