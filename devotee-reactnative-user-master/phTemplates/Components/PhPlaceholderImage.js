import React from 'react';
import { Image } from 'react-native';

const PhPlaceholderImage = (props) => {
    const uri = props.avatar ? `https://i.pravatar.cc/${props.width}` : `https://lorempixel.com/${props.width}/${props.height}/${props.theme || ''}`
    return <Image source={{ uri }} style={{ width: props.width, height: props.height, ...props.style }} />
}
export default PhPlaceholderImage
