import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import Txt from '../components/Txt';


const ServiceProviderPicker = ({ index, onRemove, services, affinities, onValuesChange }) => {
  const [selectedService, setSelectedService] = useState('');
  const [selectedAffinity, setSelectedAffinity] = useState(1);

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
         <Txt  text={"Selecione um Serviço:"}/>

      <Picker
        selectedValue={selectedService}
        onValueChange={handleServiceChange}
        style={styles.picker}
      >
        {services.map((service) => (
          <Picker.Item key={service.id} label={service.name} value={service.id} />
        ))}
      </Picker>

        <Txt  text={"Selecione uma Afinidade:"}/>
      <Picker
        selectedValue={selectedAffinity}
        onValueChange={handleAffinityChange}
        style={styles.picker}
      >
        {[1, 2, 3, 4, 5].map((value) => (
          <Picker.Item key={value} label={`${value}`} value={value} />
        ))}
      </Picker>

      <Button title="Remover" onPress={onRemove} />
      <Txt  text={`Serviço Selecionado: ${selectedService}`}/>
      <Txt  text={`Afinidade Selecionada: ${selectedAffinity}`}/>
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
  },
});

export default ServiceProviderPicker;
