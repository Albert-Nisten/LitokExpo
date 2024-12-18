import { AntDesign, Entypo, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { useContext, useState } from 'react';
import {View, StyleSheet, Image, SafeAreaView, ScrollView} from 'react-native';
import { Divider, List, Switch, useTheme } from 'react-native-paper';
import { Context } from '../Context';
import { about, faq_quetion, policy_privacy } from '../../config';
import TockAlert from '../tockElements/TockAlert';
import TockDialog from '../tockElements/TockDialog';

const Settings = ({navigation}) => {

    const {clearUser, isThemeDark, storeTheme} = useContext(Context)
    const {colors} = useTheme()
    const [mAlert, setAlert] = useState({})
    const [dialog, setDialog] = useState({})
    

    const changeTheme = () => storeTheme(!isThemeDark)

    const items = [
        {
            title: "Minha Conta",
            event: () => navigation.navigate("AccountSettings"),
            icon:()=><MaterialCommunityIcons color={colors.primary} size={30} name='account-circle'/>
        },
        {
            title: "Privacidade",
            event: null,
            icon:()=><AntDesign color={colors.primary} size={30} name='lock'/>
        },
        {
            title: isThemeDark ? "Modo claro" : "Modo escuro",
            event: changeTheme,
            icon:()=><Ionicons color={colors.primary} size={30} name='moon-sharp'/>,
            right: () => <Switch 
                            onChange={changeTheme}
                            value = {isThemeDark}
                        />,
        },
        {
            title: "Linguagem",
            event: () => setAlert({
                text: "No momento, o conteúdo está disponível exclusivamente em português. Outros idiomas serão implementados futuramente.",
                color: "red",
                buttonText: "Entendi",
                visible: true,
            }),
            icon:()=><Ionicons color={colors.primary} size={30} name='language'/>
        },
        {
            title: "Perguntas Frenquentes",
            event: () => navigation.navigate("LocalBrowser", {urlAddress: faq_quetion}),
            icon:()=><Ionicons size={30} color={colors.primary} name='help-buoy-outline'/>
        },
        {
            title: "Política de Privacidade",
            event: () => navigation.navigate("LocalBrowser", {urlAddress: policy_privacy}),
            icon:()=><MaterialIcons name = "privacy-tip" size={30} color={colors.primary} />
        },
        {
            title: "Sobre",
            event: () => navigation.navigate("LocalBrowser", {urlAddress: about}),
            icon:()=><Image source={require("../../assets/icon.png")} style = {{width: 30, height: 30}}/>
        },
        {
            title: "Terminar Sessão",
            event:() => setDialog({
                title: "Terminar Sessão",
                text: "Se preferir encerrar, a sessão será concluída. Gostaria de continuar ou sair?",
                confirm: async () => {
                    try {
                        await clearUser();
                        // navigation.replace("Login");  // Descomente se quiser navegar após sair
                    } catch (error) {
                        console.error("Erro ao limpar usuário:", error);
                    }
                },
                color: colors.error,
                visible: true
            }),
            icon:()=><MaterialCommunityIcons color={colors.error} size={30} name='logout'/>,
          
        }
    ]

    return (
        <SafeAreaView style = {styles.container}>
           <ScrollView style = {{padding: 10}}>
                <List.Section>
                    {items.map((item, key)=>(
                        <>
                            <List.Item
                                onPress={item.event}
                                key={key}
                                left = {item.icon}
                                title = {item.title}
                                right={item.right}
                            />
                            {(key+1) !== items.length && <Divider/>}
                        </>
                    ))}
                </List.Section>
           </ScrollView>
           
           <TockAlert value = {mAlert} onDismiss={() => setAlert({})}/>
           <TockDialog value = {dialog} onDismiss={() => setDialog({})}/>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1
    }
})

export default Settings;
