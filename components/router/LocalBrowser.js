import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview'
import Loading from './Loading';
import Network from './Network';

const PolicyPrivacity = ({route}) => {  

    const { urlAddress } = route.params

    const [isLoading, setIsLoading] = useState(false)
    const [isNetworkError, setNetworkError] = useState(false)


    return (
       <View style = {styles.container}>
        {isLoading && !isNetworkError && (
            <Loading/>
        )}

        {isNetworkError ? <Network event = {() => setNetworkError(false)}/> :(
            <WebView
                onLoadStart={() => setIsLoading(true)}
                onLoadEnd={() => setIsLoading(false)}
                source={{ uri: urlAddress }} 
                onError={() => setNetworkError(true)}
            />
        )}
       </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
    }
})

export default PolicyPrivacity;
