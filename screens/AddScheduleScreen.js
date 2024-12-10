import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Platform, ToastAndroid, ScrollView ,Share} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addSchedule, updateSchedule, deleteSchedule, getSchedules, getServices, getServicesProvider, addRelatesSchedulesServices, getMessage, deleteRelatesSchedulesServices } from '../database/scheduleDB';
import Txt from '../components/Txt';
import BtnPadrao from '../components/BtnPadrao';
import BtnPadraoMenor from '../components/BtnPadraoMenor';
import ServicePicker from './ServicePicker';
import { useTheme } from '../ThemeContext'; // Importa o contexto de tema
import CheckboxPadrao from "../components/CheckboxPadrao";
import Checkbox from 'expo-checkbox'; // Importando o Checkbox do expo-checkbox

function showToast(text) {
    ToastAndroid.show(text, ToastAndroid.SHORT);
}

const AddScheduleScreen = ({ route, navigation }) => {
    const { theme } = useTheme(); // Obtém o tema atual
    const schedule = route.params?.schedule || {};
    const [name, setName] = useState(schedule.name || '');
    const [phone, setPhone] = useState(schedule.phone || '');
    const [date, setDate] = useState(schedule.date ? new Date(schedule.date) : new Date());
    const [time, setTime] = useState(schedule.time || '');
    const [professional, setProfessional] = useState(schedule.professional || '');
    const [services, setServices] = useState([]);
    const [servicesProvider, setServicesProvider] = useState([]);
    const [pickers, setPickers] = useState([{ serviceId: '', providerId: '', affinity: 1 }]);
    const [selectedServicos, setSelectedServicos] = useState({});
    const [selectedColaboradores, setSelectedColaboradores] = useState({});
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [idServicos, setIdServicos] = useState([]);
    const [isAtendiment, setAtendiment] = useState(schedule.atendiment === 1);

    const [msgError, setMsgError] = useState({
        nameError: '',
        phoneError: '',
        dateError: '',
        timeError: '',
        serviceError: '',
        professionalError: '',
    });

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const result = await getServices();
                setServices(result);
                const result2 = await getServicesProvider();
                setServicesProvider(result2)
            } catch (error) {
                console.error("Erro ao buscar serviços:", error);
            }
        };
        fetchServices();
    }, []);




    const handleCheckboxChange = (id) => {
        setSelectedServicos(prevState => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };


    const handleAtendiment = () => {
        setAtendiment(prev => {
        
            const newValue = !prev;
           
            return newValue;
        });
    };





    const handleCheckboxChangeColaboradores = (id) => {
        setSelectedColaboradores(prevState => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };



    const clearErrors = () => {
        setMsgError({
            nameError: '',
            phoneError: '',
            timeError: '',
            dateError: '',
            serviceError: '',
            professionalError: '',
        });
    };

    const checkErrors = () => {
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
                timeError: 'Selecione um horário para o agendamento'
            }));
            error = true;
        }

        return error;
    };

    const saveSchedule = async () => {
        try {
            if (checkErrors() === true) {

                return;
            }
            const selectedDateTime = new Date(date);
            const [hours, minutes] = time.split(':').map(Number);
            selectedDateTime.setHours(hours);
            selectedDateTime.setMinutes(minutes);
          
            const schedulesOnDate = await getSchedules(date.toISOString().split('T')[0]);
            const isConflict = schedulesOnDate.some(s => s.time === time && s.id !== schedule.id);
            console.log(`isAtendiment`)
            console.log(isAtendiment)
            const newSchedule = { name, phone, date: date.toISOString().split('T')[0], time, services: pickers, professional, atendiment:   isAtendiment  ? 1 : 0 };

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
                return;
            }
            proceedSave(newSchedule);
        } catch (error) {
            console.error('Erro ao salvar agendamento:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao salvar o agendamento.');
        }
    };

    const proceedSave = async (newSchedule) => {
        try {
            let scheduleID;
            if (schedule.id) {


             
                await updateSchedule({ ...newSchedule, id: schedule.id });
                scheduleID = schedule.id;
                showToast('Cadastro atualizado com sucesso');
            } else {

                
                const result = await addSchedule(newSchedule);
                scheduleID = result.lastInsertRowId;

        
            }

            saveRelatedServices(scheduleID);
            navigation.navigate('Home', { refresh: true });
        } catch (error) {
            console.error('Erro ao salvar agendamento:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao salvar o agendamento.');
        }
    };

    const saveRelatedServices = async (scheduleID) => {
        try {


           
            const ids = Object.keys(selectedServicos);


            const idsColaboradores = Object.keys(selectedColaboradores);
    
            setIdServicos(ids)
            

            await Promise.all(ids.map(async (id) => {
               
                await Promise.all(idsColaboradores.map(async (id2) => {
                    const relates = {
                        idSchedules: scheduleID,
                        idService: id,
                        idProvider: id2,
                    };
                    await deleteRelatesSchedulesServices(relates);
                 
                    await addRelatesSchedulesServices(relates); 
                }));
            }));

        } catch (error) {
            console.error("Erro ao salvar serviços relacionados:", error);
            showToast("Erro ao salvar serviços relacionados.");
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


    
    const shareSchedule =   async () => {
        

    let msg1 = await getMessage() ;
     
    msg1.standard_message =  msg1.standard_message.replace(`[nome do cliente]`, name);
    msg1.standard_message = msg1.standard_message.replace("[hora do serviço]", time);
    msg1.standard_message = msg1.standard_message.replace(`[data do agendamento]`, date.toLocaleDateString('pt-BR'));
     

                    try {
                        const result = await Share.share({
                          message:
                          msg1,
                        });
                        if (result.action === Share.sharedAction) {
                          if (result.activityType) {
                            // shared with activity type of result.activityType
                          } else {
                            // shared
                          }
                        } else if (result.action === Share.dismissedAction) {
                          // dismissed
                        }
                      } catch (error) {
                        Alert.alert(error.message);
                      }

                    
    };

    const onChangeDate = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) setDate(selectedDate);
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
        <ScrollView style={{ flex: 1, padding: 16, backgroundColor: theme.background }}>
            <Txt text={'Nome:'} />
            <TextInput value={name} onChangeText={setName} style={{ borderBottomWidth: 1, marginBottom: 16, color: theme.text }} />
            <Txt text={'Telefone:'} />
            <TextInput value={phone} onChangeText={setPhone} style={{ borderBottomWidth: 1, marginBottom: 16, color: theme.text }} />

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

            <Txt text={date.toLocaleDateString('pt-BR')} />

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

            <Txt text={"Selecione os serviços para o agendamento:"} />
            <ScrollView>
                {services.map((servico) => (
                    <ScrollView key={servico.id}>

                        <CheckboxPadrao
                            statusCheck={!!selectedServicos[servico.id] ? 'checked' : 'unchecked'}
                            propOnPress={() => handleCheckboxChange(servico.id)}
                            txt={servico.name}
                        />


                    </ScrollView>
                ))}
            </ScrollView>



            <Txt text={"Selecione os colaboradores para o serviço:"} />
            <ScrollView>
                {servicesProvider.map((colaborador) => (
                    <ScrollView key={colaborador.id} >
                        <CheckboxPadrao
                            statusCheck={!!selectedColaboradores[colaborador.id] ? 'checked' : 'unchecked'}
                            propOnPress={() => handleCheckboxChangeColaboradores(colaborador.id)}
                            txt={colaborador.name}
                        />

                    </ScrollView>
                ))}
            </ScrollView>




            <BtnPadraoMenor propOnPress={saveSchedule}>Salvar</BtnPadraoMenor>


            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <Checkbox
                    value={isAtendiment}
                    onValueChange={handleAtendiment}
                    color={isAtendiment ? 'green' : theme.text}
                />
                <Txt text="Atendimento realizado" />
            </View>

            {schedule.id &&

                <View>

                    <BtnPadraoMenor propOnPress={confirmDeleteSchedule} bgColor="red">Excluir</BtnPadraoMenor>
                    <BtnPadraoMenor propOnPress={shareSchedule} >Compartilhar</BtnPadraoMenor>

                </View>


            }
        </ScrollView>
    );
};

export default AddScheduleScreen;
