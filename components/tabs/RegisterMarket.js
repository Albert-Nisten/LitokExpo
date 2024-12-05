import React, { useContext, useEffect, useRef, useState } from 'react';
import {View, StyleSheet, useWindowDimensions, TouchableOpacity, SafeAreaView, ScrollView, Image} from 'react-native';
import { Button, Card, IconButton, Text, TextInput, useTheme } from 'react-native-paper';
import { TockStyles } from '../tockElements/TockStyles';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../config';
import { Context } from '../Context';
import TockAlert from '../tockElements/TockAlert';
import Input from '../tockElements/Input';
import * as ImagePicker from 'expo-image-picker'


import { AntDesign, Feather } from '@expo/vector-icons';
import Loading from '../router/Loading';

const RegisterMarket = () => {

    const navigation = useNavigation();
    const {width} = useWindowDimensions();
    const isDesktop = width >= 768;

    const { colors } = useTheme();

    const {user, storeUser} = useContext(Context)
    const [dialog, setDialog] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState('');
    const [documentFront, setDocumentFront] = useState(null);
    const [documentBack, setDocumentBack] = useState(null);
    const [selfie, setSelfie] = useState(null);

    const isFormValid = name !== null && documentFront !== null && documentBack !== null && selfie !== null;

    const inputRef = useRef(null);

    const focusTextInput = () => {
        setDialog({visible: false})
        // Focar o campo TextInput
        inputRef.current?.focus();
      };

    const create = () => {
        setIsLoading(true)
        let  form = new FormData();
        
        form.append("name", name)

        form.append("document_front",  {
            uri: documentFront,
            name: name+"_document_front_".replace(" ", "_")+".jpg",
            type: "image/jpeg"
        })

        form.append("document_back",  {
            uri: documentFront,
            name: name+"_document_back_".replace(" ", "_")+".jpg",
            type: "image/jpeg"
        })

        form.append("document_selfie",  {
            uri: documentFront,
            name: name+"_document_selfie_".replace(" ", "_")+".jpg",
            type: "image/jpeg"
        })

        form.append("userId", user.id)

        api.post(`/market/`, form, {
            headers: {
                'Content-Type':'multipart/form-data',
            }
        })
        .then(resp => {
            let data = resp.data;
            console.log(data)
            setIsLoading(false)

            if(data.message === "sucesso"){
                setDialog({
                    visible: true,
                    title: "Sucesso",
                    text: "Dados enviados com sucesso",
                    color: colors.success,
                    button: "Entendi",
                    confirm: () => navigation.goBack()
                })
                storeUser(data.user)
            }else if(data.message === "exist"){
                setDialog({
                    visible: true,
                    text: "Já existe uma Loja com esse nome. Tente usar um nome diferente",
                    color: colors.error,
                    button: "Entendi",
                    confirm: () => focusTextInput()
                })
            }
        })
        .catch(err => {
            console.log(err)
            setIsLoading(false)
            setDialog({
                visible: true,
                title: "Ops!",
                text: err.message,
                color: colors.error,
                button: "Entendi",
                confirm: () => setDialog({})
            })

        })
    }
    
    const pickImage = async data => {
        //alert(data.type)
        // Solicita permissão para acessar a biblioteca de mídia

        // Abre a biblioteca de mídia para selecionar uma imagem
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          // aspect: [4, 4],
          quality: 1,
        });
    
        if (!result.canceled) {
            if(data.type === "document_front"){
                setDocumentFront(result.assets[0].uri)
            }

            if(data.type === "document_back"){
                setDocumentBack(result.assets[0].uri)
            }

            if(data.type === "selfie"){
                setSelfie(result.assets[0].uri)
            }
        }
    };
    
    const removePick = data => {

        if(data.type === "document_front"){
            setDocumentFront(null)
        }

        if(data.type === "document_back"){
            setDocumentBack(null)
        }

        if(data.type === "selfie"){
            setSelfie(null)
        }

    }

    useEffect(()=>{
      
    }, [])

    if(isLoading) return <Loading/>

    return (
       <SafeAreaView>
            <ScrollView>
                <View style = {isDesktop ? TockStyles.containerCenter : { padding: 10}}>
                <Card style = {{backgroundColor: colors.onPrimary}} mode={isDesktop ? "elevated": "contained"}>
                        <Card.Title
                            title = {<Text style = {{color: colors.text}} variant='titleMedium'>Crie sua Loja e Comece a Vender!</Text>}
                            subtitle = {<Text style = {{color: "gray", textAlign: "justify"}}>Preencha os campos abaixo para registar sua loja e enviar os documentos necessários. Sua conta será ativada como vendedor, permitindo que você comece a vender com segurança e confiança.</Text>}
                            subtitleNumberOfLines={5}
                        />
                        <Card.Content>
                    
                            <Text style = {{color: colors.primary, marginBottom: 5, marginTop: 10}}>Nome da Loja</Text>
                            <TextInput
                                value = {name}
                                onChangeText = {e => setName(e)}
                                ref = {inputRef}
                            />
                            <Text style = {{color: "gray", marginBottom: 5}}>Informe o nome da sua loja. Este será o nome visível aos seus clientes.</Text>


                            <Text style = {{color: colors.primary}} variant='titleSmall'>Envio do Documento de Identidade</Text>

                            <View style = {{ width: "100%", height: 150, backgroundColor: "#f2f2f2", borderRadius: 10, marginTop: 10, marginBottom: 5 }}>
                                {!documentFront ? (
                                    <TouchableOpacity 
                                    style = {{width: "100%", height: "100%", display: "flex", justifyContent: "center", padding: 10, alignItems: "center",}} 
                                    onPress={() => pickImage({type: "document_front"})}
                                    >
                                        <IconButton 
                                            mode='contained'
                                            size={40}
                                            containerColor={colors.onPrimary}
                                            icon={() => <AntDesign name="idcard" size={24} color="black" />}
                                        />
                                        <Text style = {{fontWeight: "bold", marginTop: 5}}>Frente do Documento</Text>
                                        <Text style = {{textAlign: "center", color: "gray"}}>clique para fazer upload da imagem</Text>
                                    </TouchableOpacity>
                                ):(
                                    <Image 
                                        style={{ width: "100%", height: "100%", borderRadius: 5 }} 
                                        source={{ uri: documentFront }} 
                                        resizeMode="contain"
                                    />
                                )}
                            </View>
                            {documentFront && <Button textColor={colors.error} onPress={() => removePick({type: "document_front"})}>Remover Imagem</Button>}

                            <View style = {{ width: "100%", height: 150, backgroundColor: "#f2f2f2", borderRadius: 10, marginTop: 10, marginBottom: 5 }}>
                               {!documentBack ? (
                                    <TouchableOpacity 
                                        style = {{width: "100%", height: "100%", display: "flex", justifyContent: "center", padding: 10, alignItems: "center",}} 
                                        onPress={() => pickImage({type: "document_back"})}
                                    >
                                    <IconButton 
                                        mode='contained'
                                        size={40}
                                        containerColor={colors.onPrimary}
                                        icon={() => <AntDesign name="creditcard" size={24} color="black" />}
                                    />
                                    <Text style = {{fontWeight: "bold", marginTop: 5}}>Verso do Documento</Text>
                                    <Text style = {{textAlign: "center", color: "gray"}}>clique para fazer upload da imagem</Text>
                                    </TouchableOpacity>
                               ):(
                                    <Image 
                                        style={{ width: "100%", height: "100%", borderRadius: 5 }} 
                                        source={{ uri: documentBack }} 
                                        resizeMode="contain"
                                    />
                               )}
                            </View>
                            {documentBack && <Button textColor={colors.error} onPress={() => removePick({type: "document_back"})}>Remover Imagem</Button>}

                            
                            <Text style = {{color: colors.primary, marginTop: 10}} variant='titleSmall'>Foto com Documento em Mãos</Text>
                            <Text style = {{color: "gray", textAlign: "justify"}}>Tire uma foto sua segurando o documento de identidade (frente) para confirmar sua identidade.</Text>

                            <View style = {{ width: "100%", height: 300, backgroundColor: "#f2f2f2", borderRadius: 10, marginTop: 10}}>
                                {!selfie ? (
                                    <TouchableOpacity 
                                        style = {{width: "100%", height: "100%", display: "flex", justifyContent: "center", padding: 10, alignItems: "center",}} 
                                        onPress={() => pickImage({type: "selfie"})}
                                    >
                                        <IconButton 
                                            mode='contained'
                                            size={40}
                                            containerColor={colors.onPrimary}
                                            icon={() => <Feather name="user-check" size={24} color="black" />}
                                        />
                                        <Text style = {{fontWeight: "bold", marginTop: 5}}>Clique para fazer upload da imagem</Text>
                                        <Text style = {{textAlign: "center", color: "gray"}}>Essa etapa é importante para garantir que você é o titular do documento.</Text>
                                    </TouchableOpacity>
                                ):(
                                    <Image 
                                        style={{ width: "100%", height: "100%", borderRadius: 5 }} 
                                        source={{ uri: selfie }} 
                                        resizeMode="contain"
                                    />
                                )}
                            </View>
                            {selfie && <Button textColor={colors.error} onPress={() => removePick({type: "selfie"})}>Remover Imagem</Button>}

                        </Card.Content>
                        <Card.Actions>
                            <Button 
                                onPress={create} 
                                mode='contained' 
                                disabled = {!isFormValid}
                                style = {{width: "100%"}}
                            >Criar loja</Button>
                        </Card.Actions>
                </Card>
                </View>
            </ScrollView>
            <TockAlert value={dialog} onDismiss={dialog.confirm}/>

       </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
        padding: 10
    },
    text:{
        width: "100%",
        textAlign: "center",
        padding: 10,
        color: "gray"
    },
    iconContainer:{ 
        width: "100%",
        display: "flex",
        alignItems: "center",
    }
})

export default RegisterMarket;
