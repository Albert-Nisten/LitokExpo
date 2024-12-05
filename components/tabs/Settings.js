import { AntDesign, Entypo, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { useContext } from 'react';
import {View, StyleSheet, Image} from 'react-native';
import { List, Switch, Text, useTheme } from 'react-native-paper';
import { Context } from '../Context';

const Settings = ({navigation}) => {

    const {clearUser, isThemeDark, storeTheme} = useContext(Context)
    const {colors} = useTheme()

    const changeTheme = () => storeTheme(!isThemeDark)

    const items = [
        {
            title: "Minha Conta",
            event: () => navigation.navigate("AccountSettings"),
            icon:()=><MaterialCommunityIcons color={colors.text} size={30} name='account-circle'/>
        },
        {
            title: "Privacidade",
            event: null,
            icon:()=><AntDesign color={colors.text} size={30} name='lock'/>
        },
        {
            title: "Perguntas Frenquentes",
            event: null,
            icon:()=><Ionicons color={colors.text} size={30} name='help-buoy-outline'/>
        },

        {
            title: "Linguagem",
            event: null,
            icon:()=><Ionicons color={colors.text} size={30} name='language'/>
        },
        {
            title: isThemeDark ? "Modo claro" : "Modo escuro",
            event: changeTheme,
            icon:()=><Ionicons color={colors.text} size={30} name='moon-sharp'/>,
            right: () => <Switch 
                            onChange={changeTheme}
                            value = {isThemeDark}
                        />,
        },
        {
            title: "Sobre",
            event: null,
            icon:()=><Image source={require("../../assets/icon.png")} style = {{width: 30, height: 30}}/>
        },
        {
            title: "Sair",
            event: async () => {
                try {
                    await clearUser();
                    // navigation.replace("Login");  // Descomente se quiser navegar após sair
                } catch (error) {
                    console.error("Erro ao limpar usuário:", error);
                }
            },
            icon:()=><MaterialCommunityIcons color={colors.text} size={30} name='logout'/>,
          
        }
    ]

    return (
        <View style = {styles.container}>
            <List.Section>
                {items.map((item, key)=>(
                    <List.Item
                        onPress={item.event}
                        key={key}
                        left = {item.icon}
                        title = {item.title}
                        right={item.right}
                    />
                ))}
            </List.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        padding: 10
    }
})

export default Settings;
