// App.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AddScheduleScreen from './screens/AddScheduleScreen';
import { addService, createTable } from './database/scheduleDB';
import ServiceScreen from './screens/ServiceScreen';
import { useFonts } from 'expo-font';

const Stack = createStackNavigator();
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
                        backgroundColor: '#1A2833',

                    },
                    headerTitleStyle: {
                        color: '#E3E3E3',
                        fontFamily: 'LeagueSpartan-Bold'
                    },
                    drawerLabelStyle: {
                        color: '#E3E3E3',
                        fontFamily: 'LeagueSpartan-SemiBold'
                    }

                }} />

                <Drawer.Screen name="AddSchedule" component={AddScheduleScreen}
                    options={{
                        title: 'Novo Agendamento',
                        headerStyle: {
                            backgroundColor: '#1A2833'
                        },
                        headerTitleStyle: {
                            color: '#E3E3E3',
                            fontFamily: 'LeagueSpartan-Bold'
                        },
                        drawerLabelStyle: {
                            color: '#E3E3E3',
                            fontFamily: 'LeagueSpartan-SemiBold'
                        }

                    }} />
                <Drawer.Screen name="ServiceScreen" component={ServiceScreen}
                    options={{
                        title: 'Novo Serviço',
                        headerStyle: {
                            backgroundColor: '#1A2833'
                        },
                        headerTitleStyle: {
                            color: '#E3E3E3',
                            fontFamily: 'LeagueSpartan-Bold'
                        },
                        drawerLabelStyle: {
                            color: '#E3E3E3',
                            fontFamily: 'LeagueSpartan-SemiBold'
                        }
                    }} />


            </Drawer.Navigator>
        </NavigationContainer>

    );
}
