import React, { useState, useEffect } from "react";
import { Text, TextInput, Alert, ToastAndroid, ScrollView } from "react-native";
import {

  updateService,
  addServicesProvider,
  getServices,
  getLastServicesProvider,
  addRelatesServicesProvider,
  deleteServiceProvider, 
} from "../database/scheduleDB";
import Txt from "../components/Txt";
import BtnPadraoMenor from "../components/BtnPadraoMenor";
import ServiceProviderPicker from './ServiceProviderPicker';

function showToast(text) {
  ToastAndroid.show(text, ToastAndroid.SHORT);
}

const ServiceProviderEditScreen = ({ route, navigation }) => {
  const serviceProvider = route.params?.service || {};
  const [name, setName] = useState(serviceProvider.name || "");
  const [pickers, setPickers] = useState([{ serviceId: '', affinity: 1 }]);
  const [services, setServices] = useState([]);
  const [lastProvider, setLastProvider] = useState(null);
  const [msgError, setMsgError] = useState({
    nameError: '',
  });




  useEffect(() => {
    if (!serviceProvider.id) {

    } else {
        setName(serviceProvider.name);

    }
}, [serviceProvider]);


  useEffect(() => {

    const fetchServices = async () => {
      try {
      
        const result = await getServices();
        setServices(result);
      } catch (error) {
        console.error("Erro ao buscar serviços:", error);
      }
    };

    fetchServices();
  }, []);

  const clearFormData = () => {
    setName("");
    setPickers([{ serviceId: '', affinity: 1 }]);
  };

  const clearErrors = () => {
    setMsgError({
      nameError: "",
    });
  };

  const checkErrors = () => {
    clearErrors();
    let error = false;
    if (!name.trim()) {
      setMsgError((prevState) => ({
        ...prevState,
        nameError: "Digite um nome para o prestador do serviço",
      }));
      error = true;
    }
    return error;
  };

  const saveService = async () => {
    try {
      if (checkErrors()) {
        return;
      }

      const newServiceProvider = {
        name,
      };

      await proceedSave(newServiceProvider);

      pickers.forEach((picker) => {
        const teste = {
          idProvider: lastProvider + 1,
          idService: picker.serviceId,
          affinity: picker.affinity,
        };
    
        addRelatesServicesProvider(teste);
      });
      
    } catch (error) {
      showToast("Ocorreu um erro ao salvar o serviço.");
    }
  };

  const proceedSave = async (newService) => {
    try {
      if (serviceProvider.id) {
        // Editar
        await updateService({ ...newService, id: serviceProvider.id });
        showToast("Serviço atualizado com sucesso");
      } else {
        // Adicionar novo
        await addServicesProvider(newService);
        const result = await getLastServicesProvider();
        setLastProvider(result.id);
        
        showToast("Serviço inserido com sucesso");
      }
      clearFormData();
      navigation.navigate("Home", { refresh: true });
    } catch (error) {
      console.error('Erro ao salvar o serviço:', error); // Log do erro
      showToast("Ocorreu um erro ao salvar o serviço.");
    }
  };

  const confirmDeleteService = () => {
    Alert.alert(
      "Excluir Agendamento",
      "Tem certeza de que deseja excluir este agendamento?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: removeService },
      ],
      { cancelable: true }
    );
    clearFormData();
  };

  const removeService = async () => {
    try {
      if (serviceProvider.id) {
        console.log(serviceProvider.id)
        await deleteServiceProvider(serviceProvider);
        showToast("Serviço deletado com sucesso");
        navigation.navigate("Home", { refresh: true });
      }
    } catch (error) {
      showToast("Ocorreu um erro ao excluir o serviço.");
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
    setPickers(pickers.filter((_, i) => i !== index));
  };

  const showSelectedValues = () => {
    const selectedValues = pickers.map((picker, index) => ({
      Picker: index + 1,
      ServiceID: picker.serviceId,
      Affinity: picker.affinity,
    }));

    console.log(selectedValues.length > 0 ? selectedValues : "Nenhum serviço selecionado.");
  };

  return (

    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: "#1A2833" }}>
      <Txt text={"Nome para o prestador do serviço:"} />
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
          services={services}
          affinities={[1, 2, 3, 4, 5]}
          onValuesChange={handleValuesChange}
        />
      ))}
      <BtnPadraoMenor propOnPress={addPicker}>Adicionar Serviço</BtnPadraoMenor>
      <BtnPadraoMenor propOnPress={clearFormData}>Limpar Campo</BtnPadraoMenor>
      <BtnPadraoMenor propOnPress={saveService}>Salvar</BtnPadraoMenor>
      <BtnPadraoMenor propOnPress={showSelectedValues}>Mostrar Valores</BtnPadraoMenor> 
      {serviceProvider.id && (
        <BtnPadraoMenor propOnPress={confirmDeleteService} bgColor="red">
          Excluir
        </BtnPadraoMenor>
      )}
    </ScrollView>
  );
};

export default ServiceProviderEditScreen;
