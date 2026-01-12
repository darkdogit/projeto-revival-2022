
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Constants from 'expo-constants';
import React from 'react';
import { Image } from 'react-native';
import { useSelector } from 'react-redux';
import { colors, measures } from '../phTemplates/PhStyles';
import { NotificationBadge } from '../projectsComponents';
import HomeStack from './HomeStack';
import LikesStack from './LikesStack';
import MessagesStack from './MessagesStack';
import ProfileStack from './ProfileStack';
import i18n from '../localization/AppLocalization';

export default function TabsStack() {


    const session = useSelector(state => state.sessionReducer)
    const showLikesTab = session?.account_type != 'curious'
    const chatReducer = useSelector(state => state.chatReducer)
    const Tab = createBottomTabNavigator();

    const tabOptions = {
        HomeTab: {
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size, focused }) => {
                return focused ?
                    <Image style={{ resizeMode: 'contain' }} source={require('../assets/tabBarIcons/home_tab_icon_active.png')} ></Image> :
                    <Image style={{ resizeMode: 'contain' }} source={require('../assets/tabBarIcons/home_tab_icon_inactive.png')} ></Image>
            }
        },
        LikesTab: {
            tabBarLabel: i18n.t('likes'),
            tabBarIcon: ({ color, size, focused }) => {
                return <>
                    {focused ?
                        <Image style={{ resizeMode: 'contain' }} source={require('../assets/tabBarIcons/likes_tab_icon_active.png')} ></Image> :
                        <Image style={{ resizeMode: 'contain' }} source={require('../assets/tabBarIcons/likes_tab_icon_inactive.png')} ></Image>
                    }
                </>
            }
        },
        Messages: {
            tabBarLabel: i18n.t('messages'),
            tabBarIcon: ({ color, size, focused }) => {
                // console.log('chatReducer', chatReducer)
                return <>
                    {chatReducer?.badge > 0 ? <NotificationBadge style={{ borderWidth: 2.0, height: 15, position: 'absolute', right: -2, top: 2, zIndex: 2 }} /> : null}
                    {
                        focused ?
                            <Image style={{ resizeMode: 'contain' }} source={require('../assets/tabBarIcons/messages_tab_icon_active.png')} ></Image> :
                            <Image style={{ resizeMode: 'contain' }} source={require('../assets/tabBarIcons/messages_tab_icon_inactive.png')} ></Image>
                    }
                </>
            }
        },
        ProfileTab: {
            tabBarLabel: i18n.t('profile'),
            tabBarIcon: ({ color, size, focused }) => {
                return focused ?
                    <Image style={{ resizeMode: 'contain' }} source={require('../assets/tabBarIcons/profile_tab_icon_active.png')} ></Image> :
                    <Image style={{ resizeMode: 'contain' }} source={require('../assets/tabBarIcons/profile_tab_icon_inactive.png')} ></Image>
            }
        }

    }

    return (

        <Tab.Navigator
            tabBar={props =>
                <>
                    {/* <PendingAppointment /> */}
                    <BottomTabBar {...props} />
                </>
            }
            screenOptions={{
                headerShown: false,
                tabBarKeyboardHidesTabBar: true,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.blueGray,
                tabBarLabelStyle: { fontWeight: 'bold', fontSize: 12, marginBottom: Constants.statusBarHeight == 0 ? 10 : 5 },
                tabBarStyle: { height: measures.tabBarHeight, paddingTop: 10, borderTopWidth: 2, borderTopColor: colors.lineGray, paddingHorizontal: measures.xSpace }
            }}
            // tabBarOptions={{
            //     keyboardHidesTabBar: true,
            //     activeTintColor: colors.primary,
            //     inactiveTintColor: colors.blueGray,
            //     labelStyle: { fontWeight: 'bold', fontSize: 12, marginBottom: Constants.statusBarHeight == 0 ? 10 : 5 },
            //     style: { height: measures.tabBarHeight, paddingTop: 10, borderTopWidth: 2, borderTopColor: colors.lineGray, paddingHorizontal: measures.xSpace }
            // }}
        >
            <Tab.Screen name="HomeTab" options={tabOptions.HomeTab} component={HomeStack} />
            {
                showLikesTab ? <Tab.Screen name="LikesTab" options={tabOptions.LikesTab} component={LikesStack} /> : null
            }
            <Tab.Screen name="MessagesTab" options={tabOptions.Messages} component={MessagesStack} />
            <Tab.Screen name="ProfileTab" options={tabOptions.ProfileTab} component={ProfileStack} />
        </Tab.Navigator>
    )

}
