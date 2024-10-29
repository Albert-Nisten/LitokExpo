import React from 'react';
import { StyleSheet, Text } from 'react-native';
import {TouchableOpacity} from 'react-native';
import { useTheme } from 'react-native-paper';

const Button = (props) => {

    const {colors} = useTheme()

    return (
        <TouchableOpacity {...props} style = {{...props.style, ...styles.button,  backgroundColor: colors.primary}}>
            <Text style = {{...props.titleStyle, ...styles.title, color: colors.buttonText}}>{props.title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button:{
        display: "flex",
        alignItems: "center",
        width: "100%",
        padding: 10,
        borderRadius: 15,
    },
    title: {
        color: "white"
    }
})

export default Button;
