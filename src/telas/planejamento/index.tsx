import React, { useState } from 'react';
import { StatusBar, View, Modal, TouchableOpacity, TouchableWithoutFeedback, Keyboard, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importações internas;
import Texto from '../../componentes/texto';
import styles from "./estiloPlanejamento";
import { supabase } from '../../../utils/supabaseClient';

// Componente Principal;
export default function Planejamento() {
  // Modal;
  const [modalVisible, setModalVisible] = useState(false);

  // Valores oficiais;
  const [receita, setReceita] = useState('');
  const [gasto, setGasto] = useState('');

  const temPlanejamento = receita.trim() !== '' && gasto.trim() !== '';

  // Valores temporários do modal;
  const [tempReceita, setTempReceita] = useState('');
  const [tempGasto, setTempGasto] = useState('');

  // Mês;
  const mesAtual = new Date().toLocaleString('pt-BR', { month: 'long' });
  const mesFormatado = mesAtual.charAt(0).toUpperCase() + mesAtual.slice(1);

  // ID Planejamento;
  const [idPlanejamento, setIdPlanejamento] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  // Quando o modal for aberto, os valores oficiais são copiados aos temporários;
  const abrirModal = () => {
    setTempReceita(receita);
    setTempGasto(gasto);
    setModalVisible(true);
  };

  // Quando o usuário clicar em salvar, salva os novos valores nos 'oficiais';
  const salvarPlanejamento = async () => {
    try {
      // Campos vazios;
      if (!tempReceita.trim() || !tempGasto.trim()) {
        return Alert.alert("Campos vazios!", "Preencha todos os campos.");
      }

      // Convertendo;
      const valorReceita = parseFloat(tempReceita.replace('.', '').replace(',', '.'));
      const valorGasto = parseFloat(tempGasto.replace('.', '').replace(',', '.'));

      // Limite de valor;
      if (valorReceita > 100000 || valorGasto > 100000) {
        return Alert.alert("Valor muito alto!", "Os valores não podem ultrapassar R$ 100.000,00.");
      }

      // ID usuário;
      const userIdString = await AsyncStorage.getItem("userId");
      if (!userIdString) return;

      const userId = Number(userIdString);

      let resultado;

      // UPDATE;
      if (idPlanejamento) {
        resultado = await supabase
          .from("Planejamento Futuro")
          .update({
            ValorReceita: valorReceita,
            ValorDespesa: valorGasto,
          })
          .eq("id", idPlanejamento);
      }

      // INSERT;
      else {
        resultado = await supabase
          .from("Planejamento Futuro")
          .insert({
            ValorReceita: valorReceita,
            ValorDespesa: valorGasto,
            UsuarioId: userId,
          })
          .select()
          .single();
      }

      // Erro;
      if (resultado.error) {
        console.log(resultado.error);
        return Alert.alert("Erro", "Não foi possível salvar o planejamento.");
      }

      // Atualiza os valores exibidos;
      setReceita(
        valorReceita.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
      );
      setGasto(
        valorGasto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
      );

      // Atualiza ID caso seja criação;
      if (resultado.data) setIdPlanejamento(resultado.data.id);

      setModalVisible(false);

      Alert.alert("Sucesso!", "Planejamento atualizado com sucesso!");

      // Erro;
    } catch (err) {
      console.log(err);
      Alert.alert("Erro", "Não foi possível salvar o planejamento.");
    }
  };

  // Caso clique em fechar, o modal se fecha sem nenhuma alteração de valores;
  const cancelarPlanejamento = () => {
    setModalVisible(false);
  };

  // Excluir;
  const excluirPlanejamento = () => {
    Alert.alert(
      "Excluir planejamento",
      "Tem certeza que deseja excluir seu planejamento atual?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              if (idPlanejamento) {
                await supabase
                  .from("Planejamento Futuro")
                  .delete()
                  .eq("id", idPlanejamento);
              }

              setReceita('');
              setGasto('');
              setIdPlanejamento(null);
              setModalVisible(false);

              Alert.alert("Planejamento excluído!", "Seu planejamento foi removido.");

            } catch (err) {
              console.log(err);
              Alert.alert("Erro", "Não foi possível excluir.");
            }
          }
        }
      ]
    );
  };

  // Função para formatação de valores;
  function formatarNumero(valor: string): string { // Recebe 'string' e retorna 'string';
    const somenteNumeros = valor.replace(/[^\d,]/g, ''); // Remove caracteres indesejados, ou seja, substitui tudo que não é dígito e vírgula por um vazio;

    const numero = parseFloat(somenteNumeros.replace(',', '.')); // Troca vírgula por ponto, para que o JS reconheça e posssa converter para float;

    if (isNaN(numero)) return valor; // Evita devolver algo 'estranho', que não seja número;

    return numero.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }); // Formata para moeda brasileira;
  }

  useFocusEffect(
    React.useCallback(() => {
      // Quando a tela ganhar foco aplica o status bar claro;
      StatusBar.setBarStyle('light-content');

      // Carregar o planejamento;
      const carregarPlanejamento = async () => {
        try {
          setCarregando(true);

          const userIdString = await AsyncStorage.getItem('userId');
          if (!userIdString) {
            setCarregando(false);
            return;
          }

          const userId = Number(userIdString);

          const { data, error } = await supabase
            .from('Planejamento Futuro')
            .select('*')
            .eq('UsuarioId', userId)
            .single();

          setCarregando(false);

          // Se não existe planejamento ainda;
          if (error && error.code === "PGRST116") {
            setReceita('');
            setGasto('');
            setIdPlanejamento(null);
            return;
          }

          if (error) {
            console.log("Erro ao carregar planejamento:", error);
            return;
          }

          if (data) {
            setReceita(
              Number(data.ValorReceita)
                .toLocaleString("pt-BR", { minimumFractionDigits: 2 })
            );

            setGasto(
              Number(data.ValorDespesa)
                .toLocaleString("pt-BR", { minimumFractionDigits: 2 })
            );

            setIdPlanejamento(data.id);
          }

        } catch (err) {
          console.log("Erro inesperado:", err);
          setCarregando(false);
        }
      };

      carregarPlanejamento();
    }, [])
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {/* Para quando clicar fora do teclado, ele suma; */}
      <LinearGradient
        colors={['#6ED6CB', '#AEFF5B']}
        style={styles.gradient} // Estilo para ocupar a tela inteira;
      >
        {/* Gradiente para ocupar o fundo inteiro da tela */}

        <SafeAreaView style={styles.container}>
          {/* Área de vizualização */}
          <Texto style={styles.titulo}>Planejamento</Texto>

          <View style={styles.containerbox}>
            <Texto style={styles.mes}>{mesFormatado}</Texto>

            <View style={{ flex: 1, width: '100%' }}>
              {(receita.trim() === '' && gasto.trim() === '') ? (
                <View style={styles.semPlanejamento}>
                  <Texto style={styles.textoSemPlanejamento}>
                    Nenhum planejamento definido!
                  </Texto>
                </View>
              ) : (
                <>
                  <View style={styles.containerinfo}>
                    <Texto style={styles.textoinfo}>Receitas do mês</Texto>
                    <Texto style={styles.valorinfo}>{receita}</Texto>
                  </View>

                  <View style={styles.containerinfo}>
                    <Texto style={styles.textoinfo}>Gastos Planejados</Texto>
                    <Texto style={styles.valorinfo}>{gasto}</Texto>
                  </View>
                </>
              )}
            </View>

            {temPlanejamento ? (
              <View style={styles.containerBotoesPlanejamento}>
                <TouchableOpacity
                  style={styles.botao}
                  onPress={abrirModal}
                >
                  <Texto style={styles.botaoTexto}>Atualizar Planejamento</Texto>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botaoExcluir}
                  onPress={excluirPlanejamento}
                >
                  <Texto style={styles.botaoTextoExcluir}>Excluir Planejamento</Texto>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={abrirModal} style={styles.botao}>
                <Texto style={styles.botaoTexto}>Definir novo planejamento</Texto>
              </TouchableOpacity>
            )}
          </View>

          {/* Modal (Pop-up) */}
          <Modal
            animationType="fade"
            transparent
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            {/* Fundo escuro — fecha o modal se clicar fora */}
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View style={styles.modalOverlay}>

                {/* Evita que o toque dentro do card feche o modal */}
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View style={styles.modalContainer}>
                    <Texto style={styles.modalTitulo}>
                      {temPlanejamento ? 'Editar Planejamento' : 'Novo Planejamento'}
                    </Texto>

                    <Texto style={styles.modalSubtitulo}>Receita do mês</Texto>
                    <TextInput
                      placeholder="Digite o valor da receita..."
                      placeholderTextColor="#888"
                      keyboardType="numeric"
                      value={tempReceita}
                      onChangeText={setTempReceita}
                      onBlur={() => setTempReceita(formatarNumero(tempReceita))}
                      style={styles.modalInput}
                    />

                    <Texto style={styles.modalSubtitulo}>Gastos planejados</Texto>
                    <TextInput
                      placeholder="Digite o valor do gasto..."
                      placeholderTextColor="#888"
                      keyboardType="numeric"
                      value={tempGasto}
                      onChangeText={setTempGasto}
                      onBlur={() => setTempGasto(formatarNumero(tempGasto))}
                      style={styles.modalInput}
                    />

                    <View style={styles.modalBotoes}>
                      <TouchableOpacity
                        style={[styles.modalBotao, { backgroundColor: '#038C8C' }]}
                        onPress={salvarPlanejamento}
                      >
                        <Texto style={styles.modalTextoBotao}>Salvar</Texto>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.modalBotao, { backgroundColor: '#B3261E' }]}
                        onPress={cancelarPlanejamento}
                      >
                        <Texto style={styles.modalTextoBotao}>Cancelar</Texto>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}
