
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { navOptions } from '../phTemplates/PhStyles';
import PlusScreen from '../screens/plusFlow/PlusScreen';
import PlanDetailScreen from '../screens/profileFlow/PlanDetailScreen';
import AccountDetailScreen from '../screens/profileFlow/AccountDetailScreen';
import PasswordUpdateScreen from '../screens/profileFlow/PasswordUpdateScreen';

const Stack = createStackNavigator()

export default function AccountDetailStack() {
    return (
        <Stack.Navigator screenOptions={navOptions}>
            <Stack.Screen name="AccountDetailScreen" component={AccountDetailScreen} />
            <Stack.Screen name="PasswordUpdateScreen" component={PasswordUpdateScreen} />
        </Stack.Navigator>
    )

}
