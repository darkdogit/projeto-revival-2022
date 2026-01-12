
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { navOptions } from '../phTemplates/PhStyles';
import NotificationsSettingsScreen from '../screens/profileFlow/NotificationsSettingsScreen';
import ProfileScreen from '../screens/profileFlow/ProfileScreen';
import SupportScreen from '../screens/profileFlow/SupportScreen';

const Stack = createStackNavigator()

export default function ProfileStack() {
    return (
        <Stack.Navigator screenOptions={navOptions}>
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="SupportScreen" component={SupportScreen} />
            <Stack.Screen name="NotificationsSettingsScreen" component={NotificationsSettingsScreen} />
        </Stack.Navigator>
    )

}
