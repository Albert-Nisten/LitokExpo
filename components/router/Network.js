import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { Feather, MaterialCommunityIcons} from '@expo/vector-icons'

const Network = (props) => {

    const {colors} = useTheme()

    return (
        <View style = {{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Feather color={colors.text} size={35} name='wifi-off'/>
            <Text>Sem ligação com a internet</Text>
            <Button
                style = {{marginTop: 10}}
                icon={()=><MaterialCommunityIcons color={colors.text} size={24} name='reload'/>}
                onPress={props.event}
                mode='contained-tonal'
            >Tentar Novamente</Button>
        </View>
    );
}

const styles = StyleSheet.create({})

export default Network;
