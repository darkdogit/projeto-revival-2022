
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { navOptions } from '../phTemplates/PhStyles';
import ProfileDetailScreen from '../screens/ProfileDetailScreen';


const Stack = createStackNavigator()

export default function ProfileDetailStack() {
    return (
        <Stack.Navigator screenOptions={navOptions}>
            <Stack.Screen name="ProfileDetailScreen" component={ProfileDetailScreen} />
        </Stack.Navigator>
    )

}
