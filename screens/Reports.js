import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Platform, ToastAndroid, ScrollView ,Share} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getSchedulesMonth,getSchedules1,getSchedulesYear, getSchedulesRange } from '../database/scheduleDB';
import Txt from '../components/Txt';
import BtnPadrao from '../components/BtnPadrao';
import BtnPadraoMenor from '../components/BtnPadraoMenor';
import ServicePicker from './ServicePicker';
import { useTheme } from '../ThemeContext'; // Importa o contexto de tema
import CheckboxPadrao from "../components/CheckboxPadrao";

const Reports = ({ route, navigation }) => {
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

        console.log(`setYear`)
        console.log(year)
    };

    const onChangeDataRange2 = (event, selectedDate) => {
        setShowDataRangePicker2(false);
        if (selectedDate) setDataRange2(selectedDate);

        console.log(`setYear`)
        console.log(year)
    };

    



  
    const MesEAno   = async() =>{

        let novosDados = await getSchedulesMonth(date,name) ;

        console.log(novosDados)

    }

    const FiltarPorDias   = async() =>{

        console.log(name)
        let novosDados = await getSchedules1(dias,name) ;

        console.log(novosDados)

    }

    const FiltarPorAno   = async() =>{

        console.log(name)
        let novosDados = await getSchedulesYear(year,name) ;

        console.log(novosDados)

    }


    const FiltarRange   = async() =>{

        
        let novosDados = await getSchedulesRange(dataRange1, dataRange2,name) ;

        console.log(novosDados)

    }



    return (
        <ScrollView style={{ flex: 1, padding: 16, backgroundColor: theme.background }}>


<TextInput value={name} onChangeText={setName} style={{ borderBottomWidth: 1, marginBottom: 16, color: theme.text }} />

            <Txt text={'Data:'} />
            <BtnPadraoMenor propOnPress={() => setShowDatePicker(true)}>Selecionar Data</BtnPadraoMenor>

            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={onChangeDate}
                />
            )}

<BtnPadraoMenor propOnPress={MesEAno}>Filtrar por ano e mes</BtnPadraoMenor>


<BtnPadraoMenor propOnPress={FiltarPorDias}>Por dias</BtnPadraoMenor>


<BtnPadraoMenor propOnPress={FiltarPorAno}>Filtrar pelo ano</BtnPadraoMenor>

    
{showDatePickerYear && (
        <DateTimePicker
          value={year}
          mode="date" // Definido como "date", mas vamos manipular apenas o ano
          display="default"
          onChange={onChangeYear}
       
        />
      )}

<BtnPadraoMenor propOnPress={() => setShowDatePickerYear(true)}>Selecionar o ano </BtnPadraoMenor>

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

<BtnPadraoMenor propOnPress={() => setShowDataRangePicker1(true)}>Selecionar Data range1</BtnPadraoMenor>

            
{showDataRangePicker2 && (
                <DateTimePicker
                    value={dataRange2}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={onChangeDataRange2}
                />
            )}


<BtnPadraoMenor propOnPress={() => setShowDataRangePicker2(true)}>Selecionar Data range2</BtnPadraoMenor>


<BtnPadraoMenor propOnPress={FiltarRange}>Filtrar por Range</BtnPadraoMenor>
        </ScrollView>
    );
};

export default Reports;
