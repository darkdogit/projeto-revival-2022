import { EmitterSubscription, Platform } from 'react-native';
import { finishTransaction, getProducts, getSubscriptions, initConnection, purchaseErrorListener, purchaseUpdatedListener, RequestSubscription, requestSubscription, Subscription, SubscriptionAndroid, SubscriptionOffer, SubscriptionPurchase } from 'react-native-iap';
import environment from '../environment';
import { NetworkService } from './NetworkService';
import UserService from './UserService';

class SubscriptionService extends NetworkService {
    static instance: SubscriptionService

    private purchaseUpdateSubscription: EmitterSubscription | null
    private purchaseErrorSubscription: EmitterSubscription | null
    private isConnected: boolean = false

    constructor() {
        super()
        if (!SubscriptionService.instance) {
            SubscriptionService.instance = this
        }
        if (!SubscriptionService.instance.isConnected) {
            this.configureIAP()
        }
        return SubscriptionService.instance
    }

    private configureIAP = async () => {
        if (this.isConnected) return
        initConnection().then(async () => {
            this.isConnected = true
            console.log('IN APP CONNECTED', this.isConnected)
            this.purchaseUpdateSubscription = purchaseUpdatedListener(
                async (purchase) => {
                    try {
                        console.log('purchaseUpdatedListener', JSON.stringify(purchase, null, 2));
                        const receipt = purchase.transactionReceipt;
                        if (receipt) {
                            await finishTransaction({ purchase, isConsumable: false })
                        }
                    } catch (e) {
                        console.log('purchaseUpdatedListener', e)
                    }
                },
            );
            this.purchaseErrorSubscription = purchaseErrorListener(
                (error) => {
                    console.log('retornou erro')
                    console.error('purchaseErrorListener', error);
                },
            );
        });
    }

    closeIAPConnection = () => {
        if (this.purchaseUpdateSubscription) {
            this.purchaseUpdateSubscription.remove();
            this.purchaseUpdateSubscription = null;
        }
        if (this.purchaseErrorSubscription) {
            this.purchaseErrorSubscription.remove();
            this.purchaseErrorSubscription = null;
        }
        this.isConnected = false
    }

    subscribeIAP = async () => {
        try {
            const productId = environment.PLUS_PRODUCT_ID as string
            const subs = await getSubscriptions({ skus: [productId] })

            let params: RequestSubscription
            if (Platform.OS === 'ios') {
                params = { sku: productId }
            } else {
                params = {
                    subscriptionOffers: [
                        { sku: productId, offerToken: subs[0].subscriptionOfferDetails[0].offerToken }
                    ]
                }
            }

            const purchase = await requestSubscription(params) as SubscriptionPurchase
            await finishTransaction({ purchase, isConsumable: false })
            await new UserService().savePlan(purchase)
        } catch (error) {
            console.error('SubscriptionService.', error)
            throw (error)
        }
    };


}
const subscriptionService = new SubscriptionService()
export default subscriptionService



// import * as InAppPurchases from 'expo-in-app-purchases';
// import { NetworkService } from './NetworkService';

// export default class InAppPurchaseService {

// 	constructor() {
// 		this.network = new NetworkService()
// 		InAppPurchases.connectAsync().catch(e => console.log('erro appstore', e))
// 	}
// 	purchaseItem() {

// 	}

// 	async setupPurchase(success, error) {
// 		InAppPurchases.setPurchaseListener((r) => {
// 			InAppPurchases.disconnectAsync()
// 			this.onPurchase(r, success, error)
// 		})
// 	}


// 	onPurchase({ responseCode, results, errorCode }, success, error) {
// 		if (responseCode === InAppPurchases.IAPResponseCode.OK) {
// 			results.forEach(purchase => {
// 				if (!purchase.acknowledged) {
// 					console.log(`Successfully purchased ${JSON.stringify({ ...purchase, transactionReceipt: '' })}`);
// 					InAppPurchases.finishTransactionAsync(purchase, true).finally(() => {
// 						success(purchase)
// 					})
// 				} else {
// 					error({ code: null })
// 				}
// 			});
// 		} else if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
// 			error({ code: 'canceled' })
// 			console.log('User canceled the transaction');
// 		} else if (responseCode === InAppPurchases.IAPResponseCode.DEFERRED) {
// 			error({ code: responseCode })
// 			console.log('User does not have permissions to buy but requested parental approval (iOS only)');
// 		} else {
// 			error({ code: errorCode })
// 			console.warn(`Something went wrong with the purchase. Received errorCode ${errorCode}`);
// 		}

// 	}

// }	