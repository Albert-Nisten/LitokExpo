import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput as NativeInput, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Button, Card, IconButton, List, Text, useTheme } from 'react-native-paper';
import { AntDesign, FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { api, url } from '../../config';
import { formatToKwanza } from '../../config/utilities';

const Search = ({navigation}) => {

    const [sugestions, setSugestions] = useState([])
    const [items, setItems] = useState([])
    const [input, setInput] = useState("");
    const [notFound, setNotFound] = useState(false)
    const [isInputFocus, setIsInputFocus] = useState(false)
    
    const {colors} = useTheme();

    const getSugestions = () => {
        setItems([])
        if(input){
            api.get(`/product/search/${input}`)
            .then(resp => {
                let data = resp.data
                if(data.message === "sucesso"){
                    setSugestions(data.products)
                setNotFound(false)

                }else if(data.message === "not_found"){
                    setSugestions([])
                }
            })
            .catch(err => {
                console.log(err.message)
            })
        }else{
            setSugestions([])
        }
    }

    // const fillSearch = key => {
    //     if(key){
    //         setInput(key)
    //         searchItem(key)
    //         setSugestions([])

    //     }
    // }

    const searchItem = key => {
        setSugestions([])
        if(input){
            api.get(`/product/search/${key}`)
            .then(resp => {
                let data = resp.data
                console.log(data)
                if(data.message === "sucesso"){
                    setItems(data.products)
                }else if(data.message === "not_found"){
                    setItems([])
                    setNotFound(true)
                }
            })
            .catch(err => {
                console.log(err.message)
            })
        }else{
            setSugestions([])
        }
    }

    useEffect(() => {
        getSugestions()
    }, [input, notFound])


    return (
        <View>
            {/* <View style = {styles.header}>
                
                 <View>
                    <Button onPress={() => searchItem(input)}>Pesquisar</Button>
                </View> 
            </View> */}
            <View style={styles.search}>
                <View style={{ padding: 5 }}>
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()} 
                        accessible={true} 
                        accessibilityLabel="Voltar">
                        <Ionicons size={24} name='arrow-back' color="#333" />
                    </TouchableOpacity>
                </View>
                <NativeInput
                    value={input}
                    onChangeText={(e) => setInput(e)}
                    placeholder="O que está procurando ?"
                    placeholderTextColor="#666"
                    style={styles.input}
                    returnKeyType='search'
                    onFocus={() => setIsInputFocus(true)}
                    onBlur={() => setIsInputFocus(false)}
                    onSubmitEditing={() => searchItem(input)}
                />
                <View>
                    <IconButton
                        icon={() => <Ionicons size={40} name='search-circle' color={colors.primary} />}
                        accessible={true}
                        accessibilityLabel="Pesquisar"
                        onPress={() => searchItem(input)}
                    />
                </View>
            </View>

            
            {notFound && !isInputFocus ? (
                <View style = {{height: "80%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <MaterialIcons name="search-off" size={50} color="gray" />
                    <Text style = {{color: "gray"}} variant='titleSmall'>Nenhum Resultado Encontrado</Text>
                    <Text style = {{color: "gray", textAlign: "center", fontSize: 12}}>Tente ajustar sua busca. Use palavras diferentes ou verifique a ortografia</Text>
                </View>
            ):(
               <>
                    {(sugestions.length === 0 && items.length === 0 && !isInputFocus) ? (
                        <View style = {{height: "80%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <AntDesign name="search1" size={50} color="gray" />
                            <Text style = {{color: "gray"}} variant='titleSmall'>Pesquise Produtos</Text>
                            <Text style = {{color: "gray", textAlign: "center", fontSize: 12}}>Encontre o que você procura de maneira rápida e fácil. Use palavras-chave específicas para obter os melhores resultados</Text>
                        </View>
                    ):(
                        <SafeAreaView style = {items.length > 0 && styles.container}>
                            <ScrollView>
                                {/* sugestions found */}
                                <View>
                                    {sugestions.length > 0 && (
                                        <List.Section>
                                        {sugestions.map((data, key) => (
                                            <List.Item onPress={()=>searchItem(data.name)} key = {key} title = {data.name}/>
                                        ))}
                                        </List.Section>
                                    )}
                                </View>
                                {/* items found */}
                                <View style = {styles.row}>
                                    {items.length > 0 && items.map((item, key) => (
                                        <Card
                                            onPress={() => navigation.navigate("ProductDetail", {item})}
                                            key = {item.id} 
                                            size = {100}
                                            elevation={0}
                                            style = {{...styles.card, backgroundColor: colors.card,}}
                                        >
                                            <Card.Title
                                                title = {<Text variant='titleSmall'>{item.name}</Text>}
                                                titleStyle = {{textAlign: "center"}}
                                            />
                                            <Card.Cover 
                                                style = {{height: 150, objectFit: "contain"}} 
                                                source={{uri: url+"/"+item.avatar}}
                                            />
                                            <Card.Content>
                                                <Text variant='titleSmall'>{formatToKwanza(item.price)}</Text>
                                                <Text style = {{color: "gray", fontSize: 11}}>
                                                    {item.description.length < 24 ? item.description : item.description.substring(0, 24)+"..."}
                                                </Text>
                                            </Card.Content>
                                    </Card>
                                    ))}
                                </View>
                            </ScrollView>
                        </SafeAreaView>
                    )}
               </>
            )}

            

          

        </View>
    );
}

const styles = StyleSheet.create({
    header:{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 10,
        backgroundColor: "red"
    },
    search: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10, // Borda mais suave
        backgroundColor: "#f5f5f5", // Fundo claro
        margin: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#333", // Texto visível e com bom contraste
        paddingHorizontal: 10,
        borderRadius: 5,
        height: 40,
    },
    
    row: {
        display: 'flex',
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 1,
        justifyContent: "space-between",
        marginBottom: 10,
        padding: 5,
    },
    card:{
        width: "49%",
    },
    image:{
        width: 200,
        height: 200,
    },
    container: {
        height: "100%",
        backgroundColor: "#f2f2f2",
    }
})

export default Search;
