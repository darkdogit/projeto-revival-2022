import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { colors, measures } from '../PhStyles';


function PhBottomGradientContainer({ buttonProp, children, style }) {
    return (<LinearGradient style={{ zIndex: 2, position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: measures.ySpace, paddingTop: measures.ySpace * 2, ...style }}
        locations={[0, 0.3]}
        colors={["#ffffff00", colors.white]}>
        {children}
    </LinearGradient>)
}

export default PhBottomGradientContainer


