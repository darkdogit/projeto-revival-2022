import React from 'react';
import { View } from 'react-native';
import i18n from '../../localization/AppLocalization';
import { measures } from '../PhStyles';
import { PhParagraph } from '../typography';

const PhEmptyStateContainer = (props) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: measures.xSpace, ...props.containerStyle }} >
            {
                !props.children ?
                    <PhParagraph style={{ ...props.textStyle }} >{props.title || i18n.t('no_items_found')}</PhParagraph>
                    : props.children
            }
        </View>
    )
}
export default PhEmptyStateContainer
