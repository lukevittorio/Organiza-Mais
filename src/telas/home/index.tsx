import React, { useState } from 'react';
import { StatusBar, Platform, View, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@react-native-vector-icons/ionicons'

// Importações internas;
import Texto from '../../componentes/texto';
import styles from "./estiloHome";
import { MainStackParamList } from '../../telas-internas/Main';
import { supabase } from '../../../utils/supabaseClient';

// Definindo que a navegação só acontece entre as telas incluidas no AuthStackParamList (Menu, Pendências e Perfil);
type InicialScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Menu'>;

// O componente recebe navigation como prop;
type Props = {
  navigation: InicialScreenNavigationProp;
};

// Componente principal;
export default function Home({ navigation }: Props) {
  // Nome;
  const [nomeUsuario, setNomeUsuario] = useState('');

  // Saldo;
  const [saldo, setSaldo] = useState(0);
  const [mostrarSaldo, setMostrarSaldo] = useState(false);

  // Planejamento;
  const [despesaPlan, setDespesaPlan] = useState(0);
  const [saldoPlanejamento, setSaldoPlanejamento] = useState(0);

  // Transações;
  type Transacao = {
    id: number;
    UsuarioId: number;
    Tipo: boolean;   // true = receita, false = despesa
    Valor: number;
    Data: string;
    Descricao?: string | null;
  };

  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      // Ao entrar na tela, define o estilo de acordo com o sistema;
      if (Platform.OS === 'android') {
        StatusBar.setBarStyle('light-content');
      } else {
        StatusBar.setBarStyle('dark-content');
      }

      // Buscando nome;
      async function fetchNome() {
        // Buscando ID;
        const userIdString = await AsyncStorage.getItem('userId');
        if (!userIdString) return;
        const userId = Number(userIdString);

        // Busacando nome pelo ID;
        const { data, error } = await supabase
          .from('usuario')
          .select('Nome')
          .eq('id', userId)
          .single(); // Retorna um objeto único;

        // Em caso de erro;
        if (error) {
          console.log('Erro ao buscar nome:', error);
          return;
        }

        // Mostra o nome;
        setNomeUsuario(data.Nome);
      }

      fetchNome();

      async function fetchSaldo() {
        // ID obtido no login;
        const userIdString = await AsyncStorage.getItem('userId');
        if (!userIdString) return;
        const userId = Number(userIdString);

        // Buscando transações do user através do ID;
        const { data, error } = await supabase
          .from('Transacao')
          .select('*')
          .eq('UsuarioId', userId);

        // Caso de erro.
        if (error) {
          console.log('Erro ao buscar saldo:', error);
          return;
        }

        // Lista de transações;
        setTransacoes(data || []);

        // Calcula saldo;
        calcularSaldo(data || []);
      }

      fetchSaldo();

      const carregarPlanejamento = async () => {
        try {
          // ID user;
          const userIdString = await AsyncStorage.getItem("userId");
          if (!userIdString) return;

          const userId = Number(userIdString);

          // Informações Planejamento;
          const { data, error } = await supabase
            .from("Planejamento Futuro")
            .select("ValorDespesa")
            .eq("UsuarioId", userId)
            .single();

          if (!data) return;

          // Definindo valores;
          setDespesaPlan(data.ValorDespesa);

        } catch (err) {
          console.log("Erro ao carregar planejamento:", err);
        }
      };

      carregarPlanejamento();

      // Cálculo das despesas reais;
      const totalDespesasReais = transacoes
        .filter(t => t.Tipo === false)
        .reduce((acc, t) => acc + (t?.Valor ?? 0), 0);

      // Saldo final;
      const saldo = despesaPlan - totalDespesasReais;

      setSaldoPlanejamento(saldo);

    }, [despesaPlan, transacoes])
  );

  // Calculando o saldo com base nas transações;
  function calcularSaldo(lista: any[]) {
    if (!lista || lista.length === 0) {
      setSaldo(0);
      return;
    }

    const total = lista.reduce((acc, item) => {
      return item.Tipo ? acc + item.Valor : acc - item.Valor;
    }, 0);

    setSaldo(total);
  }

  // Calculando total de receitas;
  const receitasTotal = transacoes
    .filter(t => t.Tipo === true)
    .reduce((acc, t) => acc + (t?.Valor ?? 0), 0);

  // Calculando total de despesas;
  const despesasTotal = transacoes
    .filter(t => t.Tipo === false)
    .reduce((acc, t) => acc + (t?.Valor ?? 0), 0);

  // Informações do gráfico;
  const dataGrafico = [
    {
      name: "Receitas",
      value: receitasTotal,
      color: "#79C704",
      legendFontColor: "#333",
      legendFontSize: 15
    },
    {
      name: "Despesas",
      value: despesasTotal,
      color: "#038C8C",
      legendFontColor: "#333",
      legendFontSize: 15
    }
  ];

  // Tamanho do gráfico;
  const screenWidth = Dimensions.get("window").width;

  // Verificar existência de planejamento;
  const temPlanejamento = despesaPlan > 0;

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
          <View style={styles.containerheader}>
            <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
              <Image source={require('../../../assets/perfil.png')} style={styles.img} resizeMode="cover" />
            </TouchableOpacity>

            {/* Nome; */}
            <Texto style={styles.textoHeader} numberOfLines={1} ellipsizeMode="tail">
              {nomeUsuario || 'Carregando...'}
            </Texto>
          </View>

          {/* Saldo; */}
          <View style={styles.containersaldo}>
            <Texto style={styles.titulosaldo}>Saldo</Texto>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {mostrarSaldo ? (
                <Texto
                  style={[
                    styles.saldo,
                    saldo < 0 ? styles.saldoNegativo : styles.saldoPositivo
                  ]}
                >
                  {saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </Texto>
              ) : (
                <View style={styles.linhaSaldoOculto}/>
              )}

              <TouchableOpacity
                onPress={() => setMostrarSaldo(!mostrarSaldo)}
                style={{ marginLeft: 10 }}
              >
                <Ionicons
                  name={mostrarSaldo ? "eye-off-outline" : "eye-outline"}
                  size={28}
                  color="#555"
                />
              </TouchableOpacity>
            </View>
          </View>

        </SafeAreaView>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent} // Padding da página dentro do scroll;
        >

          <TouchableOpacity onPress={() => navigation.navigate('Transações')} style={styles.containerbox}>
            {transacoes.length > 0 ? (
              <View style={styles.graficoContainer}>
                <View style={styles.graficoWrapper}>
                  {/* Gráfico de pizza */}
                  <PieChart
                    data={dataGrafico}
                    width={screenWidth} // Metade da largura da tela;
                    height={150}
                    chartConfig={{
                      backgroundColor: "#fffdff",
                      backgroundGradientFrom: "#fffdff",
                      backgroundGradientTo: "#fffdff",
                      color: () => "#0E3939",
                    }}
                    accessor={"value"}
                    backgroundColor={"transparent"}
                    paddingLeft={"0"}
                    hasLegend={false} // Desliga legenda padrão;
                  />
                </View>

                {/* Legenda personalizada; */}
                <View style={styles.graficoLegenda}>
                  {dataGrafico.map((item, i) => (
                    <View key={i} style={styles.legendaItem}>

                      {/* Quadradinho colorido; */}
                      <View
                        style={[styles.legendaQuadrado, { backgroundColor: item.color }]}
                      />

                      {/* Nome e valor; */}
                      <Texto style={styles.legendaTexto}>
                        <Texto style={{ fontSize: 16 }}>{item.name}</Texto>
                        {`:  ${item.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                      </Texto>
                    </View>
                  ))}
                </View>

              </View>
            ) : (
              <Texto style={styles.textoTransacoes}>
                Nenhuma transação para exibir.
              </Texto>
            )}
          </TouchableOpacity>


          <TouchableOpacity
            onPress={() => navigation.navigate('Planejamento')}
            style={styles.containerbox}
          >
            {temPlanejamento ? (
              <>
                {saldoPlanejamento >= 0 ? (
                  <>
                    <Texto style={styles.textoplanejamento}>Você pode gastar:</Texto>
                    <Texto
                      style={[
                        styles.saldoplanejamento,
                        saldoPlanejamento > 0 ? styles.planejamentoPositivo : {}
                      ]}
                    >
                      {saldoPlanejamento.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </Texto>
                  </>
                ) : (
                  <>
                    <Texto style={[styles.textoplanejamento, { color: "#B3261E" }]}>
                      Você gastou mais do que deveria!
                    </Texto>

                    <View style={styles.containerDevendo}>
                      <Texto style={[styles.textoplanejamento, { color: "#0E3939" }]}>
                        Está devendo:
                      </Texto>

                      <Texto style={[styles.saldoplanejamento, styles.planejamentoNegativo]}>
                        {" "}
                        {Math.abs(saldoPlanejamento).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2
                        })}
                      </Texto>
                    </View>
                  </>
                )}
              </>
            ) : (
              <Texto style={styles.textoSemPlanejamento}>
                Nenhum planejamento definido!
              </Texto>
            )}
          </TouchableOpacity>

        </ScrollView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}
