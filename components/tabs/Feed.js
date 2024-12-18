import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, SafeAreaView } from 'react-native';
import { Card, IconButton, Text, useTheme } from 'react-native-paper';
import { api, url } from '../../config';
import { formatToKwanza } from '../../config/utilities';
import { useNavigation } from '@react-navigation/native';
import Network from '../router/Network';
import Loading from '../router/Loading';
import { Context } from '../Context';
import TockAlert from '../tockElements/TockAlert'

const Feed = () => {

    const { user } = useContext(Context)

    const [products, setProducts] = useState([]);
    const [networkError, setNetworkError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { isDesktop } = useContext(Context); // Usando a variável `isDesktop` do Context
    const navigation = useNavigation();

    const [dialog, setDialog] = useState({})

    const { colors } = useTheme();

    const getProducts = () => {
        setNetworkError(false);
        api.get(`/product`)
            .then((resp) => {
                const data = resp.data;
                console.log("getProducts")
                if (data.message === 'sucesso') {
                    setProducts(data.products);
                    setIsLoading(false);
                }
            })
            .catch((err) => {
                setNetworkError(true);
                setIsLoading(false);
                console.error(err.message);
            });
    };

    const getFeed = userId => {
        setNetworkError(false);
        api.get(`/product/feed/${userId}`)
            .then((resp) => {
                const data = resp.data;
                console.log("getFeed")
                if (data.message === 'sucesso') {
                    setProducts(data.products);
                    setIsLoading(false);
                }
            })
            .catch((err) => {
                setNetworkError(true);
                setIsLoading(false);
                console.error(err.message);
            });
    };

    const handleFavorite = (id, type) => {
        setProducts((prevProducts) => {
            let dialogText = ""; // Para controlar a mensagem do diálogo
        
            const updatedProducts = prevProducts.map((product) => {
                if (product.id === id) {
                    // Definir a mensagem do diálogo somente para o produto alvo
                    dialogText = type === "like"
                    ? "Adicionado aos Favoritos"
                    : "Removido dos Favoritos";
        
                    return { ...product, liked: type === "like" ? true: false };
                }
        
                return product; // Retornar produtos sem alterações
            });
        
            // Exibir o diálogo apenas uma vez após o loop
            setDialog({
                text: dialogText,
                visible: true,
                confirm: () => setDialog({})
            });

            setTimeout(() => {
                setDialog({})
            }, 1500)
        
            return updatedProducts;
        });type === "like"
        
    }

    const likeProduct = productId => {
        if(!user){
            setDialog({
                text: "Conecte-se para adicionar produtos à sua lista de favoritos!",
                visible: true,
                confirm: () => {
                    setDialog({})
                    navigation.navigate("Login")
                },
                buttonText: "Login"
            })
            setTimeout(() => setDialog({}), 2000)
            return
        }
        api.post("/product/like", {
            productId,
            userId: user.id,
        })
        .then(resp => {
            const { message } = resp.data;
            handleFavorite(productId, message);
        })
        .catch(err => {
            console.log()
            setDialog({
                text: err.message,
                visible: true,
                confirm: () => setDialog({}),
                color: colors.error
            });
        })
    }

    const handleFeedContent =  () => {
        setIsLoading(true)
        if(user){
            getFeed(user.id)
        }else{
            getProducts()
        }
    }

    useEffect(() => {
        handleFeedContent()
    }, [user]);

    if (networkError) {
        return <Network event={() => { setIsLoading(true); getProducts(); }} />;
    }

    if (isLoading) {
        return <Loading />;
    }

    return (
        <SafeAreaView style = {{flex: 1}}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={handleFeedContent} />
                }
            >
                <View style={styles.titleContainer}>
                    <Text variant="titleSmall">Acabou de Cehgar</Text>
                </View>

                <View style={[styles.container, isDesktop ? styles.containerDesktop : styles.containerMobile]}>
                    {products.map((item) => (
                        <Card
                            onPress={() => navigation.navigate('ProductDetail', { item })}
                            key={item.id}
                            elevation={0}
                            style={[styles.card, { width: isDesktop ? '32%' : '48%' }]} // Largura dinâmica
                        >
                            <View style = {{...styles.imageContainer}}>
                                <Card.Cover
                                    style={[
                                        styles.image,
                                        { height: isDesktop ? 250 : 150 }, // Altura dinâmica
                                    ]}
                                    source={{ uri: `${url}/${item.avatar}` }}
                                />
                                <IconButton 
                                    style = {{position: "absolute", top: 1, right: 1, backgroundColor: colors.card}} 
                                    // icon= {() => <AntDesign name='hearto' color = {colors.text} size={28} />}
                                    icon = {item.liked ? "heart": "heart-outline"}
                                    mode='contained'
                                    onPress={() => likeProduct(item.id)}
                                    size={30}
                                />
                            </View>
                            <View style = {{paddingTop: 10, paddingBottom: 10}}>
                                <Text variant="titleSmall">{item.name}</Text>
                                <Text style = {{color: colors.primary}} variant="titleMedium">{formatToKwanza(item.price)}</Text>
                                <Text style={styles.description}>
                                    {item.description.length < 24
                                        ? item.description
                                        : `${item.description.substring(0, 24)}...`}
                                </Text>
                            </View>
                        </Card>
                    ))}
                </View>
            </ScrollView>
            <TockAlert value={dialog} onDismiss={dialog.confirm}/>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    scroll: {
        width: '100%',
    },
    titleContainer: {
        paddingLeft: 5,
        marginTop: 10,
        marginBottom: 10,
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'space-between',
        marginBottom: 10,
        padding: 5,
    },
    containerDesktop: {
        gap: 15,
    },
    containerMobile: {
        gap: 10,
    },
    card: {
        marginBottom: 10,
    },
    imageContainer: {
        position: 'relative'
    },  
    image: {
        resizeMode: 'contain',
        borderRadius: 20
    },
    description: {
        color: 'gray',
        fontSize: 11,
    },
});

export default Feed;
