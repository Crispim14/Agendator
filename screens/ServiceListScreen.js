import React, { useEffect, useState } from 'react';
import { View, FlatList, Pressable, StyleSheet } from 'react-native';
import { getServices } from '../database/scheduleDB';
import Txt from '../components/Txt';
import BtnItemList from '../components/BtnItemList';
import BtnPadraoMenor from '../components/BtnPadraoMenor';
import BtnPadrao from '../components/BtnPadrao';
import { useTheme } from '../ThemeContext'; // Importa o contexto de tema

const ServiceListScreen = ({ navigation }) => {
    const { theme } = useTheme(); // Obtém o tema atual
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const servicesData = await getServices();
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
            <Txt text={item.name} style={{ color: theme.text }} />
        </BtnItemList>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <BtnPadraoMenor propOnPress={() => navigation.navigate('ServiceScreen')}>
                Adicionar Serviço
            </BtnPadraoMenor>
            <Txt text="Serviços" style={{ color: theme.text }} />
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
    },
    serviceItem: {
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
        backgroundColor: '#2A3C4D',
    },
});

export default ServiceListScreen;
