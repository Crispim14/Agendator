import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
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
        setServiceProviders(providersData);
      } catch (error) {
        console.error('Erro ao buscar o colaborador:', error);
      }
    };

    fetchServiceProviders();

    const unsubscribe = navigation.addListener('focus', fetchServiceProviders);
    return unsubscribe;
  }, [navigation]);

  const renderServiceProviderItem = ({ item }) => (
    <BtnItemList
      propOnPress={() => navigation.navigate('ServiceProviderEditScreen', { serviceProvider: item })} // Corrigido para 'serviceProvider'
    >
      <Txt text={item.name} />
    </BtnItemList>
  );

  return (
    <View style={styles.container}>
      <BtnPadraoMenor propOnPress={() => navigation.navigate('ServiceProviderScreen')}>
        Adicionar Colaborador
      </BtnPadraoMenor>
      <Txt text="Colaborador" />
      {serviceProviders.length > 0 ? (
        <FlatList
          data={serviceProviders}
          renderItem={renderServiceProviderItem}
          keyExtractor={item => item.id.toString()}
        />
      ) : (
        <Text style={{ color: '#E3E3E3', textAlign: 'center', marginTop: 20 }}>
          Nenhum colaborador encontrado.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1A2833',
  },
});

export default ServiceProviderListScreen;
