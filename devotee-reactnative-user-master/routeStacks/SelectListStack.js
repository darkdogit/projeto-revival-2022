
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { PhSearchListScreen } from '../phTemplates/containers';
import { navOptions } from '../phTemplates/PhStyles';
import SearchPaginationListScreen from '../screens/SearchPaginationListScreen';

const Stack = createStackNavigator()

export default function SelectListStack() {
    return (
        <Stack.Navigator screenOptions={navOptions}>
            <Stack.Screen name="SelectListScreen" component={PhSearchListScreen} />
            <Stack.Screen name="SelectListPaginationScreen" component={SearchPaginationListScreen} />
        </Stack.Navigator>
    )

}
