import React from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import { Button, Text } from 'react-native-paper';
import { TockStyles } from '../tockElements/TockStyles';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const RequireMarket = () => {
    const {width} = useWindowDimensions();
    const isDesktop = width >= 768;
    const navigation = useNavigation();

    return (
        <View style = {TockStyles.containerCenter}>
           <View style = {{
                    width: isDesktop ? "50%":"100%", 
                    marginLeft: isDesktop ? "25%": null,
                    ...styles.container
            }}>
                <View style = {styles.iconContainer}>
                    <Entypo color={"gray"} size={70} name = "shop" />
                </View>

                <Text style = {styles.text}>Você ainda não tem uma loja</Text>

                <Button 
                    style = {TockStyles.materialButton} 
                    mode='contained'
                    onPress={()=>navigation.navigate("RegisterMarket")}
                    >Criar Loja</Button>
           </View>
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

export default RequireMarket;
