import Constants from 'expo-constants';
import React, { useEffect, useMemo } from 'react';
import { Animated, Keyboard, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { colors, measures } from '../PhStyles';
import PhLoadingContainer from './PhLoadingContainer';
import PhSafeAreaContainer from './PhSafeAreaContainer';

/**
 * * PhSectionList
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


const PhSectionList = (props) => {
    const HEADER_HEIGHT = props.headerHeight || 45
    const scrollY = new Animated.Value(0)
    const hasAnimation = props.hasAnimation === undefined || props.hasAnimation == true
    const keyboardVerticalOffset = props.keyboardVerticalOffset || 40

    useEffect(() => {
        props.navigation.setOptions(
            {
                title: props.screenTitle,
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
                ...props.setHeaderOptions
            })
    })

    const styles = {
        backgroundColor: colors.white
    }

    return useMemo(() => (
        <PhSafeAreaContainer {...props.safeAreaProps}>
            <KeyboardAvoidingView
                behavior={Platform.OS == 'ios' ? 'padding' : null}
                keyboardVerticalOffset={Platform.OS == 'ios' ? Constants.statusBarHeight + keyboardVerticalOffset : null}
                style={{ flex: 1 }}>
                {
                    props.loading ? <PhLoadingContainer /> :
                        <Animated.SectionList
                            refreshControl={props.onRefreshList ?
                                <RefreshControl
                                    tintColor={props.loadingColor || colors.primary}
                                    refreshing={props.refreshing || false}
                                    onRefresh={() => props.onRefreshList()}
                                /> : null
                            }
                            {...props.sectionListProps}
                            contentContainerStyle={{ flexGrow: 1, paddingBottom: measures.bottomSpace, ...props.contentContainerStyle }}
                            style={{ ...props.style }}
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
                                        listener: () => { Keyboard.dismiss() }
                                    },
                                )
                            }
                        />
                }
                {props.children}
            </KeyboardAvoidingView>
        </PhSafeAreaContainer>
    ))

}
export default PhSectionList
