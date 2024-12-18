import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../tabs/Home";
import Profile from "../tabs/Profile";
import Search from "../tabs/Search";
import Market from '../tabs/Market';
import { FontAwesome5, MaterialCommunityIcons, Ionicons} from '@expo/vector-icons'
import { Left, Right } from "../tockElements/Toolbar";
import { useContext, useEffect, useState } from "react";
import { Image, useWindowDimensions } from "react-native";
import Order from "../tabs/Order";
import Notification from "../tabs/Notification";
import { api } from "../../config";
import { Context, socket } from "../Context";

const Tab = createBottomTabNavigator();



const BottomTabs = () => {
    const [notificationBagde, setNotificationBagde] = useState(0);

    const {user} = useContext(Context);

    const getUserNotifications = () => {
        api.get(`notification/user/${user.id}`)
        .then(resp => {
            let data = resp.data;
            if(data.message === "sucesso"){
                let count = 0;
                data.notifications.forEach(row => {
                    if(row.is_read === false){
                        count += 1
                    }
                })
                setNotificationBagde(count)
            }else if(data.message === "not_found"){
                setNotificationBagde(0)
            }
        })
        .catch(err => console.log(err.message))
    }


    useEffect(() => {
        if(user){
            getUserNotifications();

            socket.emit('register', user)

            socket.on("new_notification", () => {
                getUserNotifications();
            })
            
            return () => {
                socket.off("new_notification");
            }
        }
        setNotificationBagde(0)

    }, [user, getUserNotifications])

    return(
        <Tab.Navigator
            screenOptions={{
            headerLeft: () => <Left/>,
            headerRight: ()=><Right/>,
            headerShadowVisible: false,
            headerTitle: () => (
                <Image
                    source={require("../../assets/litokshop.png")}
                    style = {{width: 130, objectFit: "contain"}}
                />
            ),
            headerTitleAlign: "center"
            }}
        >
          <Tab.Screen 
              name = "Inicio" 
              options={{
                  tabBarIcon: ({color, size}) => <MaterialCommunityIcons color={color} size={size} name = 'home' />,
              }}  
              component={Home} 
          />
          <Tab.Screen 
              name = "Notification" 
              options={{
                  title: "Notificações",
                  tabBarIcon: ({color, size}) => <Ionicons color={color} size={size} name = 'notifications' />,
                  tabBarBadge: notificationBagde > 0 ? notificationBagde : null,
              }}  
              component={Notification} 
          />
          <Tab.Screen 
              name = "Order" 
              options={{
                  title: "Pedidos",
                  tabBarIcon: ({color, size}) => <MaterialCommunityIcons color={color} size={size} name = 'shopping' />,
              }}  
              component={Order} 
          /> 
          <Tab.Screen 
              name = "Perfil"
              options={{
                  tabBarIcon: ({color, size}) => <FontAwesome5 color={color} size={size} name = 'user' />
              }}  
              component={Profile} 
          />
      </Tab.Navigator>
    )
}

function MainTabs(){
    const { width } = useWindowDimensions();
    const isDesktop = width >= 768;

    useEffect(()=>{
        
    }, [])

    // if(isDesktop){
    //     return <MainDash/>
    // }else{
    //     return <BottomTabs/>
    // }

    return <BottomTabs/>
}

export default MainTabs;