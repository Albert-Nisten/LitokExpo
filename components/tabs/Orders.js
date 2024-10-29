import { FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {View, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import { Text, Card, List, Avatar, useTheme, Divider } from 'react-native-paper';
import { api } from '../../config';
import { Context } from '../Context';
import Network from '../router/Network';
import { date, dateFormat, formatToKwanza } from '../../config/utilities';

const Orders = ({route}) => {
    
    const {state} = route.params
    const {user} = useContext(Context)
    const [networkError, setNetworkError] = useState(false)
    const [orders, setOrders] = useState([]);

    const navigation = useNavigation()

    const {colors} = useTheme()

    let readState = state => {
        let currentState;
        switch (state) {
            case "paid":
                currentState = "Aguardando Entrega"
                break;
            case "delivered":
                currentState = "Pedido Entregue"
                break;
            case "canceled":
                currentState = "Pedido Cancelado"
                break;
            default:
                currentState = "Aguardando Pagamento"
                break;
        }
        return currentState
    }

    const getOrders = state => {
        api.get(`/order/user/${user.id}/${state}`)
        .then(resp => {
            let data = resp.data;
            if(data.message === "sucesso"){
                setOrders(data.orders)
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
            getOrders(state)
        }, [state])
    );

    useEffect(()=>{

    }, [user, networkError])

    if(networkError){
        return <Network event = {() => getOrders(state)}/>
    }

    if(orders.length === 0){
        return (
            <View style = {{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <View style = {{}}>
                    {state === "paid" ? (
                        <Text style = {{textAlign: "center", color: "gray"}}>Você ainda não fez nenhum pedido. Explore nossos produtos e faça seu primeiro pedido agora!</Text>
                    ):null}
                    {state === "delivered" ? (
                        <Text style = {{textAlign: "center", color: "gray"}}>Você ainda não recebeu nenhum pedido. Verifique seus pedidos em andamento ou faça uma nova compra para começar!</Text>
                    ):null}
                    {state === "canceled" ? (
                        <Text style = {{textAlign: "center", color: "gray"}}>Você não tem nenhum pedido cancelado. Isso é ótimo! Continue aproveitando suas compras conosco.</Text>
                    ):null}
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <View style = {styles.container}>
                    <Card style = {{...styles.card, backgroundColor: colors.card}}>
                        <Card.Title
                            title = {<Text style = {styles.title}>{readState(state)}</Text>}
                        />
                        <Card.Content>
                            <List.Section>
                                {orders.map((data, key) => (
                                    <React.Fragment key = {key}>
                                        <List.Item 
                                            onPress={() => navigation.navigate("OrderItems", {state, data})}
                                            left={()=>(
                                                <Avatar.Icon size={40} icon={()=><MaterialCommunityIcons style = {{color: "white"}} size={24} name='shopping'/>}/>
                                            )}
                                            title = {
                                                <View>
                                                    <Text variant='titleMedium'>Número: {data.number}</Text>
                                                    <Text variant='titleMedium'>Total: {formatToKwanza(data.total)}</Text>
                                                    <Text>{dateFormat(data.createdAt)}</Text>
                                                </View>
                                            }
                                            right={() => {
                                                if(data.state === "paid"){
                                                    return <MaterialIcons color = {colors.success} size = {20} name = 'check-circle'/>
                                                }else if(state === "delivered"){
                                                    return <MaterialIcons color = {colors.text} size = {20} name = "local-shipping"/>
                                                }else if(state === "canceled"){
                                                    return <FontAwesome5 color = {colors.error} size = {20} name = "times-circle"/>
                                                }
                                            }}
                                        />
                                        {orders.length !== (key+1) ? <Divider/> : null}
                                    </React.Fragment>
                                ))}
                            </List.Section>
                        </Card.Content>
                    </Card>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    card:{

    },
    container:{
        padding: 10
    },
    title:{
        fontWeight: "bold",
        color:"gray"
    }
})

export default Orders;