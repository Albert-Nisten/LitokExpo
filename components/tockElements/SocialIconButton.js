import React from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import { useTheme } from 'react-native-paper';

const SocialIconButton = ({icon, ...props}) => {

    const {colors} = useTheme()

    return (
       <TouchableWithoutFeedback onPress={props.onPress}>
            <View style  = {{...props.style, ...styles.button}}>
                {icon}
                <Text style = {{color: colors.text}}>{props.children}</Text>
            </View>
       </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    button:{
        padding: 10,
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        gap: 10,
        borderRadius: 15,
        borderColor: "gray",
        borderWidth: 1
    }
})

export default SocialIconButton;
