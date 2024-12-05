import { AntDesign, Feather, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, useWindowDimensions, ScrollView, SafeAreaView, Image, TouchableOpacity, TextInput as NativeInput, StatusBar } from 'react-native';
import { Button, Card, FAB, IconButton, Surface, Text, TextInput, useTheme } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker'
import TockAlert from '../tockElements/TockAlert';
import { api, url } from '../../config';
import Input from '../tockElements/Input';
import * as ImagePicker from 'expo-image-picker'
import { Context } from '../Context';
import Markdown from 'react-native-markdown-display';
import Feedback from '../router/Feedback';
import Loading from '../router/Loading'

const AddProducts = ({navigation, route}) => {

    const {isEdit, data: editData} = route.params

    const { width } = useWindowDimensions();
    const isDesktop = width >= 768
    const initialValues = isEdit ? editData : {}
    // const [model, setModel] = useState()
    const [isLoading, setIsloading] = useState(false)
    const [dialog, setDialog] = useState({})
    const [steps, setSteps] = useState(0)
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [selectedCondition, setSelectedCondition] = useState("new")
    const [avatar, setAvatar] = useState(null)
    const [photoList, setPhotoList] = useState([])
    const [previewImage, setPreviewImage] = useState()
    const [formatedPrice, setFormatedPrice] = useState('')

    const imageSource = avatar ? avatar : (isEdit ? url + "/" + editData.avatar : null);
    const [showFeedback, setShowFeedback] = useState({})

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
            .catch(err => {
                console.log(err.message)
                setDialog({
                    icon: "error",
                    title: "Ups!",
                    text: err.message,
                    visible: true,
                    color: colors.error,
                    confirm: () => navigation.navigate("Market")
                })
            })
    }

    const validate = (values) => {
        const errors = {};
        
        // Validação para o passo 1
       
        if(steps === 1){
            if (!values.name) {
                errors.name = 'Digite o nome do produto.';
            }
    
            if (!values.brand) {
                errors.brand = 'Por favor, insira a marca deste produto.';
            }
    
            if (!values.price || values.price === 0) {
                errors.price = 'Informe o preço do produto em número inteiro.';
            }
        }

        if(steps === 4){
            if (!values.description) {
                errors.description = 'Descrição é um campo obrigatório.';
            }
        }

        if(steps === 6){
            if (!values.sales_conditions) {
                errors.sales_conditions = 'As Condições de Venda são obrigatórias. .';
            }
        }

        console.log(errors)
        return errors
    }

    const removeStep = () => {
        setSteps((prevStep) => prevStep - 1);

    }

    const handleNextStep = values => {
        // Se não houver erros, avance para a próxima etapa
        if((steps+1) === formInfos.length){
            createProduct(values)
            console.log(values)
        }else{
            setSteps((prevStep) => prevStep + 1);
        }
    }

    const createProduct = values => {
        setIsloading(true)
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
                    setIsloading(false)
                    if (data.message === "sucesso") {
                        setShowFeedback({
                            icon: "success",
                            title: "Sucesso",
                            text: "Seu produto foi adicionado com sucesso e passará por um processo de avaliação. Ele estará disponível no estoque após a conclusão dessa etapa. Agradecemos pela sua compreensão.",
                            visible: true,
                            color: colors.success,
                            event: () => navigation.navigate("Market"),
                        })
                    } else {
                        setShowFeedback({
                            icon: "error",
                            title: "Ups!",
                            text: "Não foi possível adicionar este produto, tente novamente mais tarde.",
                            visible: true,
                            color: colors.error,
                            event: () => {setSteps(1); setShowFeedback({visible: false})}
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                    setIsloading(false)
                    setShowFeedback({
                        icon: "error",
                        title: "Ups!",
                        text: err.message,
                        visible: true,
                        color: colors.error,
                        event: () => {setSteps(0), setShowFeedback({visible: false})}
                    })
                })
            }else{
                api.put(`/product/${editData.id}`, form, {
                    headers: {
                        'Content-Type':'multipart/form-data',
                    }
                })
                .then(resp => {
                    let data = resp.data
                    console.log(data)
                    setIsloading(false)
                    if (data.message === "sucesso") {
                        setShowFeedback({
                            icon: "success",
                            title: "Sucesso",
                            text: "As informações do seu produto foram atualizadas com sucesso e passarão por um processo de avaliação. As novas informações estarão disponíveis no estoque após a conclusão desta etapa.",
                            visible: true,
                            color: colors.success,
                            event: () => navigation.navigate("Market"),
                        })
                    } else {
                        setShowFeedback({
                            icon: "error",
                            title: "Ups!",
                            text: "Não foi possível actualizar este produto, tente novamente mais tarde.",
                            visible: true,
                            color: colors.error,
                            event: () => {setSteps(0); setShowFeedback({visible: false})}

                        })
                    }
                })
                .catch(err => {
                    //on update or PUT reqiuest
                    console.log(err)
                    setIsloading(false)
                    setShowFeedback({
                        icon: "error",
                        title: "Ups!",
                        text: err.message,
                        visible: true,
                        color: colors.error,
                        event: () => {setSteps(0); setShowFeedback({visible: false})}

                    })
                })
            }
        }
    }

    const formInfos = [
        {
            title: "Imagens do Produto",
        },
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
            title: "Descrição",
            subtitle: (
                <Text style={{ fontSize: 13, textAlign: 'justify', color: "gray" }}>
                    Aqui, você pode incluir qualquer informação relevante que não tenha sido solicitada nas etapas anteriores.
                    {'\n'}
                    <Text style={{ fontWeight: 'bold' }}>Dicas de formatação:</Text>
                    {'\n\n'}
                    
                    <Text style = {{fontWeight: "bold"}}>Negrito</Text>: <Text>  **texto**</Text>
                    {'\n'}
                    <Text style = {{fontWeight: "bold"}}>Itálico</Text>: <Text style={{ fontStyle: 'italic' }}>  *texto*</Text>
                    {'\n'}
                    <Text style = {{fontWeight: "bold"}}>Listas</Text>: <Text style={{  }}>  - item</Text> ou <Text style={{  }}>1. item</Text>
                    {'\n'}
                    <Text style = {{fontWeight: "bold"}}>Links</Text>: <Text style={{ }}> [texto](http://exemplo.com)</Text>
                </Text>
            )
        },
        {
            title: "Rever Descrição",
            subtitle: <Text style = {{color: "gray"}}>Antes de continuar, por favor, revise a descrição do produto para garantir que todas as informações estão corretas e completas.</Text>
        },
        {
            title: "Condições de Venda",
            subtitle: (
                <Text style={{ fontSize: 13, textAlign: 'justify', color: "gray" }}>
                    Informe aqui as regras para a venda do produto e políticas de devolução.
                    
                    {'\n'}
                    <Text style={{ fontWeight: 'bold' }}>Dicas de formatação:</Text>
                    {'\n\n'}
                    
                    <Text style = {{fontWeight: "bold"}}>Negrito</Text>: <Text>  **texto**</Text>
                    {'\n'}
                    <Text style = {{fontWeight: "bold"}}>Itálico</Text>: <Text style={{ fontStyle: 'italic' }}>  *texto*</Text>
                    {'\n'}
                    <Text style = {{fontWeight: "bold"}}>Listas</Text>: <Text style={{  }}>  - item</Text> ou <Text style={{  }}>1. item</Text>
                    {'\n'}
                    <Text style = {{fontWeight: "bold"}}>Links</Text>: <Text style={{ }}> [texto](http://exemplo.com)</Text>
                </Text>
            )
        },
        {
            title: "Rever Condições de Venda",
            subtitle: <Text style = {{color: "gray"}}>Antes de finalizar, verifique as condições de venda para garantir que você incluiu todas as informações necessárias.</Text>
        }
    ]

    const pickImage = async data => {
        // Solicita permissão para acessar a biblioteca de mídia

        // Abre a biblioteca de mídia para selecionar uma imagem
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          // aspect: [4, 4],
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

    const handleFormatPrice = (numberString) => {
        // Remove caracteres que não são dígitos
        const cleanedString = numberString.replace(/\D/g, '');
        if (!cleanedString) {
            setFormatedPrice(''); // Limpa o campo quando não há entrada
            return;
        }
    
        // Converte para número e formata como moeda
        const number = parseFloat(cleanedString) / 100;
        const finalNumber = number.toLocaleString('pt-BR', {
            style: 'decimal',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    
        setFormatedPrice(finalNumber);
    };

    useEffect(() => {
        getCategory()
        if(isEdit){
            loadEditMode()
        }
        if(previewImage){
            showHeader(false)
        }
    }, [avatar, photoList, previewImage])

    if(isLoading){
        return <Loading/>
    }

    if(previewImage){
        return(
            <View style = {styles.previewContainer}>
                <StatusBar backgroundColor={colors.text} barStyle="light-content"/>
                <View>
                    <IconButton 
                        size={30} 
                        icon='close' 
                        iconColor='white'
                        containerColor={colors.primary}
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
                    >Mudar Imagem</Button>

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

    if(showFeedback.visible){
        return <Feedback 
                    icon = {showFeedback.icon}
                    title = {showFeedback.title} 
                    text = {showFeedback.text}
                    event= {showFeedback.event}
                />
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <Formik
                    initialValues={initialValues}
                    // onSubmit={createProduct}
                    validate={validate}
                    onSubmit={handleNextStep}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue, touched }) => (
                        <Card mode='contained' style={{ flex: 1, marginTop: 20, backgroundColor: "transparent" }}>
                            <Card.Title
                                title={<Text style = {{color: colors.primary}} variant='titleMedium'>{formInfos[steps].title}</Text>}
                                subtitle={
                                    formInfos[steps].subtitle ? formInfos[steps].subtitle : <Text style={{ fontWeight: "bold", color: "gray" }} variant='titleSmall'>{values.name}</Text>
                                }
                                subtitleNumberOfLines={20}
                            />
                            <Card.Content style = {{flex: 1}}>
                                {steps === 0 && (
                                    <View>

                                        <View style = {{ width: "100%", height: 230, backgroundColor: "#f2f2f2", borderRadius: 10}}>
                                            {(!isEdit && !avatar) && (
                                                <TouchableOpacity 
                                                    style = {{width: "100%", height: "100%", display: "flex", justifyContent: "center", padding: 10, alignItems: "center",}} 
                                                    onPress={() => pickImage({type: "avatar"})}
                                                >
                                                   <IconButton 
                                                        mode='contained'
                                                        size={40}
                                                        containerColor={colors.onPrimary}
                                                        icon={() => <AntDesign name="upload" size={24} color="black" />}
                                                    />
                                                    <Text style = {{fontWeight: "bold", marginTop: 5}}>Clique para fazer upload da imagem</Text>
                                                    <Text style = {{textAlign: "center", color: "gray"}}>esta imagem será exibida como destaque para o produto</Text>
                                                </TouchableOpacity>
                                            )}

                                            {imageSource && (
                                                <Image 
                                                    style={{ width: "100%", height: "100%", borderRadius: 5 }} 
                                                    source={{ uri: imageSource }} 
                                                    resizeMode="contain"
                                                />
                                            )}
                                            
                                        </View>

                                        {(isEdit || avatar) &&(
                                            <View style = {{marginTop: 5}}>
                                                <Text style = {{textAlign: "justify", color: "gray",  fontSize: 12}}>Para remover ou atualizar uma foto, toque na imagem. A primeira da lista será considerada a principal.</Text>
                                            </View>
                                        )}

                                        <ScrollView horizontal contentContainerStyle = {{padding: 10, paddingTop: 0,  paddingLeft: 1}}>
                                            <View style = {{display: "flex", flexDirection: "row", gap: 10}}>
                                                <TouchableOpacity  onPress={() => setPreviewImage({avatar: avatar ? avatar : url+"/"+editData.avatar, type: "avatar", index: null})}>
                                                    {imageSource && (
                                                        <Surface style={{ width: 70, height: 70, borderRadius: 5, backgroundColor: colors.card }}>
                                                            <Image 
                                                                style={{ width: "100%", height: "100%", borderRadius: 5 }} 
                                                                source={{ uri: imageSource }} 
                                                                resizeMode="cover" // Use 'cover' se desejar que a imagem preencha o espaço
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
                                                
                                                
                                                {(isEdit || avatar) && (
                                                    <FAB
                                                        icon={() => <AntDesign name="pluscircleo" size={24} color={colors.primary} />}
                                                        style = {{...styles.addPhoto, backgroundColor: colors.onPrimary, borderColor: colors.primary, borderWidth: 1}}
                                                        mode='flat'
                                                        onPress={() => pickImage({type: "other"})}
                                                    />
                                                )}
                                            </View>
                                        </ScrollView>
                                    </View>
                                )}

                                 {steps === 1 && (
                                    <View>
                                    
                                       
                                        
                                        <Text style={{ color: colors.text, marginBottom: 5 }}>Nome <Text style = {{color: colors.error}}>*</Text></Text>
                                        <Input
                                            left={<Feather name="tag" size={24} color={colors.text} />}
                                            value = {values.name}
                                            onChangeText={handleChange("name")}
                                            onBlur={handleBlur("name")}
                                            autoFocus={false}
                                        />
                                        {errors.name && (
                                            <Text style={{color: colors.error}}>{errors.name}</Text>
                                        )}

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

                                        <Text style={{ color: colors.text, marginBottom: 5 }}>Marca <Text style = {{color: colors.error}}>*</Text></Text>
                                        <Input
                                            left={<MaterialIcons name="branding-watermark" size={24} color={colors.text} />}
                                            value = {values.brand}
                                            onChangeText={handleChange("brand")}
                                            onBlur={handleBlur("brand")}
                                            autoFocus={false}
                                        />
                                        {errors.brand && (
                                            <Text style={{color: colors.error}}>{errors.brand}</Text>
                                        )}

                                        <Text style={{ color: colors.text, marginBottom: 5 }}>Preço <Text style = {{color: colors.error}}>*</Text></Text>
                                        <Input
                                            left={<Text variant='titleSmall'>KZ</Text>}
                                            value={formatedPrice}
                                            onChangeText={e => {
                                                const cleanedString = e.replace(/\D/g, ''); // Limpa a entrada
                                                handleFormatPrice(cleanedString); // Formata para visualização
                                                
                                                const numberForFormik = Number(cleanedString) / 100; // Converte para número
                                                setFieldValue("price", numberForFormik.toString()); // Atualiza o Formik
                                            }}
                                            onBlur={handleBlur("price")}
                                            keyboardType="numeric"
                                            autoFocus={false}
                                        />

                                        {errors.price && (
                                            <Text style={{color: colors.error}}>{errors.price}</Text>
                                        )}

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
                                {steps === 2 && (
                                    <View>
                                        <Text style={{ color: colors.text, marginBottom: 5 }}>Peso (kg)</Text>
                                        <Input
                                            left={<FontAwesome5 name='weight' size={24} color={colors.text} />}
                                            value = {values.weight}
                                            onChangeText={handleChange("weight")}
                                            onBlur={handleBlur("weight")}
                                            autoFocus={false}
                                            keyboardType = "numeric"
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
                                {steps === 3 && (
                                    <View>
                                        <Text style={{ color: colors.text, marginBottom: 5 }}>Tags para Busca</Text>
                                        <Input
                                            left={<AntDesign name='tags' size={24} color={colors.text} />}
                                            value = {values.tags}
                                            onChangeText={handleChange("tags")}
                                            onBlur={handleBlur("tags")}
                                            placeholder = "exempo, exemplo_tag"
                                            autoFocus={false}
                                        />
                                        <Text style={{ color: colors.text, marginBottom: 5 }}>Quantidade em Stock</Text>
                                        <Input
                                            left={<AntDesign name='appstore1' size={24} color={colors.text} />}
                                            value = {values.stock}
                                            onChangeText={handleChange("stock")}
                                            onBlur={handleBlur("stock")}
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


                                {errors.description && (
                                    <Text style={{color: colors.error}}>{errors.description}</Text>
                                )}
                                {steps === 4 && (
                                    <View>
                                        <TextInput
                                            placeholder={"Escrever Descrição"}
                                            value = {values.description}
                                            onChangeText={handleChange("description")}
                                            onBlur={handleBlur("description")}
                                            autoFocus={false}
                                            multiline={true}
                                            numberOfLines={12}
                                            mode='outlined'
                                            style = {{marginTop: 10}}
                                        />
                                    </View>
                                )}

                                {steps === 5 && (
                                    <View>
                                        <Markdown>{values.description || ""}</Markdown>
                                    </View>
                                )}

                                {errors.sales_conditions && (
                                    <Text style={{color: colors.error}}>{errors.sales_conditions}</Text>
                                )}

                                {steps === 6 && (
                                    <View>
                                        <TextInput
                                            placeholder={"Escrver Condições de Venda"}
                                            right={<AntDesign name='checkcircle' size={24} color={colors.text} />}
                                            value = {values.sales_conditions}
                                            onChangeText={handleChange("sales_conditions")}
                                            onBlur={handleBlur("sales_conditions")}
                                            autoFocus={false}
                                            multiline={true}
                                            numberOfLines={12}
                                            style={{ marginTop: 10 }}
                                            mode='outlined'
                                        />
                                    </View>
                                )}

                                {steps === 7 && (
                                    <View>
                                         <Markdown>{values.sales_conditions || ""}</Markdown>
                                    </View>
                                )}

                            </Card.Content>
                            <Card.Actions>
                                {steps > 0 && (
                                    <Button  style = {{width: "50%"}} mode='text' onPress={removeStep}>Anterior</Button>
                                )}
                                {(steps > 0) && (steps + 1 !== formInfos.length) && (
                                    <Button style = {{width: "50%"}} mode = "outlined" onPress={handleSubmit}>Próximo</Button>
                                )}
                                {(steps+1) === formInfos.length &&( 
                                    <Button onPress={handleSubmit}>Concluír</Button>
                                )}
                            </Card.Actions>
                        </Card>
                    )}
                </Formik>
            </ScrollView>
            {/* Adicione o botão como footer */}
            {steps === 0 && (
                <View style={{ position: 'absolute', bottom: 20, left: 0, right: 0, alignItems: 'center', padding: 10 }}>
                    <Button  
                        style = {{width: "100%"}} 
                        mode='contained'
                        disabled={!imageSource}
                        onPress={handleNextStep}
                    >Informações Adicionais</Button>
                </View>
            )}
            <TockAlert value={dialog}  onDismiss={() => { setDialog({ visible: false }); }} />

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
