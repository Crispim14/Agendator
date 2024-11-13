// HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, Button, Platform, StyleSheet } from 'react-native';
import { getSchedules, getServices } from '../database/scheduleDB';
import Txt from '../components/Txt';
import DateTimePicker from '@react-native-community/datetimepicker';
import BtnPadrao from '../components/BtnPadrao';
import SttsBar from '../components/SttsBar';
import { useTheme } from '../ThemeContext';

const HomeScreen = ({ navigation }) => {
    const { theme, toggleTheme } = useTheme(); // Obtém o tema e a função para alternar o tema
    const [schedules, setSchedules] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const onChangeDate = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
            setSelectedDate(selectedDate.toISOString().split('T')[0]);
        }
    };

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

        const unsubscribe = navigation.addListener('focus', fetchSchedules);

        return unsubscribe;
    }, [navigation, selectedDate]);

    const renderItem = ({ item }) => (
        <Pressable onPress={() => navigation.navigate('AddSchedule', { schedule: item })}>
            <View style={[styles.itemContainer, { backgroundColor: new Date(`${item.date}T${item.time}`) < new Date() ? 'red' : '#0CABA8' }]}>
                <Txt text={`${item.time} - ${item.name}`} />
                <Txt text={`Serviço ${item.service}`} />
            </View>
        </Pressable>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <SttsBar />

            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={onChangeDate}
                />
            )}

            <Text style={[styles.text, { color: theme.text }]}>{`Data selecionada ${selectedDate}`}</Text>

            <BtnPadrao propOnPress={() => navigation.navigate('AddSchedule')}>
                <Text style={[styles.btnText, { color: theme.text }]}>Novo Agendamento</Text>
            </BtnPadrao>

            <BtnPadrao propOnPress={() => setShowDatePicker(true)}>
                <Text style={[styles.btnText, { color: theme.text }]}>Mudar Data</Text>
            </BtnPadrao>

            <FlatList
                data={schedules}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />

            <Button
                title="Alternar Tema"
                onPress={toggleTheme}
                color={theme.text}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        fontFamily: 'LeagueSpartan-Regular',
    },
    btnText: {
        fontSize: 20,
        textAlign: 'center',
        margin: 20,
    },
    itemContainer: {
        padding: 20,
        marginVertical: 8,
    },
});

export default HomeScreen;
