import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Platform, ToastAndroid, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addSchedule, updateSchedule, deleteSchedule, getSchedules, getServices } from '../database/scheduleDB';
import Txt from '../components/Txt';
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
        timeError: '',
        serviceError: '',
        professionalError: '',
    });

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

    const saveSchedule = async () => {
      

        const newSchedule = { name, phone, date: date.toISOString().split('T')[0], time, service: pickers, professional };

       
    };

  

    return (
        <ScrollView style={{ flex: 1, padding: 16, backgroundColor: '#1A2833' }}>
            <Txt text={'Nome:'} />
            <TextInput value={name} onChangeText={setName} style={{ borderBottomWidth: 1, marginBottom: 16 }} />
            <Txt text={'Telefone:'} />
            <TextInput value={phone} onChangeText={setPhone} style={{ borderBottomWidth: 1, marginBottom: 16 }} />

         
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
