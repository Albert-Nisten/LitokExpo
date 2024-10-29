import { AntDesign, FontAwesome5, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { useContext } from 'react';
import {View, Text, Image} from 'react-native';
import { useTheme, IconButton} from 'react-native-paper';
import { TockStyles } from './TockStyles';
import { useNavigation } from '@react-navigation/native';
import { Context } from '../Context';

const AppName = "LitokShop"

const Left = () => {
    const {user} = useContext(Context)

    const navigation = useNavigation()
    const { colors } = useTheme();

    return (
        <View style = {{...TockStyles.row, flexWrap: "nowrap", gap: 0, ...TockStyles.toolbarRight, marginRight: 10,}}>
              <IconButton 
                mode='contained'
                onPress={() => navigation.navigate(user ? "Market": "Login")} 
                icon = {()=><FontAwesome6 color = {colors.text} size = {20} name = 'shop' />}/>
            <IconButton 
                mode='contained'
                onPress={() => navigation.navigate(user ? "SupportChat": "Login")} 
                icon = {()=><MaterialIcons color = {colors.text} size = {20} name = 'support-agent' />}/>
        </View>
    )
    
}

const Right = (props) =>{

    const { colors } = useTheme();
    const navigation = useNavigation()

    const {user} = useContext(Context)

    const gotToCart = () =>{
        if(user){
            navigation.navigate("Cart")
        }else{
            navigation.navigate("Login")
        }
    }

    return(
        <View style = {{...TockStyles.row, flexWrap: "nowrap", gap: 0, ...TockStyles.toolbarRight}}>
            <IconButton
                mode='contained' 
                onPress={gotToCart} 
                icon = {()=><MaterialCommunityIcons color = {colors.text} size = {20} name = 'cart-outline' />}/>
            <IconButton
                mode='contained' 
                onPress={()=>navigation.navigate("Search")} 
                icon = {()=><Ionicons color = {colors.text} size = {20} name = 'search' />}/>
        </View>
    )
}

export { Left, Right, AppName }
