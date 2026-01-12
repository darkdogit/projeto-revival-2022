import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { colors, measures } from '../PhStyles';

const PhRawListItem = (props) => {
    const chevronIcon = props.chevronIcon || <FontAwesome5 style={{ paddingLeft: 10 }} name="chevron-right" size={15} color={props.style?.chevronColor || colors.disabled} />
    const styles = {
        itemContainer: {
            paddingHorizontal: props.noMargin ? 0 : measures.xSpace,
            paddingVertical: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            ...props.itemContainerStyle

        },
        labelsContentView: {
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            flex: 1,
            ...props.labelsContainerStyle
        },

        dividerStyle: {
            height: 1,
            backgroundColor: colors.divider,
            marginHorizontal: measures.xSpace
        }
    }


    return (
        <TouchableOpacity activeOpacity={1} onPress={() => { props.onPress ? props.onPress() : null }} >
            <View style={styles.itemContainer} >
                <View style={{ ...styles.labelsContentView }} >
                    {props.children}
                </View>
                {
                    props.chevron && !props.loading && chevronIcon
                }
                {
                    props.loading && <ActivityIndicator color={colors.primary} size={'small'} />
                }
            </View>
            {
                props.divider && <View style={styles.dividerStyle} ></View>
            }
        </TouchableOpacity>
    )
}

export default PhRawListItem