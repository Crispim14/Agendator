// screens/AddScheduleScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Platform, ToastAndroid } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addSchedule, updateSchedule, deleteSchedule, getSchedules } from '../database/scheduleDB';
import Txt from '../components/Txt';


function showToast(text) {
    ToastAndroid.show(text, ToastAndroid.SHORT);
  }

const AddScheduleScreen = ({ route, navigation }) => {
    const schedule = route.params?.schedule || {};
    const [name, setName] = useState(schedule.name || '');
    const [phone, setPhone] = useState(schedule.phone || '');
    const [date, setDate] = useState(schedule.date ? new Date(schedule.date) : new Date());
    const [time, setTime] = useState(schedule.time || '');
    const [service, setService] = useState(schedule.service || '');
    const [professional, setProfessional] = useState(schedule.professional || '');

    const [msgError, setMsgError] = useState({
        nameError: '',
        phoneError: '',
        timeError: '',
        dateError: '',
        serviceError: '',
        professionalError: '',


    });


    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);


    const clearFormData = () => {
        setName('');
        setPhone('');
        setDate(new Date()); // Se você quiser definir a data como a data atual
        setTime('');
        setService('');
        setProfessional('');
    };


const clearErrors = () =>{
    setMsgError({
        nameError: '',
        phoneError: '',
        timeError: '',
        dateError: '',
        serviceError: '',
        professionalError: '',
      });
      
}

    const checkErros = () => {

        clearErrors();

        let error = false;
        if (!name.trim()) {
            setMsgError(prevState => ({
                ...prevState,
                nameError: 'Digite um nome para o usuário'
            }));
            error = true;
        } 
         if (!phone.trim()) {
            setMsgError(prevState => ({
                ...prevState,
                phoneError: 'Digite um número de telefone'
            }));
            error = true;
        } 
        if (!time.trim()) {
            setMsgError(prevState => ({
                ...prevState,
                timeError: 'Selecione um horário para o agendamentos'
            }));
            error = true;
        } if (!service.trim()) {
            setMsgError(prevState => ({
                ...prevState,
                serviceError: 'Digite um nome para o usuário'
            }));
            error = true;
        }
         if (!professional.trim()) {
            setMsgError(prevState => ({
                ...prevState,
                professionalError: 'Digite um nome para um profissional'
            }));
            error = true;
        }

        return error
    }

    const saveSchedule = async () => {
        try {

            if (checkErros() == true) {
                return;
            }
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
                showToast('Cadastro atualizado com sucesso');
            } else {
                // Novo
                await addSchedule(newSchedule);
                showToast('Cadastro inserido com sucesso');
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
                showToast('Cadastro deletado com sucesso');
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

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return (
        <View style={{ flex: 1, padding: 16, backgroundColor: '#1A2833' }}>
            <Txt text={'Nome:'} />
            <Text style={{ color: 'red' }}>{msgError.nameError}</Text>
            <TextInput value={name} onChangeText={setName} style={{ borderBottomWidth: 1, marginBottom: 16, color: '#E3E3E3' }} />

            <Txt text={'Telefone:'} />
            <Text style={{ color: 'red' }}>{msgError.phoneError}</Text>
            <TextInput value={phone} onChangeText={setPhone} style={{ borderBottomWidth: 1, marginBottom: 16, color: '#E3E3E3' }} />

            <Txt text={'Data:'} />
            <Text style={{ color: 'red' }}>{msgError.dateError}</Text>
            <Button title="Selecionar Data" onPress={() => setShowDatePicker(true)} />
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={onChangeDate}
                />
            )}


            <Txt text={date.toLocaleDateString('pt-BR', options)} />


            <Txt text={'Horário:'} />
            <Text style={{ color: 'red' }}>{msgError.timeError}</Text>
            <Button title="Selecionar Horário" onPress={() => setShowTimePicker(true)} />
            {showTimePicker && (
                <DateTimePicker
                    value={time ? new Date(`1970-01-01T${time}`) : new Date()}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={onChangeTime}
                />
            )}
            <Txt text={time} />


            <Txt text={'Serviço:'} />
            <Text style={{ color: 'red' }}>{msgError.serviceError}</Text>
            <TextInput value={service} onChangeText={setService} style={{ borderBottomWidth: 1, marginBottom: 16, color: '#E3E3E3' }} />

            <Txt text={'Profissional:'} />
            <Text style={{ color: 'red' }}>{msgError.professionalError}</Text>
            <TextInput value={professional} onChangeText={setProfessional} style={{ borderBottomWidth: 1, marginBottom: 16, color: '#E3E3E3' }} />


            <Button title="Limpar Campos" onPress={clearFormData } />

            <Button title="Salvar" onPress={saveSchedule} />
            {schedule.id && <Button title="Excluir" onPress={confirmDeleteSchedule} color="red" />}




        </View>
        
    );

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          paddingTop: StatusBar.currentHeight,
          backgroundColor: '#6638f0',
          padding: 8,
        },
      });
    
};

export default AddScheduleScreen;
