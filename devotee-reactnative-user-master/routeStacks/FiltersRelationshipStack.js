
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { navOptions } from '../phTemplates/PhStyles';
import FiltersScreen from '../screens/profileFlow/FiltersScreen';
import LocationFilterScreen from '../screens/profileFlow/LocationFilterScreen';
import RelationshipFiltersScreen from '../screens/profileFlow/RelationshipFiltersScreen';
import RelationshipSubfiltersScreen from '../screens/profileFlow/RelationshipSubfiltersScreen';

const Stack = createStackNavigator()

export default function FiltersRelationshipStack() {
    return (
        <Stack.Navigator screenOptions={navOptions}>
            <Stack.Screen name="RelationshipFilters" component={RelationshipFiltersScreen} />
            <Stack.Screen name="RelationshipSubfilters" component={RelationshipSubfiltersScreen} />
        </Stack.Navigator>
    )

}
