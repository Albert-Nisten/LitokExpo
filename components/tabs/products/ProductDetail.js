import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AntDesign, MaterialCommunityIcons} from '@expo/vector-icons'
import { Button, Divider, IconButton, List, Surface, Text, useTheme } from 'react-native-paper';
import { formatToKwanza } from '../../../config/utilities';
import { TockStyles } from '../../tockElements/TockStyles';
import TockAlert from '../../tockElements/TockAlert'
import { api, url } from '../../../config';
import { Context } from '../../Context'
const ProductDetail = ({route, navigation}) => {

    const {item: product} = route.params // it's the same to know item as product

    const {user} = useContext(Context)
    const {colors} = useTheme()

    const [dialog, setDialog] = useState({})
    const [pictures, setPictures] = useState([]);
    const [avatar, setAvatar] = useState(null)
    const [descriptionLines, setDescriptionLines] = useState(3)

    const customHeader = () => {
        navigation.setOptions({
            title: product.name,
            headerRight:()=> (
               <>
                <IconButton 
                    mode = 'contained'
                    icon = {() =>
                    <MaterialCommunityIcons size = {24} name = 'heart-outline'/>
                    }
                />
               </>
            )

        })
    }


    const getPictures = () => {
        setAvatar({uri: url+"/"+product.avatar})    
        
        api.get(`/product/pictures/${product.id}`)
        .then(resp => {
            let data = resp.data
            const updatePictures = [...pictures, {index: 0, avatar: {uri: url+"/"+product.avatar}}]
    
            data.pictures.forEach((data, index)=>{
                let avatar = {index: index+1, avatar: {uri: url+"/"+data.avatar}}
                updatePictures.push(avatar)
            })
            setPictures(updatePictures)
            console.log(data)
        })
        .catch(err => console.log(err.message))
    }

    const handleDescriptionLines = () => {
        if(!descriptionLines){
            setDescriptionLines(3)
        }else{
            setDescriptionLines(null)
        }
    }

    const goToCheckout = () => {
        // o checkout recebe os produtos atrava de uma lista
        //entao cria-se um array antes de enviar estre produto
        if(!user){
            navigation.navigate("Login")
        }else{
            let itemList = []
            itemList.push({...product, qty: 1, discount: 0, tax: 0})

            console.log(itemList)

            navigation.navigate("Checkout", {itemList})
        }
    }

    const addToCart = () => {
      if(!user){
        navigation.navigate("Login")
      }else{
        api.post("/cart", {userId: user.id})
        .then(resp => {
             let data = resp.data
             if(data.message === "sucesso"){
                 createCartItem(data.cart.id);
                 console.log(data)
             }   
        })
        .catch(err => {
         setDialog({
             text: err.message,
             color: colors.error,
             visible: true
         })
         console.log(err.message)
        })
      }
    }

    const createCartItem = (cartId) => {
        api.post("/cart_item", {
            cartId, 
            productId: product.id,
            price: product.price,
            qty: 1
        })
        .then(resp => {
            let data = resp.data
            if(data.message === "sucesso"){
                setDialog({
                    text: "Produto adicionado ao carrinho com sucesso!",
                    visible: true,
                })
            }
        })
        .catch(err => {
            setDialog({
                text: err.message,
                color: colors.error,
                visible: true
            })
            console.log(err.response.data)
        })
    } 

    useEffect(() => {
        customHeader()
        getPictures()
    }, [])

    return (
        <SafeAreaView style = {{flex: 1}}>
            <ScrollView contentContainerStyle = {{width: "100%", paddingBottom: 10}}>
                <View>
                    <View style = {styles.imageContainer}>
                        <Image 
                            style = {styles.image}
                            source={avatar}/>
                    </View>
                    <View style = {styles.tumbnailsContainer}>
                        <FlatList
                            data={pictures}
                            horizontal = {true}
                            showsHorizontalScrollIndicator = {false}
                            renderItem={({item}) => (
                               <TouchableOpacity onPress={() => setAvatar(item.avatar)}>
                                    <Image 
                                        style = {styles.tumbnails}
                                        source={item.avatar}
                                    />
                               </TouchableOpacity>
                            )}
                        />
                    </View>
                    <List.Section>
                        <List.Item
                            title = {<Text style = {{color: colors.text}} variant='titleMedium'>{product.name}</Text>}
                            right={() => <Text variant='titleMedium' style = {{color: colors.text}}>{formatToKwanza(product.price)}</Text>}
                        />
                        <List.Item 
                            title = {<Text variant='titleSmall'>Descrição:</Text>} 
                            description = {
                                <Text style = {{width: "90%", color: "gray"}}>
                                    {product.description}
                                </Text>
                            } 
                            descriptionNumberOfLines={descriptionLines}
                            onPress={handleDescriptionLines}
                        />
                        <Divider />
                        <List.Accordion title = "Detalhes">
                            <List.Item
                                title = "Marca:"
                                right={() => <Text>{product.brand}</Text>}
                            />
                            <List.Item
                                title = "Estado:"
                                right={() => <Text>{product.condition === "used" ? "Usado":"Novo"}</Text>}
                            />
                            <List.Item
                                title = "Dimensões:"
                                right={() => <Text>{product.dimensions}</Text>}
                            />
                            <List.Item
                                title = "Tamanho:"
                                right={() => <Text>{product.size}</Text>}
                            />
                            <List.Item
                                title = "Peso (kg):"
                                right={() => <Text>{product.weight}</Text>}
                            />
                        </List.Accordion>
                        <Divider/>
                        <List.Accordion
                            // left={() => <AntDesign color={colors.text} size={24} name='check'/>}
                            title = {<Text>Condições de Venda</Text>}
                            style = {{padding: 10}}
                        >
                            <List.Item title = {product.sales_conditions} titleNumberOfLines={null}/>
                        </List.Accordion>
                    </List.Section>
                </View>
            </ScrollView>
            <Surface elevation={10} mode='elevated'>
                <View style = {styles.buttonGroup}>
                    <Button 
                        style = {{width: "30%", ...TockStyles.materialButton}} mode='outlined'
                        icon={() => <MaterialCommunityIcons color={colors.text} size={20} name='cart'/>}
                        onPress={addToCart}
                    ><MaterialCommunityIcons color={colors.text} size={20} name = 'plus'/></Button>
                    <Button 
                        style = {{width: "68%", ...TockStyles.materialButton}} mode='contained'
                        onPress={goToCheckout}
                    >Comprar Agora</Button>
                </View>
            </Surface>
            <TockAlert value={dialog} onDismiss={()=>setDialog({visible: false})} />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        width: "100%",
        height: 300,
    },
    image: {
        width: "100%",
        height: "100%",
        objectFit: "contain"
    },
    tumbnailsContainer: {
        marginTop: 5,
        marginLeft: 5
    },
    tumbnails: {
        width: 80,
        height: 80,
        objectFit: "cover",
        borderRadius: 10,
        marginRight: 5
    },
    textDetailsContainer: {
        marginTop: 5,
        marginLeft: 5
    },
    buttonGroup:{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 5,
        padding: 10
    }
})

export default ProductDetail;
