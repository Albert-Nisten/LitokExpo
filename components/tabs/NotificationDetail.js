import React from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView} from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';

const NotificationDetail = ({route, navigation}) => {

    const { notification } = route.params;

    const { colors } = useTheme()

    const handleBack = () => {
        navigation.goBack()
    }

    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle = {styles.container}>
                <View style = {{padding: 10}}>
                    <Card style = {{backgroundColor: colors.card}}>
                        <Card.Title
                            title = {<Text variant='titleMedium'>{notification.title}</Text>}
                            subtitle = {<Text>{notification.createdAt}</Text>}
                            right={() => <Text style = {{marginRight: 20, color: colors.blue}}>Visto</Text>}
                        />
                        <Card.Content>
                            <Text>{notification.description}</Text>
                        </Card.Content>
                        <Card.Actions>
                            <Button onPress={handleBack} mode='text'>Fechar</Button>
                        </Card.Actions>
                    </Card>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
    }
})

export default NotificationDetail;
