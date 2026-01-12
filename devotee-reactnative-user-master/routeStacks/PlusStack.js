
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { navOptions } from '../phTemplates/PhStyles';
import PlusScreen from '../screens/plusFlow/PlusScreen';
import WebViewScreen from '../screens/welcomeFlow/WebViewScreen';

const Stack = createStackNavigator()

export default function PlusStack() {
    return (
        <Stack.Navigator screenOptions={navOptions}>
            <Stack.Screen name="Likes" component={PlusScreen} />
            <Stack.Screen name="WebViewPlus" component={WebViewScreen} />

        </Stack.Navigator>
    )

}
