
import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, Pressable, TouchableOpacity, View } from 'react-native';
import { PhButton, PhGradientButton } from '../../phTemplates/buttons';
import { PhGradientIcon } from '../../phTemplates/components';
import { PhModal, PhScrollView } from '../../phTemplates/containers';
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhHeader, PhPageTitle, PhParagraph, PhSubtitle } from '../../phTemplates/typography';
import UserService from '../../services/UserService';
import { useSelector } from 'react-redux';
import i18n from '../../localization/AppLocalization';

const pkg = require('../../app.json')
const logo = require('../../assets/img/logo.png')
const userService = new UserService()
export default function RegisterTypeScreen(props) {
    const inf = useSelector(state => state.infoReducer?.registerInfo)
    const screenTitle = i18n.t('who_are_you')
    const [type, setType] = useState('devotee')
    const bgImg = require('../../assets/img/bg_welcome.png')
    const modalRef = useRef()

    useEffect(() => {
        const refresh = props.navigation.addListener('focus', (r) => {
            userService.clearRegisterInfo()
            DeviceEventEmitter.emit('REGISTER_PROGRESS_BAR_UPDATE', 1)
        });
    }, [])

    function handleContinue() {
        userService.setRegisterInfo({ ...inf, account_type: type })
        props.navigation.navigate('RegisterCompleteName')
    }
    function handleQuit() {
        modalRef.current.show()
    }
    function logout() {
        modalRef.current.hide()
        userService.logout()
    }
    function QuitModalContent() {
        return (
            <View style={{ paddingTop: measures.ySpace }}>
                <PhHeader style={{ textAlign: 'center', paddingBottom: measures.ySpace }} >{i18n.t('sure_quit')}</PhHeader>
                <PhParagraph style={{ textAlign: 'center' }} >{i18n.t('quit_text')}</PhParagraph>
                <View style={{ paddingTop: measures.ySpace, flexDirection: 'row', alignItems: 'center' }} >
                    <View style={{ flex: 1 }}>
                        <PhButton onPress={() => modalRef.current.hide()} containerStyle={{ backgroundColor: colors.gray }} >{i18n.t('continue')}</PhButton>
                    </View>
                    <View style={{ flex: 1 }}>
                        <PhButton onPress={() => logout()} containerStyle={{ backgroundColor: colors.red }} >{i18n.t('exit')}</PhButton>
                    </View>
                </View>
            </View>
        )
    }

    function CardContainer({ title, description, icon, selected, onPress }) {
        const styles = {
            cardContainer: {
                padding: measures.ySpace,
                flexDirection: 'row',
                alignItems: 'flex-start',
                borderWidth: 2,
                borderRadius: 20,
                borderColor: selected ? colors.secondary : colors.lighterGray,
                marginVertical: measures.ySpace / 2,
                justifyContent: 'flex-start',
            },
            labelsContainer: {
                paddingLeft: 10,
                flex: 1
            }
        }
        return (
            <Pressable onPress={onPress} style={styles.cardContainer} >
                <PhGradientIcon family={'FontAwesome5'} name={icon} size={20} />
                <View style={styles.labelsContainer}>
                    <PhSubtitle>{title}</PhSubtitle>
                    <PhParagraph>{description}</PhParagraph>
                </View>
                {
                    selected ? <PhGradientIcon style={{ solid: true }} family={'FontAwesome5'} name={'check-circle'} size={20} /> :
                        <FontAwesome name={'circle-thin'} color={colors.lighterGray} size={23} />
                }
            </Pressable>
        )
    }
    return (

        <PhScrollView {...props} safeAreaProps={{ mode: 'noTop' }}
            setHeaderOptions={{
                headerRight: () => <Pressable style={{marginRight: measures.xSpace}} onPress={handleQuit}><FontAwesome name="times-circle" size={30} color={colors.disabled} /></Pressable>
            }}
            componentOutScrollView={
                <PhModal ref={modalRef}>
                    <QuitModalContent />
                </PhModal>
            }
        >
            <View style={{ flex: 1, marginHorizontal: measures.xSpace, paddingTop: measures.ySpace }} >
                {/* <View style={{ paddingHorizontal: measures.xSpace, paddingBottom: measures.ySpace }}> */}
                <PhPageTitle>{screenTitle}</PhPageTitle>
                {/* </View> */}
                <CardContainer onPress={() => setType('special')} selected={type == 'special'} icon={'wheelchair'} title={i18n.t('special')} description={i18n.t('special_text')} />
                <CardContainer onPress={() => setType('devotee')} selected={type == 'devotee'} icon={'heart'} title={'Devotee'} description={i18n.t('devotee_text')} />
                <CardContainer onPress={() => setType('curious')} selected={type == 'curious'} icon={'eye'} title={i18n.t('curious')} description={i18n.t('curious_text')} />
            </View>
            <PhGradientButton onPress={() => handleContinue()} containerStyle={{ marginBottom: measures.bottomSpace, marginVertical: measures.ySpace }} >{i18n.t('continue')}</PhGradientButton>
        </PhScrollView>
    )
}
