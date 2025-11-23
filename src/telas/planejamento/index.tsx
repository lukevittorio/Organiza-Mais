import React, { useState } from 'react';
import { StatusBar, View, Modal, TouchableOpacity, TouchableWithoutFeedback, Keyboard, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

// Importações internas;
import Texto from '../../componentes/texto';
import styles from "./estiloPlanejamento";

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

  // Quando o modal for aberto, os valores oficiais são copiados aos temporários;
  const abrirModal = () => {
    setTempReceita(receita);
    setTempGasto(gasto);
    setModalVisible(true);
  };

  const abrirModalEdit = () => {
    setTempReceita(receita);
    setTempGasto(gasto);
    setModalVisible(true); // usa o mesmo modal
  };


  // Quando o usuário clicar em salvar, salva os novos valores nos 'oficiais';
  const salvarPlanejamento = () => {
    const valorReceita = parseFloat(tempReceita.replace('.', '').replace(',', '.'));
    const valorGasto = parseFloat(tempGasto.replace('.', '').replace(',', '.'));

    if (!tempReceita.trim() || !tempGasto.trim()) {
      Alert.alert(
        "Campos vazios!",
        "Por favor, preencha ambos os campos antes de salvar.",
        [{ text: "OK", style: "default" }]
      );
      return;
    }

    if (valorReceita > 100000 || valorGasto > 100000) {
      Alert.alert(
        "Valor muito alto!",
        "Os valores não podem ultrapassar R$ 100.000,00.",
        [{ text: "Entendi", style: "cancel" }]
      );
      return;
    }

    const receitaFormatada = formatarNumero(tempReceita);
    const gastoFormatado = formatarNumero(tempGasto);

    setReceita(receitaFormatada);
    setGasto(gastoFormatado);
    setModalVisible(false);

    Alert.alert(
      "Sucesso!",
      "Planejamento atualizado com sucesso.",
      [{ text: "OK", style: "default" }]
    );
  };


  // Caso clique em fechar, o modal se fecha sem nenhuma alteração de valores;
  const cancelarPlanejamento = () => {
    setModalVisible(false);
  };

  const excluirPlanejamento = () => {
    Alert.alert(
      "Excluir planejamento",
      "Tem certeza que deseja excluir seu planejamento atual?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            setReceita('');
            setGasto('');
            setModalVisible(false);
            Alert.alert("Planejamento excluído", "Seu planejamento foi removido com sucesso.");
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
