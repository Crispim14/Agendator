// App.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AddScheduleScreen from './screens/AddScheduleScreen';
import { addService, createTable } from './database/scheduleDB';
import ServiceScreen from './screens/ServiceScreen';
import ServiceListScreen from './screens/ServiceListScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
export default function App() {
    useEffect(() => {
        createTable(); // Cria a tabela ao iniciar o aplicativo
    }, []);

    return (
        <NavigationContainer>
            <Drawer.Navigator screenOptions={{
                drawerStyle: {
                    backgroundColor: '#1A2833',
                },
                drawerLabelStyle: {
                    color: '#E3E3E3',
                },
                headerTintColor: '#E3E3E3',
            }} initialRouteName="Home">
                <Drawer.Screen name="Home" component={HomeScreen} options={{
                    title: 'Agendamentos',
                    headerStyle: {
                        backgroundColor: '#1A2833'
                    },
                    headerTitleStyle: {
                        color: '#E3E3E3',
                    }
                }} />
                <Drawer.Screen name="AddSchedule" component={AddScheduleScreen} options={{
                    title: 'Novo Agendamento',
                    headerStyle: { backgroundColor: '#1A2833' },
                    headerTitleStyle: { color: '#E3E3E3', }
                }} />

                <Drawer.Screen name="ServiceListScreen" component={ServiceListScreen} options={{
                    title: 'Lista de Serviços',
                    headerStyle: { backgroundColor: '#1A2833' },
                    headerTitleStyle: { color: '#E3E3E3', }
                }} />

                <Drawer.Screen
                    name="ServiceScreen"
                    component={ServiceScreen}
                    options={{
                        drawerLabel: () => null, // Esconder no Drawer
                        title: 'Novo Serviço', // Título da tela quando acessada
                        headerStyle: { backgroundColor: '#1A2833' },
                        headerTitleStyle: { color: '#E3E3E3' },
                    }}
                />  

                {/* A tela "Novo Serviço" foi removida do Drawer */}
            </Drawer.Navigator>
            {/* <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} options={{
                    title: 'Agendamentos', headerStyle: {
                        backgroundColor: '#1A2833'

                    },
                    headerTitleStyle: {
                        color: '#E3E3E3',
                    }

                }} />
                <Stack.Screen name="AddSchedule" component={AddScheduleScreen} options={{
                    title: 'Novo Agendamento', headerStyle: {
                        backgroundColor: '#1A2833'
                    }, headerTitleStyle: { color: '#E3E3E3', }
                }}
                />
            </Stack.Navigator> */}
        </NavigationContainer>

    );
}
