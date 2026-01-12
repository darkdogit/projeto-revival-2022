
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { navOptions } from '../phTemplates/PhStyles';
import LikesFiltersScreen from '../screens/likesFlow/LikesFiltersScreen';
import LikesScreen from '../screens/likesFlow/LikesScreen';

const Stack = createStackNavigator()

export default function LikesStack() {
    return (
        <Stack.Navigator screenOptions={navOptions}>
            <Stack.Screen name="Likes" component={LikesScreen} />
            <Stack.Screen name="LikesFilters" component={LikesFiltersScreen} />
        </Stack.Navigator>
    )

}
