import React from "react";
import { Text, StyleSheet } from "react-native";
import { useFonts, CalSans_400Regular } from "@expo-google-fonts/cal-sans"; // Carregar fontes do google;

export default function Texto({ children, style, ...rest }: any) {

    // Retornando um bool que indica se a fonte foi carregada ou não;
    const [fontsLoaded] = useFonts({
        CalSans_400Regular,
    });

    // Enquanto a fonte não fr carregada, não retorna nada;
    if (!fontsLoaded) {
        return null;
    }
    
    let estilo_padrao = estilos.padrao;

    return <Text style={[estilo_padrao, style]}{...rest}>{children}</Text>;
}

const estilos = StyleSheet.create({
    padrao: {
        fontFamily: "CalSans_400Regular",
    },
});