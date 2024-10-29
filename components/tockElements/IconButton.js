import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import { TockStyles } from './TockStyles';

const IconButton = ({icon, onPress, color}) => {
    return (
       <TouchableOpacity style = {{...TockStyles.iconButton, backgroundColor: color}} onPress={onPress}>
        {icon}
       </TouchableOpacity>
    );
}

const styles = StyleSheet.create({})

export default IconButton;
