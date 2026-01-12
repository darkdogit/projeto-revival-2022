import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Keyboard, TextInput, View } from 'react-native';
import i18n from '../../localization/AppLocalization';
import { PhLinkButton } from '../buttons';
import { colors, measures } from '../PhStyles';

const PhSearchBarInput = (props) => {
    const [editing, setEditing] = useState(false)
    const [searchString, setSearchString] = useState('')
    let timeout
    function cancelEditing() {
        setEditing(false)
        Keyboard.dismiss()
        setSearchString('')
        props.onSearchSubmit && props.onSearchSubmit('')
    }
    const styles = {
        mainContainerStyle: {
            flexDirection: 'row',
            marginVertical: measures.ySpace,
            marginLeft: measures.xSpace,
            marginRight: measures.xSpace,
            height: 37,
        },
        inputStyle: {
            fontSize: 16,
            flex: 1,
            color: colors.primary,
        },
        inputContainerStyle: {
            flex: 1,
            paddingHorizontal: 10,
            backgroundColor: colors.lighterGray,
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 10,
        },
        iconStyle: {
            paddingRight: 7
        },
        cancelBtn: {
            marginRight: 0,
            marginBottom: 0,
            paddingTop: 8,
            paddingBottom: 8,
        }
    }

    return (
        <>
            <View style={{ ...styles.mainContainerStyle, ...props.mainContainerStyle }}>
                <View style={{ ...styles.inputContainerStyle, ...props.inputContainerStyle }} >
                    <View style={styles.iconStyle} >
                        <FontAwesome5 name="search" size={14} color={colors.primary} />
                    </View>
                    <TextInput
                        keyboardAppearance={'dark'}
                        returnKeyType={'done'}
                        onFocus={() => setEditing(true)}
                        onBlur={() => cancelEditing()}
                        placeholder={`${i18n.t('search')}...`}
                        placeholderTextColor={colors.primary}
                        style={styles.inputStyle}
                        onChangeText={(txt) => {
                            if (!props.onSearchChanged) {
                                setSearchString(txt)
                            } else {
                                clearTimeout(timeout)
                                timeout = setTimeout(() => {
                                    console.log('oi, to aqui')
                                    props.onSearchChanged(txt)
                                }, 300);
                            }
                        }}
                        onSubmitEditing={() => {
                            cancelEditing();
                            Keyboard.dismiss()
                            props.onSearchSubmit && props.onSearchSubmit(searchString)
                        }}>
                    </TextInput>
                </View>
                {
                    editing && <PhLinkButton onPress={() => cancelEditing()} textStyle={{ ...props.cancelTextStyle }} containerStyle={styles.cancelBtn} > Cancelar </PhLinkButton>
                }
            </View>
        </>
    )
}

export default PhSearchBarInput
