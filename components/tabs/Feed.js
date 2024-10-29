import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {View, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import { Card, IconButton, Text, Title, useTheme } from 'react-native-paper';
import FeedCategories from './FeedCategories';
import { api, url } from '../../config';
import { formatToKwanza } from '../../config/utilities';
import { useNavigation } from '@react-navigation/native';
import Network from '../router/Network';
import Loading from '../router/Loading';

const Feed = () => {

    const [products, setProducts] = useState([])
    const [networkError, setNetworkError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    
    let navigation = useNavigation();

    const {colors} = useTheme()

    const getProducts = () => {
        setNetworkError(false)
        api.get("/product")
        .then(resp => {
            let data = resp.data
            if(data.message === "sucesso"){
                setProducts(data.products)
                setIsLoading(false)
            }
        })
        .catch(err => {
            setNetworkError(true)
            setIsLoading(false)
            console.log(err.message)
        })
    }

    useEffect(()=>{
        getProducts()
    }, [])


    if(networkError){
        return <Network event = {() => {setIsLoading(true); getProducts()}}/>
    }

    if(isLoading){
      return <Loading/>
    }

    return (
        <ScrollView 
            showsVerticalScrollIndicator = {false}
            contentContainerStyle = {styles.scroll}
            refreshControl={<RefreshControl refreshing = {isLoading} onRefresh={getProducts}/>}
        >
            {/* <View style = {styles.titleContainer}>
                <Text variant='titleSmall'>Categorías populares</Text>
            </View> */}

            {/* <FeedCategories/> */}
            
            <View style = {styles.titleContainer}>
                <Text variant='titleSmall'>Acabou de chegar</Text>
            </View>

            <View style = {styles.container}>

                {products.map((item, key) => (
                    <Card  
                        onPress={() => navigation.navigate("ProductDetail", {item})}
                        key = {item.id} 
                        size = {100}
                        elevation={0}
                        style = {{...styles.card}}
                    >
                        <Card.Cover 
                            style = {{height: 150, objectFit: "contain"}} 
                            source={{uri: url+"/"+item.avatar}}
                        />
                        <Card.Content>
                            <Text variant='titleSmall'>{formatToKwanza(item.price)}</Text>
                            <Text style = {{color: "gray", fontSize: 11}}>
                                {item.description.length < 24 ? item.description : item.description.substring(0, 24)+"..."}
                            </Text>
                        </Card.Content>
                    </Card>
                ))}
            </View>
        </ScrollView>     
    );
}

const styles = StyleSheet.create({
    scroll:{
        width: "100%",
    },  
    titleContainer:{
        paddingLeft: 5,
        marginTop: 10,
        marginBottom: 10
    },
    container:{
        display: 'flex',
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 5,
        justifyContent: "space-between",
        marginBottom: 10,
        padding: 5
    }, 
    card:{
        width: "49%"
    },
    image:{
        width: 200,
        height: 200,
    }
})

export default Feed;
