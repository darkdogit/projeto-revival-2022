import { initStripe, useApplePay, useGooglePay } from '@stripe/stripe-react-native';
import React, { useImperativeHandle } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import environment from '../../environment';
import UserService from '../../services/UserService';
import i18n from '../../localization/AppLocalization';
/**  
  1 - instalar yard add @stripe/stripe-react-native
  2 - criar merchant id na apple -> https://developer.apple.com/account/resources/identifiers/merchant/add/
  3 - ir na parte de identifiers na apple e habilitar o Apple Pay Payment Processing, depois configurar ele pra habilitar o merchant id q vc criou
  4 - add isso no app json, dentro do objeto "expo": 
   "plugins": [
      [
        "@stripe/stripe-react-native",
        {
          "merchantIdentifier": string,
          "enableGooglePay": boolean
        }
      ]
    ],
    no obj ios, add "usesAppleSignIn": true,
    5 - rodar expo run:ios e habilitar apple pay no xcode e ticar o merchant id
    6 - importar libs  import { initStripe, StripeProvider, useApplePay } from '@stripe/stripe-react-native';
    7 - add certificado pro stripe https://dashboard.stripe.com/settings/payments/apple_pay
    esse component funciona pra subscription.. pra compra unica ver o do autoday
 */

const PhWalletPayment = React.forwardRef((props, ref) => {

    const { initGooglePay, presentGooglePay } = useGooglePay()
    const { presentApplePay, isApplePaySupported, confirmApplePayPayment } = useApplePay()
    const userService = new UserService()

    async function setupStripe() {
        const stripe = await initStripe({
            publishableKey: environment.stripeConf.key,
            merchantIdentifier: environment.stripeConf.applePayMerchantId,
        });
    }
    setupStripe()
    useImperativeHandle(
        ref,
        () => ({
            present(options) {
                if (Platform.OS == 'android') {
                    handleGooglePay(options)
                } else {
                    handleApplePay(options)
                }
            },
        }),
    )
    async function handleApplePay(options) {

        try {
            if (!isApplePaySupported) {
                // props.onError({ message: 'No cards in Apple Pay' })
                Alert.alert(i18n.t('error'), i18n.t('no_cards_added'),
                    [
                        {
                            text: i18n.t('cancel'),
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                        {
                            text: i18n.t('go_to_cards'),
                            onPress: () => { Linking.openURL('wallet://app') }
                        }
                    ],
                )
                return
            }
            const res = await presentApplePay({
                cartItems: [{ label: options.label || 'Devotee', amount: `${options.amount}` }],// o amount tem q ser string
                country: 'BR',
                currency: 'BRL'
            });
            if (res.error) {
                console.log('APPLE PAY RESPONSE ERROR', res.error)
                props.onError(res.error)
            } else {
                console.log('APPLE PAY RESPONSE SUCCESS', res)
                const confirmation = await confirmApplePayPayment(options.client_secret);
                if (confirmation.error) {
                    console.log('APPLE PAY CONFIRMATION ERROR', confirmation.error)
                    props.onError(confirmation.error)
                } else {
                    props.onSuccess({})
                }
            }

        } catch (e) {
            console.log('APPLE PAY ERROR', e)
            props.onError(e)
        }
    }

    async function handleGooglePay(options) {

        const initRes = await initGooglePay({
            testEnv: false,
            merchantName: 'Devotee Plus',
            countryCode: 'BR',
        })
        const presentGoogleRes = await presentGooglePay({ clientSecret: options.client_secret })
        console.log(presentGoogleRes)
        if (presentGoogleRes.error) {
            props.onError(presentGoogleRes)
        } else {
            props.onSuccess()
        }
    }

    return null
})
export default PhWalletPayment



