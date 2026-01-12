import Constants from 'expo-constants';
import * as RootNavigation from '../../routeStacks/RootNavigation';
import React, { useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { PhLinkButton } from '../../phTemplates/buttons';
import { PhSelectItem } from '../../phTemplates/components';
import { PhScrollView } from '../../phTemplates/containers';
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhHeader, PhParagraph } from '../../phTemplates/typography';
import i18n from '../../localization/AppLocalization';



export default function RelationshipSubfiltersScreen(props) {
    const [selectedId, setSelectedId] = useState(props.route?.params.preSelectedItem || '')
    const it = {
        'sex': [
            {
                id: 'sex_none',
                name: i18n.t('sex_none')
            },
            {
                id: 'sex_happen',
                name: i18n.t('sex_happen')
            },
            {
                id: 'sex_horny',
                name: i18n.t('sex_horny')
            }
        ],
        'friendship': [
            {
                id: 'friendship_meet',
                name: i18n.t('friendship_meet')
            },
            {
                id: 'friendship_friends',
                name: i18n.t('friendship_friends')
            },

        ],
        'relationship': [
            {
                id: 'relationship_benefits',
                name: i18n.t('relationship_benefits')
            },
            {
                id: 'relationship_long',
                name: i18n.t('relationship_long')
            },
        ],
    }

    const items = it[props.route.params.id]

    function handleItemPressed(id) {
        setSelectedId(id)
    }

    function handleDone() {
        DeviceEventEmitter.emit('relationship_filter_changed', { id: selectedId })
        RootNavigation.navigate('Filters')
    }


    return (
        <PhScrollView {...props} screenTitle={''} setHeaderOptions={{
            headerRight: () => selectedId && items.some(r => r.id == selectedId) ? <PhLinkButton  onPress={() => handleDone()} textStyle={{ color: colors.secondary }} >{i18n.t('done')}</PhLinkButton> : null,
            headerStyle: {
                backgroundColor: colors.white,
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
                height: Constants.statusBarHeight + 65,
            },
        }}
            scrollViewProps={{ contentContainerStyle: { paddingTop: 12, paddingBottom: measures.bottomSpace } }}  >

            <PhHeader style={{ paddingHorizontal: measures.xSpace }} >{i18n.t('what_look_for')}</PhHeader>

            {
                items.map(it => (
                    <PhSelectItem key={it.id} selected={it.id == selectedId} onPress={() => handleItemPressed(it.id)} >
                        <PhParagraph>{it.name}</PhParagraph>
                    </PhSelectItem>
                ))
            }


        </PhScrollView>
    )
}

