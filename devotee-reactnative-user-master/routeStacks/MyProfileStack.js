
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { navOptions } from '../phTemplates/PhStyles';
import ProfileDetailScreen from '../screens/ProfileDetailScreen';
import MyProfileScreen from '../screens/profileFlow/MyProfileScreen';



const Stack = createStackNavigator()

export default function MyProfileStack() {
    return (
        <Stack.Navigator screenOptions={navOptions}>
            <Stack.Screen name="MyProfileScreen" component={MyProfileScreen} />
            <Stack.Screen name="MyProfileDetailScreen" component={ProfileDetailScreen} />
        </Stack.Navigator>
    )

}
