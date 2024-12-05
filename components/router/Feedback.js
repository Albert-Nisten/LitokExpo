import { Feather, FontAwesome6 } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

const Feedback = ({visible, icon, title, text, event}) => {

    const { colors } = useTheme()

    return (
        <SafeAreaView style={{ flex: 1}}>
            <ScrollView contentContainerStyle={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <View style={{ justifyContent: "center", alignItems: "center", paddingHorizontal: 20 }}>
                    {
                        icon === "success" ?
                            <Feather color = {colors.success} size={70} name='check-circle' /> :
                            <FontAwesome6 color = {colors.error} name="times-circle" size={70} />
                    }
                    <Text style={{ color: colors.text, textAlign: 'center', marginTop: 20 }} variant='titleLarge'>{title}</Text>
                    <Text style={{ color: colors.text, textAlign: 'center', color: "gray" }}>{text}</Text>
                </View>
            </ScrollView>
            <View style={{ justifyContent: 'flex-end', padding: 20 }}>
               <Button onPress={event} mode='contained'>Entendi</Button>
            </View>
      </SafeAreaView>
      
    );
}


export default Feedback;
