import React from 'react';
import { Animated, Image, Linking, Pressable } from 'react-native';
import environment from '../../environment';
import { measures } from '../../phTemplates/PhStyles';
import { LinearGradient } from 'expo-linear-gradient';

export default function AdCard({ ad }) {

    return (
        <Animated.View style={ {
            width: '100%',
            height: measures.CARD_HEIGHT,
            borderRadius: 10,
            backgroundColor: 'black'
        } }>
            <Pressable onPress={ () => Linking.openURL(ad.link).catch() } style={ { flex: 1 } }>
                <LinearGradient colors={ ['transparent', '#00000050'] } style={ { position: 'absolute', zIndex: 20, width: '100%', height: measures.CARD_HEIGHT, borderRadius: 10} } />
                <Image style={ {
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    borderRadius: 10,
                } } source={ { uri: `${environment.baseImgUrl}${ad.image}` } } />
            </Pressable>
        </Animated.View >
    )

}

