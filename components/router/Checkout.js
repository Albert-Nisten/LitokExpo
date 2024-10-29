import React, {useContext, useEffect, useState} from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, TextInput, View, Button as NativeButton } from 'react-native';
import { Avatar, Button, Card, Divider, IconButton, List, RadioButton, Surface, Text, useTheme } from 'react-native-paper';
import { AntDesign, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { formatToKwanza } from '../../config/utilities';
import { Context, socket } from '../Context';
import { api, url } from '../../config';
import Loading from './Loading';
import Network from './Network';
import TockAlert from '../tockElements/TockAlert';
import { TouchableOpacity } from 'react-native';
const Checkout = ({route, navigation}) => {

    const {itemList} = route.params
    
    const {user} = useContext(Context)

    const { colors } = useTheme();

    const [isLoading, setIsLaoding] = useState(false);
    const [networkError, setNetworkError] = useState(false);
    const [dialog, setDialog] = useState({})

    const [paymentMethod, setPaymentMethod] = useState(null);
    const [footerShown, setFooterShown] = useState(true);
    const deliveryTax = 7000
    const discount = 0;
    const [note, setNote] = useState("")
    const [subtotal, setSubTotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [address, setAddress] = useState(null)

    const methods = [
        {
            image: require('../dist/img/icons/multicaixa.png'),
            name: "Referência",
            value: "multicaixa"
        },
        {
            image: require('../dist/img/icons/multicaixa_express.png'),
            name: "Multicaixa Express",
            value: "multicaixa_express"
        },
        {
            image: require('../dist/img/icons/unitel_money.jpg'),
            name: "Unitel Money",
            value: "unitel_money"
        }
    ]

    const getUserAddress = () => {
        api.get(`/user_address/user/${user.id}`)
        .then(resp => {
            let data = resp.data
            if(data.message === "sucesso"){
                let mAddress = data.address
                let description = `${mAddress.address_detail}, ${mAddress.municipality.name}, ${mAddress.province.name} - ${mAddress.country.name}`
               setAddress(mAddress)
            }
            console.log(data)
        })
        .catch(err => console.log(err))
    }

    let sum = (numberList) => {
        let result = 0
        numberList.forEach(number => {
            result = (number+result)
        })
        return result
    }

    let customCatch = err => {
        setIsLaoding(false)
        setNetworkError(true)
        console.log(err.message)
    }

    let calculator = () => {
        let numberList = []
        itemList.forEach(item => {
            numberList.push(Number(item.price*item.qty))
        })
        let subtotal = sum(numberList)
        let total = (subtotal+deliveryTax)
        setSubTotal(subtotal)
        setTotal(total)
    }

    let confirm = () => {
        setIsLaoding(true)
        api.post("/order", {
            discount,
            total,
            payment_method: paymentMethod,
            note,
            userId: user.id
        })
        .then(resp => {
            let data = resp.data
            if(data.message === "sucesso"){
                console.log(data.order)
                createItems(data.order.id)
            }
        })
        .catch(customCatch)
    }

    let createItems = orderId => {
        totalList = 0
        itemList.forEach(row => {
            let price = row.price
            let qty = row.qty
            let discount = row.discount
            let tax = row.tax
            let total = (price*qty)
            api.post("order_item", {
                price,
                qty,
                discount,
                tax,
                total,
                orderId,
                productId: row.id
            }).then(resp => {
                let data = resp.data
                if(data.message === "sucesso"){
                    console.log(data)
                    totalList ++;
                    console.log("count: "+itemList.length)
                    if(totalList === itemList.length){
                        setIsLaoding(false)
                        let text = "Parabens! pagamento efectuado com sucesso, porfavor acompanhe o seu pediido atraves de seu Perfil";
                        createNotification({title: "Encomenda", description: text, userId: user.id, type: "order"})
                        setDialog({
                            text,
                            color: colors.success,
                            event: () => navigation.navigate("MainTabs"),
                            buttonText: "comprovativo",
                            visible: true
                        })
                        
                        setTimeout(() => {
                            setDialog({visible: false})
                            navigation.navigate("MainTabs")
                        }, 5000)
                    }
                }
            })
            .catch(customCatch)
            
        })     
    }

    const createNotification = data =>{
        api.post(`notification`, data)
        .then(resp => {
            let data = resp.data
            if(data.message === "sucesso"){
                socket.emit("new_notification", {userId: user.id, message: "new order"})
            }
        })
        .catch(err => console.log(err))
    }

    const finalize = () => {
        setDialog({visible: false})
        navigation.navigate("MainTabs")
    }


    useEffect(() => {
       if(itemList){
        calculator()
       }
       getUserAddress()
    }, [user])
    

    if(isLoading){
        return <Loading/>
    }

    if(networkError){
        return <Network event = {confirm}/>
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
            <Card style={{ backgroundColor: colors.card, marginBottom: 1, marginTop: 1, borderRadius: 0 }} elevation={0}>
                {address && (
                    <Card.Content>
                        <Text variant='titleSmall'>Enviar Para</Text>
                        <Text>{user.name}</Text>
                        <Text variant='titleSmall' style = {{marginTop: 10}}>Endereço</Text>
                        <Text>{address.address_detail}</Text>
                        <Text>{address.municipality.name}</Text>
                        <Text>{address.province.name}</Text>
                        
                        <TouchableOpacity onPress={() => navigation.navigate("UserAddress")}>
                            <Text>{address.country.name} <Text style = {{fontWeight: "bold", color: colors.blue}}>Editar</Text></Text>
                        </TouchableOpacity>
                        <TextInput
                            placeholder= "Escrevar nota de Entrega"
                            onFocus={()=>setFooterShown(false)}
                            onBlur={() => setFooterShown(true)}
                            value = {note}
                            onChangeText={value => setNote(value)}
                            style = {{marginTop: 10}}
                        />
                    </Card.Content>
                )}
            </Card>
                <View style = {{width: "100%", padding: 10, backgroundColor: colors.onPrimary}}>
                    {methods.map((data, key) => (
                        <TouchableOpacity 
                            key={key}
                            onPress={() => setPaymentMethod(data.value)}
                        >
                            <Surface  style={{
                                    ...styles.radioButtonContainer, 
                                    backgroundColor: colors.card,
                                    borderWidth: paymentMethod === data.value ? 2 : 1,
                                    borderColor: paymentMethod === data.value ? colors.primary :'#ccc',
                                }} 
                                elevation={0}
                            >
                                    
                                <Image style = {{width: 35, height: 35, marginRight: 10, borderRadius: 5}} source={data.image} />
                                <Text style = {{ flex: 1, fontSize: 16}}>{data.name}</Text>
                                <RadioButton
                                    value={data.value}
                                    status={paymentMethod === data.value ? "checked": "unchecked"}
                                    onPress={() => setPaymentMethod(data.value)}  
                                />
                            </Surface>
                        </TouchableOpacity>
                        
                    ))}    
                </View>
                <Surface style={{ backgroundColor: colors.card, marginBottom: 1 }}>
                    <List.Section 
                        title={<Text variant='titleSmall'>revisar pedido</Text>}
                    >
                        {itemList.map((data, key) => (
                            <View key={key}>
                                <List.Item
                                    left={()=>(
                                        <View style = {{width: 50, height: 50, backgroundColor: "silver", marginLeft: 5, borderRadius: 5}}>
                                            <Image 
                                                style = {{width: "100%", height: "100%", objectFit: "fit"}} 
                                                source={{uri: url+"/"+data.avatar}}
                                            />
                                        </View>
                                    )}
                                    title = {<Text style = {{width: "90%", fontSize: 12, color: "gray"}}><Text style = {{fontWeight: "bold"}}>{data.name}</Text> - {data.description}</Text>}
                                    description = {
                                        <View>
                                            <Text style = {{marginTop: 10, fontSize: 14, marginBottom: 10, fontWeight: "bold"}}>{formatToKwanza(data.price*data.qty)}</Text>
                                            <Text><Text style = {{color: "gray"}}>Quantidade:</Text> {data.qty}</Text>
                                        </View>
                                    }
                                    titleNumberOfLines={3}
                                />
                                {(key+1) !== itemList.length && <Divider/>}
                            </View>
                        ))}

                        <View style={{ flex: 1, padding: 20, alignItems: 'flex-end' }}>
                            {/* Resumo do pedido à direita */}
                            <View style={{ width: '80%', padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5 }}>
                                <Text style={{ fontWeight: 'bold' }}>Resumo:</Text>
                                <Text>Total: {formatToKwanza(subtotal)}</Text>
                                <Text>Frete: {formatToKwanza(deliveryTax)}</Text>
                                <Text style={{ fontWeight: 'bold' }}>Total a Pagar: {formatToKwanza(total)}</Text>
                            </View>
                        </View>
                    </List.Section>
                </Surface>
            </ScrollView>
            {footerShown && (
                <View style={styles.footer}>
                    <Surface style={{ backgroundColor: colors.card }} elevation={3}>
                       
                        <Button 
                            style = {{margin: 5}} 
                            mode='contained'
                            disabled = {!paymentMethod && true}
                            onPress={confirm}
                        >confirmar Pagamento</Button>
                    </Surface>
                    <TockAlert value={dialog} onDismiss={finalize} />
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'silver',
    },
    scrollContent: {
        paddingBottom: 40, // Espaço para o rodapé fixo
    },
    radioButtonContainer: {
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});

export default Checkout;
