
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { navOptions } from '../phTemplates/PhStyles';
import ChatScreen from '../screens/chatFlow/ChatScreen';

const Stack = createStackNavigator()

export default function ChatStack() {
    return (
        <Stack.Navigator screenOptions={navOptions}>
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
        </Stack.Navigator>
    )

}
