// screens/CreateScheduleScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, Platform, ToastAndroid} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addSchedule, getServices, getServicesProvider } from '../database/scheduleDB';
import MaskInput, { Masks } from 'react-native-mask-input'; // Biblioteca para máscara de telefone

const showToast = (text) => {
    if (Platform.OS === 'android') ToastAndroid.show(text, ToastAndroid.SHORT);
};

const CreateScheduleScreen = ({ navigation }) => {
    // Estados para os campos principais
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState('');
    const [servicePickers, setServicePickers] = useState([{ serviceId: '', providerId: '' }]);
    const [availableServices, setAvailableServices] = useState([]);
    const [availableProviders, setAvailableProviders] = useState([]);

    // Carregar serviços e colaboradores disponíveis
    useEffect(() => {
        const fetchData = async () => {
            try {
                const services = await getServices();
                const providers = await getServicesProvider();
                setAvailableServices(services);
                setAvailableProviders(providers);
            } catch (error) {
                console.error("Erro ao buscar serviços e colaboradores:", error);
                showToast("Erro ao carregar dados.");
            }
        };
        fetchData();
    }, []);

    // Funções para adicionar/remover seletores de serviços
    const addServicePicker = () => {
        setServicePickers([...servicePickers, { serviceId: '', providerId: '' }]);
    };

    const removeServicePicker = (index) => {
        setServicePickers(servicePickers.filter((_, i) => i !== index));
    };

    // Manipulação de data e hora
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const onChangeDate = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const onChangeTime = (event, selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime) {
            const hours = selectedTime.getHours().toString().padStart(2, '0');
            const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
            setTime(`${hours}:${minutes}`);
        }
    };

    // Função de validação de campos
    const validateFields = () => {
        if (!name.trim()) {
            Alert.alert("Erro", "O campo Nome é obrigatório.");
            return false;
        }
        if (!phone.trim()) {
            Alert.alert("Erro", "O campo Telefone é obrigatório.");
            return false;
        }
        if (!time) {
            Alert.alert("Erro", "Selecione um horário para o agendamento.");
            return false;
        }
        return true;
    };

    // Função para salvar o agendamento
    const saveSchedule = async () => {
        if (!validateFields()) return;

        try {
            const newSchedule = {
                name,
                phone,
                date: date.toISOString().split('T')[0],
                time,
                services: servicePickers,
            };
            await addSchedule(newSchedule);
            showToast("Agendamento salvo com sucesso!");
            navigation.navigate('Home', { refresh: true });
        } catch (error) {
            console.error("Erro ao salvar agendamento:", error);
            Alert.alert("Erro", "Ocorreu um erro ao salvar o agendamento.");
        }
    };

    return (
        <ScrollView style={{ flex: 1, padding: 16, backgroundColor: '#1A2833' }}>
            <Text style={{ color: '#E3E3E3' }}>Nome:</Text>
            <TextInput value={name} onChangeText={setName} style={{ borderBottomWidth: 1, marginBottom: 16, color: '#E3E3E3' }} />

            <Text style={{ color: '#E3E3E3' }}>Telefone:</Text>
            <MaskInput
                value={phone}
                onChangeText={setPhone}
                mask={Masks.BRL_PHONE}
                keyboardType="numeric"
                style={{ borderBottomWidth: 1, marginBottom: 16, color: '#E3E3E3' }}
            />

            <Text style={{ color: '#E3E3E3' }}>Data:</Text>
            <Button title="Selecionar Data" onPress={() => setShowDatePicker(true)} />
            {showDatePicker && (
                <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} />
            )}
            <Text style={{ color: '#E3E3E3', marginVertical: 8 }}>{date.toLocaleDateString('pt-BR')}</Text>

            <Text style={{ color: '#E3E3E3' }}>Hora:</Text>
            <Button title="Selecionar Hora" onPress={() => setShowTimePicker(true)} />
            {showTimePicker && (
                <DateTimePicker value={time ? new Date(`1970-01-01T${time}`) : new Date()} mode="time" display="default" onChange={onChangeTime} />
            )}
            <Text style={{ color: '#E3E3E3', marginVertical: 8 }}>{time}</Text>

            {servicePickers.map((picker, index) => (
                <View key={index} style={{ marginBottom: 16 }}>
                    <Text style={{ color: '#E3E3E3' }}>Serviço:</Text>
                    <Picker
                        selectedValue={picker.serviceId}
                        onValueChange={(itemValue) => {
                            const newPickers = [...servicePickers];
                            newPickers[index].serviceId = itemValue;
                            setServicePickers(newPickers);
                        }}
                        style={{ color: '#E3E3E3', backgroundColor: '#0CABA8', marginVertical: 8 }}
                    >
                        <Picker.Item label="Selecione um serviço" value="" />
                        {availableServices.map((service) => (
                            <Picker.Item key={service.id} label={service.name} value={service.id} />
                        ))}
                    </Picker>

                    <Text style={{ color: '#E3E3E3' }}>Colaborador:</Text>
                    <Picker
                        selectedValue={picker.providerId}
                        onValueChange={(itemValue) => {
                            const newPickers = [...servicePickers];
                            newPickers[index].providerId = itemValue;
                            setServicePickers(newPickers);
                        }}
                        style={{ color: '#E3E3E3', backgroundColor: '#0CABA8', marginVertical: 8 }}
                    >
                        <Picker.Item label="Selecione um colaborador" value="" />
                        {availableProviders.map((provider) => (
                            <Picker.Item key={provider.id} label={provider.name} value={provider.id} />
                        ))}
                    </Picker>

                    <Button title="Remover Serviço" onPress={() => removeServicePicker(index)} />
                </View>
            ))}
            <Button title="Adicionar Serviço" onPress={addServicePicker} />

            <Button title="Salvar Agendamento" onPress={saveSchedule} />
        </ScrollView>
    );
};

export default CreateScheduleScreen;
