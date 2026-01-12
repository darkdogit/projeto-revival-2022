
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { navOptions } from '../phTemplates/PhStyles';
import HomeScreen from '../screens/homeflow/HomeScreen';
import LocationPermissionScreen from '../screens/registerCompletionFlow/LocationPermissionScreen';
import NotificationPermissionScreen from '../screens/registerCompletionFlow/NotificationPermissionScreen';
import RegisterSuccessScreen from '../screens/registerCompletionFlow/RegisterSuccessScreen';

const Stack = createStackNavigator()

export default function PermissionsStack() {
    return (
        <Stack.Navigator screenOptions={navOptions}>
            <Stack.Screen name="NotificationPermission" component={NotificationPermissionScreen} />
            <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} />
            <Stack.Screen name="RegisterSuccess" component={RegisterSuccessScreen} />
        </Stack.Navigator>
    )

}
