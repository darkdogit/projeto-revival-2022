
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useRef } from 'react';
import { Animated, DeviceEventEmitter, Platform, View } from 'react-native';
import { PhProgressBar } from '../phTemplates/components';
import { colors, measures, navOptions } from '../phTemplates/PhStyles';
import AddAddressScreen from '../screens/registerCompletionFlow/AddAddressScreen';
import RegisterBirthdateScreen from '../screens/registerCompletionFlow/RegisterBirthdateScreen';
import RegisterDisabilityScreen from '../screens/registerCompletionFlow/RegisterDisabilityScreen';
import RegisterGenderScreen from '../screens/registerCompletionFlow/RegisterGenderScreen';
import RegisterInterestScreen from '../screens/registerCompletionFlow/RegisterInterestScreen';
import RegisterNameScreen from '../screens/registerCompletionFlow/RegisterNameScreen';
import RegisterOnboardingScreen from '../screens/registerCompletionFlow/RegisterOnboardingScreen';
import RegisterOrientationScreen from '../screens/registerCompletionFlow/RegisterOrientationScreen';
import RegisterPicturesScreen from '../screens/registerCompletionFlow/RegisterPicturesScreen';
import RegisterTypeScreen from '../screens/registerCompletionFlow/RegisterTypeScreen';
import RegisterWelcomeScreen from '../screens/registerCompletionFlow/RegisterWelcomeScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RegisterNationalityScreen from '../screens/registerCompletionFlow/RegisterNationalityScreen';



const Stack = createStackNavigator()
export default function RegisterCompletionStack() {
	const insets = useSafeAreaInsets();
	console.log(`INSET ${Platform.OS}`, measures.statusBarHeight)
	useEffect(() => {
		let barListener = DeviceEventEmitter.addListener('REGISTER_PROGRESS_BAR_UPDATE', (value) => {
			progressBarRef.current.setBarProgress(value)
		})

		return () => {
			barListener.remove()
		}
	}, [])
	const progressBarRef = useRef()
	return (
		<View style={ { flex: 1, backgroundColor: 'white' } }>
			<PhProgressBar style={ { zIndex: 3, top: ((insets.top || 0) + (measures.statusBarHeight <= 20 ? 60 : measures.statusBarHeight) + 5), position: 'relative' } } ref={ progressBarRef } max={ 11 } />
			<Stack.Navigator screenOptions={ navOptions } initialRouteName={ 'RegisterCompleteType' } >
				<Stack.Screen name="RegisterCompleteType" component={ RegisterTypeScreen } />
				<Stack.Screen name="RegisterCompleteName" component={ RegisterNameScreen } />
				<Stack.Screen name="RegisterCompleteBirthdate" component={ RegisterBirthdateScreen } />
				<Stack.Screen name="RegisterCompleteGender" component={ RegisterGenderScreen } />
				<Stack.Screen name="RegisterCompleteNationality" component={ RegisterNationalityScreen } />
				<Stack.Screen name="RegisterCompleteOrientation" component={ RegisterOrientationScreen } />
				<Stack.Screen name="RegisterCompleteInterest" component={ RegisterInterestScreen } />
				<Stack.Screen name="RegisterCompleteDisability" component={ RegisterDisabilityScreen } />
				<Stack.Screen name="RegisterCompletePictures" component={ RegisterPicturesScreen } />
				<Stack.Screen name="AddAddress" component={ AddAddressScreen } />
			</Stack.Navigator>
		</View>
	)

}
