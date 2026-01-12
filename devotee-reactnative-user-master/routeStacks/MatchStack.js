
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { navOptions } from '../phTemplates/PhStyles';
import MatchScreen from '../screens/MatchScreen';

const Stack = createStackNavigator()

export default function MatchStack() {
    return (
        <Stack.Navigator screenOptions={navOptions}>
            <Stack.Screen name="MatchScreen" component={MatchScreen} />
        </Stack.Navigator>
    )

}
