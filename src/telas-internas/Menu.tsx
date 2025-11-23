import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Menu inferior;
import { Ionicons } from '@react-native-vector-icons/ionicons'

// Importação das telas;
import Home from "../telas/home/index";
import Transacoes from "../telas/transacoes/index";
import Planejamento from "../telas/planejamento/index";

// Definição de nome das telas e seus parâmetros (undefined: elas não recebem parâmetros);
export type AppTabsParamList = {
    Home: undefined;
    Transações: undefined;
    Planejamento: undefined;
};

// Criando o TabNavigator, renderizando o menu;
const Tab = createBottomTabNavigator<AppTabsParamList>();

// Componente principal que será utilizado no Main.tsx;
export default function Menu() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: any;

                    if (route.name === 'Home') {
                        iconName = focused
                        ? 'home'
                        : 'home-outline';
                    }

                    if (route.name === 'Transações') {
                        iconName = focused
                        ? 'cash' 
                        : 'cash-outline';
                    }

                    if (route.name === 'Planejamento') {
                        iconName = focused
                        ? 'calendar'
                        : 'calendar-outline';
                    }

                    return <Ionicons name={iconName} color={color} size={size}/>;
                },
                tabBarActiveTintColor: '#038C8C',
                tabBarInactiveTintColor: '#055757ae',
            })}
            initialRouteName="Home"
        >
            {/* Definindo as telas e seus respectivos nomes para o menu */}
            <Tab.Screen name="Transações" component={Transacoes} />
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Planejamento" component={Planejamento} />

        </Tab.Navigator>
    );
}

