import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Dashboard = () => {
    return (
        <View style = {styles.container}>
            <Text>Dashboard</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "red"
    }
})

export default Dashboard;
