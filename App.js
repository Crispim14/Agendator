// App.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';   
import { ThemeProvider, useTheme } from './ThemeContext'; // Use apenas o ThemeProvider e useTheme
import HomeScreen from './screens/HomeScreen';
import AddScheduleScreen from './screens/AddScheduleScreen';
import { createTable } from './database/scheduleDB';
import ServiceScreen from './screens/ServiceScreen';
import ServiceEditScreen from './screens/ServiceEditScreen';
import ServiceListScreen from './screens/ServiceListScreen';
import ServiceProviderListScreen from './screens/ServiceProviderListScreen';
import ServiceProviderEditScreen from './screens/ServiceProviderEditScreen';
import { useFonts } from 'expo-font';
import ReportsScreen from './screens/ReportsScreen';
import SettingsScreen from './screens/SettingsScreen';

const Drawer = createDrawerNavigator();

export default function App() {
    useEffect(() => {
        createTable(); // Cria a tabela ao iniciar o aplicativo
    }, []);

    const [fontsLoaded] = useFonts({
        'LeagueSpartan-Bold': require('./assets/fonts/LeagueSpartan-Bold.ttf'),
        'LeagueSpartan-ExtraLight': require('./assets/fonts/LeagueSpartan-ExtraLight.ttf'),
        'LeagueSpartan-Regular': require('./assets/fonts/LeagueSpartan-Regular.ttf'),
        'LeagueSpartan-SemiBold': require('./assets/fonts/LeagueSpartan-SemiBold.ttf'),
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <ThemeProvider>
            <NavigationContainer>
                <Drawer.Navigator
                    screenOptions={({ route }) => {
                        const { theme } = useTheme();
                        return {
                            drawerStyle: {
                                backgroundColor: theme.background,
                            },
                            drawerLabelStyle: {
                                color: theme.text,
                                fontFamily: 'LeagueSpartan-SemiBold',
                            },
                            headerStyle: {
                                backgroundColor: theme.background,
                            },
                            headerTintColor: theme.text,
                            headerTitleStyle: {
                                fontFamily: 'LeagueSpartan-Bold',
                            },
                        };
                    }}
                    initialRouteName="Home"
                >
                    <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Agendamentos' }} />
                    <Drawer.Screen name="AddSchedule" component={AddScheduleScreen} options={{ title: 'Novo Agendamento' }} />
                    <Drawer.Screen name="ServiceScreen" component={ServiceScreen} options={{ title: 'Novo Serviço' }} />
                    <Drawer.Screen
                        name="ServiceEditScreen"
                        component={ServiceEditScreen}
                        options={{
                            title: 'Editar Serviço',
                            drawerItemStyle: { display: 'none' }, // Esconde o botão do Drawer
                        }}
                    />
                    <Drawer.Screen name="ServiceProviderScreen" component={ServiceProviderEditScreen} options={{ title: 'Novo Colaborador' }} />
                    <Drawer.Screen
                        name="ServiceProviderEditScreen"
                        component={ServiceProviderEditScreen}
                        options={{
                            title: 'Editar Colaborador',
                            drawerItemStyle: { display: 'none' }, // Esconde o botão do Drawer
                        }}
                    />
                    <Drawer.Screen name="ServiceList" component={ServiceListScreen} options={{ title: 'Lista de Serviços' }} />
                    <Drawer.Screen name="ServiceProviderList" component={ServiceProviderListScreen} options={{ title: 'Lista de Colaboradores' }} />

                    <Drawer.Screen name="ReportsScreen" component={ReportsScreen} options={{ title: 'Relatórios' }} />

                    <Drawer.Screen name="SettingsScreen" component={SettingsScreen} options={{ title: 'Configurações' }} />
                </Drawer.Navigator>
            </NavigationContainer>
        </ThemeProvider>
    );
}
