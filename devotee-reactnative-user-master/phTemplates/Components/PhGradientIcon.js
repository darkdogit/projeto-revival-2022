import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import MaskedView from '@react-native-community/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View } from 'react-native';
import { colors } from '../PhStyles';

//  /**
//    * expo install @react-native-community/masked-view    -> import MaskedView from '@react-native-community/masked-view'
//    * expo install expo-linear-gradient                   -> import { LinearGradient } from 'expo-linear-gradient';
//    * 
//    */  
const PhGradientIcon = ({ family, name, size, gradientColors, style }) => {
    const clrs = gradientColors || colors.primaryGradient
    const locationEnd = (0.7 * size) / 50
    return (
        <View style={{ width: size + 3, height: size + 3, ...style }}>
            <MaskedView
                style={{ flex: 1, flexDirection: 'row', height: size }}
                maskElement={
                    <View
                        style={{
                            backgroundColor: 'transparent',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        {
                            family == 'FontAwesome' && <FontAwesome solid={style?.solid} name={name} size={size} />
                        }
                        {
                            family == 'FontAwesome5' && <FontAwesome5 solid={style?.solid} name={name} size={size} />
                        }
                    </View>
                }>
                <LinearGradient
                    // Background Linear Gradient

                    start={[0, 0.5]}
                    end={[1, 0.5]}
                    locations={[0, locationEnd]}
                    colors={clrs}
                    style={{ height: 45, width: 45 }}
                />
            </MaskedView>
        </View>
    )
}

export default PhGradientIcon