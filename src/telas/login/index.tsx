import React, { useState } from 'react';
import { StatusBar, View, TouchableOpacity, Image, TextInput, TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@react-native-vector-icons/ionicons'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importações Internas;
import { AuthStackParamList } from '../../autenticacao/AuthStack';
import Texto from '../../componentes/texto';
import styles from "./estiloLogin";
import { supabase } from "../../../utils/supabaseClient";


// Adicionando as props, com a de login que vem de 'AuthStack', para alterar o estado e entrar nas demais telas;
type Props = NativeStackScreenProps<AuthStackParamList, 'Login'> & {
    setLoggedIn: (value: boolean) => void;
};

// Componente principal;
export default function Login({ navigation, setLoggedIn }: Props) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);


    useFocusEffect(
        React.useCallback(() => {
            // Quando a tela ganhar foco aplica o status bar claro;
            StatusBar.setBarStyle('light-content');
        }, [])
    );

    // Realizando Login;
    async function handleLogin() {
        if (!email || !senha) {
            Alert.alert("Campos vazios", "Preencha e-mail e senha.");
            return;
        }

        setCarregando(true);

        // Busca usuário pelo email;
        const { data: usuario, error } = await supabase
            .from("usuario")
            .select("*")
            .eq("Email", email)
            .maybeSingle();

        setCarregando(false);

        // Erro de Acesso;
        if (error) {
            console.log(error);
            Alert.alert("Erro", "Erro ao acessar o servidor.");
            return;
        }

        // Email errado;
        if (!usuario) {
            Alert.alert("Usuário não encontrado", "Verifique o e-mail digitado.");
            return;
        }

        // Verifica a senha;
        if (usuario.SenhaHash !== senha) {
            Alert.alert("Senha incorreta", "A senha digitada está incorreta.");
            return;
        }

        // Salva o ID no AsyncStorage
        await AsyncStorage.setItem('userId', usuario.id.toString());

        // Login validado
        setLoggedIn(true);
    }


    return (<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {/* Para quando clicar fora do teclado, ele suma; */}
        <LinearGradient
            colors={['#038C8C', '#79C704']}
            style={styles.gradient} // Estilo para ocupar a tela inteira;
        >
            {/* Gradiente para ocupar o fundo inteiro da tela */}

            <View style={styles.containerimg}>
                <Image source={require('../../../assets/icon.png')} style={styles.img} resizeMode="contain" />

                <View style={styles.containertextocima}>
                    <Texto style={styles.textocima}>Entre em sua conta</Texto>
                </View>
            </View>

            <SafeAreaView style={styles.container}>
                {/* Área de vizualização */}

                <View style={styles.containerforms}>
                    <View style={styles.input}>
                        <Ionicons name="mail-outline" size={24} color="#79C704" style={{ marginRight: '5%' }} />
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="E-mail"
                            style={styles.inputdentro}
                            placeholderTextColor='#79C704'
                        />
                    </View>

                    <View style={styles.input}>
                        <Ionicons name="lock-closed-outline" size={24} color="#79C704" style={{ marginRight: '5%' }} />

                        <TextInput
                            value={senha}
                            onChangeText={setSenha}
                            placeholder="Senha"
                            secureTextEntry={!mostrarSenha}
                            style={[styles.inputdentro, { flex: 1 }]}
                            placeholderTextColor='#79C704'
                        />

                        <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                            <Ionicons
                                name={mostrarSenha ? "eye-off-outline" : "eye-outline"}
                                size={24}
                                color="#79C704"
                            />
                        </TouchableOpacity>
                    </View>

                </View>

                {/* Botão de acesso que durante a consulta muda para carregando; */}
                <TouchableOpacity
                    onPress={handleLogin}
                    style={[styles.botao, carregando && { opacity: 0.6 }]}
                    disabled={carregando}
                >
                    {carregando
                        ? <ActivityIndicator size={45} color="#fffdff" />
                        : <Texto style={styles.botaoTexto}>Entrar</Texto>
                    }
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Cadastro')} style={styles.espaco}>
                    <Texto style={styles.textocadastro}>Não possui conta? Cadastre-se</Texto>
                </TouchableOpacity>

                <View style={styles.containertexto}>
                    <Texto style={styles.texto}>Organiza+</Texto>
                </View>
            </SafeAreaView>
        </LinearGradient>
    </TouchableWithoutFeedback>
    );
}