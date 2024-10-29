import React, { useEffect, useState } from 'react';
import {View, StyleSheet, FlatList, Image} from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

const FeedCategories = () => {
    const [categiories, setCategories] = useState([]);
    const {colors} = useTheme()

    const categoryList = () => [
        {
            id: 1,
            name: "Auriculares"
        },
        {
            id: 2,
            name: "Iphones"
        }
    ]

    useEffect(()=>{
        setCategories(categoryList)
    }, [])

    return (
        <FlatList
            data = {categiories}
            horizontal = {true}
            showsHorizontalScrollIndicator = {false}
            renderItem={({item})=>(
                <Card 
                    style = {{...styles.card}}
                    elevation={0}
                >  
                    <Card.Content> 
                       <View style = {{display: "flex", alignItems: "center"}}>
                            <Image
                                style = {styles.image}
                                source={require("../dist/img/products/iphone1.png")}/>
                            <Text style = {{textAlign: "center"}} variant='titleSmall'>{item.name}</Text>
                       </View>
                    </Card.Content>
                </Card>
            )}
        />  
    );
}

const styles = StyleSheet.create({
    card:{
        width: 100,
        margin: 5,
    },
    image:{
        width: 70,
        height: 70,
        objectFit: "contain",
        borderRadius: 100,
        backgroundColor: "silver"
    }
})

export default FeedCategories;
