import { NavigationContainer, DefaultTheme, DarkTheme as NavigationDarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext, useEffect } from "react";
import { Image, StatusBar } from "react-native";
import {  DefaultTheme as PaperTheme, MD3DarkTheme as PaperDarkTheme, Provider as PaperProvider } from 'react-native-paper'
import { Context } from "../Context";
import MainTabs from "./MainTabs";
import { dark, light } from "../theme";
import Login from "../auth/Login";
import Register from "../auth/Register";
import Settings from "../tabs/Settings";
import Favorite from "../tabs/Favorite";
import RegisterMarket from "../tabs/RegisterMarket";
import AddProducts from "../tabs/AddProducts";
import ProductDetail from "../tabs/products/ProductDetail";
import { AppName, Left } from "../tockElements/Toolbar";
import Checkout from "./Checkout";
import Cart from "../tabs/Cart";
import Search from "../tabs/Search";
import OrderItems from "../tabs/OrderItems";
import UserAddress from "../tabs/UserAddress";
import AccountSettings from "../tabs/AccountSettings";
import Market from "../tabs/Market";
import NotificationDetail from "../tabs/NotificationDetail";
import SupportChat from "../tabs/SupportChat";


function MainRoutes(){

    const Stack = createNativeStackNavigator();

    const { isThemeDark, user, tryToAutoLogin} = useContext(Context);

    const statusColor = isThemeDark ? PaperDarkTheme.colors.background: "white";
    const statuStyle = isThemeDark ? "light-content": "dark-content";
    
    const theme = isThemeDark ? dark : light;

    useEffect(()=>{
        if(!user){
            tryToAutoLogin()
        }
    }, [])

    return(
      <PaperProvider theme = {theme}>
         <StatusBar barStyle={statuStyle} theme = {theme} translucent = {false} backgroundColor = {statusColor} />
         <NavigationContainer theme={theme}>
            <Stack.Navigator>
                <Stack.Screen 
                    name = "MainTabs" 
                    component={MainTabs}
                    options = {{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name = "ProductDetail"
                    component={ProductDetail}
                    options = {{
                        title: "Detalhes",
                        presentation: "modal",
                        headerShadowVisible: false
                    }}
                />
                <Stack.Screen
                    name = "Search"
                    component={Search}
                    options = {{
                        headerShown: false,
                        presentation: "modal",
                        headerShadowVisible: false
                    }}
                />
                {user && (
                    <>
                        <Stack.Screen
                            name = "Market"
                            component = {Market}
                            options={{
                                title: "Minha Loja",
                                presentation: 'modal',
                                headerShadowVisible: false
                            }}
                        />
                        <Stack.Screen
                            name = "RegisterMarket"
                            component = {RegisterMarket}
                            options={{
                                title: "Criar Loja",
                                presentation: 'modal',
                                headerShadowVisible: false,
                            }}
                        />
                        <Stack.Screen
                            name = "AddProducts"
                            component = {AddProducts}
                            options={{
                                title: "Novo Produto",
                                presentation: 'modal',
                                headerShadowVisible: false
                            }}
                        />
                        <Stack.Screen
                            name = "Settings"
                            component = {Settings}
                            options={{
                                title: "Definições",
                                presentation: 'modal',
                                headerShadowVisible: false
                            }}
                        />
                        <Stack.Screen
                            name = "Favorite"
                            component = {Favorite}
                            options={{
                                title: "Produtos Guardados",
                            }}
                        />
                        <Stack.Screen
                            name = "Checkout"
                            component={Checkout}
                            options={{
                                headerShadowVisible: false
                            }}
                        />
                        <Stack.Screen
                            name = "Cart"
                            component = {Cart}
                            options={{
                                title: "Carrinho",
                                headerShadowVisible: false
                            }}
                        />
                        <Stack.Screen
                            name = "OrderItems"
                            component = {OrderItems}
                            options={{
                                title: "Detalhes do Pedido",
                            }}
                        />
                        <Stack.Screen
                            name = "UserAddress"
                            component = {UserAddress}
                            options={{
                                title: "Endereço de Entrega",
                            }}
                        />
                        <Stack.Screen
                            name = "AccountSettings"
                            component = {AccountSettings}
                            options={{
                                title: "Minha Conta",
                            }}
                        />
                        <Stack.Screen
                            name = "NotificationDetail"
                            component = {NotificationDetail}
                            options={{
                                title: "Notificações",
                                headerShadowVisible: false,
                                headerTitleAlign: "center"
                            }}
                        />
                        <Stack.Screen
                            name = "SupportChat"
                            component = {SupportChat}
                            options={{
                                title: "Fale Connosco",
                                headerShadowVisible: false,
                                headerTitleAlign: "center"
                            }}
                        />
                    </>
                )}
                <Stack.Screen
                    name = "Login"
                    component = {Login}
                    options={{
                        title: AppName,
                        headerShadowVisible: false
                    }}
                />
                <Stack.Screen
                    name = "Register"
                    component = {Register}
                    options={{
                        title: AppName,
                        headerShown: false,
                        headerShadowVisible: false
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    )
}

export default MainRoutes;