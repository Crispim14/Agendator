import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Platform, ToastAndroid, ScrollView, Share } from 'react-native';
import { getSchedulesMonth, getMessage, getSchedules1, getSchedulesYear, getSchedulesRange, dropTable, createTable, deleteFirstAccess, updateSettings } from '../database/scheduleDB';
import BtnPadraoMenor from '../components/BtnPadraoMenor';
import { useTheme } from '../ThemeContext'; 
import * as LocalAuthentication from 'expo-local-authentication';
import Txt from '../components/Txt';

const ReportsScreen = ({ route, navigation }) => {
    const { theme } = useTheme(); 



    function showToast(text) {
        ToastAndroid.show(text, ToastAndroid.SHORT);
    }
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userConfig, setUserConfig] = useState([]);
    const [msg, setMsg] = useState('');
    const defaultMessage = 'Olá [nome do cliente], você possui agendado o serviço [serviço agendado] às [hora do serviço] do dia [data do agendamento] na [empresa]'

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

        const handleConfig = async () => {
            const config =  await  getMessage();
            setUserConfig(config);
            setMsg(userConfig.standard_message)
        };

     

        handleConfig();
        checkAuthentication();

    }, []);


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

                Alert.alert(
                    "Reinicializar sistema",
                    "Tem certeza de que deseja reinicializar sistema? Alguns dados podem ser perdidos no processo",
                    [
                        { text: "Cancelar", style: "cancel" },
                        { text: "Reinicializar", style: "destructive", onPress: handleResetar }
                    ],
                    { cancelable: true }
                );

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

            await dropTable();
            await deleteFirstAccess();

            await createTable();

            showToast('Dados resetados com sucesso');

            navigation.navigate('Home', { refresh: true });

        } catch (error) {
            console.error('Erro na autenticação:', error);
            Alert.alert('Erro', 'Ocorreu um erro durante a autenticação.');
        }
    };

  const updateUserConfig = async (newConfig) => {
    setUserConfig((prevState) => ({
      ...prevState, 
      ...newConfig, 
    }));


  };


  const updateUserSettigns = async () => {
  

    await updateSettings(userConfig);


  };

  
  const handleMessageChange = (newMessage) => {
    updateUserConfig({ standard_message: newMessage });
  };

 


    return (
        <ScrollView style={{ flex: 1, padding: 16, backgroundColor: theme.background }}>


            <BtnPadraoMenor propOnPress={handleAuthentication}  bgColor="red">Reinicializar sistema</BtnPadraoMenor>
            <Txt text={'Mensagem padrao atual:'} />
            <TextInput
  value={userConfig.standard_message}
  onChangeText={handleMessageChange}
  style={{
    borderBottomWidth: 1,
    marginBottom: 16,
    color: theme.text,
    height: 100,
    paddingHorizontal: 8, 
    paddingVertical: 10, 
  }}
  multiline={true} 
  numberOfLines={4} 
/>
<Txt text={'Siga o padrão abaixo para conseguir personalizar a mensagem'} />
<Text numberOfLines={4}  style={{ flex: 1, padding: 16, color: theme.text }}>
    {defaultMessage}
</Text>

<BtnPadraoMenor propOnPress={updateUserSettigns}  >Salvar configurações</BtnPadraoMenor>
        </ScrollView>
    );
};

export default ReportsScreen;
