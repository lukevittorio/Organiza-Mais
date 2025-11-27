import React, { useEffect, useState } from 'react';
import { StatusBar, View, Image, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@react-native-vector-icons/ionicons'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importações internas;
import Texto from '../../componentes/texto';
import styles from "./estiloPerfil";
import { MainStackParamList } from '../../telas-internas/Main';
import { supabase } from '../../../utils/supabaseClient';

// Adicionando as props, com a de perfil que vem de 'Main', para alterar o estado e voltar para as demais telas;
type Props = NativeStackScreenProps<MainStackParamList, 'Perfil'> & {
  setLoggedIn: (value: boolean) => void;
};

// Componente Principal;
export default function Perfil({ navigation, setLoggedIn }: Props) {
  // Nome e email;
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [editNome, setEditNome] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [carregandoDados, setCarregandoDados] = useState(false);

  // Data Cadastro;
  const [dataCadastro, setDataCadastro] = useState('');

  // Modal de edição;
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [modalSenhaVisible, setModalSenhaVisible] = useState(false);

  // Senha;
  const [senhaAtual, setSenhaAtual] = useState("");
  const [senhaNova, setSenhaNova] = useState("");
  const [carregandoSenha, setCarregandoSenha] = useState(false);
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarSenhaNova, setMostrarSenhaNova] = useState(false);

  // Logout;
  const handleLogout = () => {
    setLoggedIn(false); // Volta para AuthStack;
  };

  // Abrindo o modal;
  function abrirModalEditar() {
    setEditNome(nome);
    setEditEmail(email);
    setModalEditarVisible(true);
  }

  // Validar nome;
  function validarNome(nome: string): string | null {
    if (!nome.trim()) {
        return "Preencha o nome.";
    }
    
    const partes = nome.trim().split(" ").filter(n => n !== "");

    if (partes.length !== 2) {
      return "Informe exatamente dois nomes: primeiro e último.";
    }

    const regexLetras = /^[A-Za-zÀ-ÿ]{2,}$/;

    for (let parte of partes) {
      if (!regexLetras.test(parte)) {
        return "Use apenas letras, sem números ou caracteres especiais.";
      }
      if (parte.length < 2) {
        return "Cada nome deve ter ao menos 2 letras.";
      }
    }

    return null;
  }

  // Salvar edição;
  const salvarEdicao = async () => {
    try {
      const erroNome = validarNome(editNome);
      if (erroNome) {
        Alert.alert("Nome inválido", erroNome);
        return;
      }

      // Impedir campos vazios;
      if (!editNome.trim() || !editEmail.trim()) {
        Alert.alert("Campos vazios", "Preencha todos os campos.");
        return;
      }

      setCarregandoDados(true);

      // Buscar userId salvo no login;
      const userIdString = await AsyncStorage.getItem("userId");
      if (!userIdString) {
        Alert.alert("Erro", "Usuário não encontrado.");
        return;
      }

      const userId = Number(userIdString);

      // Buscar dados atuais do usuário;
      const { data: usuarioAtual, error: erroBusca } = await supabase
        .from("usuario")
        .select("Nome, Email")
        .eq("id", userId)
        .single();

      if (erroBusca) throw erroBusca;

      // Checar se houve alteração;
      if (
        usuarioAtual.Nome === editNome.trim() &&
        usuarioAtual.Email === editEmail.trim()
      ) {
        Alert.alert("Erro", "Nenhuma alteração foi feita.");
        return;
      }

      // Atualizar dados;
      const { error: erroUpdate } = await supabase
        .from("usuario")
        .update({
          Nome: editNome.trim(),
          Email: editEmail.trim(),
        })
        .eq("id", userId);

      if (erroUpdate) throw erroUpdate;

      // Atualizar estados principais da tela;
      setNome(editNome.trim());
      setEmail(editEmail.trim());

      Alert.alert("Sucesso!", "Dados atualizados com sucesso!");
      setModalEditarVisible(false);

    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar os dados.");
      console.log(error);
    } finally {
      setCarregandoDados(false);
    }
  };

  // Senha;
  const atualizarSenha = async () => {
    try {
      // Impedir campos vazios;
      if (!senhaAtual.trim() || !senhaNova.trim()) {
        Alert.alert("Campos vazios", "Preencha todos os campos.");
        return;
      }

      setCarregandoSenha(true);

      // Pega o ID salvo no AsyncStorage;
      const userIdString = await AsyncStorage.getItem("userId");
      if (!userIdString) {
        Alert.alert("Erro", "Usuário não encontrado.");
        setCarregandoSenha(false);
        return;
      }

      const userId = Number(userIdString);

      // Buscar senha atual no banco;
      const { data: usuario, error: erroBusca } = await supabase
        .from("usuario")
        .select("SenhaHash")
        .eq("id", userId)
        .single();

      if (erroBusca) {
        console.log(erroBusca);
        Alert.alert("Erro", "Não foi possível buscar os dados.");
        setCarregandoSenha(false);
        return;
      }

      // Validar senha atual;
      if (usuario.SenhaHash !== senhaAtual) {
        Alert.alert("Erro", "Senha atual incorreta.");
        setCarregandoSenha(false);
        return;
      }

      // Validar senha igual;
      if (senhaAtual === senhaNova) {
        Alert.alert("Erro", "A nova senha não pode ser igual à anterior.");
        setCarregandoSenha(false);
        return;
      }

      // Atualizar senha;
      const { error: erroUpdate } = await supabase
        .from("usuario")
        .update({ SenhaHash: senhaNova })
        .eq("id", userId);

      if (erroUpdate) {
        console.log(erroUpdate);
        Alert.alert("Erro", "Não foi possível atualizar a senha.");
        setCarregandoSenha(false);
        return;
      }

      Alert.alert("Sucesso!", "Senha alterada com sucesso!");

      // Fechar modal e limpar campos;
      setSenhaAtual("");
      setSenhaNova("");
      setModalSenhaVisible(false);

    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Erro inesperado ao alterar senha.");
    } finally {
      setCarregandoSenha(false);
    }
  };

  // Cancelar;
  function cancelarEdicao() {
    setModalEditarVisible(false);
  }

  function cancelarAlteracao() {
    setSenhaAtual("");
    setSenhaNova("");
    setModalSenhaVisible(false);
  }

  // Excluir conta;
  const excluirConta = async () => {
    try {
      const userIdString = await AsyncStorage.getItem("userId");
      if (!userIdString) return;

      const userId = Number(userIdString);

      // Deletar usuário;
      const { error } = await supabase
        .from("usuario")
        .delete()
        .eq("id", userId);

      if (error) throw error;

      // Logout e limpeza;
      await AsyncStorage.clear();

      Alert.alert("Até breve!", "Conta excluída com sucesso!");

      handleLogout();

    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir a conta.");
      console.log(error);
    }
  };

  // Confirmar exclusão da Conta;
  const confirmarExclusao = () => {
    Alert.alert(
      "Excluir conta",
      "Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: excluirConta }
      ]
    );
  };

  // Funções quando a tela entra em foco;
  useFocusEffect(
    React.useCallback(() => {
      // Quando a tela ganhar foco aplica o status bar claro;
      StatusBar.setBarStyle('light-content');

      async function fetchUsuario() {
        const userIdString = await AsyncStorage.getItem('userId');
        if (!userIdString) return;

        const userId = Number(userIdString);

        // Buscando as informações através do id;
        const { data, error } = await supabase
          .from('usuario')
          .select('Nome, Email, DataCadastro')
          .eq('id', userId)
          .single(); // Retorna um objeto único;

        // Erro;
        if (error) {
          console.log('Erro ao buscar usuário:', error);
          return;
        }

        // Nome e email pelo id;
        setNome(data.Nome);
        setEmail(data.Email);
        setDataCadastro(data.DataCadastro);
      }

      fetchUsuario();
    }, [])
  );

  // Foramatando a data de cadastro;
  const dataFormatada = dataCadastro
    ? new Date(dataCadastro).toLocaleDateString("pt-BR")
    : "";

  return (<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    {/* Para quando clicar fora do teclado, ele suma; */}
    <LinearGradient
      colors={['#6ED6CB', '#AEFF5B']}
      style={styles.gradient} // Estilo para ocupar a tela inteira;
    >
      {/* Gradiente para ocupar o fundo inteiro da tela */}

      <SafeAreaView style={styles.container}>
        {/* Área de vizualização */}
        <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
          <Ionicons name="chevron-back-outline" size={44} color="#fffdff" />
        </TouchableOpacity>

        {/* Informações; */}
        <View style={styles.containerconteudo}>
          <Texto style={styles.tituloperfil}>Perfil</Texto>
          <Image source={require('../../../assets/perfil.png')} style={styles.img} resizeMode="cover" />
          <Texto style={styles.nometexto}>{nome || 'Carregando...'}</Texto>
          <Texto style={styles.emailtexto}>{email || 'Carregando...'}</Texto>
        </View>

        {/* Botões; */}
        <View style={styles.botoesLinha}>
          <TouchableOpacity
            style={styles.botaoAcao}
            onPress={abrirModalEditar}
          >
            <Texto style={styles.botaoAcaoTexto}>Editar Perfil</Texto>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoAcao}
            onPress={() => {
              // Resetando a função de mostrar senha, para que sempre que seja aberto as senhas fiquem ocultas;
              setMostrarSenhaAtual(false);
              setMostrarSenhaNova(false);
              setModalSenhaVisible(true);
            }}
          >
            <Texto style={styles.botaoAcaoTexto}>Alterar Senha</Texto>
          </TouchableOpacity>

        </View>

        {/* Informação cadastro; */}
        <View style={styles.containerconteudo}>
          <Texto style={styles.info}>
            Cadastro realizado em: {dataFormatada}
          </Texto>
        </View>


        <View style={styles.containerbotao}>
          {/* Encerrar sessão; */}
          <TouchableOpacity onPress={handleLogout} style={styles.botao}>
            <Texto style={styles.botaoTexto}>Encerrar sessão</Texto>
          </TouchableOpacity>

          {/* Excluir conta; */}
          <TouchableOpacity style={styles.botaoExcluir} onPress={confirmarExclusao}>
            <Texto style={styles.botaoExcluirTexto}>Excluir Conta</Texto>
          </TouchableOpacity>
        </View>

        {/* Modal - Editar Perfil; */}
        <Modal
          visible={modalEditarVisible}
          transparent
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>

              <Texto style={styles.modalTitulo}>Editar Perfil</Texto>

              <TextInput
                style={styles.input}
                placeholder="Nome"
                value={editNome}
                onChangeText={setEditNome}
                placeholderTextColor="#0E3939"
              />

              <TextInput
                style={styles.input}
                placeholder="Email"
                value={editEmail}
                onChangeText={setEditEmail}
                placeholderTextColor="#0E3939"
              />

              <TouchableOpacity style={styles.modalButton} onPress={salvarEdicao}>
                <Texto style={styles.modalButtonText}>
                  {carregandoDados ? "Salvando..." : "Salvar"}
                </Texto>
              </TouchableOpacity>

              <TouchableOpacity onPress={cancelarEdicao}>
                <Texto style={styles.fechar}>Fechar</Texto>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>

        {/* Modal - Alterar senha */}
        <Modal
          transparent
          animationType="fade"
          visible={modalSenhaVisible}
          onRequestClose={() => setModalSenhaVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>

              <Texto style={styles.modalTitulo}>Alterar Senha</Texto>

              {/* Senha atual */}
              <View style={styles.inputSenhaContainer}>
                <TextInput
                  placeholder="Senha atual"
                  placeholderTextColor="#0E3939"
                  secureTextEntry={!mostrarSenhaAtual}
                  value={senhaAtual}
                  onChangeText={setSenhaAtual}
                  style={styles.inputSenha}
                />

                <TouchableOpacity onPress={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}>
                  <Ionicons
                    name={mostrarSenhaAtual ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="#0E3939"
                  />
                </TouchableOpacity>
              </View>

              {/* Nova senha */}
              <View style={styles.inputSenhaContainer}>
                <TextInput
                  placeholder="Nova senha"
                  placeholderTextColor="#0E3939"
                  secureTextEntry={!mostrarSenhaNova}
                  value={senhaNova}
                  onChangeText={setSenhaNova}
                  style={styles.inputSenha}
                />

                <TouchableOpacity onPress={() => setMostrarSenhaNova(!mostrarSenhaNova)}>
                  <Ionicons
                    name={mostrarSenhaNova ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="#0E3939"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={atualizarSenha}
              >
                <Texto style={styles.modalButtonText}>
                  {carregandoSenha ? "Salvando..." : "Salvar"}
                </Texto>
              </TouchableOpacity>

              <TouchableOpacity onPress={cancelarAlteracao}>
                <Texto style={styles.fechar}>Fechar</Texto>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </LinearGradient>
  </TouchableWithoutFeedback>
  );
}