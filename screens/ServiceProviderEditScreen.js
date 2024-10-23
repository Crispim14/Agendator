import React, { useState, useEffect } from "react";
import { Text, TextInput, Alert, ToastAndroid, ScrollView } from "react-native";
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

function showToast(text) {
  ToastAndroid.show(text, ToastAndroid.SHORT);
}

const ServiceProviderEditScreen = ({ route, navigation }) => {
  const serviceProvider = route.params?.serviceProvider || {};
  const [name, setName] = useState(serviceProvider.name || "");
  const [pickers, setPickers] = useState([{ serviceId: '', affinity: 1 }]);
  const [relatedServices, setRelatedServices] = useState([]);  // Armazena apenas os serviços relacionados ao colaborador
  const [allServices, setAllServices] = useState([]);  // Todos os serviços disponíveis
  const [msgError, setMsgError] = useState({ nameError: '' });

  useEffect(() => {
    if (serviceProvider.id) {
      setName(serviceProvider.name);
      loadRelatedServices(serviceProvider.id);  // Carrega os serviços relacionados ao colaborador
    }
    fetchAllServices();  // Carrega todos os serviços disponíveis, mas não os exibe imediatamente
  }, [serviceProvider]);

  const fetchAllServices = async () => {
    try {
      const result = await getServices();
      setAllServices(result);  // Carrega a lista de todos os serviços disponíveis, mas não a usa na edição inicial
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    }
  };

  const loadRelatedServices = async (providerId) => {
    try {
      const related = await getListServicesProvider(providerId);  // Obtém apenas os serviços relacionados
      if (related.length > 0) {
        const pickersData = related.map((item) => ({
          serviceId: item.id,   // Garante que o ID correto de cada serviço relacionado seja obtido
          affinity: item.affinity,  // Garante que a afinidade correta seja obtida
        }));
        setPickers(pickersData);  // Atualiza os pickers com os serviços e afinidades relacionados
        setRelatedServices(related);  // Armazena os serviços relacionados
      } else {
        setPickers([{ serviceId: '', affinity: 1 }]);  // Inicializa com um picker vazio se não houver serviços
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
        providerId = result.lastInsertRowId;  // Obtém o ID do novo colaborador criado
        showToast('Colaborador adicionado com sucesso');
      }

      await saveRelatedServices(providerId);  // Passamos o ID correto
      clearFormData();
      navigation.navigate("ServiceProviderList", { refresh: true });
    } catch (error) {
      console.error('Erro ao salvar o colaborador:', error);
      showToast("Ocorreu um erro ao salvar o colaborador.");
    }

  };

  const saveRelatedServices = async (providerId) => {
    try {
      await Promise.all(pickers.map(async (picker) => {
        const relates = {
          idProvider: providerId,  // Certifica-se de que o ID correto é passado
          idService: picker.serviceId,
          affinity: picker.affinity,
        };
        await addRelatesServicesProvider(relates);  // Salva o relacionamento serviço/afinidade
      }));
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
    // Adiciona um novo picker com a lista completa de serviços
    setPickers([...pickers, { serviceId: '', affinity: 1 }]);
  };

  const removePicker = (index) => {
    const newPickers = [...pickers];
    newPickers.splice(index, 1);
    setPickers(newPickers);
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: "#1A2833" }}>
      <Txt text={"Nome para o colaborador:"} />
      <Text style={{ color: "red" }}>{msgError.nameError}</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={{ borderBottomWidth: 1, marginBottom: 16, color: "#E3E3E3" }}
      />

      {pickers.map((picker, index) => (
        <ServiceProviderPicker
          key={index}
          index={index}
          onRemove={() => removePicker(index)}
          services={allServices}  // Passa a lista de todos os serviços disponíveis para cada picker
          affinities={[1, 2, 3, 4, 5]}
          onValuesChange={handleValuesChange}
          initialServiceId={picker.serviceId}  // Certifique-se de que o ID correto do serviço está sendo passado
          initialAffinity={picker.affinity}  // Certifique-se de que a afinidade correta está sendo passada
        />
      ))}
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
