import { AntDesign, Entypo, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { useContext, useState } from 'react';
import {View, StyleSheet, Image, SafeAreaView, ScrollView} from 'react-native';
import { Divider, List, Switch, useTheme } from 'react-native-paper';
import { Context } from '../Context';
import { about, faq_quetion, policy_privacy } from '../../config';
import TockAlert from '../tockElements/TockAlert';
import TockDialog from '../tockElements/TockDialog';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

const Settings = (props) => {

    const {clearUser, isThemeDark, storeTheme} = useContext(Context)
    const {colors} = useTheme()
    const [mAlert, setAlert] = useState({})
    const [dialog, setDialog] = useState({})

    const navigation = useNavigation()
    

    const changeTheme = () => storeTheme(!isThemeDark)

    const items = [
        {
            title: "Perfil",
            event: () => props.navigation.navigate("Profile"),
            icon:()=><MaterialCommunityIcons color={colors.primary} size={30} name='account'/>
        },
        {
            title: "Configurações da Conta",
            event: () => props.navigation.navigate("AccountSettings"),
            icon:()=><MaterialCommunityIcons color={colors.primary} size={30} name='cog'/>,
        },
        {
            title: "Segurança Privacidade",
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
            title: "Idioma",
            event: () => setAlert({
                text: "No momento, o conteúdo está disponível exclusivamente em português. Outros idiomas serão implementados futuramente.",
                color: "red",
                buttonText: "Entendi",
                visible: true,
            }),
            icon:()=><Ionicons color={colors.primary} size={30} name='language'/>
        },
        {
            title: "FAQ",
            event: () => props.navigation.navigate("LocalBrowser", {urlAddress: faq_quetion}),
            icon:()=><Ionicons size={30} color={colors.primary} name='help-circle'/>
        },
        {
            title: "Privacidade",
            event: () => props.navigation.navigate("LocalBrowser", {urlAddress: policy_privacy}),
            icon:()=><MaterialIcons name = "privacy-tip" size={30} color={colors.primary} />
        },
        {
            title: "Ajuda e Suporte",
            event: () => navigation.navigate("SupportChat"),
            icon:()=><MaterialIcons name = 'support-agent' size={30} color={colors.primary} />
        },
        {
            title: "Sobore o App",
            event: () => props.navigation.navigate("LocalBrowser", {urlAddress: about}),
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
                        setDialog({})

                        navigation.replace("MainTabs");  // Descomente se quiser navegar após sair
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

    // return (
    //     <SafeAreaView style = {styles.container}>
    //        <ScrollView style = {{padding: 10}}>
    //             <List.Section>
    //                 {items.map((item, key)=>(
    //                     <React.Fragment  key={key}>
    //                         <List.Item
    //                             onPress={item.event}
    //                             left = {item.icon}
    //                             title = {item.title}
    //                             right={item.right}
    //                         />
    //                         {(key+1) !== items.length && <Divider/>}
    //                     </React.Fragment>
    //                 ))}
    //             </List.Section>
    //        </ScrollView>
           
    //        <TockAlert value = {mAlert} onDismiss={() => setAlert({})}/>
    //        <TockDialog value = {dialog} onDismiss={() => setDialog({})}/>

    //     </SafeAreaView>
    // );



    return (
       <SafeAreaView style = {styles.container}>
            <DrawerContentScrollView {...props}>
                {items.map((item, key) => (
                    <DrawerItem
                        key={key}
                        label={item.title}
                        icon={item.icon}
                        onPress={item.event}
                    />
                ))}

                <TockDialog value = {dialog} onDismiss={() => setDialog({})}/>
            </DrawerContentScrollView>
            
            <TockAlert value = {mAlert} onDismiss={() => setAlert({})}/>

       </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container:{
        flex: 1
    }
})

export default Settings;
