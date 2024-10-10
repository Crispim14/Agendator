import React, { useState, useEffect } from 'react';
import { View, FlatList, Pressable, Button } from 'react-native';
import { getService, toggleFavoriteService } from '../database/scheduleDB';
import Txt from '../components/Txt';
import BtnPadrao from '../components/BtnPadrao';

const ServiceListScreen = ({ navigation }) => {
    const [services, setServices] = useState([]);

    // Função para buscar os serviços e atualizar o estado
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const servicesData = await getService();
                console.log("Serviços retornados:", servicesData); // Verificar os serviços retornados
                setServices(servicesData);
            } catch (error) {
                console.error('Erro ao buscar serviços:', error);
            }
        };

        fetchServices();

        // Atualiza a lista ao retornar para esta tela
        const unsubscribe = navigation.addListener('focus', () => {
            fetchServices();
        });

        return unsubscribe;
    }, [navigation]);

    // Função para marcar/desmarcar um serviço como favorito
    const toggleFavorite = async (service) => {
        try {
            await toggleFavoriteService(service.id, service.favorite);
            const updatedServices = await getService(); // Atualiza a lista de serviços
            setServices(updatedServices);
        } catch (error) {
            console.error('Erro ao alternar favorito:', error);
        }
    };

    // Renderização de cada item da lista
    const renderService = ({ item }) => {
        console.log("Renderizando serviço:", item); // Log para depuração
        return (
            <Pressable onPress={() => navigation.navigate('ServiceScreen', { service: item })}>
                <View style={{
                    padding: 20,
                    marginVertical: 8,
                    backgroundColor: item.favorite ? '#FFD700' : '#0CABA8', // Cor para favoritos
                    borderColor: item.favorite ? '#FFD700' : '#0CABA8',
                    borderWidth: item.favorite ? 2 : 0,
                }}>
                    <Txt text={item.name} />
                    <Txt text={`Descrição: ${item.description}`} />
                </View>
            </Pressable>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#1A2833' }}>
            <BtnPadrao propOnPress={() => navigation.navigate('ServiceScreen')}>
                <Txt text="Adicionar Novo Serviço" />
            </BtnPadrao>

            <FlatList
                data={services}
                renderItem={renderService}
                keyExtractor={item => item.id.toString()} // Garante que cada item tenha um ID único
            />
        </View>
    );
};

export default ServiceListScreen;
