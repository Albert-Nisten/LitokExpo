import React, { useContext, useEffect, useState } from 'react';
import { Button, RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Divider, List, Text, useTheme } from 'react-native-paper';
import { Context, socket } from '../Context';
import RequireAuth from '../router/RequireAuth';
import { api } from '../../config';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getTime } from '../../config/utilities';
import Loading from '../router/Loading';


const Notification = ({navigation}) => {
    const {user} = useContext(Context)
    const { colors} = useTheme();

    const [notifications, setNotifications] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    const getUserNotifications = () => {
        setIsLoading(true)
        api.get(`notification/user/${user.id}`)
        .then(resp => {
            setIsLoading(false)
            let data = resp.data
            if(data.message === "sucesso"){
                setNotifications(data.notifications)
            }
        })
        .catch(err => console.log(err.message))
    }

    const handleNotification = notification => {
        api.put(`/notification/${notification.id}`, {is_read: true})
        .then(resp => {
            let data = resp.data;
            if(data.message === "sucesso"){
                let type = data.notification.type
                
                socket.emit('new_notification', {userId: user.id, message: "a notification opened"})
                switch (type) {
                    case 'order':
                        navigation.navigate("NotificationDetail", {notification})
                        break;
                
                    default:
                        break;
                }
            }else{
                alert(data.message)
            }
        })
     
    }   

    useEffect(() => {
      if(user){
        if(notifications.length === 0){
            getUserNotifications()
        }
        
        socket.on('new_notification', data => {
            getUserNotifications()
        })
        
        return () => {
            socket.off("new_notification")
        }
      }
    }, [])


    if(!user){
        return <RequireAuth/>
    }


    if(notifications.length === 0){
        return (
            <View style = {{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Ionicons color={colors.text} size={40} name='notifications-outline'/>
                <Text style = {{marginTop: 10}}>Sem Notificações no momento</Text>
            </View>
        );
    }

    return (
        <SafeAreaView>
            <ScrollView
               refreshControl={<RefreshControl refreshing = {isLoading} onRefresh={getUserNotifications}/>}
            >
                {notifications.map((data, key) => (
                    <List.Section key={key}>
                        <List.Item 
                            left={props => (
                                <Avatar.Icon 
                                    {...props}
                                    size={40} 
                                    style = {{marginLeft: 10}} 
                                    colo
                                    icon={
                                        () => {
                                            if(data.type === "order"){
                                                return <MaterialCommunityIcons color={colors.onPrimary} size={24} name='shopping'/>
                                            }else{
                                                return <Ionicons color={colors.onPrimary} size={24} name='notifications-outline'/>
                                            }
                                        }
                                    }/>
                            )}
                            title = {<Text style = {{color: data.is_read === false ? colors.blue : "gray"}} variant='titleSmall'>{data.title}</Text>}
                            description = {
                                <Text style = {{textAlign: "left", color: "gray"}}>{data.description}</Text>
                            }
                            right={() => (
                                <Text style = {{color: data.is_read === false ? colors.blue : "gray"}}>{getTime(data.createdAt)}</Text>
                            )}
                            onPress={() => handleNotification(data)}
                        />
                    </List.Section>
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    
})

export default Notification;
