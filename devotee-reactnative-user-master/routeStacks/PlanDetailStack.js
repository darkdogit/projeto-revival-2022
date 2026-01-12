
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { navOptions } from '../phTemplates/PhStyles';
import PlusScreen from '../screens/plusFlow/PlusScreen';
import PlanDetailScreen from '../screens/profileFlow/PlanDetailScreen';

const Stack = createStackNavigator()

export default function PlanDetailStack() {
    return (
        <Stack.Navigator screenOptions={navOptions}>
            <Stack.Screen name="PlanDetailScreen" component={PlanDetailScreen} />
        </Stack.Navigator>
    )

}
