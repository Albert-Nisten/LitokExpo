import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useContext, useEffect, useState } from 'react';
import {View, StyleSheet, ScrollView, SafeAreaView} from 'react-native';
import { Button, Card, IconButton, Text, useTheme } from 'react-native-paper';
import { TockStyles } from '../tockElements/TockStyles';
import { Context } from '../Context';
import { api, url } from '../../config';
import TockAlert from '../tockElements/TockAlert';
import Network from '../router/Network';
import Loading from '../router/Loading';
import { formatToKwanza } from '../../config/utilities';

const Favorite = ({navigation}) => {

    const {user} = useContext(Context)

    const {colors} = useTheme()

    const [favorites, setFavorites] = useState([])
    const [networkError, setNetworkError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [dialog, setDialog] = useState({})

    const getFavorites = () => {
        setIsLoading(true)
        api.get(`/product/favorites/${user.id}`)
        .then(resp => {
            let data = resp.data
            console.log(data)
            if(data.message === "sucesso"){
                setFavorites(data.favorites)
            }
            setIsLoading(false)
        })
        .catch(err => {
            console.log(err)
            setNetworkError(true)
            setDialog({
                text: err.message,
                visible: true,
                color: colors.error,
                confirm: () => {}
            })
            setIsLoading(false)
        })
    }

    useEffect(()=>{
        getFavorites()
    }, [])

    if(isLoading) return <Loading/>

    if(networkError) return <Network event = {() => {getFavorites(); setNetworkError(false)}}/>

    return (
        <SafeAreaView style = {{flex: 1, padding: 10}}>
            <ScrollView
                style = {styles.scroll}
                showsVerticalScrollIndicator = {false}
            >
                <View style = {styles.container}>
                    {favorites.map((item, key)=>(
                        <Card key={key} style = {styles.card} onPress={() => navigation.navigate('ProductDetail', { item: {...item.product, liked: true} })}>
                            <Card.Cover resizeMode='contain' source={{ uri: `${url}/${item.product.avatar}` }}/>
                            <Card.Title
                                title = {item.product.name}
                                subtitle = {item.product.description}
                            />
                            <Card.Content>
                                <View>
                                    <Text style = {{color: colors.primary}} variant='titleLarge'>{formatToKwanza(item.product.price)}</Text>
                                </View>
                            </Card.Content>

                        </Card>
                    ))}
                </View>
            </ScrollView>
            <TockAlert value={dialog} onDismiss={dialog.confirm}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scroll:{
        width: "100%"
    },
    container:{
        width: "100%",
        height: "100%",
        padding: 5,
        // backgroundColor: "#F5F5F5"
    },
    card:{
        backgroundColor: "white",
        marginBottom: 10
    }
})

export default Favorite;
