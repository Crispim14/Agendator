import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Platform, ToastAndroid, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addSchedule, updateSchedule, deleteSchedule, getSchedules, getServices } from '../database/scheduleDB';
import Txt from '../components/Txt';
import BtnPadrao from '../components/BtnPadrao';
import BtnPadraoMenor from '../components/BtnPadraoMenor';
import ServicePicker from './ServicePicker';

function showToast(text) {
    ToastAndroid.show(text, ToastAndroid.SHORT);
}

const AddScheduleScreen = ({ route, navigation }) => {
    const schedule = route.params?.schedule || {};
    const [name, setName] = useState(schedule.name || '');
    const [phone, setPhone] = useState(schedule.phone || '');
    const [date, setDate] = useState(schedule.date ? new Date(schedule.date) : new Date());
    const [time, setTime] = useState(schedule.time || '');
    const [professional, setProfessional] = useState(schedule.professional || '');
    const [services, setServices] = useState([]); // Adicione estado para serviços
    const [pickers, setPickers] = useState([{ serviceId: '', affinity: 1 }]); // Adicione pickers para serviços

    const [msgError, setMsgError] = useState({
        nameError: '',
        phoneError: '',
        dateError: '',
        timeError: '',
        serviceError: '',
        professionalError: '',
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    // Carregue os serviços
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const result = await getServices();
                setServices(result);
            } catch (error) {
                console.error("Erro ao buscar serviços:", error);
            }
        };
        fetchServices();
    }, []);

    const handleValuesChange = (index, serviceId, affinity) => {
        const newPickers = [...pickers];
        newPickers[index] = { serviceId, affinity };
        setPickers(newPickers);
    };

    const addPicker = () => {
        setPickers([...pickers, { serviceId: '', affinity: 1 }]);
    };

    const removePicker = (index) => {
        setPickers(pickers.filter((_, i) => i !== index));
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
        }
        
        //  if (!professional.trim()) {
        //     setMsgError(prevState => ({
        //         ...prevState,
        //         professionalError: 'Digite um nome para um profissional'
        //     }));
        //     error = true;
        // }

        return error
    }
    const saveSchedule = async () => {
        try {

            if (checkErros() == true) {
                console.log("Erros encontrados, salvamento cancelado.");
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

            const newSchedule = { name, phone, date: date.toISOString().split('T')[0], time, services, professional };

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
    const newSchedule = { name, phone, date: date.toISOString().split('T')[0], time, services: pickers, professional };
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };


    



    return (
        <ScrollView style={{ flex: 1, padding: 16, backgroundColor: '#1A2833' }}>
            <Txt text={'Nome:'} />
            <TextInput value={name} onChangeText={setName} style={{ borderBottomWidth: 1, marginBottom: 16 }} />
            <Txt text={'Telefone:'} />
            <TextInput value={phone} onChangeText={setPhone} style={{ borderBottomWidth: 1, marginBottom: 16 }} />

            <Txt text={'Data:'} />
            <Text style={{ color: 'red' }}>{msgError.dateError}</Text>

            <BtnPadraoMenor propOnPress={() => setShowDatePicker(true)}>Selecionar Data</BtnPadraoMenor>

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

            <BtnPadraoMenor propOnPress={() => setShowTimePicker(true)}>Selecionar Horário</BtnPadraoMenor>

            {showTimePicker && (
                <DateTimePicker
                    value={time ? new Date(`1970-01-01T${time}`) : new Date()}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={onChangeTime}
                />
            )}
            <Txt text={time} />


            {pickers.map((picker, index) => (
                <ServicePicker
                    key={index}
                    index={index}
                    onRemove={() => removePicker(index)}
                    services={services}
                    affinities={[1, 2, 3, 4, 5]}
                    onValuesChange={handleValuesChange}
                />
            ))}
            <BtnPadraoMenor propOnPress={addPicker}>Adicionar Serviço</BtnPadraoMenor>

            <BtnPadraoMenor propOnPress={saveSchedule}>Salvar</BtnPadraoMenor>
            {schedule.id && <BtnPadraoMenor propOnPress={confirmDeleteSchedule} bgColor="red">Excluir</BtnPadraoMenor>}
        </ScrollView>
    );
};

export default AddScheduleScreen;
