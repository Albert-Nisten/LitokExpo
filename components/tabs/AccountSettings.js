import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import TockAlert from '../tockElements/TockAlert';
import { Formik } from 'formik';
import { Avatar, Button, IconButton, Surface, Text, useTheme } from 'react-native-paper';
import Input from '../tockElements/Input';
import { AntDesign, Entypo, Feather, MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker'
import { Context } from '../Context';
import * as ImagePicker from 'expo-image-picker'
import { api } from '../../config';

const AccountSettings = () => {

    const [dialog, setDialog] = useState({})

    const {colors} = useTheme()
    const {user, storeUser} = useContext(Context)

    
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [gender, setGender] = useState("")
    const [maritalState, setMaritalState] = useState("single")
    const [showDate, setShowDate] = useState(false);
    const [birthDate, setBirthDate] = useState()
    const [avatar, setAvatar] = useState(null)

    const handleDate = (event, selectedDate) => {
        if(event.type === "dismissed"){
            setShowDate(false)
            return;
        }

        const currentDate = selectedDate || birthDate;
        setBirthDate(currentDate.toLocaleDateString())
        setShowDate(false)
        return;
    }

    const pickImage = async () => {
        // Solicita permissão para acessar a biblioteca de mídia
        // if (Platform.OS !== 'web') {
        //   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        //   if (status !== 'granted') {
        //     alert('Desculpe, precisamos da permissão para acessar a câmera!');
        //     return;
        //   }
        // }
    
        // Abre a biblioteca de mídia para selecionar uma imagem
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.canceled) {
          setAvatar(result.assets[0].uri);
        }
    };
    
    const getUser = () => {
        api.get(`/user/${user.id}`)
        .then(resp => {
            let data = resp.data;
            if(data.message === "sucesso"){
                setName(data.user.name)
                setPhone(data.user.phone)
                setEmail(data.user.email)
                if(data.user.gender){
                    setGender(data.user.gender)
                }else{
                    setGender("male")
                }

                if(data.user.marital_state){
                    setMaritalState(data.user.marital_state)
                }else{
                    setMaritalState("single")
                }

                if(data.user.birth_date){
                    setBirthDate(data.user.birth_date)
                }else{
                    let currentDate = new Date();
                    setBirthDate(currentDate.toLocaleDateString())
                }
            }
            console.log(data)
        })
        .catch(err => console.log(err.message))
    }
    
    const saveChanges = () => {
        if(user){
            let form = new FormData();
            if(avatar){
                form.append("avatar", {
                    uri: avatar,
                    name: name.replace(" ", "_")+".jpg",
                    type: "image/jpeg"
                })
            }
            
            form.append("name", name)
            form.append("phone", phone)
            form.append("email", email)
            form.append("gender", gender)
            form.append("marital_state", maritalState)
            form.append("birth_date", birthDate)
            
            api.put(`/user/${user.id}`, form, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              })
            .then(resp => {
                let data = resp.data;
                if(data.message === "sucesso"){
                    setDialog({
                        text: "As alterações foram salvas com sucesso!",
                        color: colors.success,
                        visible: true,
                    })
                    storeUser(data.user)
                }else{
                    setDialog({
                        text: "Ocurreu um erro",
                        color: colors.error,
                        visible: true,
                    })
                }
                console.log(data)
            })
            .catch(err => {
                setDialog({
                    text: "Verifique a sua ligação com a internet",
                    color: colors.error,
                    visible: true,
                })
                console.log(err.message)
            })
        }
    }

    useEffect(() => {
        getUser()
    }, [user])

    return (
       <SafeAreaView style = {{flex: 1}}>
            <ScrollView>
                <View style = {styles.container}>
                    {avatar &&(
                        <Avatar.Image 
                            size={70}
                            source={{uri: avatar}}
                            style = {{marginBottom: 10}}
                        />
                    )}
                    <Button 
                        onPress={pickImage}
                        mode='outlined'
                    >Alterar Imagem</Button>
                    <Text>Nome Completo</Text>
                    <Input
                        left={<AntDesign color={colors.text} size={24} name='user'/>}
                        placeholder = "nome completo"
                        value = {name}
                        onChangeText = {text => setName(text)}
                    />
                    <Text>Telefone</Text>
                    <Input
                        left={<AntDesign color={colors.text} size={24} name='phone'/>}
                        placeholder = "telefone"
                        keyboardType = 'numeric'  
                        value = {phone} 
                        onChangeText = {text => setPhone(text)}
                    />
                    <Text>Email</Text>
                    <Input
                        left={<Entypo color={colors.text} size={24} name='email'/>}
                        placeholder = "Email"
                        value = {email}
                        onChangeText = {text => setEmail(text)}
                    />
                    <Text style = {{marginBottom: 3}}>Gênero</Text>
                    <Surface style = {{borderRadius: 5, backgroundColor: "rgba(192, 192, 192, 0.5)"}} mode='flat'>
                        <View style = {styles.selectContainer}>
                            <Picker
                                selectedValue={gender}
                                style = {styles.picker}
                                itemStyle = {styles.pickerItem}
                                onValueChange={(value, index) => {
                                    setGender(value)
                                }}
                            >
                                <Picker.Item value={"male"} label="Masculino"/>
                                <Picker.Item value={"female"} label="Femenino"/>
                            </Picker>
                        </View>
                    </Surface>
                    <Text style = {{marginBottom: 3}}>Estado Civíl</Text>
                    <Surface style = {{borderRadius: 5, backgroundColor: "rgba(192, 192, 192, 0.5)"}} mode='flat'>
                        <View style = {styles.selectContainer}>
                            <Picker
                                selectedValue={maritalState}
                                style = {styles.picker}
                                itemStyle = {styles.pickerItem}
                                onValueChange={(value, index) => {
                                    setMaritalState(value)
                                }}
                            >
                                <Picker.Item value={"single"} label="Solteiro"/>
                                <Picker.Item value={"married"} label="Casado"/>
                                <Picker.Item value={"divorced"} label="Divorciado"/>
                                <Picker.Item value={"widowed"} label="Viuvo"/>
                            </Picker>
                        </View>
                    </Surface>
                    <Text>Aniversário</Text>
                    <Input
                        left={<Feather color={colors.text} size={24} name='calendar'/>}
                        placeholder = "D-MM-YYYY"
                        editable = {false}
                        value = {birthDate}
                        right={
                            <IconButton
                                style = {{padding: 0}}
                                onPress={() => setShowDate(true)}
                                icon={() => <Feather color={colors.blue} size={24} name='edit'/>}
                            />
                        }
                    />
                    {showDate && (
                        <DateTimePicker
                        value={new Date()}
                        mode='date'
                        display='default'
                        onChange={handleDate}
                        />
                    )}
                    <Button onPress={saveChanges} style = {{marginTop: 10}} mode='contained'>Salvar Alterações</Button>
                </View>
            </ScrollView>
            <TockAlert value={dialog} onDismiss={() => setDialog({visible: false})}/>
       </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    selectContainer: {
        flex: 1,
        justifyContent: 'center',
        // borderWidth: 1
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    picker: {
        height: 40
    },
    pickerItem: {
        height: 44,
        color: 'red', // Cor dos itens na lista
    },
})

export default AccountSettings;
