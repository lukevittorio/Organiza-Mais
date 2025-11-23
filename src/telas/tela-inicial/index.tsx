import React from "react";
import { StatusBar, View, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';

// Importações internas;
import Texto from '../../componentes/texto';
import styles from "./estiloInicial";
import { AuthStackParamList } from '../../autenticacao/AuthStack';

// Definindo que a navegação só acontece entre as telas incluidas no AuthStackParamList (Inicial, Login e Cadastro);
type InicialScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Inicial'>;

// O componente recebe navigation como prop;
type Props = {
    navigation: InicialScreenNavigationProp;
};

// Componente principal;
export default function Inicial({ navigation }: Props) {

    useFocusEffect(
        React.useCallback(() => {
            // Quando a tela ganhar foco aplica o status bar claro;
            StatusBar.setBarStyle('light-content');
        }, [])
    );

    return (
        <LinearGradient
            colors={['#038C8C', '#79C704']}
            style={styles.gradient} // Estilo para ocupar a tela inteira;
        >
            {/* Gradiente para ocupar o fundo inteiro da tela */}

            <SafeAreaView style={styles.container}>
                {/* Área de vizualização */}

                <Image source={require('../../../assets/porquinho-corpo-inteiro.png')} style={styles.img} resizeMode="contain" />

                <View style={styles.containertexto}>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.botao} // Navega para a tela de login
                    >
                        <Texto style={styles.botaoTexto}>Iniciar</Texto>
                    </TouchableOpacity>

                    <Texto style={styles.texto}>Organiza+</Texto>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}