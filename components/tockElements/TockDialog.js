import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

const TockDialog = ({value, onDismiss}) => {


    return (
       <Portal>
            <Dialog visible = {value.visible} onDismiss={onDismiss}>
                <Dialog.Title>{value.title}</Dialog.Title>
                <Dialog.Content>
                    <Text>{value.text}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onDismiss}>Cancelar</Button>
                    <Button buttonColor={value.color} onPress = {value.confirm} mode='contained'>Confirmar</Button>
                </Dialog.Actions>
            </Dialog>
       </Portal>
    );
}

const styles = StyleSheet.create({})

export default TockDialog;
