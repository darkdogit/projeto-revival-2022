
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { navOptions } from '../phTemplates/PhStyles';
import LocationFixScreen from '../screens/welcomeFlow/LocationFixScreen';
import LoginScreen from '../screens/welcomeFlow/LoginScreen';
import PasswordRecoveryScreen from '../screens/welcomeFlow/PasswordRecoveryScreen';
import RegisterEmailScreen from '../screens/welcomeFlow/RegisterEmailScreen';
import RegisterPasswordScreen from '../screens/welcomeFlow/RegisterPasswordScreen';
import RegisterScreen from '../screens/welcomeFlow/RegisterScreen';
import WebViewScreen from '../screens/welcomeFlow/WebViewScreen';
import WelcomeScreen from '../screens/welcomeFlow/WelcomeScreen';

const Stack = createStackNavigator()

export default function WelcomeStack() {
	return (
		<Stack.Navigator screenOptions={navOptions} initialRouteName={'Welcome'} >
			<Stack.Screen name="Welcome" component={WelcomeScreen} />
			<Stack.Screen name="Login" component={LoginScreen} />
			<Stack.Screen name="PasswordRecovery" component={PasswordRecoveryScreen} /> 
			<Stack.Screen name="Register" component={RegisterScreen} />
			<Stack.Screen name="RegisterEmail" component={RegisterEmailScreen} />
			<Stack.Screen name="RegisterPassword" component={RegisterPasswordScreen} />
			<Stack.Screen name="LocationFix" component={LocationFixScreen} />
			<Stack.Screen name="WebView" component={WebViewScreen} /> 
		</Stack.Navigator>
	)

}
