
import React, { useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, ScrollView } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { PhLinkButton } from '../buttons';
import { colors, measures } from '../PhStyles';
import { PhHeader, PhParagraph } from '../typography';
import i18n from '../../localization/AppLocalization';

const PhBottomAlert = (props) => {
    const [messageParams, setMessageParams] = useState(null)
    const refRBSheet = useRef();
    useEffect(() => {
        const eventEmmiter = DeviceEventEmitter.addListener('alertMessage', params => {
            setMessageParams(params)
        })
        return () => {
            eventEmmiter.remove()
        }
    }, [])

    useEffect(() => {
        if (messageParams) {
            refRBSheet.current.open()
        }
    }, [messageParams])

    function handleClose() {

        refRBSheet.current.close()
        clearTimeout()
    }

    return (

        <RBSheet ref={refRBSheet}
            animationType={'fade'}
            height={200}
            customStyles={{
                container: {
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    backgroundColor: colors.white
                }
            }}>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: measures.xSpace, alignItems: 'center' }} style={{ padding: measures.xSpace }} >
                <PhHeader>{messageParams?.title || i18n.t('error')}</PhHeader>
                <PhParagraph style={{ textAlign: 'center' }}>{messageParams?.message || i18n.t('default_error_msg')}</PhParagraph>
                <PhLinkButton onPress={() => handleClose()} containerStyle={{ marginTop: measures.ySpace }} >{i18n.t('close')}</PhLinkButton>
            </ScrollView>

        </RBSheet>
    )
}

export default PhBottomAlert