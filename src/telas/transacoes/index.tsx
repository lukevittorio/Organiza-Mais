import React, { useState, useCallback, useEffect } from 'react';
import { StatusBar, View, Modal, TouchableOpacity, TouchableWithoutFeedback, Keyboard, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@react-native-vector-icons/ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

// Importações internas;
import Texto from '../../componentes/texto';
import styles from "./estiloTransacoes";
import { supabase } from '../../../utils/supabaseClient';

// Componente Principal;
export default function Transacoes() {
  // Valor Máximo para adicionar;
  const VALOR_MAXIMO = 9999;

  function validarValor(valor: string): boolean {
    const somenteNumeros = valor.replace(/[^\d,]/g, '');
    const numero = parseFloat(somenteNumeros.replace(',', '.'));

    if (isNaN(numero)) return false; // não é número
    if (numero > VALOR_MAXIMO) {
      Alert.alert('Valor muito alto!', `O limite máximo é R$ ${VALOR_MAXIMO.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`);
      return false;
    }

    return true;
  }

  function converterParaNumero(valor: string): number {
    if (!valor) return NaN;

    valor = valor.replace(/[^\d,]/g, ''); // só números e vírgula
    valor = valor.replace(',', '.');     // vírgula → ponto

    return Number(valor);
  }

  // Modal;
  const [modalReceitaVisible, setModalReceitaVisible] = useState(false);
  const [modalDespesaVisible, setModalDespesaVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);

  // Lista de Transações;
  type Transacao = {
    id: number;
    UsuarioId: number;
    Tipo: boolean; // true = receita, false = despesa;
    Valor: number;
    Data: string;
    Descricao: string | null;
  };

  // Transações;
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [carregando, setCarregando] = useState(false);

  // Valores temporários do modal;
  const [tempReceita, setTempReceita] = useState('');
  const [tempDespesa, setTempDespesa] = useState('');

  // Guarda o índice do item que está sendo editado (ou null se for novo)
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [valorEditando, setValorEditando] = useState('');


  // Quando o modal for aberto, os valores oficiais são copiados aos temporários;
  const abrirModalReceita = () => {
    setTempReceita('');
    setEditIndex(null); // <- limpa modo de edição;
    setModalReceitaVisible(true);
  };

  const abrirModalDespesa = () => {
    setTempDespesa('');
    setEditIndex(null);
    setModalDespesaVisible(true);
  };

  // Salvar receita;
  async function salvarReceita() {
    // Campo vazio retorna erro;
    if (tempReceita.trim() === '') {
      Alert.alert('Campo vazio!', 'Por favor, insira um valor para a receita.');
      return;
    }

    // Verificar valor;
    if (!validarValor(tempReceita)) return;

    // ID de user logado;
    const userIdString = await AsyncStorage.getItem('userId');
    if (!userIdString) return;
    const userId = Number(userIdString);

    // Formatando;
    const valorNum = parseFloat(tempReceita.replace(',', '.'));

    // INSERT;
    const { data, error }: PostgrestSingleResponse<Transacao> = await supabase
      .from('Transacao')
      .insert([{ UsuarioId: userId, Tipo: true, Valor: valorNum, Data: new Date().toISOString(), Descricao: null }])
      .select()
      .single(); // Retorna apenas um objeto;

    // Erro caso não poste os dados;
    if (error || !data) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível salvar a receita.');
      return;
    }

    // Adiciona a nova receita;
    Alert.alert('Receita adicionada!', 'O valor foi adicionado com sucesso!');
    setTransacoes(prev => [...prev, data]);
    setModalReceitaVisible(false);
    setTempReceita('');
  }

  // Salvar despesa;
  async function salvarDespesa() {
    // Campo vazio retorna erro;
    if (tempDespesa.trim() === '') {
      Alert.alert('Campo vazio!', 'Por favor, insira um valor para a despesa.');
      return;
    }

    // Verificar valor;
    if (!validarValor(tempDespesa)) return;

    // ID de user logado;
    const userIdString = await AsyncStorage.getItem('userId');
    if (!userIdString) return;
    const userId = Number(userIdString);

    // Formatando;
    const valorNum = parseFloat(tempDespesa.replace(',', '.'));

    // INSERT;
    const { data, error }: PostgrestSingleResponse<Transacao> = await supabase
      .from('Transacao')
      .insert([{ UsuarioId: userId, Tipo: false, Valor: valorNum, Data: new Date().toISOString(), Descricao: null }])
      .select()
      .single(); // Retorna apenas um objeto;

    // Erro caso não poste os dados;
    if (error || !data) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível salvar a despesa.');
      return;
    }

    // Adiciona a nova despesa;
    Alert.alert('Despesa adicionada!', 'O valor foi adicionado com sucesso!');
    setTransacoes(prev => [...prev, data]);
    setModalDespesaVisible(false);
    setTempDespesa('');
  }

  // Caso clique em fechar, o modal se fecha sem nenhuma alteração de valores;
  const cancelar = () => {
    setModalReceitaVisible(false);
    setModalDespesaVisible(false);
  };

  // Modal editar transação;
  const editarTransacao = (index: number) => {
    setEditIndex(index);
    setValorEditando(formatarNumero(transacoes[index].Valor));// Valor é number
    setModalEditarVisible(true);
  };

  // Editar a transação, buscando id da transação e valor;
  async function salvarEdicaoBanco(id: number, valor: string) {
    // Formatando;
    const valorNum = parseFloat(valor.replace(/\./g, '').replace(',', '.'));

    // UPDATE;
    const { error } = await supabase
      .from('Transacao')
      .update({ Valor: valorNum })
      .eq('id', id);

    // Em caso de erro;
    if (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível atualizar a transação.');
      return false;
    }

    // Atualiza;
    setTransacoes(prev =>
      prev.map(t => t.id === id ? { ...t, Valor: valorNum } : t)
    );

    return true;
  }

  // Excluir a transação, buscando pelo id;
  async function excluirTransacaoBanco(id: number) {
    // Alerta de confimação;
    Alert.alert(
      "Excluir transação",
      "Tem certeza que deseja excluir esta transação?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          style: "destructive",
          // Deleta a transação;
          onPress: async () => {
            const { error } = await supabase
              .from("Transacao")
              .delete()
              .eq("id", id);

            // Em caso de erro;
            if (error) {
              console.log(error);
              Alert.alert("Erro", "Não foi possível excluir a transação.");
              return;
            }

            // Remove da lista;
            setTransacoes((prev) => prev.filter((t) => t.id !== id));

            Alert.alert("Excluída!", "A transação foi removida com sucesso.");
          }
        }
      ]
    );
  }

  // Salvar edição;
  const salvarEdicao = async () => {
    // Garantindo preenchimento;
    if (valorEditando.trim() === '') {
      Alert.alert('Campo vazio!', 'Por favor, insira um valor válido.');
      return;
    }

    // Verifica valor;
    if (!validarValor(valorEditando)) {
      return;
    }

    if (editIndex !== null) {

      // Aguarda o update
      const ok = await salvarEdicaoBanco(
        transacoes[editIndex].id,
        valorEditando
      );

      // Se salvarEdicaoBanco retornar false dá erro;
      if (!ok) return;

      Alert.alert('Transação atualizada!', 'O valor foi alterado com sucesso!');
    }

    setModalEditarVisible(false);
    setEditIndex(null);
  };

  // Função para formatação de valores;
  function formatarNumero(n: number | string) {
    if (!n) return "0,00";
    return Number(n).toFixed(2).replace('.', ',');
  }

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content');

      // Carregando lista de transações;
      const fetchTransacoes = async () => {
        setCarregando(true);
        const userIdString = await AsyncStorage.getItem('userId');
        if (!userIdString) return setCarregando(false);
        const userId = Number(userIdString);

        const { data, error } = await supabase
          .from('Transacao')
          .select('*')
          .eq('UsuarioId', userId)
          .order('Data', { ascending: true });

        setCarregando(false);

        // Caso de erro;
        if (error) {
          console.log('Erro ao buscar transações:', error);
          return;
        }

        setTransacoes(data || []);
      };

      fetchTransacoes();
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
          <Texto style={styles.titulo}>Transações</Texto>

          <View style={styles.containerbox}>
            <View style={styles.centralizar}>
              <Texto style={styles.resumo}>Resumo</Texto>
            </View>

            <View style={{ flex: 1, width: '100%' }}>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                style={{ flex: 1 }}
                // Caso não exista transações, muda as configurações;
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: transacoes.length === 0 ? 'center' : 'flex-start',
                  paddingVertical: 20,
                }}
                showsVerticalScrollIndicator={false}
              >
                {/* Sem transações; */}
                {transacoes.length === 0 ? (
                  <View style={styles.centralizarTexto}>
                    <Texto style={styles.texto}>Nenhuma transação adicionada!</Texto>
                  </View>
                ) : (
                  // Com transações;
                  transacoes.map((item, index) => (
                    <TouchableOpacity
                      activeOpacity={1}
                      key={index}
                      style={[styles.containertransacoes, { width: '100%' }]}
                    >
                      <Texto style={styles.valortransacao}>
                        {item.Valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Texto>

                      {/* Dependendo do tipo, aparece a etiqueta correspondente; */}
                      <View
                        style={
                          item.Tipo
                            ? styles.categoriaReceita
                            : styles.categoriaDespesa
                        }>
                        <Texto
                          style={
                            item.Tipo
                              ? styles.categoriatransacaoReceita
                              : styles.categoriatransacaoDespesa
                          }>
                          {item.Tipo ? 'Receita' : 'Despesa'}
                        </Texto>
                      </View>

                      {/* Botão de editar e excluir as transações; */}
                      <View style={styles.functions}>
                        <TouchableOpacity onPress={() => editarTransacao(index)}>
                          <Ionicons
                            name="create-outline"
                            color="blue"
                            style={styles.editButton}
                          />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => excluirTransacaoBanco(transacoes[index].id)}>
                          <Ionicons
                            name="trash-outline"
                            color="red"
                            style={styles.deleteButton}
                          />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </View>

            {/* Adicionar Receita */}
            <TouchableOpacity onPress={abrirModalReceita} style={styles.botaoRec}>
              <Texto style={styles.botaoTextoRec}>Adicionar Receita</Texto>
            </TouchableOpacity>

            {/* Adicionar Despesa */}
            <TouchableOpacity onPress={abrirModalDespesa} style={styles.botaoDesp}>
              <Texto style={styles.botaoTextoDesp}>Adicionar Despesa</Texto>
            </TouchableOpacity>
          </View>

          {/* Modal (Pop-up) - Receita*/}
          <Modal
            animationType="fade"
            transparent
            visible={modalReceitaVisible}
            onRequestClose={() => setModalReceitaVisible(false)}
          >
            {/* Fundo escuro — fecha o modal se clicar fora */}
            <TouchableWithoutFeedback onPress={() => setModalReceitaVisible(false)}>
              <View style={styles.modalOverlay}>

                {/* Evita que o toque dentro do card feche o modal */}
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View style={styles.modalContainer}>
                    <Texto style={styles.modalTitulo}>Nova Receita</Texto>

                    <TextInput
                      placeholder="Digite o valor da receita..."
                      placeholderTextColor="#888"
                      keyboardType="numeric"
                      value={tempReceita}
                      onChangeText={(text) => {
                        // Mantém somente números e vírgula;
                        let limpo = text.replace(/[^\d,]/g, '');

                        // Impede mais de uma vírgula;
                        limpo = limpo.replace(/,+/g, ',');

                        setTempReceita(limpo);
                      }}
                      onBlur={() => {
                        // Somente quando sai de foco formata;
                        const numero = converterParaNumero(tempReceita);
                        if (!isNaN(numero)) {
                          setTempReceita(formatarNumero(numero));
                        }
                      }}
                      style={styles.modalInput}
                    />

                    <View style={styles.modalBotoes}>
                      <TouchableOpacity
                        style={[styles.modalBotao, { backgroundColor: '#038C8C' }]}
                        onPress={salvarReceita}
                      >
                        <Texto style={styles.modalTextoBotao}>Salvar</Texto>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.modalBotao, { backgroundColor: '#B3261E' }]}
                        onPress={cancelar}
                      >
                        <Texto style={styles.modalTextoBotao}>Cancelar</Texto>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {/* Modal (Pop-up) - Despesa */}
          <Modal
            animationType="fade"
            transparent
            visible={modalDespesaVisible}
            onRequestClose={() => setModalDespesaVisible(false)}
          >
            {/* Fundo escuro — fecha o modal se clicar fora */}
            <TouchableWithoutFeedback onPress={() => setModalDespesaVisible(false)}>
              <View style={styles.modalOverlay}>

                {/* Evita que o toque dentro do card feche o modal */}
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View style={styles.modalContainer}>
                    <Texto style={styles.modalTitulo}>Nova Despesa</Texto>

                    <TextInput
                      placeholder="Digite o valor da despesa..."
                      placeholderTextColor="#888"
                      keyboardType="numeric"
                      value={tempDespesa}
                      onChangeText={(text) => {
                        // Mantém somente números e vírgula;
                        let limpo = text.replace(/[^\d,]/g, '');

                        // Impede mais de uma vírgula;
                        limpo = limpo.replace(/,+/g, ',');

                        setTempDespesa(limpo);
                      }}
                      onBlur={() => {
                        // Somente quando sai de foco formata;
                        const numero = converterParaNumero(tempDespesa);
                        if (!isNaN(numero)) {
                          setTempDespesa(formatarNumero(numero));
                        }
                      }}
                      style={styles.modalInput}
                    />

                    <View style={styles.modalBotoes}>
                      <TouchableOpacity
                        style={[styles.modalBotao, { backgroundColor: '#038C8C' }]}
                        onPress={salvarDespesa}
                      >
                        <Texto style={styles.modalTextoBotao}>Salvar</Texto>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.modalBotao, { backgroundColor: '#B3261E' }]}
                        onPress={cancelar}
                      >
                        <Texto style={styles.modalTextoBotao}>Cancelar</Texto>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {/* Modal - Editar */}
          <Modal
            animationType="fade"
            transparent
            visible={modalEditarVisible}
            onRequestClose={() => setModalEditarVisible(false)}
          >
            {/* Fundo escuro — fecha o modal se clicar fora */}
            <TouchableWithoutFeedback onPress={() => setModalEditarVisible(false)}>
              <View style={styles.modalOverlay}>

                {/* Evita que o toque dentro do card feche o modal */}
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View style={styles.modalContainer}>
                    <Texto style={styles.modalTitulo}>Editar Transação</Texto>

                    <TextInput
                      placeholder="Digite o novo valor..."
                      placeholderTextColor="#888"
                      keyboardType="numeric"
                      value={valorEditando}
                      onChangeText={(text) => {
                        // Mantém somente números e vírgula;
                        let limpo = text.replace(/[^\d,]/g, '');

                        // Impede mais de uma vírgula;
                        limpo = limpo.replace(/,+/g, ',');

                        setValorEditando(limpo);
                      }}
                      onBlur={() => {
                        // Somente quando sai de foco formata;
                        const numero = converterParaNumero(valorEditando);
                        if (!isNaN(numero)) {
                          setValorEditando(formatarNumero(numero));
                        }
                      }}
                      style={styles.modalInput}
                    />

                    <View style={styles.modalBotoes}>
                      <TouchableOpacity
                        style={[styles.modalBotao, { backgroundColor: '#038C8C' }]}
                        onPress={salvarEdicao}
                      >
                        <Texto style={styles.modalTextoBotao}>Salvar</Texto>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.modalBotao, { backgroundColor: '#B3261E' }]}
                        onPress={() => setModalEditarVisible(false)}
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
