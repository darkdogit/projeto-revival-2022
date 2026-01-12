import React from 'react';
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from '../PhStyles';

// interface PhSafeAreaContainerProps {
//     mode?: string
// }

export default function PhSafeAreaContainer(props) {
    const safeArea = props.mode || 'default'

    const areas = {
        'noBottom': ['top', 'right', 'left'],
        'noTop': ['bottom', 'right', 'left'],
        'onlyHorizontal': ['right', 'left'],
        'onlyVertical': ['top', 'bottom'],
        'default': ['bottom', 'top', 'right', 'left'],
    }

    const edges = areas[safeArea]

    return (
        <SafeAreaView
            edges={edges}
            style={{ flex: 1, backgroundColor: colors.white, ...props.style }} >
            <StatusBar translucent backgroundColor={props.statusBarStyle?.backgroundColor || 'transparent'} barStyle={props.statusBarStyle?.barStyle || 'dark-content'} />
            {props.children}
        </SafeAreaView>
    )

}