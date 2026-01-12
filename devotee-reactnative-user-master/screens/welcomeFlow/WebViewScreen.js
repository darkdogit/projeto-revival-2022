import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { PhSafeAreaContainer } from '../../phTemplates/containers';
import { measures } from '../../phTemplates/PhStyles';

import UserService from '../../services/UserService';

export default function WebViewScreen(props) {
    const userService = new UserService()
    const type = props.route.params.type

    const [html, setHtml] = useState('')

    useEffect(() => {
        props.navigation.setOptions({ headerTitle: 'Devotee' })
        switch (type) {
            case 'terms':
            case 'privacy':
                getSettings()
                break;
        }
    }, [])
    async function getSettings() {
        try {
            const res = await userService.getSettings(type)
            setHtml(res)
        } catch (e) {
            console.log(e)
            setHtml('')
        }
    }

    return (
        <PhSafeAreaContainer>
            <ScrollView contentContainerStyle={{ paddingBottom: measures.bottomSpace }}>
                <View style={{ paddingHorizontal: measures.xSpace }} >
                    <RenderHtml
                        contentWidth={measures.screenWidth}
                        source={{
                            html: html
                        }}
                    />
                    {/* <PhParagraph>{`Aenean pharetra vehicula diam. Ut blandit quam nec tellus rhoncus ullamcorper. Quisque posuere cursus elit id tempor. Proin sollicitudin nisi vitae odio rutrum, eu eleifend felis porttitor. Donec sollicitudin placerat mauris, nec accumsan risus eleifend nec. Cras ut neque iaculis, posuere urna vitae, consequat eros. Vestibulum facilisis feugiat ultricies. Suspendisse fermentum faucibus consectetur. Nullam lacinia diam orci, vehicula imperdiet velit consequat id. Pellentesque sit amet quam at ipsum mattis suscipit in nec ex. Nam velit eros, placerat et consectetur sit amet, blandit ut diam. Nullam a lorem quam. Donec elit magna, bibendum id erat a, rhoncus tincidunt massa. Ut congue felis sed metus imperdiet, eu tristique nulla imperdiet. Proin consequat consequat purus non fermentum. Cras nec ligula non odio tempor imperdiet eu eu turpis  Quisque posuere cursus elit id tempor. Proin sollicitudin nisi vitae odio rutrum, eu eleifend felis porttitor. Donec sollicitudin placerat mauris, nec accumsan risus eleifend nec. Cras ut neque iaculis, posuere urna vitae, consequat eros. Vestibulum facilisis feugiat ultricies. Suspendisse fermentum faucibus consectetur. Nullam lacinia diam orci, vehicula imperdiet velit consequat id. Pellentesque sit amet quam at ipsum mattis suscipit in nec ex. Nam velit eros, placerat et consectetur sit amet, blandit ut diam. Nullam a lorem quam. Donec elit magna, bibendum id erat a, rhoncus tincidunt massa. Ut congue felis sed metus imperdiet, eu tristique nulla imperdiet. Proin consequat consequat purus non fermentum. Cras nec ligula non odio tempor imperdiet eu eu turpis.`}</PhParagraph> */}
                </View>
            </ScrollView>
        </PhSafeAreaContainer>
    )
}