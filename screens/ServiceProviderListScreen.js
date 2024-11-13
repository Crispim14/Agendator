import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { getServicesProvider } from '../database/scheduleDB';
import Txt from '../components/Txt';
import BtnItemList from '../components/BtnItemList';
import BtnPadraoMenor from '../components/BtnPadraoMenor';
import { useTheme } from '../ThemeContext'; 

const ServiceProviderListScreen = ({ navigation }) => {
  const { theme } = useTheme(); 
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
      propOnPress={() => navigation.navigate('ServiceProviderEditScreen', { serviceProvider: item })}
    >
      <Txt text={item.name} style={{ color: theme.text }} />
    </BtnItemList>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <BtnPadraoMenor propOnPress={() => navigation.navigate('ServiceProviderScreen')}>
        Adicionar Colaborador
      </BtnPadraoMenor>
      <Txt text="Colaborador" style={{ color: theme.text }} />
      {serviceProviders.length > 0 ? (
        <FlatList
          data={serviceProviders}
          renderItem={renderServiceProviderItem}
          keyExtractor={item => item.id.toString()}
        />
      ) : (
        <Text style={{ color: theme.text, textAlign: 'center', marginTop: 20 }}>
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
  },
});

export default ServiceProviderListScreen;
