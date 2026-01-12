import { FontAwesome5 } from '@expo/vector-icons';
import Constants from 'expo-constants';
import React from 'react';
import { Dimensions, Platform, TouchableOpacity } from 'react-native';


const colors = {
    primary: '#2E4664',
    secondary: '#F97486',
    secondaryLighter: '#FEEAED',
    disabled: '#C6CCD3',
    red: '#E13C31',
    success: '#00A550',
    warining: '#FE8F00',
    divider: '#EFEFEF',
    black: '#000000',
    white: '#fff',
    lineGray: '#F2F2F2',
    primaryGradient: ['#F97EA2', '#F96863'],
    redTransparent: '#E13C31e8',
    placeholder: '#ACBDD2',
    lightGray: '#c7c7c7',
    lighterGray: '#EFF2F5',
    darkGray: '#363636',
    gray: '#7C8DA1',
    blackOpaque: '#00000033',
    greenTransparent: '#33A042e8',
    whiteTransparent: '#ffffff66',
    orange: '#FE8F00',
    orangeLighter: '#FFEED9',
    lightGreen: '#49e394',
    lightBlue: '#01b9ff',
}



const noSpace = {
    marginBottom: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
}
const navOptions = {
    title: '',
    // swipeEnabled: false,
    // gestureEnabled: false,
    headerStyle: {
        backgroundColor: colors.white,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
        height: Constants.statusBarHeight + 65
    },
    headerTitleStyle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 16,
        color: colors.primary
    },
    headerLeft: ((options) => {
        return (
            <TouchableOpacity
                activeOpacity={ 0.8 }
                style={ { paddingLeft: measures.xSpace } }
                onPress={ options.onPress }>
                <FontAwesome5 name="chevron-circle-left" size={ 25 } color={ colors.disabled } />
            </TouchableOpacity>
        )
    }),
    headerTintColor: colors.primary,
}


// console.log(`dimensions ${Platform.OS}`, (Dimensions.get('screen').height - Dimensions.get('window').height))

const cardHeightFix = Constants.statusBarHeight >= 44 ? 145 : 125
const statusBarHeight = Platform.OS == 'ios' ? Constants.statusBarHeight : Dimensions.get('screen').height - Dimensions.get('window').height
const measures = {
    xSpace: 20,
    ySpace: 20,
    backButtonSize: 26,
    bottomSpace: (Constants.statusBarHeight) + 10,
    statusBarHeight,
    screenHeight: Dimensions.get('screen').height,
    screenWidth: Dimensions.get('screen').width,
    delayDuration: 130,
    tabBarHeight: Constants.statusBarHeight > 40 ? 104 : 70,
    cardHeightFix,
    buttonRadius: 23,
    CARD_HEIGHT: Dimensions.get('screen').height - cardHeightFix - statusBarHeight

}

export { colors, noSpace, measures, navOptions };

