import React from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { TockStyles } from '../tockElements/TockStyles';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const RequireMarket = () => {
    const {width} = useWindowDimensions();
    const isDesktop = width >= 768;
    const navigation = useNavigation();

    const { colors } = useTheme()

    return (
        <View style = {TockStyles.containerCenter}>
           <View style = {{
                    width: isDesktop ? "80%":"100%", 
                    marginLeft: isDesktop ? "10%": null,
                    ...styles.container
            }}>
                <View style = {styles.iconContainer}>
                    <Entypo color={colors.primary} size={70} name = "shop" />
                </View>

                <Text variant='titleMedium' style = {{...styles.text, textAlign: "center", color: colors.text}}>Torne-se Vendedor!</Text>
                
                <Text style = {styles.text}>
                    Ainda não encontramos uma loja associada à sua conta. Isso significa que você ainda não está registrado como vendedor.
                </Text>

                <Text style = {styles.text}>
                    Mas não se preocupe! Criar sua loja é rápido e fácil. Ao fazer isso, sua conta será automaticamente atualizada para vendedor, permitindo que você comece a vender seus produtos e aproveitar todos os benefícios da plataforma.
                </Text>

                <Text style = {styles.text}>
                Clique no botão abaixo para criar sua loja e dar o primeiro passo para se tornar um vendedor!
                </Text>

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
        textAlign: "justify",
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
