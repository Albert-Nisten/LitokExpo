import React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';

const Input = ({left, right, ...props}) => {
    return (
        <View style = {{...styles.box, ...props.style}} {...props}>
            {left}
            <TextInput style = {{...styles.input}} {...props}/>
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
        backgroundColor: "rgba(192, 192, 192, 0.5)",
        padding: 10,
    },
    input:{
        flex: 1,
    }
})

export default Input;
