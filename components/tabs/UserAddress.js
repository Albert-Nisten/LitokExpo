import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Context } from '../Context';
import { Button, Surface, Text, TextInput, useTheme } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { api } from '../../config';
import TockAlert from '../tockElements/TockAlert';
import Loading from '../router/Loading';

const UserAddress = ({navigation}) => {

    const { user, setUser, storeUser} = useContext(Context)

    const [countries, setCountries] = useState([])
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [provinces, setProvinces] = useState([])
    const [selectedProvince, setSelectedProvince] = useState(null)
    const [municipalities, setMunicipalities] = useState([])
    const [selectedMunicipality, setSelectedMunicipality] = useState(null)
    const [addressDetail, setAddressDetail] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const [dialog, setDialog] = useState({})

    const {colors} = useTheme()


    const getCountry = () => {
        api.get("/country")
        .then(resp => {
            let data = resp.data;
            if(data.message === "sucesso"){
                setCountries([{id: 0, name: "Selecionar País"}, ...data.countries])
            }
        })
        .catch(err => console.log(err.message))
    }

    const getProvince = countryId => {
        if(countryId > 0){
            api.get(`/province/country/${countryId}`)
            .then(resp => {
                let data = resp.data;
                if(data.message === "sucesso"){
                    setProvinces([{id: 0, name: "Selecionar Província"}, ...data.provinces])
                }else if(data.message === "not_found"){
                    setProvinces([{id: 0, name: "Sem Províncias"}])
                }
            })
            .catch(err => console.log(err.message))
        }else{
            setProvinces([{id: 0, name: "Por favor, selecione um país antes"}])
        }
    }

    const getMunicipality = provinceId => {
        if(provinceId > 0){
            api.get(`/municipality/province/${provinceId}`)
            .then(resp => {
                let data = resp.data;
                if(data.message === "sucesso"){
                    setMunicipalities([{id: 0, name: "Selecionar Município"}, ...data.municipalities])
                }else if(data.message === "not_found"){
                    setMunicipalities([{id: 0, name: "Sem Municípios"}])
                }
            })
            .catch(err => console.log(err.message))
        }else{
            setMunicipalities([{id: 0, name: "Por favor, selecione uma províncias antes"}])
        }
    }

    const getUserAddress = () => {
        setIsLoading(true)
        api.get(`/user_address/user/${user.id}`)
        .then(resp => {
            let data = resp.data;
            if(data.message === "sucesso"){
                getCountry()
                setSelectedCountry(data.address.countryId)
                getProvince(data.address.countryId)
                setSelectedProvince(data.address.provinceId)
                getMunicipality(data.address.provinceId)
                setSelectedMunicipality(data.address.municipalityId)
                setAddressDetail(data.address.address_detail)
                setIsLoading(false)
            }else if(data.message === "not_found"){
                getCountry()
                setIsLoading(false)
            }
        })
        .catch(err => console.log(err.message))
    }

    const saveAddress = () => {
        setIsLoading(true)
        api.post("/user_address", {
            userId: user.id,
            countryId: selectedCountry,
            provinceId: selectedProvince,
            municipalityId: selectedMunicipality,
            address_detail: addressDetail
        })
        .then(resp => {
            let data = resp.data
            setIsLoading(false)
            if(data.message === "sucesso"){
                setDialog({
                    text: "Edereço actualizado com sucesso",
                    color: colors.success,
                    visible: true,
                    timer: 600
                })
                setUser(null)
                storeUser(user)
            }else{
                setDialog({
                    text: "Um erro inesperado está a acontecer",
                    color: colors.error,
                    visible: true,
                    timer: 1000
                })
            }
        })
        .catch(err => {
            setIsLoading(false)
            // setDialog({
            //     text: "Verifique a sua conexão com a internet",
            //     color: colors.sucess,
            //     visible: true,
            //     timer: 1000
            // })
            console.log(err.message)
        })
    }


    useEffect(() => {
        getUserAddress()
    }, [user])

    if(isLoading){
        return <Loading/>
    }

    return (
       <SafeAreaView style = {{flex: 1}}>
            <ScrollView>
                <View style = {{padding: 10}}>
                    <Text style = {{color: "gray", marginBottom: 3}}>País</Text>
                    <Surface style = {{borderRadius: 5}} mode='flat'>
                        <View style = {styles.selectContainer}>
                            <Picker
                                selectedValue={selectedCountry}
                                style = {styles.picker}
                                itemStyle = {styles.pickerItem}
                                onValueChange={(value, index) => {
                                    setSelectedCountry(value)
                                    getProvince(value)
                                    getMunicipality(selectedProvince)
                                }}
                            >
                                {countries.map((data, key) => (
                                    <Picker.Item key = {key} value={data.id} label={data.name}/>
                                ))}
                            </Picker>
                        </View>
                    </Surface>
                    <Text style = {{color: "gray", marginBottom: 3}}>Província</Text>
                    <Surface style = {{borderRadius: 5}} mode='flat'>
                        <View style = {styles.selectContainer}>
                            <Picker
                                selectedValue={selectedProvince}
                                style = {styles.picker}
                                itemStyle = {styles.pickerItem}
                                onValueChange={(value, index) => {
                                    setSelectedProvince(value)
                                    getMunicipality(value)
                                }}
                            >
                                {provinces.map((data, key) => (
                                    <Picker.Item key = {key} value={data.id} label={data.name}/>
                                ))}
                            </Picker>
                        </View>
                    </Surface>
                    <Text style = {{color: "gray", marginBottom: 3}}>Município</Text>
                    <Surface style = {{borderRadius: 5}} mode='flat'>
                        <View style = {styles.selectContainer}>
                            <Picker
                                selectedValue={selectedMunicipality}
                                style = {styles.picker}
                                itemStyle = {styles.pickerItem}
                                onValueChange={(value, index) => {
                                    setSelectedMunicipality(value)
                                }}
                            >
                                {municipalities.map((data, key) => (
                                    <Picker.Item key = {key} value={data.id} label={data.name}/>
                                ))}
                            </Picker>
                        </View>
                    </Surface>
                    <Text style = {{color: "gray", marginBottom: 3}}>Digite seu endereço completo e um ponto de referência para facilitar a localização.</Text>
                    <TextInput
                    mode='outlined'
                    dense = {true}
                    label="Endereço completo"
                    multiline = {true}
                    numberOfLines={4}
                    value={addressDetail}
                    onChangeText={text => setAddressDetail(text)}
                    />
                    <Button 
                        mode='contained'
                        onPress={saveAddress} 
                        style = {{marginTop: 10}}
                    >Guardar</Button>
                </View>
            </ScrollView>
            <TockAlert value = {dialog} onDismiss={() => setDialog({visible: false})}/>
       </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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

export default UserAddress;
