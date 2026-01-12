import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { colors, measures } from '../PhStyles';

const PhCheckboxButton = (props) => {
    const styles = {
        btnContainerView: {
            paddingVertical: 10
        },
        mainContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        }
    }
    return (
        <TouchableOpacity onPress={() => { if (props.onPress) props.onPress() }} style={{ ...styles.btnContainerView, ...props.containerStyle }} activeOpacity={1} >
            <View style={styles.mainContainer}>
                <View style={styles.labelsContainer} >
                    {props.children}
                </View>
                {
                    props.selected ?
                        <FontAwesome5 solid={props.solid === undefined || props.solid === true} size={20} name={`${props.selectedIcon || "check-circle"}`} color={props.color || colors.green} />
                        :
                        <FontAwesome5 size={20} name="circle" color={colors.lightGray} />
                }
            </View>
            {
                props.border &&
                <View style={{ borderBottomWidth: 1, borderColor: colors.lineGray, paddingTop: 20 }}></View>
            }
        </TouchableOpacity>


    );
}


export default PhCheckboxButton
