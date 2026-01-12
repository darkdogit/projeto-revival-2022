import 'react-native-get-random-values';
// import { v4 as uuidv4 } from 'uuid';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'expo-dev-client';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import { Modal, View } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import environment from './environment';
import { PhBottomAlert, PhToast } from './phTemplates/components';
import { PhSplashScreen } from './phTemplates/containers';
import AccountDetailStack from './routeStacks/AccountDetailStack';
import ChatStack from './routeStacks/ChatStack';
import FiltersRelationshipStack from './routeStacks/FiltersRelationshipStack';
import FiltersStack from './routeStacks/FiltersStack';
import MatchStack from './routeStacks/MatchStack';
import MyProfileStack from './routeStacks/MyProfileStack';
import PermissionsStack from './routeStacks/PermissionsStack';
import PlanDetailStack from './routeStacks/PlanDetailStack';
import PlusStack from './routeStacks/PlusStack';
import ProfileDetailStack from './routeStacks/ProfileDetailStack';
import RegisterCompletionStack from './routeStacks/RegisterCompletionStack';
import * as RootNavigation from './routeStacks/RootNavigation';
import { navigationRef } from './routeStacks/RootNavigation';
import SelectListStack from './routeStacks/SelectListStack';
import TabsStack from './routeStacks/TabsStack';
import WelcomeStack from './routeStacks/WelcomeStack';
import RegisterSuccessScreen from './screens/registerCompletionFlow/RegisterSuccessScreen';
import RegisterWelcomeScreen from './screens/registerCompletionFlow/RegisterWelcomeScreen';
import ChatService from './services/ChatService';
import PushNotificationService from './services/PushNotificationService';
import { SessionService } from './services/SessionService';
import SocketService from './services/SocketService';
import UserService from './services/UserService';
import { persistor, store } from './stores/store';
import subscriptionService from './services/SubscriptionService';
const Stack = createStackNavigator()
const pkg = require('./app.json')
var deepLinkEventListener



// setJSExceptionHandler((error, isFatal) => {
//   Alert.alert(error.toString())
// }, true);


// setNativeExceptionHandler(error => {
//   Alert.alert(error)
// })



function MainContainer(props) {
  const pushService = new PushNotificationService()
  const [modalVisible, setModalVisible] = useState(false)
  const socketService = new SocketService()
  const chatService = new ChatService()
  const sessionService = new SessionService()
  const session = useSelector(state => state.sessionReducer)
  const dispatch = useDispatch()
  const userService = new UserService()
  var channel
  if (session) {
    if (session.version != pkg.expo.version) {
      if (environment.logout) {
        console.log('FAZENDO LOGOUT')
        userService.logout()
      } else {
        userService.updateSession({ version: pkg.expo.version })
      }
    }
    setupSocket()
  }


  // useEffect(() => {
  //   deepLinkEventListener = Linking.addEventListener('url', ({ url }) => {
  //     completeLoginFromDeeplink(url)
  //   })

  //   return () => {
  //     deepLinkEventListener.remove()
  //   }
  // }, [])


  // completeLoginFromDeeplink = async (url) => {
  //   try {
  //     const socialLoginData = await userService.completeSocialLogin(url)
  //     sessionService.saveSession(socialLoginData)
  //   } catch (e) {
  //     console.log(e)
  //   } finally {
  //   }
  // }
  useEffect(() => {
    // const redirectUrl = Linking.createURL('google-login');
    pushService.setupNotificationReceivers((notification) => {
      let currentRouteName = RootNavigation.navRef().getCurrentRoute()
      if (currentRouteName.name != 'Messages') {
        chatService.updateBadgeCount(1)
      }
    }, (notification) => {
      handleNotificationTapped(notification)
    })
    return () => {
      subscriptionService.closeIAPConnection()
      Notifications.removeNotificationSubscription(pushService.notificationListener);
      Notifications.removeNotificationSubscription(pushService.responseListener);
    };

  }, []);

  function setupSocket() {
    // console.log('Setando os sockets')
    socketService.subscribe(`matches.${session?.id}`).bind('new-match', (e) => {
      // console.log('payload do match', e)
      RootNavigation.navigate('MatchStack', { screen: 'MatchScreen', params: { item: e.payload.match_user, matchId: e.payload.match_id } })
    })
    socketService.subscribe(`user.${session?.id}`).bind('plan-update', (e) => {
      userService.syncUserWithApi()
    })
  }


  function handleNotificationTapped(notification) {
    const type = notification.data.type
    // console.log(notification)
    // console.log(type)
    if (session) {
      switch (type) {
        case 'notification_message':
          RootNavigation.navigate('MessagesTab')
          break;
        case 'notification_match':
          RootNavigation.navigate('MessagesTab')
          break;
        case 'notification_like':
          RootNavigation.navigate('LikesTab')
          break;
      }
    }
  }

  return (
    <View style={ { flex: 1 } }>
      <NavigationContainer ref={ navigationRef } >
        <Stack.Navigator screenOptions={ { presentation: 'modal', headerShown: false } } >
          { !session && <Stack.Screen name="Welcome" component={ WelcomeStack }></Stack.Screen> }
          {
            session && !session.account_type && <>
              <Stack.Screen name="RegisterWelcomeScreen" component={ RegisterWelcomeScreen }></Stack.Screen>
              <Stack.Screen name="RegisterCompletion" component={ RegisterCompletionStack }></Stack.Screen>
              <Stack.Screen name="PermissionsStack" component={ PermissionsStack }></Stack.Screen>
            </>
          }
          { session && session.account_type && <Stack.Screen name="Home" component={ TabsStack }></Stack.Screen> }
          <Stack.Screen name="Plus" component={ PlusStack }></Stack.Screen>
          <Stack.Screen name="PlanDetail" component={ PlanDetailStack }></Stack.Screen>
          <Stack.Screen name="Chat" component={ ChatStack }></Stack.Screen>
          <Stack.Screen name="Filters" component={ FiltersStack }></Stack.Screen>
          <Stack.Screen name="AccountDetail" component={ AccountDetailStack }></Stack.Screen>
          <Stack.Screen name="ProfileDetailStack" component={ ProfileDetailStack }></Stack.Screen>
          <Stack.Screen name="MatchStack" component={ MatchStack }></Stack.Screen>
          <Stack.Screen name="MyProfileStack" component={ MyProfileStack }></Stack.Screen>
          <Stack.Screen name="FiltersRelationshipStack" component={ FiltersRelationshipStack }></Stack.Screen>
          <Stack.Screen name="SelectListStack" component={ SelectListStack }></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
      <PhBottomAlert />
      <PhToast />
      <Modal visible={ modalVisible } animationType={ 'slide' } >
        <RegisterSuccessScreen onClose={ () => setModalVisible(false) } />
      </Modal>
    </View>
  )

}

export default function App() {
  // const l = new AppLocalization()
  // l.start()

  return (
    <PhSplashScreen>
      <Provider store={ store } >
        <PersistGate loading={ null } persistor={ persistor } >
          <MainContainer />
        </PersistGate>
      </Provider>
    </PhSplashScreen>
  )

}

