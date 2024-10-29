import { StyleSheet } from "react-native";

export const TockStyles = StyleSheet.create({
    container:{
        width: "100%",
        height: "100%",
    },
    title:{
        
    },
    titleContainer:{
        paddingLeft: 5,
        marginTop: 10,
        marginBottom: 10
    },
    containerCenter:{
        width: "100%", 
        height: "100%", 
        flex: 1, 
        justifyContent:"center", 
        alignContent: "center"
    },  
    row:{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12
    },
    materialButton:{
        borderRadius: 4
    },
    iconButton:{
        padding: 7,
        borderRadius: 100
    }
})
