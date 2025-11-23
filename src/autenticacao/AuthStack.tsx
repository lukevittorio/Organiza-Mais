import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importação das Telas Iniciais;
import Inicial from "../telas/tela-inicial/index";
import Login from "../telas/login/index";
import Cadastro from "../telas/cadastro/index";

// Criando o StackNavigator para navegação entre telas;
const Stack = createNativeStackNavigator<AuthStackParamList>();

// Definindo as propiedades que o componente recebe, a função 'setLoggedIn' muda o estado de login do usuário;
interface AuthStackProps {
  setLoggedIn: (value: boolean) => void;
}

// Definição de nome das telas e seus parâmetros (undefined: elas não recebem parâmetros);
export type AuthStackParamList = {
  Inicial: undefined;
  Login: undefined;
  Cadastro: undefined;
};

// Componente principal que será utilizado no App.tsx;
export default function AuthStack({ setLoggedIn }: AuthStackProps) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Adiciona a tela Inicial; */}
      <Stack.Screen name="Inicial" component={Inicial} /> 

      {/* Passa as props do react navigation e passa a função do App para a tela de Login; */}
      {/* Sendo assim, quando logar, a tela realiza 'setLoggedIn(true);' e é redirecionada as telas que possuem menu; */}
      <Stack.Screen name="Login">
        {(props) => <Login {...props} setLoggedIn={setLoggedIn} />}
      </Stack.Screen>

      {/* Tela de Cadastro sendo adicionada; */}
      <Stack.Screen name="Cadastro" component={Cadastro} />
    </Stack.Navigator>
  );
}