import React, { useEffect, useState } from 'react';
import { View, FlatList, Pressable, StyleSheet } from 'react-native';
import { getServicesProvider } from '../database/scheduleDB';
import Txt from '../components/Txt';
import BtnItemList from '../components/BtnItemList';
import BtnPadraoMenor from '../components/BtnPadraoMenor';

const ServiceProviderListScreen = ({ navigation }) => {
  const [serviceProviders, setServiceProviders] = useState([]);

  useEffect(() => {
    const fetchServiceProviders = async () => {
      try {
        const providersData = await getServicesProvider();
        console.log('Prestadores de serviço carregados:', providersData); // Verifique os dados retornados
        setServiceProviders(providersData);
      } catch (error) {
        console.error('Erro ao buscar prestadores de serviço:', error);
      }
    };

    fetchServiceProviders();

    const unsubscribe = navigation.addListener('focus', fetchServiceProviders); // Atualiza ao focar na tela

    return unsubscribe; // Remove o listener quando o componente é desmontado
  }, [navigation]);

  const renderServiceProviderItem = ({ item }) => {
    return (
      <BtnItemList 
        propOnPress={() => navigation.navigate('ServiceProviderEditScreen', { serviceProvider: item })} // Corrigido para passar 'service'
      >
        <Txt text={item.name} />
      </BtnItemList>
    );
  };

  return (
    <View style={styles.container}>
      <BtnPadraoMenor propOnPress={() => navigation.navigate('ServiceProviderScreen')}>Adicionar um prestador de serviço</BtnPadraoMenor>

      <Txt text="Prestadores de Serviço" />
      <FlatList 
        data={serviceProviders}
        renderItem={renderServiceProviderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1A2833',
  },
  serviceItem: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#2A3C4D',
  },
});

export default ServiceProviderListScreen;
