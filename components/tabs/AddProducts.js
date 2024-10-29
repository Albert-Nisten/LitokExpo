import { AntDesign, Feather, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, useWindowDimensions, ScrollView, SafeAreaView, Image, TouchableOpacity, Touchable } from 'react-native';
import { Avatar, Button, Card, IconButton, Surface, Text, TextInput, Title, useTheme } from 'react-native-paper';
import { TockStyles } from '../tockElements/TockStyles';
import { Picker } from '@react-native-picker/picker'
import TockAlert from '../tockElements/TockAlert';
import { api, url } from '../../config';
import Input from '../tockElements/Input';
import * as ImagePicker from 'expo-image-picker'
import { Context } from '../Context';

const AddProducts = ({navigation, route}) => {

    const {isEdit, data: editData} = route.params

    const { width } = useWindowDimensions();
    const isDesktop = width >= 768
    const initialValues = isEdit ? editData : {}
    // const [model, setModel] = useState()
    const [dialog, setDialog] = useState({})
    const [steps, setSteps] = useState(0)
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [selectedCondition, setSelectedCondition] = useState("new")
    const [avatar, setAvatar] = useState(null)
    const [photoList, setPhotoList] = useState([])
    const [previewImage, setPreviewImage] = useState()

    const {market} = useContext(Context)

    const { colors } = useTheme()

    const getCategory = () => {
        api.get("/category")
            .then(resp => {
                let data = resp.data;
                if (data.message === "sucesso") {
                    setCategories(data.categories)
                    setSelectedCategory(data.categories[0].id)
                }
            })
            .catch(err => console.log(err.message))
    }

    const createProduct = values => {
        if (values) {
            let form = new FormData();
            if(avatar){
                form.append("avatar", {
                    uri: avatar,
                    name: values.name.replace(" ", "_")+".jpg",
                    type: "image/jpeg"
                })
            }
            
            form.append("categoryId", selectedCategory)
            form.append("name", values.name)
            form.append("brand", values.brand)
            form.append("price", values.price)
            form.append("weight", values.weight)
            form.append("dimensions", values.dimensions)
            form.append("size", values.size)
            form.append("tags", values.tags)
            form.append("sales_conditions", values.sales_conditions)
            form.append("stock", values.stock)
            form.append("barcode", values.barcode)
            form.append("description", values.description)
            form.append("condition", selectedCondition)
            form.append("marketId", market.id)

           if(photoList.length > 0){
                photoList.forEach((photo, index) => {
                    form.append("photos", {
                        uri: photo,
                        name: `${values.name.replace(" ", "_")}_${index}.jpg`,
                        type: "image/jpeg"
                    })
                })
           }
            
            if(!isEdit){
                api.post("/product", form, {
                    headers: {
                        'Content-Type':'multipart/form-data',
                    }
                })
                .then(resp => {
                    let data = resp.data
                    console.log(data)
                    if (data.message === "sucesso") {
                        setDialog({
                            title: "Sucesso",
                            text: "Seu produto foi adicionado com sucesso e passará por um processo de avaliação. Ele estará disponível no estoque após a conclusão dessa etapa. Agradecemos pela sua compreensão.",
                            visible: true,
                            color: colors.success,
                            confirm: () => navigation.navigate("Market"),
                        })
                    } else {
                        setDialog({
                            title: "Ups!",
                            text: "Não foi possível adicionar este produto, tente novamente mais tarde.",
                            visible: true,
                            color: colors.error,
                        })
                    }
                })
                .catch(err => console.log(err))
            }else{
                api.put(`/product/${editData.id}`, form, {
                    headers: {
                        'Content-Type':'multipart/form-data',
                    }
                })
                .then(resp => {
                    let data = resp.data
                    console.log(data)
                    if (data.message === "sucesso") {
                        setDialog({
                            title: "Sucesso",
                            text: "As informações do seu produto foram atualizadas com sucesso e passarão por um processo de avaliação. As novas informações estarão disponíveis no estoque após a conclusão desta etapa.",
                            visible: true,
                            color: colors.success,
                            confirm: () => navigation.navigate("Market"),
                        })
                    } else {
                        setDialog({
                            title: "Ups!",
                            text: "Não foi possível actualizar este produto, tente novamente mais tarde.",
                            visible: true,
                            color: colors.error,
                        })
                    }
                })
                .catch(err => console.log(err))
            }
        }
    }

    const formInfos = [
        {
            title: "Informações Básicas",
        },
        {
            title: "Detalhes Físicos"
        },
        {
            title: "Informações Adicionais"
        },
        {
            title: "Observações"
        }
    ]

    const removeStep = () => {
        let value = steps - 1;
        setSteps(value)
    }

    const addStep = () => {
        let value = steps + 1;
        setSteps(value)
    }

    const pickImage = async data => {
        // Solicita permissão para acessar a biblioteca de mídia

        // Abre a biblioteca de mídia para selecionar uma imagem
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 4],
          quality: 1,
        });
    
        if (!result.canceled) {
          if(data.type === "avatar"){
            setAvatar(result.assets[0].uri);
          }else{
            if(data.avatar){
                const updatePhotoList = [...photoList]

                updatePhotoList[data.index] = result.assets[0].uri;

                setPhotoList(updatePhotoList)
                
            }else{
                setPhotoList([...photoList, result.assets[0].uri])
            }
            console.log(photoList)
          }
        }
    };

    const loadEditMode = () => {
        navigation.setOptions({
            title: "Editar Produto"
        })
        
       // alert(editData.stock)
        setSelectedCategory(editData.categoryId)
        setSelectedCondition(editData.condition)
        
    }

    const showHeader = (state) => {
        navigation.setOptions({
            headerShown: state
        })
    }

    const closePreview = () => {
        setPreviewImage(null)
        showHeader(true)
    }

    const updatePic = data => {
        pickImage(data)
        closePreview()
    }

    const removePic = data =>{
        if(data.type == "avatar"){
            setAvatar(null);
            if (photoList.length > 0) {
                // Define a primeira foto de photoList como o novo avatar
                setAvatar(photoList[0]);

                // Remove a primeira foto de photoList e atualiza o estado
                const updatedPhotoList = [...photoList];
                updatedPhotoList.splice(0, 1);
                setPhotoList(updatedPhotoList);
            }
        }else{
            const updatePhotoList = [...photoList]
            updatePhotoList.splice(data.index, 1)
            setPhotoList(updatePhotoList)
        }
        closePreview()
    }

    useEffect(() => {
        getCategory()
        if(isEdit){
            loadEditMode()
        }
        if(previewImage){
            showHeader(false)
        }
    }, [avatar, photoList, previewImage])

    if(previewImage){
        return(
            <View style = {styles.previewContainer}>
                <View>
                    <IconButton 
                        size={19} 
                        icon='close' 
                        mode='contained'
                        onPress={() => setPreviewImage(null)}
                    />
                </View>
               <View>
                    <Image style = {{width: "100%", height: "90%", objectFit: "contain"}} source={{uri: previewImage.avatar}}/>
               </View>
               <View style = {{position: "absolute", bottom: 10, display: "flex", flexDirection: "row", justifyContent: "space-between", gap: 5, padding: 10}}>
                    <Button 
                        onPress={() => updatePic(previewImage)}
                        mode='contained' 
                        style = {{width: "50%", backgroundColor: "white"}} 
                        icon={() =><Feather size={20}  name='refresh-ccw'/>}
                        textColor='black'
                    >Actualizar</Button>

                    <Button 
                        onPress={() => removePic(previewImage)}
                        mode='contained'  
                        style = {{width: "50%", backgroundColor: colors.error}} 
                        icon={() =><AntDesign size={20} color={"white"} name='closecircle'/>}
                        textColor='white' 
                    >Remover</Button>
               </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <Formik
                    initialValues={initialValues}
                    onSubmit={createProduct}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <Card mode='contained' style={{ marginTop: 20, backgroundColor: "transparent" }}>
                            <Card.Title
                                title={<Text variant='titleMedium'>{formInfos[steps].title}</Text>}
                                // subtitle={<Text variant='titleSmall'>{values.name}</Text>}
                            />
                            <Card.Content>
                                {steps === 0 && (
                                    <View>
                                        {(isEdit || avatar) &&(
                                            <View>
                                                <Text style = {{textAlign: "justify", color: "gray"}}>Para remover ou atualizar qualquer foto, inclusive a foto principal, toque na imagem desejada. A primeira foto na lista será considerada como a foto principal.</Text>
                                            </View>
                                        )}
                                        <ScrollView horizontal contentContainerStyle = {{paddingBottom: 10, paddingTop: 10}}>
                                            <View style = {{display: "flex", flexDirection: "row", gap: 10}}>
                                                <TouchableOpacity  onPress={() => setPreviewImage({avatar: avatar ? avatar : url+"/"+editData.avatar, type: "avatar", index: null})}>
                                                    {avatar && (
                                                        <Surface style={{ width: 70, height: 70, borderRadius: 5, backgroundColor: colors.card }}>
                                                            <Image 
                                                                style={{ width: "100%", height: "100%", objectFit: "fit", borderRadius: 5 }} 
                                                                source={{uri: avatar ? avatar : url+"/"+editData.avatar}} 
                                                            />
                                                        </Surface>
                                                    )}
                                                    {(isEdit && !avatar) &&(
                                                        <Surface style={{ width: 70, height: 70, borderRadius: 5, backgroundColor: colors.card }}>
                                                            <Image 
                                                                style={{ width: "100%", height: "100%", objectFit: "fit", borderRadius: 5 }} 
                                                                source={{uri: url+"/"+editData.avatar}} 
                                                            />
                                                        </Surface>
                                                    )}
                                                </TouchableOpacity>
                                                {photoList.length > 0 && photoList.map((photo, key) => (
                                                     <TouchableOpacity  key={key} onPress={() => setPreviewImage({index: key, avatar: photo, type: "other"})}>
                                                        <Surface style={{ width: 70, height: 70, borderRadius: 5, backgroundColor: colors.card }}>
                                                        <Image 
                                                            style={{ width: "100%", height: "100%", objectFit: "fit", borderRadius: 5 }} 
                                                            source={{uri: photo}} 
                                                        />
                                                    </Surface>
                                                     </TouchableOpacity>
                                                ))}
                                                {(!isEdit && !avatar) && (
                                                    <TouchableOpacity onPress={() => pickImage({type: "avatar"})}>
                                                        <Surface style={{...styles.addPhoto, backgroundColor: colors.card}}>
                                                            <MaterialIcons name="add-photo-alternate" size={30} color="black" />
                                                            <Text style = {{textAlign: "center"}}>Carregar Foto</Text>
                                                        </Surface>
                                                    </TouchableOpacity>
                                                )}
                                                {(isEdit || avatar) && (
                                                    <TouchableOpacity onPress={() => pickImage({type: "other"})}>
                                                        <Surface style={{...styles.addPhoto, backgroundColor: colors.card}}>
                                                            <AntDesign name="pluscircleo" size={24} color="gray" />
                                                        </Surface>
                                                    </TouchableOpacity>
                                                )}
                                                
                                            </View>
                                        </ScrollView>
                                        
                                        <Text style={{ marginBottom: 3 }}>Categoŕa</Text>
                                        <Surface style={{ borderRadius: 10, backgroundColor: "rgba(192, 192, 192, 0.5)" }} mode='flat'>
                                            <View style={styles.selectContainer}>
                                                <Picker
                                                    style={styles.picker}
                                                    itemStyle={styles.pickerItem}
                                                    selectedValue={selectedCategory}
                                                    onValueChange={(value, index) => {
                                                        setSelectedCategory(value)
                                                    }}
                                                >
                                                    {categories.map((data, key) => (
                                                        <Picker.Item key={key} value={data.id} label={data.name} />
                                                    ))}
                                                </Picker>
                                            </View>
                                        </Surface>
                                        <Text style={{ color: colors.text, marginBottom: 5 }}>Nome </Text>
                                        <Input
                                            left={<Feather name="tag" size={24} color={colors.text} />}
                                            value = {values.name}
                                            onChangeText={handleChange("name")}
                                            onBlur={handleBlur("name")}
                                            autoFocus={false}
                                        />
                                        <Text style={{ color: colors.text, marginBottom: 5 }}>Marca</Text>
                                        <Input
                                            left={<MaterialIcons name="branding-watermark" size={24} color={colors.text} />}
                                            value = {values.brand}
                                            onChangeText={handleChange("brand")}
                                            onBlur={handleBlur("brand")}
                                            autoFocus={false}
                                        />
                                        <Text style={{ color: colors.text, marginBottom: 5 }}>Preço (0.00)</Text>
                                        <Input
                                            left={<Text variant='titleSmall'>KZ</Text>}
                                            value = {values.price}
                                            onChangeText={handleChange("price")}
                                            onBlur={handleBlur("price")}
                                            keyboardType = "numeric"
                                            autoFocus={false}
                                        />
                                        <Text style={{ marginBottom: 3 }}>Condição</Text>
                                        <Surface style={{ borderRadius: 10, backgroundColor: "rgba(192, 192, 192, 0.5)" }} mode='flat'>
                                            <View style={styles.selectContainer}>
                                                <Picker
                                                    style={styles.picker} d
                                                    itemStyle={styles.pickerItem}
                                                    selectedValue={selectedCondition}
                                                    onValueChange={(value, index) => {
                                                        setSelectedCondition(value)
                                                    }}
                                                >
                                                    <Picker.Item value={"new"} label='Novo' />
                                                    <Picker.Item value={"used"} label='Usado' />
                                                </Picker>
                                            </View>
                                        </Surface>
                                    </View>
                                )}
                                {steps === 1 && (
                                    <View>
                                        <Text style={{ color: colors.text, marginBottom: 5 }}>Peso (kg)</Text>
                                        <Input
                                            left={<FontAwesome5 name='weight' size={24} color={colors.text} />}
                                            value = {values.weight}
                                            onChangeText={handleChange("weight")}
                                            onBlur={handleBlur("weight")}
                                            autoFocus={false}
                                        />
                                        <Text style={{ color: colors.text, marginBottom: 5 }}>Dimensões</Text>
                                        <Input
                                            left={<FontAwesome5 name='ruler-combined' size={24} color={colors.text} />}
                                            onChangeText={handleChange("dimensions")}
                                            value = {values.dimensions}
                                            onBlur={handleBlur("dimensions")}
                                            autoFocus={false}
                                        />
                                        <Text style={{ color: colors.text, marginBottom: 5 }}>Tamanho</Text>
                                        <Input
                                            left={<Ionicons name='resize' size={24} color={colors.text} />}
                                            value = {values.size}
                                            onChangeText={handleChange("size")}
                                            onBlur={handleBlur("size")}
                                            autoFocus={false}
                                        />
                                    </View>
                                )}
                                {steps === 2 && (
                                    <View>
                                        <Text style={{ color: colors.text, marginBottom: 5 }}>Palavras-Chave (Tags)</Text>
                                        <Input
                                            left={<AntDesign name='tags' size={24} color={colors.text} />}
                                            value = {values.tags}
                                            onChangeText={handleChange("tags")}
                                            onBlur={handleBlur("tags")}
                                            autoFocus={false}
                                        />
                                        <Text style={{ color: colors.text, marginBottom: 5 }}>Quantidade (Stock)</Text>
                                        <Input
                                            left={<AntDesign name='appstore1' size={24} color={colors.text} />}
                                            value = {values.stock}
                                            onChangeText={handleChange("stcok")}
                                            onBlur={handleBlur("stcok")}
                                            keyboardType = "numeric"
                                            autoFocus={false}
                                        />
                                        <Text style={{ color: colors.text, marginBottom: 5 }}>Código de Barras</Text>
                                        <Input
                                            left={<FontAwesome5 name='barcode' size={24} color={colors.text} />}
                                            value = {values.barcode}
                                            onChangeText={handleChange("barcode")}
                                            onBlur={handleBlur("barcode")}
                                            autoFocus={false}
                                        />
                                    </View>
                                )}
                                {steps === 3 && (
                                    <View>
                                        <TextInput
                                            label={"Descrição do Produto"}
                                            right={<AntDesign name='checkcircle' size={24} color={colors.text} />}
                                            value = {values.description}
                                            onChangeText={handleChange("description")}
                                            onBlur={handleBlur("description")}
                                            autoFocus={false}
                                            multiline={true}
                                            numberOfLines={4}
                                            style={{ marginTop: 10 }}
                                            mode='outlined'
                                        />
                                        <TextInput
                                            label={"Condições de Venda"}
                                            right={<AntDesign name='checkcircle' size={24} color={colors.text} />}
                                            value = {values.sales_conditions}
                                            onChangeText={handleChange("sales_conditions")}
                                            onBlur={handleBlur("sales_conditions")}
                                            autoFocus={false}
                                            multiline={true}
                                            numberOfLines={4}
                                            style={{ marginTop: 10 }}
                                            mode='outlined'
                                        />
                                    </View>
                                )}
                            </Card.Content>
                            <Card.Actions>
                                {steps > 0 && (
                                    <Button onPress={removeStep}>Anterior</Button>
                                )}
                                {(steps + 1) !== formInfos.length ? (
                                    <Button onPress={addStep}>Próximo</Button>
                                ) : (
                                    <Button onPress={handleSubmit}>Concluír</Button>
                                )}
                            </Card.Actions>
                        </Card>
                    )}
                </Formik>
            </ScrollView>

            <TockAlert value={dialog} onDismiss={() => { setDialog({ visible: false }); }} />

        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    containerCenter: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
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
    addPhoto: { 
        width: 80,
        height: 70,
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        borderRadius: 5 ,
    },
    previewContainer: {
        width: "100%",
        height: "100%",
        backgroundColor: "black",
        display: "flex",
    }
})

export default AddProducts;
