
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { navOptions } from '../phTemplates/PhStyles';
import SupportScreen from '../screens/profileFlow/SupportScreen';

const Stack = createStackNavigator()

export default function SupportStack() {
    return (
        <Stack.Navigator screenOptions={navOptions}>
            <Stack.Screen name="Support" component={SupportScreen} />
        </Stack.Navigator>
    )

}
