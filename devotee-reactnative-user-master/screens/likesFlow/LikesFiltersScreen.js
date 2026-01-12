import React, { useState } from 'react';
import { DeviceEventEmitter, View } from 'react-native';
import { PhSelectItem } from '../../phTemplates/components';
import { PhScrollView } from '../../phTemplates/containers';
import { measures } from '../../phTemplates/PhStyles';
import { PhPageTitle, PhParagraph } from '../../phTemplates/typography';
import UserService from '../../services/UserService';
import i18n from '../../localization/AppLocalization';


const userService = new UserService()
export default function LikesFiltersScreen(props) {
    const prevFilters = { ...props.route.params?.filters }
    const [gender, setGender] = useState(prevFilters?.gender || 'all')
    /**
     * @description volta e manda o filtro selecionado pra tela de likes
     */
    function handleGenderSelected(gender) {
        setGender(gender.id)
        DeviceEventEmitter.emit('LIKES_FILTERS_CHANGED', { gender: gender.id })
        props.navigation.goBack()
    }
    const styles = {

    }
    return (
        <>
            <PhScrollView onRefresh={ () => refresh() } { ...props } screenTitle={ '' }>
                <View style={ { paddingHorizontal: measures.xSpace } } >
                    <PhPageTitle style={ { paddingBottom: 12 } }>{ i18n.t('filters') }</PhPageTitle>
                    <PhParagraph>{ i18n.t('filters_likes_message') }</PhParagraph>
                </View>
                <View>
                    {
                        userService.getGenderFilters().map(r => {
                            return (
                                <PhSelectItem key={ r.id } selected={ gender == r.id } onPress={ () => handleGenderSelected(r) } >
                                    <PhParagraph>{ r.name }</PhParagraph>
                                </PhSelectItem>
                            )
                        })
                    }
                </View>
            </PhScrollView>
        </>

    )
}

