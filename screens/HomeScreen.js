import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [agendamentos, setAgendamentos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));

  useEffect(() => {
    const fetchAgendamentos = async () => {
      const storedAgendamentos = await AsyncStorage.getItem('agendamentos');
      if (storedAgendamentos) {
        setAgendamentos(JSON.parse(storedAgendamentos));
      }
    };
    fetchAgendamentos();
  }, []);

  const agendamentosDoDia = agendamentos.filter(agendamento => agendamento.data === selectedDate);

  const handleNovoAgendamento = () => {
    navigation.navigate('Agendamento');
  };

  const isAtrasado = (horario) => {
    const agora = moment();
    return moment(horario, 'HH:mm').isBefore(agora);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Agendamentos para {selectedDate}</Text>
      <FlatList
        data={agendamentosDoDia}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10, padding: 15, backgroundColor: isAtrasado(item.horario) ? 'red' : 'green' }}>
            <Text>{item.nomeCliente} - {item.servico}</Text>
            <Text>{item.horario}</Text>
          </View>
        )}
      />
      <TouchableOpacity onPress={handleNovoAgendamento} style={{ backgroundColor: 'blue', padding: 15, marginTop: 20 }}>
        <Text style={{ color: 'white' }}>Novo Agendamento</Text>
      </TouchableOpacity>
    </View>
  );
}
