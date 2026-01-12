import * as Camera from 'expo-camera';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import mime from 'mime';
import React, { useImperativeHandle, useRef } from 'react';
import { Alert, IntentLauncher, Linking, Platform, View } from 'react-native';
import { PhLinkButton } from '../buttons';
import { PhBottomSheet } from '../components';
import { colors, measures } from '../PhStyles';


const PhCameraContainer = React.forwardRef((props, ref) => {
    const allowGallery = props.allowGallery === undefined || props.allowGallery
    const allowCamera = props.allowCamera === undefined || props.allowCamera
    const bottomSheetRef = useRef()
    useImperativeHandle(
        ref,
        () => ({
            openSheet() {

                if (!allowCamera || !allowGallery) {

                    if (!allowGallery) {
                        pickImage('camera')
                    }
                    if (!allowCamera) {
                        pickImage('library')
                    }
                } else {
                    return bottomSheetRef.current.show()
                }

            },
        }),
    )

    async function pickImage(type) {
        // const cr = await Permissions.askAsync(Permissions.MEDIA_LIBRARY)
        // const c = await Permissions.askAsync(Permissions.CAMERA)

        const c = await Camera.requestCameraPermissionsAsync()
        const cr = await MediaLibrary.getPermissionsAsync()

        const defaultEditingOptions = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: props.aspect || [1, 1],
            quality: 0.20
        }

        if (c.status !== 'granted' && cr.status !== 'granted') {
            alert()
        } else {
            try {
                let result
                if (type == 'library') {
                    result = await ImagePicker.launchImageLibraryAsync(defaultEditingOptions);
                } else {
                    result = await ImagePicker.launchCameraAsync(defaultEditingOptions);
                }
                // if (result.uri) {
                if (result.assets && result.assets.length) {
                    result.uri = result.assets[0].uri
                    onSelectedImage({ ...result, path: result.uri }, 'selected_media')
                }
                // bottomSheetRef.current.close()
                bottomSheetRef.current.hide()
            } catch (e) {
                alert()
            }
        }
    }

    function alert() {
        Alert.alert(
            'Permitir acesso a camera',
            'Precisamos das permissões de acesso à sua camera e galeria pra prosseguir',
            [
                {
                    text: 'Cancelar',
                    onPress: () => {
                        console.log('Cancel Pressed');
                        bottomSheetRef.current.hide();
                        props.onCancelled()
                    },
                    style: 'cancel',
                },
                {
                    text: 'Permitir',
                    onPress: () => {
                        if (Platform.OS == 'ios') {
                            Linking.openURL('app-settings:')
                        } else {
                            const pkg = Constants.manifest.releaseChannel
                                ? Constants.manifest.android.package  // When published, considered as using standalone build
                                : "host.exp.exponent"; // In expo client mode

                            IntentLauncher.startActivityAsync(
                                IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
                                { data: 'package:' + pkg },
                            )
                        }
                    }
                }
            ],
            { cancelable: true },
        )
    }

    async function onSelectedImage(image, type) {

        const tp = mime.getType(image.path)
        var item = {
            uri: image.path,
            type: tp,
            name: `${type}.${tp.split('/')[1]}`
        }
        try {
            const r = await FileSystem.getInfoAsync(item.uri)
            if (r.size) {
                item.size = r.size
            }
        } catch (r) { }
        props.onImageInfoReturned(item)
    }

    const styles = {
        button: {
            color: colors.black
        },
        cancelButton: {
            color: colors.primary
        },
        border: {
            borderBottomColor: colors.lighterGray,
            borderBottomWidth: 1,
            marginHorizontal: measures.xSpace,
        }
    }


    return (
        <PhBottomSheet ref={bottomSheetRef} onCancelled={() => props.onCancelled ? props.onCancelled() : null}>
            <PhLinkButton textStyle={styles.button} onPress={() => pickImage('camera')} >{props.cameraTitle || 'Tirar foto'}</PhLinkButton>
            <View style={styles.border}></View>
            <PhLinkButton textStyle={styles.button} onPress={() => pickImage('library')} >{props.libraryTitle || 'Selecionar da galeria'}</PhLinkButton>
            <View style={styles.border}></View>
            <PhLinkButton textStyle={styles.cancelButton} onPress={() => { bottomSheetRef.current.hide(); props.onCancelled ? props.onCancelled() : null }} >{props.cancelTitle || 'Cancelar'}</PhLinkButton>
        </PhBottomSheet>
    )
})

export default PhCameraContainer
