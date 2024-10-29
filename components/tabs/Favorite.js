import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import { Button, Card, IconButton, Text } from 'react-native-paper';
import { TockStyles } from '../tockElements/TockStyles';

const Favorite = () => {

    const [favorites, setFavorites] = useState([])

    const favoritList = [
        {
            id: 1,
            name: "loading...",
            avatar: "",
            price: "..."
        },
       
    ]

    useEffect(()=>{
        setFavorites(favoritList)
    }, [])

    return (
        <ScrollView
            style = {styles.scroll}
            showsVerticalScrollIndicator = {false}
        >
           
            <View style = {styles.container}>
                {favorites.map((item, key)=>(
                    <Card key={key} style = {styles.card}>
                        <Card.Title
                            right={
                                () => <IconButton mode='contained' icon={()=><MaterialCommunityIcons color={"red"} size={20} name = "delete"/>}/>
                            }
                            title = {item.name}
                        />
                        <Card.Cover />
                        <Card.Content>
                           <View style = {{marginTop: 10}}>
                                <Text variant='titleMedium'>{item.price}</Text>
                           </View>
                        </Card.Content>
                        <Card.Actions>
                            <Button>Comprar agora</Button>
                            <Button>Adicionar ao carrinho</Button>
                        </Card.Actions>
                    </Card>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll:{
        width: "100%"
    },
    container:{
        width: "100%",
        height: "100%",
        padding: 5
    },
    card:{
        backgroundColor: "white",
        marginBottom: 5
    }
})

export default Favorite;
