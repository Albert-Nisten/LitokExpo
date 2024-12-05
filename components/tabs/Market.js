import React, { useContext, useEffect, useState } from 'react';
import {View, StyleSheet, ScrollView, useWindowDimensions, SafeAreaView} from 'react-native';
import { Context } from '../Context';
import { Avatar, Button, Card, FAB, IconButton, Text, useTheme } from 'react-native-paper';
import RequireAuth from '../router/RequireAuth';
import RequireMarket from '../router/RequireMarket';
import { api, url } from '../../config';
import { MaterialCommunityIcons} from '@expo/vector-icons';
import TockAlert from '../tockElements/TockAlert';
import { formatToKwanza } from '../../config/utilities';
import Loading from '../router/Loading'
import IsNotMarketVerified from '../router/IsNotMakertVerified';
import Input from '../tockElements/Input';
import Network from '../router/Network';

const Market = ({navigation}) => {

    const {width} = useWindowDimensions()
    const isDesktop = width >= 768;

    const {user, setMarket, market} = useContext(Context)
    const [dialog, setDialog] = useState({})
    // const [market, setMarket] = useState({})

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [networkError, setNetworkError] = useState(false)
    const [isNotMarketVerified, setIsNotMarketVerified ] = useState(false);
    const [notFoundMarket, setNotFoundMarket] = useState(false)

    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const {colors} = useTheme();

    const configMarketHeader = (currentMarket) => {
        console.log(currentMarket)
        if(isDesktop){
            navigation.setOptions({
                // headerLeft: "Dashboard"
            })
        }else{
            // o Navegador n suporta passar o //  ou Rigth aqui
            navigation.setOptions({
                headerTitle: `Minha Loja - ${currentMarket.name}`,
                headerRight: () =>  <IconButton 
                                        icon={() => <MaterialCommunityIcons name="cellphone-cog" size={24} color={colors.primary} />}
                                        onPress={() => alert(`configurações de market place indisponíveis`)}
                                    />
            })
        }
    }

    let getMyMarket = () => {
        setIsLoading(true)
        api.get(`/market/user/${user.id}`)
        .then(resp=>{
            let data = resp.data;
            console.log(data)
            if(data.message === "sucesso"){
                if(data.market.enabled === "true" || data.market.enabled === 1){
                    setMarket(data.market)
                    configMarketHeader(data.market)

                    getMarktProduct(data.market.id)
                }else{
                    setMarket(data.market)
                    setIsNotMarketVerified(true)
                }
                setIsLoading(false)
            }

            if(data.message === "not_found"){
                setNotFoundMarket(true)
                setIsLoading(false)
            }
        })
        .catch(err => {
            setNetworkError(true)
            setIsLoading(false)
            console.log(err)
            setDialog({
                title: "Ups!",
                text: err.message,
                visible: true,
                color: colors.error,
            })
        })
    }


    let getMarktProduct = id => {
        setIsLoading(true)
        api.get(`/product/market/${id}`)
        .then(resp=>{
            let data = resp.data;
            if(data.message === "sucesso"){
                setProducts(data.products)
                setIsLoading(false)
            }
        })
        .catch(err => {
            setIsLoading(false)
            console.log(err.message)
            setNetworkError(false)
        })
    }

    useEffect(()=>{
        if(user){
            getMyMarket();
        }
    }, [user])

    if(!user){
        return <RequireAuth/>
    }

    if(user.level === "customer" || notFoundMarket){
        return <RequireMarket/>
    }

    if(isLoading){
        return <Loading/>
    }

    if(isNotMarketVerified){
        return <IsNotMarketVerified market = {market}/>
    }

    if(networkError) return <Network event = {() => getMyMarket()}/>


    return (
      <SafeAreaView style = {{flex: 1}}>
        <ScrollView>
            <View style = {{padding: 10}}>
                {/* <Card 
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
                </Card> */}
                <View>
                    <Input
                        placeholder='Pesquisar'
                        value={searchTerm}
                        onChangeText={text => setSearchTerm(text)}
                    />
                </View>
                <View style = {{padding: 10}}>
                    <Text style = {{color: "gray"}} variant="titleMedium">Meus Produtos</Text>
                </View>
                {filteredProducts.map((data, key) => (
                     <Card 
                        onPress={() => navigation.navigate("ProductDetail", {item: data})}
                        key={key}
                        style = {{marginTop: 5, backgroundColor: colors.card}}
                     >
                        <Card.Title
                            left={() => <Avatar.Image size={40} source={{uri: url+"/"+data.avatar}} />}
                            title = {data.name}
                            subtitle = {<Text style = {{color: "gray"}}>{formatToKwanza(data.price)}</Text>}
                            right={() => (
                                <Button 
                                    style = {{marginRight: 10}} 
                                    onPress={() => navigation.navigate("AddProducts", {isEdit: true, data})}
                                >Editar</Button>
                            )}
                        />
                    </Card>
                ))}
            </View>
        </ScrollView>
        <FAB
            icon='plus'
            color='white'
            style = {{
                position: 'absolute',
                margin: 16,
                right: 0,
                bottom: 0,
                borderRadius: 100,
                backgroundColor: colors.primary
              }}
            onPress={() => navigation.navigate("AddProducts", {isEdit: false})}
        />
        <TockAlert value={dialog} onDismiss={() => { setDialog({ visible: false }); }} />
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
