import React, { useEffect, useState } from 'react';
import { View, FlatList, Pressable, StyleSheet } from 'react-native';
import { getServices } from '../database/scheduleDB';
import Txt from '../components/Txt';
import BtnItemList from '../components/BtnItemList';
import BtnPadraoMenor from '../components/BtnPadraoMenor';
import BtnPadrao from '../components/BtnPadrao';

const ServiceListScreen = ({ navigation }) => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const servicesData = await getServices();


                //console.log('Serviços carregados:', servicesData);
                setServices(servicesData);
            } catch (error) {
                console.error('Erro ao buscar serviços:', error);
            }
        };

        fetchServices();

        const unsubscribe = navigation.addListener('focus', fetchServices); // Atualiza ao focar na tela

        return unsubscribe; // Remove o listener quando o componente é desmontado
    }, [navigation]);

    const renderServiceItem = ({ item }) => (
        <BtnItemList
            propOnPress={() => navigation.navigate('ServiceEditScreen', { service: item })}
        >
            <Txt text={item.name} />
        </BtnItemList>
    );

    return ( 



        <View style={styles.container}>

            <BtnPadraoMenor propOnPress={() => navigation.navigate('ServiceScreen')}>Adicionar Serviço</BtnPadraoMenor>

            <Txt text="Serviços" />
            <FlatList
                data={services}
                renderItem={renderServiceItem}
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

export default ServiceListScreen;
