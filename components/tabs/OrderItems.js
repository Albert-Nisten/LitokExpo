import { FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {View, StyleSheet, SafeAreaView, ScrollView, Image} from 'react-native';
import { Text, Card, List, Avatar, useTheme, Divider, Button } from 'react-native-paper';
import { api, url } from '../../config';
import { Context } from '../Context';
import Network from '../router/Network';
import { date, dateFormat, formatToKwanza } from '../../config/utilities';

const OrderItems = ({route}) => {
    
    const {state, data: orderData} = route.params
    const {user} = useContext(Context)
    const [networkError, setNetworkError] = useState(false)
    const [items, setItems] = useState([]);

    const {colors} = useTheme()

    let readState = state => {
        let currentState;
        switch (state) {
            case "paid":
                currentState = `Aguardando Entrega n ${orderData.number}`
                break;
            case "delivered":
                currentState = `Pedido Entregue n ${orderData.number}`
                break;
            case "canceled":
                currentState = `Pedido Cancelado n ${orderData.number}`
                break;
            default:
                break;
        }
        return currentState
    }

    const getOrderItems = order => {
        api.get(`/order_item/order/${order.id}`)
        .then(resp => {
            let data = resp.data;
            if(data.message === "sucesso"){
                setItems(data.orderItems)
            }
            console.log(data)
        })
        .catch(err => {
            console.log(err.message)
        })
    }

    useFocusEffect(
        useCallback(() => {
            readState(state)        
            getOrderItems(orderData)
        }, [state])
    );

    useEffect(()=>{

    }, [user, networkError])

    if(networkError){
        return <Network event = {() => getOrderItems(orderData)}/>
    }

    if(items.length === 0){
        return (
            <View style = {{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <View style = {{}}>
                        <Text style = {{textAlign: "center", color: "gray"}}>Nenhum item encontrado</Text>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <View style = {styles.container}>
                    {items.map((data, key) => (
                        <Card 
                        style = {{
                            backgroundColor: colors.card
                        }}
                        key={key}>
                            <Card.Title
                                title = {data.product.name}
                                right={() => (
                                    <View style = {{paddingRight: 20}}>
                                        <Text>{dateFormat(data.createdAt)}</Text>
                                    </View>
                                )}
                                
                            />
                            <Card.Cover style = {{width: "100%", objectFit: "contain"}} source={{uri: url+"/"+data.product.avatar}}/>
                            <Card.Content>
                                <List.Section>
                                    <List.Item
                                        left={() => <Text variant='titleMedium'>Estado:</Text>}
                                        title = {readState(state)}
                                    />
                                    <Divider/>
                                    <List.Item
                                        left={() => <Text variant='titleMedium'>Preço:</Text>}
                                        title = {formatToKwanza(data.price)}
                                    />
                                    <Divider/>
                                    <List.Item
                                        left={() => <Text variant='titleMedium'>Quantidade:</Text>}
                                        title = {data.qty}
                                    />   
                                    <Divider/>
                                    <List.Item
                                        left={() => <Text variant='titleMedium'>Total:</Text>}
                                        title = {formatToKwanza(data.total)}
                                    />  
                                    <List.Accordion style = {{backgroundColor: "transparent"}} title = "Descrição">
                                        <Text style = {{paddingLeft: 16}}>{data.product.description}</Text>
                                    </List.Accordion>
                                </List.Section>
                            </Card.Content>

                        </Card>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    card:{},
    container:{
        padding: 10
    },
    title:{
        fontWeight: "bold",
        color:"gray"
    }
})

export default OrderItems;