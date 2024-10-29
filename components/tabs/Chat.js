import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Context } from '../Context';
import RequireAuth from '../router/RequireAuth';

const Chat = () => {
    const {user} = useContext(Context)

    if(!user){
        return <RequireAuth/>
    }

    return (
        <View style = {{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Text style = {{color: "gray"}}>Sem notificações no momento</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    
})

export default Chat;
