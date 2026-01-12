import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { colors } from '../PhStyles';

const PhRadioInput = (props) => {
    const styles = {
        btnContainerView: {
            paddingVertical: 10
        },
        outerRadioStyle: {

            height: 22,
            width: 22,
            borderRadius: 11,
            borderWidth: 2,
            borderColor: '#ccc',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10
        },
        innerRadioStyle: {
            height: 10,
            width: 10,
            borderRadius: 5,
            backgroundColor: colors.primary,
        },
        labelsContainer: {

        },
        mainContainer: {
            flexDirection: 'row',
            alignItems: 'center'
        }

    }
    return (
        <TouchableOpacity onPress={() => { if (props.onPress) props.onPress() }} style={[styles.btnContainerView, props.containerStyle]} activeOpacity={0.9} >
            <View style={styles.mainContainer}>
                <View style={[styles.outerRadioStyle, props.outerStyle]}>
                    {props.selected ?
                        <View style={[styles.innerRadioStyle, props.innerStyle]} />
                        : null
                    }
                </View>
                <View style={styles.labelsContainer} >
                    {props.children}
                </View>
            </View>
        </TouchableOpacity>


    );
}
export default PhRadioInput
