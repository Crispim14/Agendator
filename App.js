// App.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AddScheduleScreen from './screens/AddScheduleScreen';
import { createTable } from './database/scheduleDB';

const Stack = createStackNavigator();

export default function App() {
    useEffect(() => {
        createTable(); // Cria a tabela ao iniciar o aplicativo
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Agendamentos' }} />
                <Stack.Screen name="AddSchedule" component={AddScheduleScreen} options={{ title: 'Novo Agendamento' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
