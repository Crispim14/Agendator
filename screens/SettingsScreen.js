import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Platform, ToastAndroid, ScrollView ,Share} from 'react-native';
import { getSchedulesMonth,getSchedules1,getSchedulesYear, getSchedulesRange,  dropTable, createTable } from '../database/scheduleDB';
import BtnPadraoMenor from '../components/BtnPadraoMenor';
import { useTheme } from '../ThemeContext'; // Importa o contexto de tema
import * as LocalAuthentication from 'expo-local-authentication';

const ReportsScreen = ({ route, navigation }) => {
    const { theme } = useTheme(); // Obtém o tema atual


    const [isAuthenticated, setIsAuthenticated] = useState(false);


    useEffect(() => {

        const checkAuthentication = async () => {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (!hasHardware || !isEnrolled) {
                Alert.alert(
                    'Autenticação indisponível',
                    'Seu dispositivo não suporta biometria ou PIN configurado.'
                );
            }
        };

        checkAuthentication();

    }, []);

    const handleAuthentication = async () => {
        try {
            const authResult = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Autenticar',
                fallbackLabel: 'Usar PIN',
            });

            if (authResult.success) {
                handleResetar();
            } else {
                Alert.alert('Autenticação falhou', 'Tente novamente.');
            }
        } catch (error) {
            console.error('Erro na autenticação:', error);
            Alert.alert('Erro', 'Ocorreu um erro durante a autenticação.');
        }

        ////Olá [nome do cliente], você possui agendado o serviço [serviço agendado] às [hora do serviço] do dia [data do agendamento] na [empresa]

    };


    
    const handleResetar = async () => {
        try {
            
                const  reset =  await dropTable();

                            
                const  createT=  await createTable();

        } catch (error) {
            console.error('Erro na autenticação:', error);
            Alert.alert('Erro', 'Ocorreu um erro durante a autenticação.');
        }
    };


    return (
        <ScrollView style={{ flex: 1, padding: 16, backgroundColor: theme.background }}>


<BtnPadraoMenor propOnPress={handleAuthentication}>Resetar dados</BtnPadraoMenor>
        </ScrollView>
    );
};

export default ReportsScreen;
