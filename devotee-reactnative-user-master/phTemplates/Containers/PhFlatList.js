import { FontAwesome5 } from '@expo/vector-icons';
import { useScrollToTop } from '@react-navigation/native';
import Constants from 'expo-constants';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, KeyboardAvoidingView, Platform, RefreshControl, StatusBar, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { colors, measures, navOptions } from '../PhStyles';
import PhLoadingContainer from './PhLoadingContainer';
import PhSafeAreaContainer from './PhSafeAreaContainer';
/**
 * * PhFlatList
 * @param {*} props 
 * @returns 
 * @safeAreaProps -> mesmas props da PhSafeArea
 * @flatListProps -> mesmas props da flatlist
 * @screenTitle -> mesmas props do ScrollView
 * @setHeaderOptions -> mais coisa pro setOptions da tela
 * @onRefreshList -> funcao que executa quando da o pull to refresh
 * @loadingColor -> cor do loading no pull to refresh
 * @refreshing -> se é pra mostrar o indicator
 * @headerHeight -> altura do header
 */


const PhFlatList = (props) => {
    const HEADER_HEIGHT = props.headerHeight || 0
    // const scrollY = new Animated.Value(0)
    const scrollY = useRef(new Animated.Value(0)).current
    const hasAnimation = props.hasAnimation === undefined || props.hasAnimation == true
    const keyboardVerticalOffset = props.keyboardVerticalOffset || 50
    const navigationOptions = navOptions
    const banner = props.banner
    const info = useSelector(state => state.infoReducer)
    const [darkStatusBar, setDarkStatusBar] = useState('light-content')
    const statusBarRef = useRef()
    useLayoutEffect(() => {
        let isMounted = true;

        if (isMounted && props.navigation) {
            props.navigation.setOptions(
                {
                    title: props.screenTitle || null,
                    headerTitleStyle: hasAnimation && {
                        opacity: scrollY.interpolate({
                            inputRange: [1, 40, 80],
                            outputRange: [0, 0, 1],
                            // useNativeDriver: true
                        }),
                        transform: [
                            {
                                translateY: scrollY.interpolate({
                                    inputRange: [1, 40, 80],
                                    outputRange: [25, 15, 0],
                                    extrapolate: 'clamp',
                                    // useNativeDriver: true
                                })
                            }
                        ]
                    },
                    headerTitle: (e) => <Animated.Text style={{ ...navigationOptions.headerTitleStyle, ...e.style }}>{e.children}</Animated.Text>,
                    ...props.setHeaderOptions
                })
        }
        return () => { isMounted = false };

    }, [])

    let flatListRef = useRef()
    useScrollToTop(flatListRef)

    const styles = {
        headerContainer: {
            position: 'absolute',
            right: 0,
            zIndex: 10,
            backgroundColor: colors.WHITE,
            // backgroundColor: colors.red,
            left: 0,
            top: 0,
            height: HEADER_HEIGHT,
            // paddingBottom: measures.ySpace,
            // paddingHorizontal: measures.xSpace,
            transform: [{
                translateY: scrollY.interpolate({
                    inputRange: [0, HEADER_HEIGHT],
                    outputRange: [0, -HEADER_HEIGHT],
                    extrapolate: 'clamp'
                })
            }]
        },
        backButton: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: measures.statusBarHeight + 20,
            justifyContent: 'space-between',
            paddingHorizontal: measures.xSpace,
            position: 'absolute',
            width: measures.screenWidth,
            zIndex: 99
        },
        textWhite: props.statusBarAnimation && {
            opacity: scrollY.interpolate({
                inputRange: [0, props.statusBarAnimation],
                outputRange: [1, 0]
            }),
        },
        textGray: props.statusBarAnimation && {
            opacity: scrollY.interpolate({
                inputRange: [0, props.statusBarAnimation],
                outputRange: [0, 1]
            }),
        }
    }
    return useMemo(() => (
        <PhSafeAreaContainer {...props.safeAreaProps} notSafeArea={props.notSafeArea}>
            {
                banner &&
                <StatusBar animated ref={statusBarRef} translucent backgroundColor={'transparent'} barStyle={darkStatusBar} />
            }
            {
                props.statusBarAnimation &&
                <Animated.View style={{
                    backgroundColor: colors.WHITE,
                    position: 'absolute',
                    top: 0,
                    width: measures.screenWidth,
                    height: measures.statusBarHeight,
                    opacity: scrollY.interpolate({
                        inputRange: [0, props.statusBarAnimation],
                        outputRange: [0, 1]
                    }),
                    zIndex: 1,
                    ...props.customHeaderStyle
                }}></Animated.View>
            }
            <KeyboardAvoidingView
                behavior={Platform.OS == 'ios' ? 'padding' : null}
                keyboardVerticalOffset={Platform.OS == 'ios' ? Constants.statusBarHeight + keyboardVerticalOffset : null}
                style={{ flex: 1 }}>
                {
                    props.header &&
                    <Animated.View style={{ ...styles.headerContainer, ...props.headerContainerStyle }}>
                        {props.header}
                    </Animated.View>
                }
                {
                    props.loading ? <PhLoadingContainer containerStyle={{ marginTop: HEADER_HEIGHT }} /> :
                        <Animated.FlatList
                            ref={flatListRef}
                            contentInset={{ top: HEADER_HEIGHT }}
                            contentOffset={{ x: 0, y: Platform.select({ android: 0, ios: -HEADER_HEIGHT }) }}
                            style={{ paddingTop: Platform.select({ android: HEADER_HEIGHT, ios: 0 }), ...props.style }}
                            scrollEventThrottle={16}
                            refreshControl={props.onRefreshList ?
                                <RefreshControl
                                    tintColor={colors.primary}
                                    refreshing={props.refreshing || false}
                                    onRefresh={() => props.onRefreshList()}
                                    progressViewOffset={HEADER_HEIGHT}

                                /> : null
                            }
                            listFooterComponent={
                                props.loadingMore ? <ActivityIndicator style={{ marginBottom: 20 }} size={'large'} /> : null
                            }
                            onEndReached={() => props.hasMore ? props.handleLoadMore() : null}
                            onEndReachedThreshold={0.5}
                            {...props.flatListProps}
                            contentContainerStyle={{
                                flexGrow: 1,
                                paddingBottom: Platform.select({ android: props.length > 0 ? HEADER_HEIGHT : 0, ios: 0 }),
                                ...props.contentContainerStyle
                            }}
                            showsVerticalScrollIndicator={false}
                            onScroll={
                                Animated.event([
                                    {
                                        nativeEvent: {
                                            contentOffset: {
                                                y: scrollY
                                            }
                                        }
                                    }
                                ],
                                    {
                                        useNativeDriver: true,
                                        listener: e => {
                                            if (!info?.darkMode) {
                                                let y = e.nativeEvent.contentOffset.y
                                                setDarkStatusBar((y > props.statusBarAnimation / 2 || e.nativeEvent.contentOffset.y < 0) ? 'dark-content' : 'light-content')
                                            }
                                        }
                                    },
                                )
                            }
                        />
                }
                {props.children}
            </KeyboardAvoidingView>
            {
                banner &&
                <>
                    <Animated.View style={{ ...styles.backButton, ...styles.textGray }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => props.navigation.goBack()}>
                            <FontAwesome5 name="chevron-circle-left" size={25} color={colors.gray25} />
                        </TouchableOpacity>
                        {
                            banner.label &&
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => banner.onPress()}>
                                <PhRow>
                                    <PhSubtitle style={{ color: colors.gray25, marginRight: 5 }}>{banner.label}</PhSubtitle>
                                    <FontAwesome5 name={banner.icon} size={16} color={colors.gray25} />
                                </PhRow>
                            </TouchableOpacity>
                        }
                    </Animated.View>

                    <Animated.View style={{ ...styles.backButton, ...styles.textWhite }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => props.navigation.goBack()}>
                            <FontAwesome5 name="chevron-circle-left" size={25} color={colors.white} />
                        </TouchableOpacity>
                        {
                            banner.label &&
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => banner.onPress()}>
                                <PhRow>
                                    <PhSubtitle style={{ color: colors.WHITE, marginRight: 5 }}>{banner.label}</PhSubtitle>
                                    <FontAwesome5 name={banner.icon} size={16} color={colors.WHITE} />
                                </PhRow>
                            </TouchableOpacity>
                        }
                    </Animated.View>
                </>
            }
        </PhSafeAreaContainer>
    ))

}

export default PhFlatList
