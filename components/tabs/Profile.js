import React, { useContext, useEffect, useState } from 'react';
import {View, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';
import { Context } from '../Context';
import RequireAuth from '../router/RequireAuth';
import { Avatar, Button, Divider, IconButton, List, Switch, Text, useTheme } from 'react-native-paper';
import { TockStyles } from '../tockElements/TockStyles';
import { Ionicons, Feather, MaterialCommunityIcons, FontAwesome5, AntDesign} from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Orders, { AllOrders, PendingOrders, DeliveredOrders, CanceledOrders } from './Orders';
import { api, url } from '../../config';
import Network from '../router/Network';
import TockAlert from '../tockElements/TockAlert';


const Profile = ({navigation}) => {

    const { user } = useContext(Context)
    const {colors} = useTheme()

    const [userAddress, setUserAddress] = useState("")
    const [dialog, setDialog] = useState({})
    const [cartCount, setCartCount] = useState(0)
    const [orderCount, setOrderCount] = useState(0)

    const Tab = createMaterialTopTabNavigator();

    const customHeader = () => {

        navigation.setOptions({
            headerLeft: null,
            headerRight: () => 
            <IconButton 
            onPress={() => navigation.navigate("Settings")}
            mode='contained'
            icon={() =>(
                <Feather size={20} name='settings'/>
            )}/>,
            headerTitle: "Meu Perfil",
            headerTitleAlign: "left"
        })
    }

    const readLevel = level => {
        let label
        switch (level) {
            case "customer":
                label = "Comprador"
                break;
            case "sailor":
                label = "Vendedor"
                break;
            case "master":
                label = "Administrador"
                break;
            default:
                case "sailor":
                    label = "Comprador"
                    break;
                break;
        }
        return label
    }

    const items = [
        {
            title: "Endereço de entrega",
            event: () => navigation.navigate("UserAddress"),
            icon:()=><FontAwesome5 color={colors.text} size={24} name='map-marker-alt'/>,
        },
        {
            title: "Favoritos",
            event: ()=>navigation.navigate("Favorite"),
            icon:()=><AntDesign color={colors.text} size={24} name='hearto'/>
        },
        {
            title: "Meu Carrinho",
            event: ()=>navigation.navigate("Cart"),
            icon:()=><AntDesign color={colors.text} size={24} name='shoppingcart'/>
        }
    ]

    const getUserAddress = () => {
        api.get(`user_address/user/${user.id}`)
        .then(resp => {
            let data = resp.data
            if(data.message === "sucesso"){
                setUserAddress(`${data.address.address_detail}, ${data.address.municipality.name}, ${data.address.province.name} - ${data.address.country.name}`)
            }else if(data.message === "sucesso"){
                setUserAddress(null)
            }
        })
        .catch(err => {
            setDialog({
                visible: true,
                text: "Verifique a sua ligação com a internet",
                color: colors.error,
                buttonText: "Tentar Novamente",
                confirm: () => getUserAddress()
            })
            console.log(err.message)
        })
    }

    useEffect(()=>{
       if(user){
        customHeader()
        getUserAddress()
       }
    }, [user])  

    if(!user){
        return <RequireAuth/>
    }

    return (
        <SafeAreaView style = {{flex: 1}}>
            <ScrollView>
                <View style = {styles.header}>
                    <View>
                        {user.avatar ? (
                            <Avatar.Image 
                                size={70}
                                source={{uri: url+"/"+user.avatar}}
                            />
                        ):(
                            <Avatar.Icon
                                size={50}
                                icon={() => <AntDesign size={30} color={colors.onPrimary} name='user'/>}
                            />
                        )}
                    </View>
                    <View>
                        <Text variant='titleLarge'>{user.name}</Text>
                        <Text style = {{color: "gray", marginTop: 5}} variant='labelSmall'>{readLevel(user.level)}</Text>
                    </View>
                </View>
                <View style = {styles.subheader}>
                    <View style = {styles.subheaderRow}>
                        <View>
                            <Feather color={colors.text} size={20} name='phone'/>
                        </View>
                        <View>
                            <Text style = {{color: "gray"}}>(244) {user.phone}</Text>
                        </View>
                    </View>
                    <View style = {styles.subheaderRow}>
                        <View>
                            <MaterialCommunityIcons color={colors.text} size={20} name='email'/>
                        </View>
                        <View>
                            <Text style = {{color: "gray"}}>(244) {user.email}</Text>
                        </View>
                    </View>
                    <View style = {styles.subheaderRow}>
                        <View>
                            <FontAwesome5 color={colors.text} size={20} name='map-marker-alt'/>
                        </View>
                        <View>
                            {userAddress ? <Text style = {{width:"60%", color: "gray"}}>{userAddress}</Text>:(
                                <Button onPress={() => navigation.navigate("UserAddress")} textColor={colors.blue}>Adicionar Endereço</Button>
                            )}
                        </View>
                    </View>
                </View>
                <Divider/>
                {/* <View style = {{display: "flex", flexDirection: "row", padding: 10}}>
                    <View style = {{width: "50%", display: "flex"}}>
                        <Text variant='titleSmall' style = {{textAlign: "center"}}>0</Text>
                        <Text variant='labelSmall' style = {{textAlign: "center", color: "gray"}}>Carrinho</Text>
                    </View>
                    <View style = {{width: "50%", display: "flex"}}>
                        <Text variant='titleSmall' style = {{textAlign: "center"}}>0</Text>
                        <Text variant='labelSmall' style = {{textAlign: "center", color: "gray"}}>Pedidos</Text>
                    </View>
                </View>
                <Divider/> */}
                <View style = {{padding: 10}}>
                    <List.Section>
                        {items.map((item, key)=>(
                            <List.Item
                                onPress={item.event}
                                key={key}
                                left = {item.icon}
                                title = {() => <Text>{item.title}</Text>}
                                right={item.right}
                            />
                        ))}
                    </List.Section>
                </View>
            </ScrollView>
            <TockAlert value={dialog} onDismiss={() => setDialog({visible: false})}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header:{
        display: "flex",
        flexDirection: "row",
        gap: 20,
        alignItems: "center",
        padding: 10
    },
    subheader:{
        padding: 20,
        marginTop: 10,
        paddingBottom: 10
    },
    subheaderRow:{
        display: "flex",
        flexDirection: "row",
        gap: 20,
        paddingBottom: 10,
        alignItems: "center"
    }
})

export default Profile;
