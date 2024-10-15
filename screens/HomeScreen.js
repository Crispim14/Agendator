// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, Button, Platform } from 'react-native';
import { getSchedules, getServices } from '../database/scheduleDB';
import Txt from '../components/Txt';
import DateTimePicker from '@react-native-community/datetimepicker';
import BtnPadrao from '../components/BtnPadrao';
import SttsBar from '../components/SttsBar';


const HomeScreen = ({ navigation }) => {
    const [schedules, setSchedules] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [date, setDate] = useState(new Date());

    const onChangeDate = (event, selectedDate) => {
        setShowDatePicker(false);

        if (selectedDate) {

            setDate(selectedDate)
            setSelectedDate(selectedDate.toISOString().split('T')[0])
        }
    };
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const schedulesData = await getSchedules(selectedDate);
                const x = await getServices(selectedDate);
                //console.log(x)
                setSchedules(schedulesData);
            } catch (error) {
                console.error('Erro ao buscar agendamentos:', error);
            }
        };

        fetchSchedules();

        // Adicionando um listener para atualizar a tela ao voltar para ela
        const unsubscribe = navigation.addListener('focus', () => {
            fetchSchedules();
        });

        // Cleanup do listener
        return unsubscribe;
    }, [navigation, selectedDate]);

    const renderItem = ({ item }) => (
        <Pressable onPress={() => navigation.navigate('AddSchedule', { schedule: item })}>
            <View style={{
                padding: 20,
                marginVertical: 8,
                backgroundColor: new Date(`${item.date}T${item.time}`) < new Date() ? 'red' : '#0CABA8'
            }}>
                <Txt text={`${item.time} - ${item.name}`} />
                <Txt text={`Serviço ${item.service}`} />
            </View>
        </Pressable>);

    return (

        <View style={{ flex: 1, backgroundColor: '#1A2833' }}>
            <SttsBar />

            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={onChangeDate}
                />
            )}

            <Text style={{ fontSize: 20, color: '#E3E3E3', textAlign: 'center', margin: 10, fontFamily: 'LeagueSpartan-Regular' }}>{`Data selecionada ${selectedDate}`}</Text>

            <BtnPadrao propOnPress={() => navigation.navigate('AddSchedule')}>

                <Text style={{ fontSize: 20, color: '#E3E3E3', textAlign: 'center', margin: 20 }}>Novo Agendamento</Text>

            </BtnPadrao>

            <BtnPadrao propOnPress={() => setShowDatePicker(true)}>

                <Text style={{ fontSize: 20, color: '#E3E3E3', textAlign: 'center', margin: 20 }}>Mudar Data</Text>

            </BtnPadrao>

            <FlatList
                data={schedules}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
};

export default HomeScreen;
