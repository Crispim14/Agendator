
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Platform, ToastAndroid } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {  deleteService, updateService, addService } from '../database/scheduleDB';
import Txt from '../components/Txt';
import BtnPadraoMenor from '../components/BtnPadraoMenor';


function showToast(text) {
    ToastAndroid.show(text, ToastAndroid.SHORT);
  }

const ServiceScreen = ({ route, navigation }) => {
    const service = route.params?.service || {};
    const [name, setName] = useState(service.name || '');
    const [description, setDescription] = useState(service.phone || '');
 
    const [msgError, setMsgError] = useState({
        nameError: '',
        descriptionError: '',
        


    });


    const clearFormData = () => {
        setName('');
        setDescription('');
   
    };


const clearErrors = () =>{
    setMsgError({
        nameError: '',
        descriptionError: '',
      });
      
}

    const checkErros = () => {

        clearErrors();

        let error = false;
        if (!name.trim()) {
            setMsgError(prevState => ({
                ...prevState,
                nameError: 'Digite um nome para o serviço'
            }));
            error = true;
        } 
         if (!description.trim()) {
            setMsgError(prevState => ({
                ...prevState,
                descriptionError: 'Digite uma descrição para o servio'
            }));
            error = true;
        } 
        

        return error
    }

    const saveService = async () => {
        try {

            if (checkErros() == true) {
                return;
            }
    
         
            const newService = { name, description };


            proceedSave(newService);
        } catch (error) {
           
            showToast('Ocorreu um erro ao salvar o serviço.');
        }
    };

    const proceedSave = async (newService) => {
        try {
            if (service.id) {
                // Editar
                await updateService({ ...newService, id: service.id });
                showToast('Serviço atualizado com sucesso');
            } else {
                // Novo
                await addService(newService);
                showToast('Serviço inserido com sucesso');
            }
            navigation.navigate('Home', { refresh: true });
        } catch (error) {
            showToast('Ocorreu um erro ao salvar o servico.');
        }
    };

    const confirmDeleteService = () => {
        Alert.alert(
            "Excluir Agendamento",
            "Tem certeza de que deseja excluir este agendamento?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Excluir", style: "destructive", onPress: removeService }
            ],
            { cancelable: true }
        );
    };

    const removeService = async () => {
        try {
            if (service.id) {
                await deleteService(service.id);
                showToast('Serviço deletado com sucesso');
                navigation.navigate('Home', { refresh: true });
            }
        } catch (error) {
         
            showToast('Ocorreu um erro ao excluir o serviço.');
           
        }
    };

    

    return (
        <View style={{ flex: 1, padding: 16, backgroundColor: '#1A2833' }}>
                <Txt text={'Nome do serviço:'} />
            <Text style={{ color: 'red' }}>{msgError.nameError}</Text>
            <TextInput value={name} onChangeText={setName} style={{ borderBottomWidth: 1, marginBottom: 16, color: '#E3E3E3' }} />

 

            <Txt text={'Descrção do serviço:'} />
            <Text style={{ color: 'red' }}>{msgError.descriptionError}</Text>
            <TextInput value={description} onChangeText={setDescription} style={{ borderBottomWidth: 1, marginBottom: 16, color: '#E3E3E3' }} />


            <BtnPadraoMenor propOnPress={clearFormData } >Limpar Campo</BtnPadraoMenor>

            <BtnPadraoMenor propOnPress={saveService} >Salvar</BtnPadraoMenor>
            {service.id && <BtnPadraoMenor propOnPress={confirmDeleteService} bgColor="red" >Excluir</BtnPadraoMenor>}




        </View>
        
    );

    
};

export default ServiceScreen;
