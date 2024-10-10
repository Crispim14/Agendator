import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ToastAndroid } from 'react-native';
import { deleteService, updateService, addService } from '../database/scheduleDB';
import Txt from '../components/Txt';
import BtnPadraoMenor from '../components/BtnPadraoMenor';
import Checkbox from 'expo-checkbox'; // Importando o Checkbox do expo-checkbox

function showToast(text) {
    ToastAndroid.show(text, ToastAndroid.SHORT);
}

const ServiceScreen = ({ route, navigation }) => {
    const service = route.params?.service || {};
    const [name, setName] = useState(service.name || '');
    const [description, setDescription] = useState(service.description || '');
    const [isFavorite, setIsFavorite] = useState(service.favorite || false); // Estado para o checkbox
    const [msgError, setMsgError] = useState({
        nameError: '',
        descriptionError: ''
    });

    const clearFormData = () => {
        setName('');
        setDescription('');
        setIsFavorite(false); // Resetar o checkbox também
    };

    const clearErrors = () => {
        setMsgError({
            nameError: '',
            descriptionError: ''
        });
    };

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
                descriptionError: 'Digite uma descrição para o serviço'
            }));
            error = true;
        }

        return error;
    };

    const saveService = async () => {
        try {
            if (checkErros() === true) {
                return;
            }

            const newService = { name, description, favorite: isFavorite ? 1 : 0 }; // Adicionando o valor do checkbox
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
                // Novo serviço
                await addService(newService);
                showToast('Serviço inserido com sucesso');
            }
            navigation.navigate('ServiceListScreen', { refresh: true });
        } catch (error) {
            showToast('Ocorreu um erro ao salvar o serviço.');
        }
    };

    const confirmDeleteService = () => {
        Alert.alert(
            "Excluir Serviço",
            "Tem certeza de que deseja excluir este serviço?",
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
                navigation.navigate('ServiceListScreen', { refresh: true });
            }
        } catch (error) {
            showToast('Ocorreu um erro ao excluir o serviço.');
        }
    };

    return (
        <View style={{ flex: 1, padding: 16, backgroundColor: '#1A2833' }}>
            <Txt text={'Nome do serviço:'} />
            <Text style={{ color: 'red' }}>{msgError.nameError}</Text>
            <TextInput 
                value={name} 
                onChangeText={setName} 
                style={{ borderBottomWidth: 1, marginBottom: 16, color: '#E3E3E3' }} 
            />

            <Txt text={'Descrição do serviço:'} />
            <Text style={{ color: 'red' }}>{msgError.descriptionError}</Text>
            <TextInput 
                value={description} 
                onChangeText={setDescription} 
                style={{ borderBottomWidth: 1, marginBottom: 16, color: '#E3E3E3' }} 
            />

            {/* Adicionando o CheckBox para favoritar o serviço */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <Checkbox
                    value={isFavorite}
                    onValueChange={setIsFavorite}
                    color={isFavorite ? '#FFD700' : '#E3E3E3'} // Mudando a cor com base no estado
                    style={{ width: 24, height: 24, borderRadius: 12 }} // Tornando o checkbox redondo
                />
                <Txt text="Favorito" />
            </View>

            <BtnPadraoMenor propOnPress={clearFormData}>Limpar Campos</BtnPadraoMenor>
            <BtnPadraoMenor propOnPress={saveService}>Salvar</BtnPadraoMenor>
            {service.id && <Button title="Excluir" onPress={confirmDeleteService} color="red" />}
        </View>
    );
};

export default ServiceScreen;
