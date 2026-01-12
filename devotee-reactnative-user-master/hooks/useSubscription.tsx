import qs from "qs"
import { useState } from "react"
import { Linking } from "react-native"
import { useSelector } from "react-redux"
import environment from "../environment"

// import { IPlanPeriod } from "../interfaces"
// import Plan from "../models/Plan"
import subscriptionService from "../services/SubscriptionService"
// import { useSession } from "./useSession"
// import { SessionService } from "../services/SessionService"
import UserService from "../services/UserService"

// const sessionService = new SessionService()
const userService = new UserService()

export const useSubscription = () => {
    // const { session } = useSession()
    // const session = useSelector((state: any) => state?.sessionReducer)
    // const [selectedPlan, setSelectedPlan] = useState<Plan>()
    // const [selectedPeriod, setSelectedPeriod] = useState<IPlanPeriod>()
    const [loading, setLoading] = useState<boolean>(false)

    // const handleContinueRegular = async () => {
    //     const p = {
    //         token: sessionService.getAuthToken(),
    //         user_id: session?.id,
    //         appRedirect: true
    //     }
    //     const url = `${environment.WEB_APP_URL}meu-plano?${qs.stringify(p)}`
    //     Linking.openURL(url)
    // }

    const handleContinueIAP = async (handleSuccess: Function, handleError: Function) => {
        console.log('handleContinueIAP')
        try {
            setLoading(true)
            // await subscriptionService.subscribeIAP(selectedPeriod, session.subscription?.iap_product_id)
            await subscriptionService.subscribeIAP()
            await handleSuccess()
            await userService.syncUserWithApi()
        } catch (e) {
            console.error('useSubscription.handleContinueIAP', e)
            handleError()
        } finally {
            setLoading(false)
        }
    }

    return {
        // selectedPlan,
        // setSelectedPlan,
        // selectedPeriod,
        // setSelectedPeriod,
        // currentSubscription: session?.subscription,
        loading,
        // handleContinueRegular,
        handleContinueIAP,
    }
}