import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useContext, useEffect } from 'react';
import Orders from './Orders';
import { Context } from '../Context';
import Network from '../router/Network';
import RequireAuth from '../router/RequireAuth';
import { StyleSheet } from 'react-native';
const Order = () => {

    const {user} = useContext(Context)


    useEffect(() => {

    }, [user])

    if(!user){
        return <RequireAuth/>
    }

    const Tab = createMaterialTopTabNavigator();
    
    return (
        <Tab.Navigator>
            <Tab.Screen 
                name = "Pedidos" 
                component={Orders}
                initialParams={{state: "paid"}}
            />
            <Tab.Screen 
                name = "Recebidos" 
                component={Orders}
                initialParams={{state: "delivered"}}
            />
            <Tab.Screen 
                name = "Cancelados" 
                component={Orders}
                initialParams={{state: "canceled"}}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({})

export default Order;
