import { useContext, useEffect, useState } from "react"
import { KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View, useWindowDimensions } from "react-native"
import { useTheme, Text, TextInput, Button as PaperButton} from "react-native-paper"
import { Formik } from "formik"
import Input from "../tockElements/Input"
import Button from "../tockElements/Button"
import { AntDesign, Entypo, Feather, FontAwesome5 } from "@expo/vector-icons"
import { api } from "../../config"
import TockAlert from "../tockElements/TockAlert"
import { Context } from "../Context"

const Register = ({navigation}) => {

    const {storeUser, user, isDesktop} = useContext(Context)

    const {colors} = useTheme()
    const [passVisible, setPassVisible] = useState(false);
    const [dialog, setDialog] = useState({})


    const handlePassVisible = () => {
        setPassVisible(!passVisible)
    }
    
    const signUp = values =>{
        console.log(values)
        api.post("/user", values)
        .then(resp => {
            console.log(resp.data)
            if(resp.data.message === "exist"){
                setDialog({
                    visible: true,
                    title: "Criação de conta mal sucedida.",
                    text: "Desculpe, não foi possível concluir seu cadastro. Por favor, verifique as informações fornecidas e tente novamente.",
                    button: "Entendi",
                })
            }else if(resp.data.message === "sucesso"){
                setDialog({
                    visible: true,
                    title: "Conta criada com sucesso!",
                    text: "Parabéns! Seu cadastro foi concluído com sucesso. Bem-vindo ao TockApp!",
                    button: "ok",
                    event: ()=>alert("going to validation")
                })
                storeUser(resp.data.user)
            }else if(resp.data.message === "erro"){
                setDialog({
                    visible: true,
                    title: "Ups!",
                    text: "Desculpe, ocorreu um erro inesperado. Nossa equipe já foi notificada e está trabalhando para resolver o problema. Por favor, tente novamente mais tarde.",
                    button: "ok",
                    event: ()=>alert("going to validation")
                })
            }
        })
        .catch(err =>{
            setDialog({
                visible: true,
                text: "Verifique a sua ligação com a internet",
                color: colors.error
            })
        })
    }

    const validate = values => {
        let errors = {}
        
        if(!values.name){
            errors.name = "Este campo é obrigatório";
        }else{
            let name = values.name.trim()

            if(!name.includes(' ')){
                errors.name = "Este campo deve conter pelo menos o primeiro 2 nomes.";
            }
        }

        if(!values.phone){
            errors.phone = "Este campo é obrigatório"
        }else{
            if(values.phone.length < 9){
                errors.phone = "Insere um número válido"
            }
        }

        if(values.email){
            const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            if(!regex.test(values.email)){
                errors.email = "O e-mail deve conter um formato válido, por exemplo: nome@dominio.com"
            }
        }
        
        if(values.password){
            let senha = values.password;
            const comprimentoMinimo = 6;
            const temLetrasMaiusculas = /[A-Z]/.test(senha);
            const temLetrasMinusculas = /[a-z]/.test(senha);
            const temNumeros = /[0-9]/.test(senha);
            const temCaracteresEspeciais = /[!@#$%^&*()_+{}\[\]|:;<>,.?~]/.test(senha);
            
            if (
                senha.length >= comprimentoMinimo &&
                temLetrasMaiusculas &&
                temLetrasMinusculas &&
                temNumeros &&
                temCaracteresEspeciais
              ) {
                // 'A senha é forte.';
              } else {
                // A senha é considerada fraca
                let sugestao = 'A senha é fraca. Tente o seguinte formato: ';
            
                if (senha.length < comprimentoMinimo) {
                  sugestao += 'ter pelo menos ' + comprimentoMinimo + ' caracteres, ';
                }
            
                if (!temLetrasMaiusculas) {
                  sugestao += 'incluir pelo menos uma letra maiúscula, ';
                }
            
                if (!temLetrasMinusculas) {
                  sugestao += 'incluir pelo menos uma letra minúscula, ';
                }
            
                if (!temNumeros) {
                  sugestao += 'incluir pelo menos um número, ';
                }
            
                if (!temCaracteresEspeciais) {
                  sugestao +=
                    'incluir pelo menos um caractere especial (por exemplo, !@#$%^&*()), ';
                }
            
                sugestao = sugestao.slice(0, -2); // Remova a vírgula e o espaço no final
                errors.password = sugestao;
              }
        }else{
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
        <View style = {{...styles.container}}>
           
            <Formik
                initialValues={{
                    name: "",
                    phone: "",
                    email: "", 
                    password: ""
                }}
                validate={validate}
                onSubmit = {signUp}
            >
                {({handleChange, handleBlur, handleSubmit, values, errors, touched})=>(
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "height": "height"}
                        style = {{flex: 1}}
                    >
                        
                        <View style = {{width: "100%", height: "100%", display: "flex", justifyContent:"center"}}>
                            <View style = {!isDesktop ? styles.box : styles.desktopBox}>
                                <View style = {styles.header}>
                                    <Text variant='displaySmall'>Criar conta</Text>
                                    <Text>Olá! Bem-vindo</Text>
                                </View>
                                <Text style = {{color: colors.text, marginBottom: 5}}>Nome Completo</Text>
                                <Input
                                    left={<AntDesign size = {24} name = 'user'/>}
                                    placeholder = "Nome"
                                    onChangeText = {handleChange("name")}
                                    onBlur = {handleBlur("name")}/>
                                {touched.name && errors.name && (
                                    <Text style={styles.textError}>{errors.name}</Text>
                                )}

                                <Text style = {{color: colors.text, marginTop: 5, marginBottom: 5}}>Telefone</Text>
                                 <Input
                                    left={<AntDesign size = {24} name = 'phone'/>}
                                    placeholder = "+244"
                                    keyboardType = 'numeric'   
                                    onChangeText = {handleChange("phone")}
                                    onBlur = {handleBlur("phone")}/>
                                {touched.phone && errors.phone && (
                                    <Text style={styles.textError}>{errors.phone}</Text>
                                )}

                                <Text style = {{color: colors.text, marginTop: 5, marginBottom: 5}}>E-mail (Opcional)</Text>
                                 <Input
                                    left={<Entypo size = {24} name = 'email'/>}
                                    placeholder = "exemplo@dominio.com"
                                    onChangeText = {handleChange("email")}
                                    onBlur = {handleBlur("email")}/>
                                {touched.email && errors.email && (
                                    <Text style={styles.textError}>{errors.email}</Text>
                                )}

                                <Text style = {{color: colors.text, marginTop: 5, marginBottom: 5}}>Palavra-Passe</Text>
                                <Input
                                    left={<AntDesign size = {24} name = 'lock'/>}
                                    placeholder = " Senha de Segurança"
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
                                
                                
                                <View style = {styles.footer}>
                                    <PaperButton 
                                        onPress={()=>navigation.goBack()}
                                        mode='outlined'>Voltar</PaperButton>
                                    <PaperButton 
                                        onPress={handleSubmit}
                                        mode='contained'>Criar Conta</PaperButton>
                                </View>
                            </View>

                        </View>
                    </KeyboardAvoidingView>
                )}
            </Formik>
            <TockAlert value = {dialog} onDismiss ={()=>{setDialog({visible: false})}}/>

        </View>
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
        width: "80%",
        marginLeft: "10%"
    },
    textError:{
        color: "#770303",
    },
    footer:{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        marginTop: 10
    }
})

export default Register