
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { navOptions } from '../phTemplates/PhStyles';
import HomeScreen from '../screens/homeflow/HomeScreen';

const Stack = createStackNavigator()

export default function HomeStack() {
    return (
        <Stack.Navigator screenOptions={navOptions}>
            <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
    )

}
