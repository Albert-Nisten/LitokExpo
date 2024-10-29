import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Avatar, Card, DataTable, Text, TextInput, useTheme } from 'react-native-paper';
import { api, url } from '../../config';

const DashUsers = () => {

    const [users, setUsers] = useState([])

    const {colors} = useTheme()

    const readLevel = level => {
        let result 
        switch (level) {
            case "sailor":
                result = "Vendedor"
                break;
            case "customer":
                result = "Comprador"
                break;
            default:
                break;
        }
        return result
    }

    const getUsers = () => {
        api.get(`/user`)
        .then(resp => {
            let data = resp.data;
            if(data.message === "sucesso"){
                setUsers(data.users)
            }
            console.log(data)
        })
        .catch(err => console.log(err.message))
    }

    useState(() => {
        getUsers()
    }, [])

    return (
        <View style = {styles.container}>
            <Text variant='titleMedium' style = {{marginBottom: 20}}>Utilizadores ({users.length}) </Text>
            <Card style = {{backgroundColor: colors.card}} elevation={0}>
                <Card.Title
                    right={() => (
                        <View >
                             <TextInput 
                                mode='outlined'
                                dense
                                style = {{height: 40, marginRight: 10}}
                            />
                        </View>
                    )}
                />
                <Card.Content>
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title>FOTO</DataTable.Title>
                            <DataTable.Title>NOME</DataTable.Title>
                            <DataTable.Title>EMIAL</DataTable.Title>
                            <DataTable.Title numeric>TELEFONE</DataTable.Title>
                            <DataTable.Title numeric>NÍVEL</DataTable.Title>
                        </DataTable.Header>
                        {users.map((data, key) => (
                            <DataTable.Row key={key}>
                                <DataTable.Cell>
                                    <Avatar.Image size={40} source={{uri: url+"/"+data.avatar}}/>
                                </DataTable.Cell>
                                <DataTable.Cell>{data.name}</DataTable.Cell>
                                <DataTable.Cell>{data.email}</DataTable.Cell>
                                <DataTable.Cell numeric>{data.phone}</DataTable.Cell>
                                <DataTable.Cell numeric>{readLevel(data.level)}</DataTable.Cell>
                            </DataTable.Row>
                        ))}
                        <DataTable.Pagination/>
                    </DataTable>
                </Card.Content>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        padding: 20,
        backgroundColor: "#f7f7f7"
    }
})

export default DashUsers;
