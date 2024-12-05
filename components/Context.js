import { createContext, useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import io from "socket.io-client";
import { url } from "../config";
import { useWindowDimensions } from "react-native";

const Context = createContext();
const socket = io(url);

function TockContext(props) {
    const appName = "LitokShop";
    const [user, setUser] = useState(null);
    const [isThemeDark, setIsThemeDark] = useState(false);
    const [market, setMarket] = useState(null);

    const { width } = useWindowDimensions();
    const isDesktop = width >= 768;

    const storeUser = useCallback(async (data) => {
        try {
            const userData = JSON.stringify(data);
            setUser(data);
            await AsyncStorage.setItem("@user", userData);
            console.log("user strored successfully!")
        } catch (error) {
            console.error("Erro ao armazenar o usuário:", error);
        }
    }, []);

    const clearUser = useCallback(async () => {
        try {
            await AsyncStorage.removeItem("@user");
            setUser(null);
            if (isThemeDark) {
                await AsyncStorage.setItem("@theme", "light");
                setIsThemeDark(false);
            }
        } catch (error) {
            console.error("Erro ao limpar o usuário:", error);
        }
    }, [isThemeDark, user]);

    const tryToAutoLogin = useCallback(async () => {
        try {
            const currentUser = await AsyncStorage.getItem("@user");
            if (currentUser) {
                setUser(JSON.parse(currentUser));
            }
        } catch (error) {
            console.error("Erro ao tentar login automático:", error);
        }
    }, []);

    const changeTheme = useCallback((value) => {
        setIsThemeDark(value);
    }, []);

    const storeTheme = useCallback((value) => {
        const theme = value ? "dark" : "light";
        AsyncStorage.setItem("@theme", theme);
        changeTheme(value);
    }, [changeTheme]);

    const setCurrentTheme = useCallback(async () => {
        try {
            const theme = await AsyncStorage.getItem("@theme");
            if (theme) {
                changeTheme(theme === "dark");
            }
        } catch (error) {
            console.error("Erro ao definir o tema atual:", error);
        }
    }, [changeTheme]);

    useEffect(() => {
        setCurrentTheme();
    }, [setCurrentTheme]);

    useEffect(() => {
        return () => {
            socket.disconnect();
        };
    }, []);

    const values = {
        user,
        storeUser,
        clearUser,
        tryToAutoLogin,
        isThemeDark,
        setIsThemeDark,
        changeTheme,
        storeTheme,
        setCurrentTheme,
        appName,
        market,
        isDesktop,
        setMarket,
    };

    return (
        <Context.Provider value={values}>{props.children}</Context.Provider>
    );
}

export { Context, TockContext, socket };
