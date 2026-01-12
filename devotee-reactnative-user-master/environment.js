const pkg = require('./app.json')
import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

const BANNER_ID_IOS = process.env.EXPO_PUBLIC_BANNER_ID_IOS || TestIds.BANNER
const BANNER_ID_ANDROID = process.env.EXPO_PUBLIC_BANNER_ID_ANDROID || TestIds.BANNER
const INTERSTITIAL_ID_IOS = process.env.EXPO_PUBLIC_INTERSTITIAL_ID_IOS || TestIds.INTERSTITIAL
const INTERSTITIAL_ID_ANDROID = process.env.EXPO_PUBLIC_INTERSTITIAL_ID_ANDROID || TestIds.INTERSTITIAL

export default environment = {
    baseUrl: process.env.EXPO_PUBLIC_API_URL,
    baseImgUrl: process.env.EXPO_PUBLIC_BASE_IMG_URL,
    supportEmail: 'mkt@devotee.com.br',
    pusherKey: process.env.EXPO_PUBLIC_PUSHER_KEY,
    pusherConf: {
        encrypted: true,
        disableStats: true,
        wsHost: process.env.EXPO_PUBLIC_PUSHER_HOST,
        wsPort: process.env.EXPO_PUBLIC_PUSHER_PORT,
        wssPort: process.env.EXPO_PUBLIC_PUSHER_PORT,
    },
    googleSettings: {
        loginCredentials: {
            expoClientId: process.env.EXPO_PUBLIC_GOOGLE_LOGIN_EXPO_CLIENT,
            iosClientId: process.env.EXPO_PUBLIC_GOOGLE_LOGIN_IOS_CLIENT,
            androidClientId: process.env.EXPO_PUBLIC_GOOGLE_LOGIN_ANDROID_CLIENT,
            scopes: ['profile', 'email'],
        }
    },
    logout: false,
    googleApiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
    stripeConf: {
        accountId: process.env.EXPO_PUBLIC_STRIPE_ACCOUNT_ID,
        key: process.env.EXPO_PUBLIC_STRIPE_KEY,
        applePayMerchantId: process.env.EXPO_PUBLIC_APPLE_MERCHANT_ID // se for alterar, tem no appjson tbm ,
    },
    appVersion: `${pkg.expo.version} ${process.env.EXPO_PUBLIC_APP_ENVIRONMENT_STRING}`,
    PLUS_PRODUCT_ID: Platform.select({ 'ios': 'devotee_plus_subscription', 'android': 'subscription_devotee_plus' }),
    BANNER_ID: Platform.select({ 'ios': BANNER_ID_IOS, 'android': BANNER_ID_ANDROID }),
    INTERSTITIAL_ID: Platform.select({ 'ios': INTERSTITIAL_ID_IOS, 'android': INTERSTITIAL_ID_ANDROID }),
}