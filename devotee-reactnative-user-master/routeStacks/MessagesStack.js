
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { navOptions } from '../phTemplates/PhStyles';
import MessagesScreen from '../screens/messagesFlow/MessagesScreen';

const Stack = createStackNavigator()

export default function MessagesStack() {
    return (
        <Stack.Navigator screenOptions={navOptions}>
            <Stack.Screen name="Messages" component={MessagesScreen} />
        </Stack.Navigator>
    )

}
