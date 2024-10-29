import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TockContext } from './components/Context';
import MainRoutes from './components/router/MainRoutes';
import * as SplashScreen from 'expo-splash-screen'

const App = () => {


  useEffect(() => {
    async function prepare() {
      try {
        // Impede que a splash screen desapareça imediatamente
        await SplashScreen.preventAutoHideAsync();
        // Adicione lógicas de carregamento (ex: carregamento de dados)
      } catch (e) {
        console.warn(e);
      } finally {
        // Após carregar os recursos, ocultar a Splash Screen
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);


  return (
    <TockContext>
      <MainRoutes/>
    </TockContext>
  );
}

const styles = StyleSheet.create({})

export default App;
