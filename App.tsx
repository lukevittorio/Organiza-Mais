import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AuthStack from './src/autenticacao/AuthStack';
import Main from './src/telas-internas/Main';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      {loggedIn ? (
        <Main setLoggedIn={setLoggedIn} /> // Menu e telas internas;
      ) : (
        <AuthStack setLoggedIn={setLoggedIn} /> // "Autenticação" do login;
      )}
    </NavigationContainer>
  );
}