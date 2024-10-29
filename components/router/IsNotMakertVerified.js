import React from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { TockStyles } from '../tockElements/TockStyles';
import { Entypo, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const IsNotMarketVerified = (props) => {
    const {width} = useWindowDimensions();
    const isDesktop = width >= 768;
    const navigation = useNavigation();
    const {colors} = useTheme()

    return (
        <View style = {TockStyles.containerCenter}>
           <View style = {{
                    width: isDesktop ? "50%":"100%", 
                    marginLeft: isDesktop ? "25%": null,
                    ...styles.container
            }}>
                <View style = {styles.iconContainer}>
                    <Feather color={colors.error} size={70} name = "check-circle" />
                </View>

                <Text variant='titleMedium' style = {{...styles.text, color: colors.text}}>
                    Processo de Verificação
                </Text>

                <Text style = {{...styles.text, textAlign: "justify"}}>
                    Sua loja <Text variant='titleSmall'>{props.market.name}</Text> foi criada com sucesso e está em fase de verificação. Durante este processo, avaliamos a conformidade com nossas políticas e diretrizes de segurança. O acesso à sua loja será liberado assim que a verificação for concluída.
                </Text>

                <Text style = {{...styles.text, textAlign: "justify"}}>
                    Caso algum ajuste seja necessário ou se identificarmos alguma incompatibilidade com nossas políticas, nossa equipe entrará em contato com você. Em situações onde não seja possível cumprir com os requisitos estabelecidos, a loja poderá ser desativada.
                </Text>

                <Text style = {{...styles.text, textAlign: "justify"}}>
                    Agradecemos pela sua compreensão e paciência. Se precisar de mais informações, entre em contato com nossa equipe de suporte.
                </Text>

                <Button 
                    style = {TockStyles.materialButton} 
                    mode='outlined'
                    onPress={()=>navigation.navigate("MainTabs")}
                    >Entendi</Button>
           </View>
        </View>
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

export default IsNotMarketVerified;
