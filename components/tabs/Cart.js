import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet,View, Image, Touchable, TouchableOpacity } from 'react-native';
import { api, url } from '../../config';
import { Context } from '../Context';
import { Button, Text, Surface, RadioButton, IconButton, Divider } from 'react-native-paper'
 import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { formatToKwanza } from '../../config/utilities';

const Cart = ({navigation}) => {

    const {user} = useContext(Context)
    const [items, setItems] = useState([])
    const [total, setTotal] = useState(null)
    const [selectedProducts, setSelectedProducts] = useState([])

    const getCartItems = () => {
        api.get(`/cart/user/${user.id}`)
        .then(resp => {
            let data = resp.data
            console.log(data)
            if(data.message === "sucesso"){
                setItems(data.items)
            }   
        })
        .catch(err => console.log(err.message))
    }

    const handleIncrease = (index) => {
        const newItem = [...items];
        newItem[index].qty += 1;
        
        // Atualiza o estado dos itens
        setItems(newItem);
    
        // Verifica se o item está em `selectedProducts`
        const item = newItem[index];
        if (!selectedProducts.includes(item)) {
            setSelectedProducts(prevSelected => [...prevSelected, item]);
        }
    };

    const handleDescrease = (index) => {
        const newItem = [...items]
        newItem[index].qty -= 1;
        if(newItem[index].qty > 0){
            setItems(newItem) 
        
            const item = newItem[index];
            if (!selectedProducts.includes(item)) {
                setSelectedProducts(prevSelected => [...prevSelected, item]);
            }
        }
       
    }

    const handleSelected = item => {
       if(item.qty > 0){
            // Crie uma nova lista a partir da lista atual
            const newList = [...selectedProducts];
            
            // Verifique se o item já está na lista
            const itemIndex = newList.indexOf(item);
            
            if (itemIndex === -1) {
                // Adiciona o item se não estiver na lista
                newList.push(item);
            } else {
                // Remove o item se ele já estiver na lista
                newList.splice(itemIndex, 1);
            }
            
            // Atualiza o estado com a nova lista
            setSelectedProducts(newList);
       }
    }

    const handleTotal = () => {
        const newTotal = selectedProducts.reduce((acc, item) => {
            return acc + item.product.price * item.qty;
        }, 0)
        setTotal(newTotal)
    }

    const goToCheckout = () => {
        if(selectedProducts.length > 0){
            let itemList = []
            selectedProducts.forEach(row => {
                itemList.push({...row.product, qty: row.qty, price: row.price})
            })
            navigation.navigate('Checkout', {itemList})
        }else{
            alert("Problema na leitura dos produtos selecionados")
        }
    }

    useEffect(() => {
        if(items.length === 0){
            getCartItems()
        }
        handleTotal()

    }, [items, selectedProducts])

    return (
        <SafeAreaView style = {{flex: 1}}>
            <ScrollView contentContainerStyle = {styles.container}>
                {items.map((data, key) => (
                    <TouchableOpacity onPress={() => handleSelected(data)} key={key}>
                        <Surface elevation={0}>
                            <View style = {styles.row}>
                                <RadioButton
                                    value = {data}
                                    status={selectedProducts.includes(data) ? 'checked': 'unchecked'}
                                    onPress={() => handleSelected(data)}
                                />
                                <Text variant='titleSmall'>{data.product.name}</Text>
                            </View>
                            <View style = {styles.row}>
                                <View style = {styles.imageContainer}>
                                    <Image 
                                        style = {{width: "100%", height: "100%", objectFit: "contain"}} 
                                        source={{uri: url+"/"+data.product.avatar}} 
                                    />
                                </View>
                                <View style = {styles.content}>
                                    <Text style = {{color: "gray"}} variant='labelSmall'>{data.product.description.substring(0, 40)}</Text>
                                    <Text variant='titleSmall'>{formatToKwanza(data.product.price*data.qty)}</Text>
                                    <View style = {{...styles.row, gap: 1}}>
                                        <IconButton
                                            size={20}
                                            onPress={() => handleDescrease(key)}
                                            onAccessibilityAction
                                            disabled = {data.qty === 1 && true}
                                            mode='contained'
                                            icon={() => <AntDesign name='minus'/>}
                                        />
                                        <IconButton
                                            size={20}
                                            mode='tonal'
                                            icon={() => <Text>{data.qty}</Text>}
                                        />
                                    
                                        <IconButton
                                            size={20}
                                            onPress={() => handleIncrease(key)}
                                            mode='contained'
                                            icon={() => <MaterialCommunityIcons name='plus'/>}
                                        />
                                        
                                    </View>
                                </View>
                            </View>
                            <Divider/>
                        </Surface>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <View styles = {styles.footer}>
              <View style = {{...styles.row, padding: 10, justifyContent: "space-between"}}>
                <View>
                    <Text variant='labelLarge'>{formatToKwanza(total)}</Text>
                </View>
                <View style = {{width: "50%"}}>
                    <Button 
                        mode='contained'
                        disabled = {selectedProducts.length > 0 ? false:true}
                        onPress={goToCheckout}
                    >Checkout ({selectedProducts.length})</Button>
                </View>
              </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        paddingBottom: 80,
    },
    row: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    imageContainer: {
        width: 70,
        height: 70,
        backgroundColor: "silver"
    },
    footer: {
        position: "absolute",
        bottom: 0, 
        left: 0,
        right: 0
    }

})

export default Cart;
