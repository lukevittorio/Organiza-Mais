import React, { useState } from 'react';
import { StatusBar, View, TouchableOpacity, Image, TextInput, TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@react-native-vector-icons/ionicons'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';

// Impoertações Internas;
import Texto from '../../componentes/texto';
import styles from "./estiloCadastro";
import { AuthStackParamList } from '../../autenticacao/AuthStack';
import { supabase } from "../../../utils/supabaseClient";


// Definindo que a navegação só acontece entre as telas incluidas no AuthStackParamList (Inicial, Login e Cadastro);
type InicialScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Cadastro'>;

// O componente recebe navigation como prop;
type Props = {
    navigation: InicialScreenNavigationProp;
};

// Componente principal;
export default function Cadastro({ navigation }: Props) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [carregando, setCarregando] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            // Quando a tela ganhar foco aplica o status bar claro;
            StatusBar.setBarStyle('light-content');
        }, [])
    );

    // Validar nome;
    function validarNome(nome: string): string | null {
        if (!nome.trim()) {
            return "Preencha o nome.";
        }

        // Remover espaços extras;
        const partes = nome.trim().split(" ").filter(n => n !== "");

        // Verificar quantidade de nomes;
        if (partes.length !== 2) {
            return "Informe exatamente dois nomes: primeiro e último.";
        }

        // Regex que aceita apenas letras com acentos (mín. 2 caracteres);
        const regexLetras = /^[A-Za-zÀ-ÿ]{2,}$/;

        for (let parte of partes) {
            if (!regexLetras.test(parte)) {
                return "Use apenas letras, sem números ou caracteres especiais.";
            }
            if (parte.length < 2) {
                return "Cada nome deve ter ao menos 2 letras.";
            }
        }

        return null; // Nome válido;
    }

    async function handleCadastro() {
        const erroNome = validarNome(nome);

        if (erroNome) {
            Alert.alert("Nome inválido", erroNome);
            return;
        }

        if (!email || !senha) {
            Alert.alert("Campos vazios", "Preencha todos os campos.");
            return;
        }

        setCarregando(true);

        // Verificar se e-mail já existe;
        const { data: existente, error: erroBusca } = await supabase
            .from("usuario")
            .select("*")
            .eq("Email", email);

        // Erro de busca;
        if (erroBusca) {
            setCarregando(false);
            Alert.alert("Erro", "Erro ao verificar e-mail.");
            return;
        }

        // Se já existe o email cadastrado, pede outro;
        if (existente && existente.length > 0) {
            setCarregando(false);
            Alert.alert("E-mail já cadastrado", "Use outro e-mail.");
            return;
        }

        // Inserir usuário
        const { error: erroInsert } = await supabase
            .from("usuario")
            .insert({
                Nome: nome,
                Email: email,
                SenhaHash: senha,
                DataCadastro: new Date().toISOString().split("T")[0]
            });

        setCarregando(false);

        // Erro na inserção;
        if (erroInsert) {
            console.log("Erro ao inserir usuário:", erroInsert);
            Alert.alert("Erro no cadastro", "Tente novamente mais tarde.");
            return;
        }

        // Cadastro feito;
        Alert.alert("Sucesso!", "Cadastro realizado com sucesso.");
        navigation.navigate("Login");
    }

    return (<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {/* Para quando clicar fora do teclado, ele suma; */}
        <LinearGradient
            colors={['#79C704', '#038C8C']}
            style={styles.gradient} // Estilo para ocupar a tela inteira;
        >
            {/* Gradiente para ocupar o fundo inteiro da tela */}

            <View style={styles.containerimg}>
                <Image source={require('../../../assets/icon.png')} style={styles.img} resizeMode="contain" />

                <View style={styles.containertextocima}>
                    <Texto style={styles.textocima}>Cadastre-se</Texto>
                </View>
            </View>

            <SafeAreaView style={styles.container}>
                {/* Área de vizualização */}

                {/* Nome */}
                <View style={styles.input}>
                    <Ionicons name="person-outline" size={24} color="#038C8C" style={{ marginRight: '5%' }} />
                    <TextInput
                        value={nome}
                        onChangeText={setNome}
                        placeholder="Nome e Sobrenome"
                        style={styles.inputdentro}
                        placeholderTextColor='#038C8C'
                    />
                </View>

                {/* E-mail */}
                <View style={styles.input}>
                    <Ionicons name="mail-outline" size={24} color="#038C8C" style={{ marginRight: '5%' }} />
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="E-mail"
                        style={styles.inputdentro}
                        placeholderTextColor='#038C8C'
                    />
                </View>

                {/* Senha */}
                <View style={styles.input}>
                    <Ionicons name="lock-closed-outline" size={24} color="#038C8C" style={{ marginRight: '5%' }} />

                    <TextInput
                        value={senha}
                        onChangeText={setSenha}
                        placeholder="Senha"
                        secureTextEntry={!mostrarSenha}
                        style={[styles.inputdentro, { flex: 1 }]}
                        placeholderTextColor='#038C8C'
                    />

                    <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                        <Ionicons
                            name={mostrarSenha ? "eye-off-outline" : "eye-outline"}
                            size={24}
                            color="#038C8C"
                        />
                    </TouchableOpacity>
                </View>

                {/* Botão cadastrar */}
                <TouchableOpacity
                    onPress={handleCadastro}
                    style={[styles.botao, carregando && { opacity: 0.6 }]}
                    disabled={carregando}
                >
                    {carregando
                        ? <ActivityIndicator size={45} color="#fffdff" />
                        : <Texto style={styles.botaoTexto}>Cadastrar</Texto>
                    }
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.espaco}>
                    <Texto style={styles.textologin}>Já possui conta? Realize seu login</Texto>
                </TouchableOpacity>

                <View style={styles.containertexto}>
                    <Texto style={styles.texto}>Organiza+</Texto>
                </View>
            </SafeAreaView>
        </LinearGradient>
    </TouchableWithoutFeedback >
    );
}