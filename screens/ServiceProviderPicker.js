import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import Txt from '../components/Txt';

const ServiceProviderPicker = ({ index, onRemove, services, affinities, onValuesChange, initialServiceId = '', initialAffinity = 1 }) => {
  const [selectedService, setSelectedService] = useState(initialServiceId);  // Inicializar com o valor passado
  const [selectedAffinity, setSelectedAffinity] = useState(initialAffinity);  // Inicializar com a afinidade passada

  useEffect(() => {
    // Atualizar o picker quando os valores iniciais mudarem
    setSelectedService(initialServiceId);
    setSelectedAffinity(initialAffinity);
  }, [initialServiceId, initialAffinity]);

  const handleServiceChange = (itemValue) => {
    setSelectedService(itemValue);
    onValuesChange(index, itemValue, selectedAffinity);
  };

  const handleAffinityChange = (itemValue) => {
    setSelectedAffinity(itemValue);
    onValuesChange(index, selectedService, itemValue);
  };

  return (
    <View style={styles.pickerContainer}>
      <Txt text={"Selecione um Serviço:"} />

      <Picker
        selectedValue={selectedService}
        onValueChange={handleServiceChange}
        style={styles.picker}
      >
        {services.map((service) => (
          <Picker.Item key={service.id} label={service.name} value={service.id} />
        ))}
      </Picker>

      <Txt text={"Selecione uma Afinidade:"} />
      <Picker
        selectedValue={selectedAffinity}
        onValueChange={handleAffinityChange}
        style={styles.picker}
      >
        {affinities.map((value) => (
          <Picker.Item key={value} label={`${value}`} value={value} />
        ))}
      </Picker>

      <Button title="Remover" onPress={onRemove} />
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    marginVertical: 10,
    color: '#E3E3E3',
  },
});

export default ServiceProviderPicker;
