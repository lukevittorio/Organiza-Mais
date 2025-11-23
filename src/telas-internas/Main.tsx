// MainStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importação das telas;
import Menu from './Menu';
import Perfil from "../telas/perfil/index";
import Transacoes from "../telas/transacoes/index";
import Planejamento from "../telas/planejamento/index";

// Definição de nome das telas e seus parâmetros (undefined: elas não recebem parâmetros);
export type MainStackParamList = {
    Menu: undefined;
    Perfil: undefined;
    Transações: undefined;
    Planejamento: undefined;
};

// Criando o StackNavigator para navegação entre telas;
const Stack = createNativeStackNavigator<MainStackParamList>();

// Para deslogar;
interface MainStackProps {
    setLoggedIn: (value: boolean) => void;
}

// Componente principal que será utilizado no App.tsx;
export default function MainStack({ setLoggedIn }: MainStackProps) {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* Importa o menu; */}
            <Stack.Screen name="Menu" component={Menu} />

            {/* Importa as telas 'extras' que existem dentro do aplicativo; */}
            <Stack.Screen name="Perfil" >
                {(props) => <Perfil {...props} setLoggedIn={setLoggedIn} />}
            </Stack.Screen>

            <Stack.Screen name="Transações" component={Transacoes} />
            <Stack.Screen name="Planejamento" component={Planejamento} />
        </Stack.Navigator>
    );
}