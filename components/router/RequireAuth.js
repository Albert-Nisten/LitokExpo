import React, { useContext } from 'react';
import {View, StyleSheet} from 'react-native';
import { Button, Text } from 'react-native-paper';
import { TockStyles } from '../tockElements/TockStyles';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Context } from '../Context';

const RequireAuth = () => {

    const {isDesktop} = useContext(Context)
    const navigation = useNavigation();

    return (
        <View style = {TockStyles.containerCenter}>
           <View style = {!isDesktop ? styles.container : styles.desktopContainer}>
                <View style = {styles.iconContainer}>
                    <AntDesign color={"gray"} size={70} name = "user" />
                </View>

                <Text style = {styles.text}>Para acessar essa funcionalidade, por favor, inicie sessão na sua conta.</Text>

                <Button 
                    style = {TockStyles.materialButton} 
                    mode='outlined'
                    onPress={()=>navigation.navigate("Login")}
                    >Iniciar sessão</Button>
           </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        padding: 10
    },
    desktopContainer: {
        width: "50%",
        marginLeft: "25%"
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

export default RequireAuth;
