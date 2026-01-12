import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import { useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import ImageView from "react-native-image-viewing";
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhCaption, PhParagraph } from '../../phTemplates/typography';
import { PhRow } from '../../projectsComponents';
import MessageAudioContainer from './MessageAudioContainer';
import i18n from '../../localization/AppLocalization';

const DEFAULT_MESSAGE_RADIUS = 20

/** RIGHT CHAT BUBBLE */

function RightChatBubble({ currentMessage }) {

    const styles = {
        bubble: {
            borderRadius: DEFAULT_MESSAGE_RADIUS,
            borderBottomRightRadius: 0,
            backgroundColor: colors.gray,
        },

        text: {
            color: colors.white,
            paddingVertical: 8,
            paddingHorizontal: 12,
        },
        image: {
            height: 120, width: 180,
            borderRadius: DEFAULT_MESSAGE_RADIUS,
            borderBottomRightRadius: 0,
        }
    }
    return (
        <View style={{alignItems: 'flex-end'}}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', maxWidth: measures.screenHeight * 0.35 }} >
                <View style={styles.bubble} >
                    {
                        currentMessage.audio ? <MessageAudioContainer currentMessage={currentMessage} /> :
                            <>
                                {
                                    currentMessage.image ? <MessageImageContainer currentMessage={currentMessage} /> : null
                                }
                                {
                                    currentMessage.text ? <PhParagraph style={styles.text} >{currentMessage.text}</PhParagraph> : null
                                }
                            </>
                    }
                </View>
            </View>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                marginVertical: 5,
                marginRight: 2
            }}>
                <PhCaption bold style={{ paddingRight: 2, color: colors.disabled }}>{moment(currentMessage.time).format(i18n.t('full_date_format'))}</PhCaption>
                {
                    <MaterialCommunityIcons name="check-all" size={16} color={currentMessage.read ? colors.lightBlue : colors.lightGray} />
                }
            </View>
        </View >
    )
}









/** LEFT CHAT BUBBLE */

function LeftChatBubble({ currentMessage }) {

    const styles = {
        bubble: {
            borderBottomLeftRadius: 0,
            borderRadius: DEFAULT_MESSAGE_RADIUS,
            backgroundColor: colors.secondary
        },

        text: {
            color: colors.white,
            paddingVertical: 8,
            paddingHorizontal: 12,
        },
        image: {
            height: 120, width: 180,
            borderRadius: DEFAULT_MESSAGE_RADIUS,
            borderBottomLeftRadius: 0,
        }
    }
    return (
        <View style={{ marginRight: 10, flex: 1 }}>
            <PhRow>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', maxWidth: measures.screenHeight * 0.35 }} >
                    <View style={styles.bubble} >
                        {
                            currentMessage.audio ? <MessageAudioContainer currentMessage={currentMessage} /> :
                                <>
                                    {
                                        currentMessage.image ? <MessageImageContainer currentMessage={currentMessage} /> : null
                                    }
                                    {
                                        currentMessage.text ? <PhParagraph style={styles.text} >{currentMessage.text}</PhParagraph> : null
                                    }
                                </>
                        }

                    </View>
                </View>
            </PhRow>
            <PhRow alignCenter justifyStart style={{ marginVertical: 5, marginLeft: 2, }}>
                <PhCaption bold style={{ paddingRight: 2, color: colors.disabled }}>{moment(currentMessage.time).format(i18n.t('full_date_format'))}</PhCaption>
            </PhRow>
        </View>
    )
}


function MessageImageContainer({ currentMessage }) {
    const [zoomVisible, setZoomVisible] = useState(false)
    const styles = {
        image: {
            height: 120, width: 180,
            borderRadius: DEFAULT_MESSAGE_RADIUS,
            borderBottomRightRadius: 0,
        }
    }

    return (
        <Pressable onPress={() => setZoomVisible(true)}>
            <Image style={styles.image} source={{ uri: `${currentMessage.image}` }} />
            <ImageView
                images={[{ uri: `${currentMessage.image}` }]}
                imageIndex={0}
                visible={zoomVisible}
                onRequestClose={() => setZoomVisible(false)}
            />
        </Pressable>
    )
}
export { RightChatBubble, LeftChatBubble };
