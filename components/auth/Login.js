import { useContext, useEffect, useState } from "react"
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View, useWindowDimensions } from "react-native"
import { useTheme, Text, Button as PaperButton} from "react-native-paper"
import TockAlert from "../tockElements/TockAlert"
import { Formik } from "formik"
import Input from "../tockElements/Input"
import Button from "../tockElements/Button"
import { AntDesign, Feather } from "@expo/vector-icons"
import SocialIconButton from "../tockElements/SocialIconButton"
import { TockStyles } from "../tockElements/TockStyles"
import { Context } from "../Context"
import { api } from "../../config"

const Login = ({navigation}) => {
    const {width} = useWindowDimensions()
    const isDesktop = width >= 768
    const {storeUser, user} = useContext(Context)
    
    const {colors} = useTheme()
    const [passVisible, setPassVisible] = useState(false);
    const [dialog, setDialog] = useState({})

    const handlePassVisible = () => {
        setPassVisible(!passVisible)
    }
    
    const localLogin = values =>{
        api.post("/auth", values)
        .then(resp => {
            if(resp.data.message === "not_found"){
                setDialog({
                    visible: true,
                    text: "Email ou Palavra-Passe errada",
                    color: colors.error
                })
            }else if(resp.data.message === "sucesso"){
                storeUser(resp.data.user)
                console.log(resp.data.user)
               
            }else if(resp.data.message === "erro"){
                setDialog({
                    visible: true,
                    text: "Desculpe, ocorreu um erro inesperado. Nossa equipe já foi notificada e está trabalhando para resolver o problema. Por favor, tente novamente mais tarde.",
                    color: colors.error
                })
            }
        })
        .catch(err => {
            console.log(err)
            
            setDialog({
                visible: true,
                text: "Verifique a sua ligação com a internet",
                color: colors.error
            })
        })
    }

    const validate = values => {
        let errors = {}
        if(!values.email){
            errors.email = "Este campo é obrigatório"
        }
        if(!values.password){
            errors.password = "Este campo é obrigatório"
        }
        return errors
    }

    useEffect(()=>{
        if(user){
            navigation.navigate("MainTabs")
        }
    }, [user])

    return(
            <Formik
                initialValues={{email: "", password: ""}}
                validate={validate}
                onSubmit = {localLogin}
            >
                {({handleChange, handleBlur, handleSubmit, values, errors, touched})=>(
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding": "height"}
                        style = {{flex: 1}}
                    >
                        <ScrollView contentContainerStyle = {{width:"100%", height: "100%"}}>
                            <View style = {{...TockStyles.containerCenter}}>
                                <View style = {!isDesktop ? styles.box: styles.desktopBox}>
                                    <View style = {styles.header}>
                                        <Text variant='displaySmall'>Login</Text>
                                        <Text>Olá! Bem-vindo de Volta</Text>
                                    </View>
                                    <Text style = {{color: colors.text, marginBottom: 5}}>Email ou Telefone</Text>
                                    <Input
                                        left={<AntDesign size = {24} name = 'phone'/>}
                                        placeholder = "Email ou Telefone"
                                        onChangeText = {handleChange("email")}
                                        onBlur = {handleBlur("email")}/>
                                    {touched.email && errors.email && (
                                        <Text style={styles.textError}>{errors.email}</Text>
                                    )}
                                    <Text style = {{color: colors.text, marginTop: 5, marginBottom: 5}}>Palavra-Passe</Text>
                                    <Input
                                        left={<AntDesign size = {24} name = 'lock'/>}
                                        placeholder = "Palavra-Passe"
                                        onChangeText = {handleChange("password")}   
                                        onBlur = {handleBlur("password")}
                                        secureTextEntry = {!passVisible}
                                        right={
                                            <TouchableOpacity onPress={handlePassVisible}>
                                                <Feather size={24} name ={!passVisible ? "eye":"eye-off"}/>
                                            </TouchableOpacity>
                                        }/>
                                    {touched.password && errors.password && (
                                        <Text style={styles.textError}>{errors.password}</Text>
                                    )}
                                    
                                    <Button 
                                        onPress = {handleSubmit}
                                        style = {{marginTop: 10}}
                                        title = "Iniciar Sessão"/>
                                    
                                    <View style = {{display: "flex", flexDirection: "row", justifyContent: "space-between", gap: 2}}>
                                        <SocialIconButton
                                            icon = {<Image style = {{width: 24, height: 24}} source={require("../dist/img/icons/google.png")} />}
                                            style = {{...styles.socialButton, width: "50%"}}>Google</SocialIconButton>
                                    
                                        <SocialIconButton
                                            icon = {<Image style = {{width: 24, height: 24}} source={require("../dist/img/icons/facebook.png")} />}
                                            style ={{width: "50%", ...styles.socialButton}}>Facebook</SocialIconButton>
                                    </View>
                                
                                    <View style = {styles.footer}>
                                        <Text style = {{color: "gray"}}>Não tem uma conta?</Text>
                                        <PaperButton textColor={colors.blue} onPress={()=>navigation.navigate("Register")}>Criar Conta</PaperButton>
                                    </View>

            
                                </View>
                            </View>
                        </ScrollView>
                        <TockAlert value = {dialog} onDismiss ={()=>{setDialog({visible: false})}}/>
                    </KeyboardAvoidingView>
                )}
            </Formik>
    )
}

const styles = StyleSheet.create({
    header:{
        marginBottom: 50
    },
    container:{
        width: "100%",
        height: "100%",
        padding: 10
    },
    box:{
        padding: 10,
        borderRadius: 5
    },
    desktopBox: {
        width: "40%",
        marginLeft: "30%"
    },
    textError:{
        color: "red",
    },
    footer:{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10
    },
    socialButton:{
        marginTop: 5
    }
})

export default Login