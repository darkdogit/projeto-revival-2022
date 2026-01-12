import {
    Nunito_200ExtraLight,
    Nunito_200ExtraLight_Italic,
    Nunito_300Light,
    Nunito_300Light_Italic,
    Nunito_400Regular,
    Nunito_400Regular_Italic,
    Nunito_600SemiBold,
    Nunito_600SemiBold_Italic,
    Nunito_700Bold,
    Nunito_700Bold_Italic,
    Nunito_800ExtraBold,
    Nunito_800ExtraBold_Italic,
    Nunito_900Black,
    Nunito_900Black_Italic, useFonts
} from '@expo-google-fonts/nunito';
import AppLoading from 'expo-app-loading';
import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useMemo, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';

const PhSplashScreen = ({ children, image }) => {
    const [isSplashReady, setSplashReady] = useState(false);
    const startAsync = useMemo(
        // If you use a local image with require(...), use `Asset.fromModule`
        () => () => Asset.fromModule(image).downloadAsync(),
        [image]
    );
    const [fontsLoaded] = useFonts({
        Nunito_200ExtraLight,
        Nunito_200ExtraLight_Italic,
        Nunito_300Light,
        Nunito_300Light_Italic,
        Nunito_400Regular,
        Nunito_400Regular_Italic,
        Nunito_600SemiBold,
        Nunito_600SemiBold_Italic,
        Nunito_700Bold,
        Nunito_700Bold_Italic,
        Nunito_800ExtraBold,
        Nunito_800ExtraBold_Italic,
        Nunito_900Black,
        Nunito_900Black_Italic
    });
    const onFinish = useMemo(() => setSplashReady(true), []);

    function AnimatedSplashScreen({ children, image }) {
        const animation = useMemo(() => new Animated.Value(1), []);
        const [isAppReady, setAppReady] = useState(false);
        const [isSplashAnimationComplete, setAnimationComplete] = useState(
            false
        );

        if (!fontsLoaded) return null

        useEffect(() => {
            if (isAppReady) {
                Animated.timing(animation, {
                    toValue: 0,
                    duration: 700,
                    delay: 1000,
                    useNativeDriver: true,
                }).start(() => setAnimationComplete(true));
            }
        }, [isAppReady]);

        const onImageLoaded = useMemo(() => async () => {

            try {
                await SplashScreen.hideAsync();
                // Load stuff
                await Promise.all([]);
            } catch (e) {
                // handle errors
            } finally {
                // setTimeout(() => {
                setAppReady(true);
                // }, 1000);
            }
        });

        return (
            <View style={{ flex: 1 }}>
                {isAppReady && children}
                {(!isSplashAnimationComplete || !fontsLoaded) && (
                    <Animated.View
                        pointerEvents="none"
                        style={[
                            StyleSheet.absoluteFill,
                            {
                                backgroundColor: Constants.expoConfig.splash.backgroundColor,
                                opacity: animation,
                            },
                        ]}
                    >
                        <Animated.Image
                            style={{
                                width: "100%",
                                height: "100%",
                                resizeMode: Constants.expoConfig.splash.resizeMode || "contain",
                            }}
                            source={require('../../assets/splash.png')}
                            onLoadEnd={onImageLoaded}
                            fadeDuration={0}
                        />
                    </Animated.View>
                )}
            </View>
        );
    }

    if (!isSplashReady) {
        return (
            <AppLoading
                // Instruct SplashScreen not to hide yet, we want to do this manually
                autoHideSplash={false}
                startAsync={startAsync}
                onError={console.error}
                onFinish={onFinish}
            />
        );
    }
    return <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>;
}

export default PhSplashScreen
