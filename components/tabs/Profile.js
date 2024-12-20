import React, { useContext, useEffect, useState } from 'react';
import {View, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';
import { Context } from '../Context';
import RequireAuth from '../router/RequireAuth';
import { Avatar, Button, Divider, IconButton, List, Switch, Text, useTheme } from 'react-native-paper';
import { TockStyles } from '../tockElements/TockStyles';
import { Ionicons, Feather, MaterialCommunityIcons, FontAwesome5, AntDesign, MaterialIcons} from '@expo/vector-icons';
import { api, url } from '../../config';
import Network from '../router/Network';
import TockAlert from '../tockElements/TockAlert';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer'
import Settings from './Settings';
import LocalBrowser from '../router/LocalBrowser';
import AccountSettings from './AccountSettings';
import { AppName } from '../tockElements/Toolbar';
import { useNavigation } from '@react-navigation/native';
 

const Profile = ({navigation}) => {

    const { user, isThemeDark } = useContext(Context)
    const {colors} = useTheme()

    const [userAddress, setUserAddress] = useState("")
    const [dialog, setDialog] = useState({})

    const mainNavigation = useNavigation();

    const customHeader = () => {
        navigation.setOptions({
            headerShown: true
        })
    }

    const readLevel = level => {
        let label
        switch (level) {
            case "customer":
                label = "Comprador"
                break;
            case "sailor":
                label = "Vendedor"
                break;
            case "master":
                label = "Administrador"
                break;
            default:
                label = "Comprador"
                break;
        }
        return label
    }

    const items = [
        {
            title: "Meus Endereços",
            event: () => navigation.navigate("UserAddress"),
            icon:()=><FontAwesome5 color={colors.text} size={24} name='map-marker-alt'/>,
        },
        {
            title: "Minha Lista de Desejos",
            event: ()=>navigation.navigate("Favorite"),
            icon:()=><AntDesign color={colors.text} size={24} name='hearto'/>
        },
        {
            title: "Carrinho de Compras",
            event: ()=>navigation.navigate("Cart"),
            icon:()=><AntDesign color={colors.text} size={24} name='shoppingcart'/>
        }
    ]

    const getUserAddress = () => {
        api.get(`user_address/user/${user.id}`)
        .then(resp => {
            let data = resp.data
            if(data.message === "sucesso"){
                setUserAddress(`${data.address.address_detail}, ${data.address.municipality.name}, ${data.address.province.name} - ${data.address.country.name}`)
            }else if(data.message === "sucesso"){
                setUserAddress(null)
            }
        })
        .catch(err => {
            setDialog({
                visible: true,
                text: "Verifique a sua ligação com a internet",
                color: colors.error,
                buttonText: "Tentar Novamente",
                confirm: () => getUserAddress()
            })
            console.log(err.message)
        })
    }

    useEffect(() => {
        if (user) {
            customHeader();
            getUserAddress();
        }else{
            navigation.setOptions({
                headerShown: false
            })
        }
    }, [user]); // Apenas 'user' como dependência, a não ser que 'isThemeDark' afete alguma lógica
      

    if(!user){
        
        return <RequireAuth/>
    }

    return (
        <SafeAreaView style = {{flex: 1}}>
            <ScrollView>
                <View style = {styles.header}>
                    <View>
                        {user.avatar ? (
                           <TouchableOpacity
                                onPress={() => mainNavigation.navigate("LocalBrowser", {urlAddress: url+"/"+user.avatar})}
                           >
                                <Avatar.Image 
                                    size={70}
                                    source={{uri: url+"/"+user.avatar}}
                                />
                           </TouchableOpacity>
                        ):(
                            <Avatar.Icon
                                size={50}
                                icon={() => <AntDesign size={30} color={colors.onPrimary} name='user'/>}
                            />
                        )}
                    </View>
                    <View>
                        <Text variant='titleMedium'>{user.name}</Text>
                        <Text style = {{color: colors.textGray, marginTop: 5}} variant='labelSmall'>{readLevel(user.level)}</Text>
                    </View>
                </View>
                <View style = {styles.subheader}>
                    <View style = {styles.subheaderRow}>
                        <View>
                            <Feather color={colors.text} size={20} name='phone'/>
                        </View>
                        <View>
                            <Text style = {{color: colors.textGray}}>(244) {user.phone}</Text>
                        </View>
                    </View>
                    <View style = {styles.subheaderRow}>
                        <View>
                            <MaterialCommunityIcons color={colors.text} size={20} name='email'/>
                        </View>
                        <View>
                            <Text style = {{color: colors.textGray}}>(244) {user.email}</Text>
                        </View>
                    </View>
                    <View style = {styles.subheaderRow}>
                        <View>
                            <FontAwesome5 color={colors.text} size={20} name='map-marker-alt'/>
                        </View>
                        <View>
                            {userAddress ? <Text style = {{width:"60%", color: colors.textGray}}>{userAddress}</Text>:(
                                <Button onPress={() => navigation.navigate("UserAddress")} textColor={colors.blue}>Adicionar Endereço</Button>
                            )}
                        </View>
                    </View>
                </View>
                <Divider/>
               
                <View style = {{padding: 10}}>
                    <List.Section>
                        {items.map((item, key)=>(
                           <React.Fragment key = {key}>
                                <List.Item
                                    onPress={item.event}
                                    left = {item.icon}
                                    title = {() => <Text>{item.title}</Text>}
                                    right={item.right}
                                />
                                {(key + 1) !== items.length && <Divider/>}
                           </React.Fragment>
                        ))}
                    </List.Section>
                </View>
            </ScrollView>
            <TockAlert value={dialog} onDismiss={() => setDialog({visible: false})}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header:{
        display: "flex",
        flexDirection: "row",
        gap: 20,
        alignItems: "center",
        padding: 10
    },
    subheader:{
        padding: 20,
        marginTop: 10,
        paddingBottom: 10
    },
    subheaderRow:{
        display: "flex",
        flexDirection: "row",
        gap: 20,
        paddingBottom: 10,
        alignItems: "center"
    }
})

const Drawer = createDrawerNavigator()


const Menu = () => {

    const {colors} = useTheme()

   return ( 
        <Drawer.Navigator 
            drawerContent={props => <Settings {...props}/>}
            screenOptions={({navigation}) => ({
                headerShadowVisible: false,
                headerTitle: "Perfil",
                drawerType: 'slide',
                drawerPosition: 'right',
                headerLeft: () => null,
                headerRight: () => 
                    <IconButton 
                        onPress={() => navigation.toggleDrawer()}
                        size={30}
                        icon={() =>(
                            <MaterialIcons size={30} color={colors.text} name='menu'/>
                    )}/>,
            })}
        >
            <Drawer.Screen 
                name = "Profile" 
                component={Profile}
                options={{
                    headerShown: true
                }}
            /> 
            <Drawer.Screen 
                name = "LocalBrowser" 
                component={LocalBrowser}
                options={{
                    headerShadowVisible: true,
                    title: AppName,
                }}
            /> 
            <Drawer.Screen 
                name = "AccountSettings" 
                component={AccountSettings}
                options={{
                    title: "Minha Conta",
                }}
            /> 
        </Drawer.Navigator>
   )
}

export default Menu;
