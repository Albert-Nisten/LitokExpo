import { useEffect, useState } from "react"
import { Button, Dialog, Portal, Snackbar, Text, useTheme } from "react-native-paper"

const TockAlert = ({value, onDismiss}) => {
    const {colors} = useTheme()
    return(
        <Snackbar 
            visible = {value.visible} 
            onDismiss={onDismiss}
            action={{
                label: value.buttonText || "Fechar",
                textColor: "white",
                onPress: value.confirm || onDismiss
            }}
            style = {{backgroundColor: value.color ? value.color : colors.snack}}
        >
            {value.text}
        </Snackbar>
    )
}

export default TockAlert