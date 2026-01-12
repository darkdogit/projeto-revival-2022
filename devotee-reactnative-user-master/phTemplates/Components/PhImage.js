import React, { useState } from 'react';
import { ActivityIndicator, Image, View } from 'react-native';

const PhImage = (props) => {
    const [imgLoading, setImagLoading] = useState(true)
    return (
        <>
            {
                imgLoading && props.source.uri ? <View style={{ position: 'absolute', zIndex: 4, width: props.style.width, height: props.style.height }} >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                        <ActivityIndicator />
                    </View>
                </View> : null
            }
            <Image onLoadEnd={() => setImagLoading(false)} {...props} progressiveRenderingEnabled={true} ></Image>
        </>

    )
}

export default PhImage