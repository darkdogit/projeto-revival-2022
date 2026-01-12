import React from 'react';
import { Switch, View } from 'react-native';
import { PhDivider } from '../components';
import { colors, measures } from '../PhStyles';
import { PhParagraph } from '../typography';

function PhSwitchInput(props) {
    return (
        <View style={{ paddingHorizontal: measures.xSpace, paddingTop: measures.ySpace }}>
            <View style={{ paddingBottom: measures.ySpace }}>
                <PhParagraph>{props.label}</PhParagraph>
                <Switch
                    trackColor={{ false: colors.lightGray, true: colors.secondary }}
                    thumbColor={colors.white}
                    ios_backgroundColor={colors.disabled}
                    {...props}
                />
            </View>
            {
                props.border === undefined || props.border === true ? <PhDivider /> : null
            }

        </View>
    )
}

export default PhSwitchInput
