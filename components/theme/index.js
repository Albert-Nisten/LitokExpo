import { MD3LightTheme as PaperTheme, MD3DarkTheme as PaperDarkTheme } from "react-native-paper";
import { DefaultTheme, DarkTheme } from "@react-navigation/native";


const light = {
    ...PaperTheme,
    ...DefaultTheme,
    colors:{
        ...PaperTheme.colors,
        ...DefaultTheme.colors,
        background: "white",
        onBackground: "black",
        // primary: "#000000",
        litok: "d16a1e",
        primary: "#d16a1e",
        onPrimary: "white",
        icon: "#000000",
        item: "#000000",
        text: "black",
        surface: DefaultTheme.colors.card,
        onSurface: "black",
        buttonText: "white",
        card: DefaultTheme.colors.card,
        blue: DefaultTheme.colors.primary,
        error: '#770303', 
        success: '#388E3C',
        snack: DarkTheme.colors.card
    },
    roundness: 2,
}

const dark = {
    ...DarkTheme,
    ...PaperDarkTheme,
    colors:{
        ...PaperDarkTheme.colors,
        ...DarkTheme.colors,
        onBackground: "white",
        litok: "d16a1e",
        primary: "white",
        onPrimary: "black",
        icon: "white",
        item: "#000000",
        card: DarkTheme.colors.card,
        text: "white",
        surface: DarkTheme.colors.card,
        onSurface: DefaultTheme.colors.card,
        buttonText: "black",
        blue: DefaultTheme.colors.primary,
        error: '#770303', 
        success: '#388E3C', 
        snack: DefaultTheme.colors.card
    },
    roundness: 2,
}

export {light, dark}