import React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';

const Input = ({left, right, ...props}) => {
    return (
        <View style = {{...styles.box, ...props.style}} {...props}>
            {left}
            <TextInput placeholderTextColor="#666" style = {{...styles.input, ...props.inputStyle}} {...props}/>
            {right}
        </View>
    );
}

const styles = StyleSheet.create({
    box:{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        width: "100%",
        borderRadius: 15,
        backgroundColor: "#f5f5f5",
        paddingHorizontal: 10,
    },
    input:{
        flex: 1,
        padding: 10,
        color: "black"
    }
})

export default Input;
