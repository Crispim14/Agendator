// screens/AddScheduleScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addSchedule, updateSchedule, deleteSchedule, getSchedules } from '../database/scheduleDB';

const AddScheduleScreen = ({ route, navigation }) => {
    const schedule = route.params?.schedule || {};
    const [name, setName] = useState(schedule.name || '');
    const [phone, setPhone] = useState(schedule.phone || '');
    const [date, setDate] = useState(schedule.date ? new Date(schedule.date) : new Date());
    const [time, setTime] = useState(schedule.time || '');
    const [service, setService] = useState(schedule.service || '');
    const [professional, setProfessional] = useState(schedule.professional || '');

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const saveSchedule = async () => {
        try {
            const now = new Date();
            const selectedDateTime = new Date(date);
            const [hours, minutes] = time.split(':').map(Number);
            selectedDateTime.setHours(hours);
            selectedDateTime.setMinutes(minutes);

         

            // Verificar se já existe um agendamento para o mesmo horário e data
            const schedulesOnDate = await getSchedules(date.toISOString().split('T')[0]);
            const isConflict = schedulesOnDate.some(s => s.time === time && s.id !== schedule.id);

            const newSchedule = { name, phone, date: date.toISOString().split('T')[0], time, service, professional };

            if (isConflict) {
                Alert.alert(
                    'Conflito de Horário',
                    'Já existe um agendamento para este horário. Deseja continuar e salvar mesmo assim?',
                    [
                        { text: 'Cancelar', style: 'cancel' },
                        { text: 'Continuar', onPress: () => proceedSave(newSchedule) }
                    ],
                    { cancelable: true }
                );
                return; // Saia para não salvar até que o usuário confirme
            }

            // Continuar com o salvamento se não houver conflitos ou após confirmação
            proceedSave(newSchedule);
        } catch (error) {
            console.error('Erro ao salvar agendamento:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao salvar o agendamento.');
        }
    };

    const proceedSave = async (newSchedule) => {
        try {
            if (schedule.id) {
                // Editar
                await updateSchedule({ ...newSchedule, id: schedule.id });
                Alert.alert('Sucesso', 'Agendamento atualizado com sucesso');
            } else {
                // Novo
                await addSchedule(newSchedule);
                Alert.alert('Sucesso', 'Agendamento salvo com sucesso');
            }
            navigation.navigate('Home', { refresh: true });
        } catch (error) {
            console.error('Erro ao salvar agendamento:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao salvar o agendamento.');
        }
    };

    const confirmDeleteSchedule = () => {
        Alert.alert(
            "Excluir Agendamento",
            "Tem certeza de que deseja excluir este agendamento?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Excluir", style: "destructive", onPress: removeSchedule }
            ],
            { cancelable: true }
        );
    };

    const removeSchedule = async () => {
        try {
            if (schedule.id) {
                await deleteSchedule(schedule.id);
                Alert.alert('Sucesso', 'Agendamento excluído com sucesso');
                navigation.navigate('Home', { refresh: true });
            }
        } catch (error) {
            console.error('Erro ao excluir agendamento:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao excluir o agendamento.');
        }
    };

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


        
    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text>Nome do Cliente:</Text>
            <TextInput value={name} onChangeText={setName} style={{ borderBottomWidth: 1, marginBottom: 16 }} />

            <Text>Telefone:</Text>
            <TextInput value={phone} onChangeText={setPhone} style={{ borderBottomWidth: 1, marginBottom: 16 }} />

            <Text>Data:</Text>
            <Button title="Selecionar Data" onPress={() => setShowDatePicker(true)} />
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    minimumDate={new Date(new Date().setHours(0, 0, 0, 0))} // Permitir apenas datas a partir de hoje
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={onChangeDate}
                />
            )}
            <Text>{date.toDateString()}</Text>

            <Text>Horário:</Text>
            <Button title="Selecionar Horário" onPress={() => setShowTimePicker(true)} />
            {showTimePicker && (
                <DateTimePicker
                    value={time ? new Date(`1970-01-01T${time}`) : new Date()}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={onChangeTime}
                />
            )}
            <Text>{time}</Text>

            <Text>Serviço:</Text>
            <TextInput value={service} onChangeText={setService} style={{ borderBottomWidth: 1, marginBottom: 16 }} />

            <Text>Profissional:</Text>
            <TextInput value={professional} onChangeText={setProfessional} style={{ borderBottomWidth: 1, marginBottom: 16 }} />

            <Button title="Salvar" onPress={saveSchedule} />
            {schedule.id && <Button title="Excluir" onPress={confirmDeleteSchedule} color="red" />}
        </View>
    );
};

export default AddScheduleScreen;
