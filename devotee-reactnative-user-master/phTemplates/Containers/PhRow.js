import React from 'react';
import { View } from 'react-native';

const PhRow = (props) => {
    const flex = props.noFlex ? null : props.style?.flex || 1
    var justify = 'space-between'
    var align = 'center'
    if (props.justifyStart) {
        justify = 'flex-start'
    }
    if (props.justifyEnd) {
        justify = 'flex-end'
    }
    if (props.justifyAround) {
        justify = 'space-around'
    }


    if (props.alignStart) {
        align = 'flex-start'
    }
    if (props.alignEnd) {
        align = 'flex-end'
    }

    const styles = {
        flexDirection: 'row',
        justifyContent: justify,
        alignItems: align,
        ...props.style,
        flex: flex
    }
    return (
        <View style={styles} >
            {props.children}
        </View>
    )
}

export default PhRow
