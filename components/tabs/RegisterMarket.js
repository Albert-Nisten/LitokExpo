import React, { useContext, useEffect, useState } from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import { Avatar, Button, Card, Text, TextInput, useTheme } from 'react-native-paper';
import { TockStyles } from '../tockElements/TockStyles';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../config';
import { Context } from '../Context';
import TockAlert from '../tockElements/TockAlert';
import Input from '../tockElements/Input';

const RegisterMarket = () => {

    const navigation = useNavigation();
    const {width} = useWindowDimensions();
    const isDesktop = width >= 768;

    const { colors } = useTheme();

    const {user, storeUser} = useContext(Context)
    const [dialog, setDialog] = useState({});
    const [name, setName] = useState("");

    const create = () => {
        api.post(`/market/`, {
            name: name,
            userId: user.id
        })
        .then(resp => {
            let data = resp.data;
            console.log(data)
            if(data.message == "sucesso"){
                setDialog({
                    visible: true,
                    title: "Sucesso",
                    text: "sua loja foi criada com sucesso",
                    button: "Ok",
                })
                storeUser(data.user)
            }
        })
        .catch(err => console.log(err))
    }

    const cardStyle = {
        width: "30%",
        marginLeft: "35%"
    }
    


    useEffect(()=>{

    }, [])

    return (
        <View style = {isDesktop ? TockStyles.containerCenter : {...TockStyles.containerCenter, padding: 10}}>
           <Card style = {{backgroundColor: colors.onPrimary}} mode={isDesktop ? "elevated": "contained"}>
                <Card.Title
                    title = {<Text variant='headlineSmall'>Simples e fácil</Text>}
                />
                <Card.Content>
                    <Text style = {{color: "gray", marginBottom: 10}}>Você poderá montar seu proprio Stock, monitorar as suas vendas e clientes, insere o nome da sua loja e clique em proceguir, simples e fácil!</Text>
                    <Text style = {{marginBottom: 10}}>Nome da loja</Text>
                    {isDesktop ? (
                        <TextInput 
                            style = {{marginBottom: 10}} 
                            dense 
                            label={"nome da loja"}
                            value={name}
                            onChangeText={e=>setName(e)}
                            mode='flat'
                        />
                    ):(
                        <Input
                            value = {name}
                            onChangeText = {e => setName(e)}
                        />
                    )}
                </Card.Content>
                <Card.Actions>
                    <Button onPress={create} mode='contained' disabled = {!name ? true: false}>Criar loja</Button>
                </Card.Actions>
           </Card>
           <TockAlert value={dialog} onDismiss={()=>navigation.navigate("MainTabs")}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        padding: 10
    },
    text:{
        width: "100%",
        textAlign: "center",
        padding: 10,
        color: "gray"
    },
    iconContainer:{ 
        width: "100%",
        display: "flex",
        alignItems: "center",
    }
})

export default RegisterMarket;
