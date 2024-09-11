import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';

export default function AgendamentoScreen({ navigation }) {
  const [nomeCliente, setNomeCliente] = useState('');
  const [telefone, setTelefone] = useState('');
  const [data, setData] = useState(new Date()); // Definimos a data inicial para o momento atual
  const [hora, setHora] = useState(new Date()); // Definimos o horário inicial para o momento atual
  const [servico, setServico] = useState('');
  const [profissional, setProfissional] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSalvarAgendamento = async () => {
    const storedAgendamentos = await AsyncStorage.getItem('agendamentos');
    let agendamentos = storedAgendamentos ? JSON.parse(storedAgendamentos) : [];

    const novoAgendamento = {
      id: Math.random().toString(36).substr(2, 9),
      nomeCliente,
      telefone,
      data: dayjs(data).format('YYYY-MM-DD'), // Formatando a data selecionada
      horario: dayjs(hora).format('HH:mm'), // Formatando a hora selecionada
      servico,
      profissional,
    };

    agendamentos.push(novoAgendamento);
    await AsyncStorage.setItem('agendamentos', JSON.stringify(agendamentos));

    Alert.alert('Sucesso', 'Agendamento salvo com sucesso!');
    navigation.navigate('Home');
  };

  // Função para lidar com a seleção da data
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || data;
    setShowDatePicker(Platform.OS === 'ios'); // Para fechar o picker no Android após seleção
    setData(currentDate); // Atualiza a data no estado
  };

  // Função para lidar com a seleção do horário
  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || hora;
    setShowTimePicker(Platform.OS === 'ios'); // Para fechar o picker no Android após seleção
    setHora(currentTime); // Atualiza a hora no estado
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text>Nome do Cliente</Text>
      <TextInput
        value={nomeCliente}
        onChangeText={setNomeCliente}
        style={{ borderWidth: 1, marginBottom: 10 }}
        placeholder="Digite o nome do cliente"
      />

      <Text>Telefone</Text>
      <TextInput
        value={telefone}
        onChangeText={setTelefone}
        style={{ borderWidth: 1, marginBottom: 10 }}
        placeholder="Digite o telefone"
        keyboardType="phone-pad"
      />

      {/* Selecionar Data */}
      <Text>Data</Text>
      <Button title={dayjs(data).format('DD/MM/YYYY')} onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={data}
          mode="date"
          display="default"
          onChange={onChangeDate}
          minimumDate={new Date()} // Impede escolher datas passadas
        />
      )}

      {/* Selecionar Horário */}
      <Text>Horário</Text>
      <Button title={dayjs(hora).format('HH:mm')} onPress={() => setShowTimePicker(true)} />
      {showTimePicker && (
        <DateTimePicker
          value={hora}
          mode="time"
          display="default"
          onChange={onChangeTime}
          is24Hour={true} // Horário no formato 24h
        />
      )}

      <Text>Serviço</Text>
      <TextInput
        value={servico}
        onChangeText={setServico}
        style={{ borderWidth: 1, marginBottom: 10 }}
        placeholder="Digite o serviço"
      />

      <Text>Profissional (Opcional)</Text>
      <TextInput
        value={profissional}
        onChangeText={setProfissional}
        style={{ borderWidth: 1, marginBottom: 10 }}
        placeholder="Digite o nome do profissional"
      />

      <Button title="Salvar Agendamento" onPress={handleSalvarAgendamento} />
    </ScrollView>
  );
}
