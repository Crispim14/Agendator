import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Platform, ToastAndroid, ScrollView ,Share} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getSchedulesMonth,getSchedules1,getSchedulesYear, getSchedulesRange } from '../database/scheduleDB';
import Txt from '../components/Txt';
import BtnPadrao from '../components/BtnPadrao';
import BtnPadraoMenor2 from '../components/BtnPadraoMenor2';
import ServicePicker from './ServicePicker';
import { useTheme } from '../ThemeContext'; // Importa o contexto de tema
import CheckboxPadrao from "../components/CheckboxPadrao";

const ReportsScreen = ({ route, navigation }) => {
    const { theme } = useTheme(); // Obtém o tema atual

  
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showDatePickerYear, setShowDatePickerYear] = useState(false);
    const [date, setDate] = useState( new Date());
    const [year, setYear] = useState( new Date());
    const [dados, setDados] = useState([]);
    const [name, setName] = useState('');
    const [dias, setDias] = useState(7);
    const [dataRange1, setDataRange1] = useState( new Date());
    const [dataRange2, setDataRange2] = useState( new Date());
    const [showDataRangePicker1, setShowDataRangePicker1] = useState(false);
    const [showDataRangePicker2, setShowDataRangePicker2] = useState(false);



    const onChangeDate = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) setDate(selectedDate);
    };


    const onChangeYear = (event, selectedDate) => {
        setShowDatePickerYear(false);
        if (selectedDate) setYear(selectedDate);

       
    };


    const onChangeDataRange1 = (event, selectedDate) => {
        setShowDataRangePicker1(false);
        if (selectedDate) setDataRange1(selectedDate);

      
    };

    const onChangeDataRange2 = (event, selectedDate) => {
        setShowDataRangePicker2(false);
        if (selectedDate) setDataRange2(selectedDate);

      
    };

    



  
    const MesEAno   = async() =>{

        const novosDados = await getSchedulesMonth(date,name) ;
        setDados(novosDados)
        
      

    }

    const FiltarPorDias   = async() =>{

     
        const novosDados = await getSchedules1(dias,name) ;
        setDados(novosDados)
   

    }

    const FiltarPorAno   = async() =>{

     
        const novosDados = await getSchedulesYear(year,name) ;
        setDados(novosDados)

    }


    const FiltarRange   = async() =>{

        
        const novosDados = await getSchedulesRange(dataRange1, dataRange2,name) ;
        setDados(novosDados)
       

    }



    return (
        <ScrollView style={{ flex: 1, padding: 16, backgroundColor: theme.background }}>

<Txt text={'Digite o nome do cliente que deseja filtrar'} />
<TextInput value={name} onChangeText={setName} style={{ borderBottomWidth: 1, marginBottom: 16, color: theme.text }} />

            <Txt text={'Data:'} />
            <BtnPadraoMenor2 propOnPress={() => setShowDatePicker(true)}>Selecionar Data</BtnPadraoMenor2>

            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={onChangeDate}
                />
            )}

<BtnPadraoMenor2 propOnPress={MesEAno}>Filtrar por ano e mes</BtnPadraoMenor2>


<BtnPadraoMenor2 propOnPress={FiltarPorDias}>Por dias</BtnPadraoMenor2>


<BtnPadraoMenor2 propOnPress={FiltarPorAno}>Filtrar pelo ano</BtnPadraoMenor2>

    
{showDatePickerYear && (
        <DateTimePicker
          value={year}
          mode="date" // Definido como "date", mas vamos manipular apenas o ano
          display="default"
          onChange={onChangeYear}
       
        />
      )}

<BtnPadraoMenor2 propOnPress={() => setShowDatePickerYear(true)}>Selecionar o ano </BtnPadraoMenor2>

            <Txt text={year.toLocaleDateString('pt-BR')} />

            <TextInput
  keyboardType="number-pad"  // Abre o teclado numérico
  value={dias}
  onChangeText={setDias}
  placeholder="Digite um número"
/>




{showDataRangePicker1 && (
                <DateTimePicker
                    value={dataRange1}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={onChangeDataRange1}
                />
            )}

<BtnPadraoMenor2 propOnPress={() => setShowDataRangePicker1(true)}>Selecionar Data range1</BtnPadraoMenor2>

            
{showDataRangePicker2 && (
                <DateTimePicker
                    value={dataRange2}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={onChangeDataRange2}
                />
            )}


<BtnPadraoMenor2 propOnPress={() => setShowDataRangePicker2(true)}>Selecionar Data range2</BtnPadraoMenor2>


<BtnPadraoMenor2 propOnPress={FiltarRange}>Filtrar por Range</BtnPadraoMenor2>

  {/* Exibindo os dados na tela */}
  <View style={{ marginTop: 16 }}>
                {dados && dados.length > 0 ? (
                    dados.map((item, index) => (
                        <View key={index} style={{ marginBottom: 10 }}>

<Text style={{ color: theme.text }}>
                          Dados do cliente
                              
                            </Text>
                            <Text style={{ color: theme.text }}>
                              Nome {item.name }
                              
                            </Text>
                            <Text style={{ color: theme.text }}>
                               Telefone {item.phone }
                               
                            </Text>
                           

                        </View>
                    ))
                ) : (
                    <Text style={{ color: theme.text }}>Nenhum dado encontrado</Text>
                )}
            </View>
        </ScrollView>
    );
};

export default ReportsScreen;
