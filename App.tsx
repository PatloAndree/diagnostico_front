/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Login from './src/screens/Login';
import Inicio from './src/screens/Inicio';
import Listado from './src/screens/Listado';
import Instituciones from './src/screens/Instituciones';
import Diagnostico from './src/screens/Diagnostico';
import DiagnosticosListado from './src/screens/DiagnosticosListado';
import DiagnosticoDetalle from './src/screens/DiagnosticoDetalle';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          animation: 'fade',
        }}>
        <Stack.Screen name="Login" options={{ headerShown: false }}  component={Login} />
        <Stack.Screen name="Inicio" options={{ headerShown: false }}  component={Inicio} />
        <Stack.Screen name="Listado" options={{ headerShown: false }} component={Listado} />
        <Stack.Screen name="Instituciones" options={{ headerShown: false }} component={Instituciones} />
        <Stack.Screen name="Diagnostico" options={{ headerShown: false }} component={Diagnostico} />
        <Stack.Screen name="DiagnosticosListado" options={{ headerShown: false }} component={DiagnosticosListado} />
        <Stack.Screen name="DiagnosticoDetalle" options={{ headerShown: false }} component={DiagnosticoDetalle} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
