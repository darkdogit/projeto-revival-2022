import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import { colors, measures } from '../PhStyles';
import { PhParagraph, PhSubtitle } from '../typography';

const PhToast = (props) => {
    const toastConfig = {
        success: (internalState) => (
            <View style={{ minHeight: 60, width: '100%', zIndex: 9999999999 }}>
                <View style={{ flex: 1, justifyContent: 'center', borderRadius: 6, padding: measures.xSpace, marginHorizontal: 12, backgroundColor: colors.greenTransparent, }} >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                        <View style={{ flex: 1, paddingRight: 30 }}>
                            <PhSubtitle style={{ color: colors.white }} >{internalState.text1}</PhSubtitle>
                            <PhParagraph style={{ color: colors.white }}>{internalState.text2}</PhParagraph>
                        </View>
                        <FontAwesome name={'check-circle'} color={colors.white} size={20} />
                    </View>
                </View>
            </View>
        ),
        error: (internalState) => (
            <View style={{ height: 60, width: '100%' }}>
                <View style={{ flex: 1, justifyContent: 'center', borderRadius: 6, padding: measures.xSpace, marginHorizontal: 12, backgroundColor: colors.redTransparent, }} >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                        <View>
                            <PhSubtitle style={{ color: colors.white }} >{internalState.text1}</PhSubtitle>
                            <PhParagraph style={{ color: colors.white }}>{internalState.text2}</PhParagraph>
                        </View>
                        <FontAwesome name={'times-circle'} color={colors.white} size={20} />
                    </View>
                </View>
            </View>
        ),
        info: () => { },
        any_custom_type: () => { }
    };

    return (
        // <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} /> 
        <Toast config={toastConfig} />
    )
}


export default PhToast