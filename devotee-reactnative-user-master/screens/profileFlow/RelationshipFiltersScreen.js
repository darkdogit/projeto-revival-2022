import Constants from 'expo-constants';
import React from 'react';
import { DeviceEventEmitter } from 'react-native';
import { PhSelectItem } from '../../phTemplates/components';
import { PhScrollView } from '../../phTemplates/containers';
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhHeader, PhParagraph } from '../../phTemplates/typography';
import i18n from '../../localization/AppLocalization';

export default function RelationshipFiltersScreen(props) {
    const preSelectedItem = props.route.params.preSelectedItem
    const items = [
        {
            id: 'all',
            name: i18n.t('all'),
            selected: preSelectedItem == 'all'
        },
        {
            id: 'sex',
            name: i18n.t('sex'),
            selected: preSelectedItem.includes('sex')
        },
        {
            id: 'friendship',
            name: i18n.t('friendship'),
            selected: preSelectedItem.includes('friendship')
        },
        {
            id: 'relationship',
            name: i18n.t('relationship'),
            selected: preSelectedItem.includes('relationship')
        },
    ]

    function handleItemPressed(id) {
        if (id == 'all') {
            DeviceEventEmitter.emit('relationship_filter_changed', { id })
            props.navigation.goBack()
        } else {
            props.navigation.navigate('RelationshipSubfilters', { id, preSelectedItem })
        }
    }


    return (
        <PhScrollView {...props} screenTitle={''} setHeaderOptions={{
            headerStyle: {
                backgroundColor: colors.white,
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
                height: Constants.statusBarHeight + 65,
            },
        }}
            scrollViewProps={{ contentContainerStyle: { paddingTop: 12, paddingBottom: measures.bottomSpace } }}  >

            <PhHeader style={{ paddingHorizontal: measures.xSpace }} >{i18n.t('relationship_type_label')}</PhHeader>

            {
                items.map(it => (
                    <PhSelectItem key={it.id} selected={it.selected} onPress={() => handleItemPressed(it.id)} >
                        <PhParagraph>{it.name}</PhParagraph>
                    </PhSelectItem>
                ))
            }


        </PhScrollView>
    )
}

