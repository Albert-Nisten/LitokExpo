import React, { useContext, useEffect, useState } from 'react';
import {View, StyleSheet, ScrollView, useWindowDimensions, SafeAreaView} from 'react-native';
import { Context } from '../Context';
import { Appbar, Avatar, Button, Card, Divider, FAB, IconButton, List, Modal, Portal, Text, Title, useTheme } from 'react-native-paper';
import RequireAuth from '../router/RequireAuth';
import RequireMarket from '../router/RequireMarket';
import { api, url } from '../../config';
import { AntDesign, Entypo, Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import { TockStyles } from '../tockElements/TockStyles';
import TockAlert from '../tockElements/TockAlert';
import AddProducts from './AddProducts';
import { formatToKwanza } from '../../config/utilities';
import Loading from '../router/Loading'
import Network from '../router/Network'
import IsNotMarketVerified from '../router/IsNotMakertVerified';

const Market = ({navigation}) => {

    const {width} = useWindowDimensions()
    const isDesktop = width >= 768;

    const {user, setMarket, market} = useContext(Context)
    const [dialog, setDialog] = useState({})
    // const [market, setMarket] = useState({})
    const [modalVisible, setModalVisible] = useState(false);
    const [products, setProducts] = useState([]);
    const [isLaoding, setIsLoading] = useState(false)
    const [networkError, setNetworkError] = useState(false)
    const [isNotMarketVerified, setIsNotMarketVerified ] = useState(false);

    const {colors} = useTheme();

    let getMyMarket = () => {
        setIsLoading(true)
        api.get(`/market/user/${user.id}`)
        .then(resp=>{
            let data = resp.data;
            console.log(data)
            if(data.message === "sucesso"){
                if(data.market.enabled){
                    setIsLoading(false)
                    setMarket(data.market)
                    getMarktProduct(data.market.id)
                }else{
                    setMarket(data.market)
                    setIsNotMarketVerified(true)
                    setIsLoading(false)
                }
            }
        })
        .catch(err => {
            setNetworkError(true)
            setIsLoading(false)
            console.log(err)
        })
    }


    let getMarktProduct = id => {
        api.get(`/product/market/${id}`)
        .then(resp=>{
            let data = resp.data;
            if(data.message === "sucesso"){
                setProducts(data.products)
            }
        })
        .catch(err => console.log(err.message))
    }


    useEffect(()=>{
        if(user){
            if(isDesktop){
                navigation.setOptions({
                    // headerLeft: "Dashboard"
                })
            }else{
                // o Navegador n suporta passar o //  ou Rigth aqui
                navigation.setOptions({
                    headerRight: () => <IconButton mode='contained' icon={() => <AntDesign size={20} color = {colors.text} name='search1'/>}/>
                })
            }
            getMyMarket();
        }
    }, [user])

    if(!user){
        return <RequireAuth/>
    }else if(user.level === "customer"){
        return <RequireMarket/>
    }

    if(isLaoding){
        return <Loading/>
    }

    if(isNotMarketVerified){
        return <IsNotMarketVerified market = {market}/>
    }


    return (
      <SafeAreaView>
        <ScrollView>
            <View style = {{padding: 10}}>
                <Card 
                    mode='elevated'>
                    <Card.Title
                        left={() => <Avatar.Icon size={40} icon={() => <Ionicons size={20} color={colors.onPrimary} name='grid'/>}/>}
                        title = "Novo Produto"
                        right={() => (
                            <Button 
                                style = {{marginRight: 10}} mode='contained'
                                onPress={() => navigation.navigate("AddProducts", {isEdit: false})}
                            >Adicionar</Button>
                        )}
                    />
                </Card>
                <View style = {{padding: 10}}>
                    <Text style = {{color: "gray"}} variant="titleMedium">Meus Produtos</Text>
                </View>
                {products.map((data, key) => (
                     <Card 
                        mode='elevated' 
                        onPress={() => navigation.navigate("ProductDetail", {item: data})}
                        key={key}
                        style = {{marginTop: 10}}
                     >
                        <Card.Title
                            left={() => <Avatar.Image size={40} source={{uri: url+"/"+data.avatar}} />}
                            title = {data.name}
                            subtitle = {<Text style = {{color: "gray"}}>{formatToKwanza(data.price)}</Text>}
                            right={() => (
                                <Button 
                                    style = {{marginRight: 10}} 
                                    mode='outlined'
                                    icon={() => <AntDesign color={colors.text} size={24} name='edit'/>}
                                    onPress={() => navigation.navigate("AddProducts", {isEdit: true, data})}
                                >Editar</Button>
                            )}
                        />
                    </Card>
                ))}
            </View>
        </ScrollView>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    card:{
        backgroundColor: "white"
    },
    row:{
        display: "flex",
        flexDirection: "row",
        gap: 5,
        //justifyContent: "space-around" Centralizar os item dando espacos 
        justifyContent: "space-between",
        padding: 10
    },
    containerCenter:{
        display: "flex",
        alignItems: "center",
        padding: 10
    },
    fab:{
        position: "absolute",
        bottom: 10,
        right: 10,
        borderRadius: 100,

    },
    customAvatar: {
        width: 50,
        height: 50,
        backgroundColor: "silver",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
    },
    modalContain: {

    }
})

export default Market;
