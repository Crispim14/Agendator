// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { getSchedules } from '../database/scheduleDB';
import Txt from '../components/Txt';

const HomeScreen = ({ navigation }) => {
    const [schedules, setSchedules] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const schedulesData = await getSchedules(selectedDate);
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
        <TouchableOpacity onPress={() => navigation.navigate('AddSchedule', { schedule: item })}>
            <View style={{
                padding: 20,
                marginVertical: 8,
                backgroundColor: new Date(`${item.date}T${item.time}`) < new Date() ? 'red' : '#0CABA8'
            }}>
         
                <Txt text={`${item.time} - ${item.name}`}/>
                <Txt text={`Serviço ${item.service}`}/>
               
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#1A2833'  }}>
            <TouchableOpacity onPress={() => navigation.navigate('AddSchedule')}>
            <Text style={{ fontSize: 20, color: '#E3E3E3', textAlign: 'center', margin: 20 }}>Novo Agendamento</Text>
            </TouchableOpacity>
            <FlatList
                data={schedules}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
};

export default HomeScreen;
