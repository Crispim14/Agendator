import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import Txt from '../components/Txt';
import { getListProvider } from '../database/scheduleDB';

const ServicePicker = ({ index, onRemove, services, affinities, onValuesChange }) => {
    const [selectedService, setSelectedService] = useState('');
    const [selectedProvider, setSelectedProvider] = useState(''); // Armazenar o provider selecionado
    const [selectedAffinity, setSelectedAffinity] = useState(1);
    const [listProviders, setListProviders] = useState([]);

    const handleServiceChange = async (itemValue) => {
        setSelectedService(itemValue);
        setSelectedProvider(''); // Resetar o provider selecionado ao mudar o serviço

        try {
            const providers = await getListProvider(itemValue);
            setListProviders(providers);
        } catch (error) {
            console.error('Erro ao obter colaboradores:', error);
        }
        
        onValuesChange(index, itemValue, selectedProvider, selectedAffinity); // Passar provider vazio
    };

    const handleProviderChange = (itemValue) => {
        setSelectedProvider(itemValue);
        onValuesChange(index, selectedService, itemValue, selectedAffinity); // Passar o provider selecionado
    };

    const handleAffinityChange = (itemValue) => {
        setSelectedAffinity(itemValue);
        onValuesChange(index, selectedService, selectedProvider, itemValue); // Passar a afinidade
    };

    return (
        <View style={styles.pickerContainer}>
            <Txt text={"Selecione um Serviço:"} />
            <Picker
                selectedValue={selectedService}
                onValueChange={handleServiceChange}
                style={styles.picker}
            >
                {services.map((service) => (
                    <Picker.Item key={service.id} label={service.name} value={service.id} />
                ))}
            </Picker>

            <Txt text={"Selecione um Colaborador:"} />
            <Picker
                selectedValue={selectedProvider}
                onValueChange={handleProviderChange} // Atualize para usar handleProviderChange
                style={styles.picker}
            >
                {listProviders.map((provider) => (
                    <Picker.Item key={provider.id} label={provider.name} value={provider.id} />
                ))}
            </Picker>

            <Button title="Remover" onPress={onRemove} />
            <Txt text={`Serviço Selecionado: ${selectedService}`} />
            <Txt text={`Colaborador Selecionado: ${selectedProvider}`} />
            <Txt text={`Afinidade Selecionada: ${selectedAffinity}`} />
        </View>
    );
};

const styles = StyleSheet.create({
    pickerContainer: {
        marginBottom: 20,
    },
    picker: {
        height: 50,
        width: '100%',
        marginVertical: 10,
        color: '#E3E3E3',
    },
});

export default ServicePicker;
