//import RNFS from 'react-native-fs'; // Import RNFS at the top
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, Button, Platform, StyleSheet,Alert  } from 'react-native';
import { getSchedules, getServices, getDataSchedules,addRamoAtividade, getAcess, addFirstAccess} from '../database/scheduleDB';
import  createBackup from '../database/Backup';
import * as DocumentPicker from 'expo-document-picker';
import Txt from '../components/Txt';
import DateTimePicker from '@react-native-community/datetimepicker';
import BtnPadrao from '../components/BtnPadrao';
import SttsBar from '../components/SttsBar';
import { useTheme } from '../ThemeContext';
import * as LocalAuthentication from 'expo-local-authentication';
//import * as FileSystem from 'expo-file-system';
//import RNFS from 'react-native-fs'; // Importar o RNFS corretamente
//import RNFS from 'react-native-fs';
//import FileSystem from "expo-file-system"
// import * as FileSystem from 'expo-file-system';


const HomeScreen = ({ navigation }) => {
    const { theme, toggleTheme } = useTheme(); // Obtém o tema e a função para alternar o tema
    const [schedules, setSchedules] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);



    const pickDocument  = async () => {
        try {
          // Abre o seletor de documentos
          const result = await DocumentPicker.getDocumentAsync({
            type: '*/*',  // Escolher o tipo de arquivo
          });

          if (result.type === 'success') {
           
            const sourceUri = result.uri;
            const fileName = sourceUri.split('/').pop(); // Extrair o nome do arquivo
            const destinationUri = FileSystem.documentDirectory + fileName; // Caminho no documentDirectory

            // Mover o arquivo selecionado para o documentDirectory
            await FileSystem.moveAsync({
              from: sourceUri,
              to: destinationUri,
            });

     
            
          } else {
         
          }
        } catch (error) {
          console.error('Erro ao mover o arquivo:', error);
        }
      };


      const funcaoteste = async () => {
        // console.log(`aaaaa`)
        // try {
        //   // Abre o seletor de documentos
        //   const result = await DocumentPicker.getDocumentAsync({
        //     type: '*/*',
        //   });
      
       
      
        //   const sourceUri = (result.assets[0].uri);
        //   const fileName = result.assets[0].name; // Extrair o nome do arquivo
      
        //   // Definir o caminho da pasta Downloads (ajuste de acordo com sua plataforma)
        //   const destinationPath = `${RNFS.ExternalStorageDirectoryPath}/Download/teste.txt`;
      
        //   // Copiar o arquivo selecionado para a pasta Downloads
        //   await RNFS.copyFile(sourceUri, destinationPath);
      
      
        // } catch (error) {
        //   console.error('Erro ao copiar o arquivo:', error);
        // }
      };

const copyFile = async (fileContent) => {



  };



    
    const handleGenerateBackup = async () => {
       
        try {
            console.log('try inicio')
            await createBackup();  // Garantir que a função seja aguardada
           
           
        } catch (error) {
          
            console.error("Erro ao gerar o backup:", error);
        }
    
    };
 
    const onChangeDate = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
            setSelectedDate(selectedDate.toISOString().split('T')[0]);
        }

    
    };

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const schedulesData = await getDataSchedules(selectedDate);
                setSchedules(schedulesData);
            } catch (error) {
                console.error('Erro ao buscar agendamentos:', error);
            }
        };

        const verifyAcess = async () => {
            try {
                const acess = await getAcess();
                 if(!acess || acess.length === 0){


            await addFirstAccess(); 

                 }else{
                  

                 }

            } catch (error) {
                console.error('Erro ao buscar agendamentos:', error);
            }
        };


      //  checkAuthentication();
        fetchSchedules();
        verifyAcess();

        const unsubscribe = navigation.addListener('focus', fetchSchedules);
        return unsubscribe;
    }, [navigation, selectedDate]);

    const handleAuthentication = async () => {
        try {
            const authResult = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Autenticar',
                fallbackLabel: 'Usar PIN',
            });

            if (authResult.success) {
                setIsAuthenticated(true);
            } else {
                Alert.alert('Autenticação falhou', 'Tente novamente.');
            }
        } catch (error) {
            console.error('Erro na autenticação:', error);
            Alert.alert('Erro', 'Ocorreu um erro durante a autenticação.');
        }
    };


    const renderItem = ({ item }) => (
        <Pressable onPress={() => navigation.navigate('AddSchedule', { schedule: item })}>
            <View style={[styles.itemContainer, { backgroundColor: new Date(`${item.date}T${item.time}`) < new Date() ? 'red' : '#0CABA8' }]}>
                <Txt text={`${item.time} - ${item.name}`} />
                <Txt text={`Serviço ${item.description}`} />
            </View>
        </Pressable>
    );

     
    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <SttsBar />

            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={onChangeDate}
                />
            )}

            <Text style={[styles.text, { color: theme.text }]}>{`Data selecionada ${selectedDate}`}</Text>

            <BtnPadrao propOnPress={() => navigation.navigate('AddSchedule')}>
                <Text style={[styles.btnText, { color: theme.text }]}>Novo Agendamento</Text>
            </BtnPadrao>

            <BtnPadrao propOnPress={() => setShowDatePicker(true)}>
                <Text style={[styles.btnText, { color: theme.text }]}>Mudar Data</Text>
            </BtnPadrao>

            <FlatList
                data={schedules}
                renderItem={renderItem}
                keyExtractor={(item, index) => {
                   
                    return item.id ? item.id.toString() : index.toString();
                }}
            />




            <Button
                title="Alternar Tema"
                onPress={toggleTheme}
                color={theme.text}
            />
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        fontFamily: 'LeagueSpartan-Regular',
    },
    btnText: {
        fontSize: 20,
        textAlign: 'center',
        margin: 20,
    },
    itemContainer: {
        padding: 20,
        marginVertical: 8,
    },
});

export default HomeScreen;
