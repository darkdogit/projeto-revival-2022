import React, { useEffect, useState } from 'react';
import { Switch, View } from 'react-native';
import { PhScrollView } from '../../phTemplates/containers';
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhHeader, PhParagraph } from '../../phTemplates/typography';
import { SessionService } from '../../services/SessionService';
import UserService from '../../services/UserService';
import i18n from '../../localization/AppLocalization';


export default function NotificationsSettingsScreen(props) {
    const sessionService = new SessionService()
    const session = sessionService.getSession()
    const userService = new UserService()
    const [isSubmitting, setSubmitting] = useState(false)
    const [matchNotification, setMatchNotification] = useState(session?.notification_match || false)
    const [likeNotification, setLikeNotification] = useState(session?.notification_like)
    const [messageNotification, setMessageNotification] = useState(session?.notification_message)



    const styles = {
        switchContainer: {
            paddingVertical: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        }
    }

    async function itemChanged(type, status) {
        const params = { [`notification_${type}`]: status }
        const res = await userService.update(params)
        userService.updateSession(params)
    }

    return (

        <PhScrollView screenTitle={''}>


            <View style={{ paddingHorizontal: measures.xSpace }} >
                <PhHeader style={{ paddingBottom: 12 }} >{i18n.t('notifications')}</PhHeader>
                <View style={styles.switchContainer} >
                    <PhParagraph>{i18n.t('when_match')}</PhParagraph>
                    <Switch
                        onValueChange={(v) => {
                            setMatchNotification(v);
                            itemChanged('match', v)
                        }}
                        trackColor={{ false: colors.lightGray, true: colors.secondary }}
                        thumbColor={colors.white}
                        ios_backgroundColor={colors.disabled}
                        value={matchNotification}
                    />
                </View>
                <View style={styles.switchContainer} >
                    <PhParagraph>{i18n.t('when_like')}</PhParagraph>
                    <Switch
                        onValueChange={(v) => {
                            setLikeNotification(v)
                            itemChanged('like', v)
                        }}
                        trackColor={{ false: colors.disabled, true: colors.secondary }}
                        thumbColor={colors.white}
                        ios_backgroundColor={colors.disabled}
                        value={likeNotification}
                    />
                </View>
                <View style={styles.switchContainer} >
                    <PhParagraph>{i18n.t('when_message')}</PhParagraph>
                    <Switch
                        onValueChange={(v) => {
                            setMessageNotification(v)
                            itemChanged('message', v)
                        }}
                        trackColor={{ false: colors.disabled, true: colors.secondary }}
                        thumbColor={colors.white}
                        ios_backgroundColor={colors.disabled}
                        value={messageNotification}
                    />
                </View>
            </View>


        </PhScrollView>

    )
}

