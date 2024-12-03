import React, { useState, useEffect } from "react";
import { Text, TextInput, Alert, ToastAndroid, ScrollView , View, TouchableOpacity} from "react-native";
import {
  updateServiceProvider,
  addServicesProvider,
  getServices, 
  addRelatesServicesProvider,
  getListServicesProvider,
  deleteServiceProvider,
} from "../database/scheduleDB";
import Txt from "../components/Txt";
import BtnPadraoMenor from "../components/BtnPadraoMenor";
import ServiceProviderPicker from './ServiceProviderPicker';
import { useTheme } from '../ThemeContext'; // Importa o contexto de tema
import CheckboxPadrao from "../components/CheckboxPadrao";

function showToast(text) {
  ToastAndroid.show(text, ToastAndroid.SHORT);
}

const ServiceProviderEditScreen = ({ route, navigation }) => {
  const { theme } = useTheme(); // Obtém o tema atual
  const serviceProvider = route.params?.serviceProvider || {};
  const [name, setName] = useState(serviceProvider.name || "");
  const [pickers, setPickers] = useState([{ serviceId: '', affinity: 1 }]);
  const [relatedServices, setRelatedServices] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedServicos, setSelectedServicos] = useState({});

  const [allServices, setAllServices] = useState([]);
  const [msgError, setMsgError] = useState({ nameError: '' });






  const handleCheckboxChange = (id) => {
    setSelectedServicos(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));  
  };

  useEffect(() => {
    if (serviceProvider.id) {
      setName(serviceProvider.name);
      loadRelatedServices(serviceProvider.id);
      
    }
    fetchAllServices();
  }, [serviceProvider]);

  const fetchAllServices = async () => {
    try {
      const result = await getServices();
      setAllServices(result);
      
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    }
  };

  const loadRelatedServices = async (providerId) => {
    try {
      const related = await getListServicesProvider(providerId);
      if (related.length > 0) {
        const pickersData = related.map((item) => ({
          serviceId: item.id,
          affinity: item.affinity,
        }));
        setPickers(pickersData);
        setRelatedServices(related);
      } else {
        setPickers([{ serviceId: '', affinity: 1 }]);
      }
    } catch (error) {
      console.error("Erro ao carregar serviços relacionados:", error);
    }
  };

  const clearFormData = () => {
    setName("");
    setPickers([{ serviceId: '', affinity: 1 }]);
  };

  const checkErrors = () => {
    if (!name.trim()) {
      setMsgError({ nameError: "Digite um nome para o colaborador" });
      return true;
    }
    return false;
  };

  const saveServiceProvider = async () => {
    if (checkErrors()) return;

    const newServiceProvider = { name };

    try {
      let providerId;
      if (serviceProvider.id) {
        await updateServiceProvider({ ...newServiceProvider, id: serviceProvider.id });
        providerId = serviceProvider.id;
        showToast('Colaborador atualizado com sucesso');
      } else {
        const result = await addServicesProvider(newServiceProvider);
        providerId = result.lastInsertRowId;
        showToast('Colaborador adicionado com sucesso');
      }

      await saveRelatedServices(providerId);
      clearFormData();
      navigation.navigate("ServiceProviderList", { refresh: true });
    } catch (error) {
      console.error('Erro ao salvar o colaborador:', error);
      showToast("Ocorreu um erro ao salvar o colaborador.");
    }
  };

  const saveRelatedServices = async (providerId) => {
    try {
      for (const idServico of Object.keys(selectedServicos)) {
        if (selectedServicos[idServico]) {
          const relates = {
            idProvider: providerId,
            idService: idServico,
            affinity: 1,
          };
  
          await addRelatesServicesProvider(relates);
        }
      }
    } catch (error) {
      console.error("Erro ao salvar serviços relacionados:", error);
      showToast("Erro ao salvar serviços relacionados.");
    }
  };

  const confirmDeleteService = () => {
    Alert.alert(
      "Excluir Colaborador",
      "Tem certeza de que deseja excluir este colaborador?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: removeService },
      ]
    );
  };

  const removeService = async () => {
    try {
      if (serviceProvider.id) {
        await deleteServiceProvider(serviceProvider);
        showToast("Colaborador deletado com sucesso");
        navigation.navigate("ServiceProviderList", { refresh: true });
      }
    } catch (error) {
      showToast("Ocorreu um erro ao excluir o colaborador.");
    }
  };

  const handleValuesChange = (index, serviceId, affinity) => {
    const newPickers = [...pickers];
    newPickers[index] = { serviceId, affinity };
    setPickers(newPickers);
  };

  const addPicker = () => {
    setPickers([...pickers, { serviceId: '', affinity: 1 }]);
  };

  const removePicker = (index) => {
    const newPickers = [...pickers];
    newPickers.splice(index, 1);
    setPickers(newPickers);
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: theme.background }}>
      <Txt text={"Nome para o colaborador:"} />
      <Text style={{ color: 'red' }}>{msgError.nameError}</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={{ borderBottomWidth: 1, marginBottom: 16, color: theme.text }}
      />


<ScrollView >
{allServices.map((servico) => (
  <View key={servico.id} style={{ flexDirection: 'row', marginBottom: 8 , }}>
    <CheckboxPadrao
      statusCheck={!!selectedServicos[servico.id] ? 'checked' : 'unchecked'}
      propOnPress={ () =>  handleCheckboxChange(servico.id)}
      txt={servico.name}
    />
    
  </View>
))}
  </ScrollView>



      <BtnPadraoMenor propOnPress={addPicker}>Adicionar Serviço</BtnPadraoMenor>
      <BtnPadraoMenor propOnPress={clearFormData}>Limpar Campos</BtnPadraoMenor>
      <BtnPadraoMenor propOnPress={saveServiceProvider}>Salvar</BtnPadraoMenor>
      {serviceProvider.id && (
        <BtnPadraoMenor propOnPress={confirmDeleteService} bgColor="red">
          Excluir
        </BtnPadraoMenor>
      )}
    </ScrollView>
  );
};

export default ServiceProviderEditScreen;

