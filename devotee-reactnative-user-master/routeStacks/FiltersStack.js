
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { navOptions } from '../phTemplates/PhStyles';
import FiltersScreen from '../screens/profileFlow/FiltersScreen';
import LocationFilterScreen from '../screens/profileFlow/LocationFilterScreen';

const Stack = createStackNavigator()

export default function FiltersStack() {
    return (
        <Stack.Navigator screenOptions={navOptions}>
            <Stack.Screen name="Filters" component={FiltersScreen} />
            <Stack.Screen name="LocationFilter" component={LocationFilterScreen} />
        </Stack.Navigator>
    )

}
