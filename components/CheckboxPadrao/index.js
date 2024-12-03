import React from 'react';
import {  StyleSheet ,View , Text} from 'react-native';
import { Checkbox } from 'react-native-paper';
import Txt from '../Txt';


export default function CheckboxPadrao({ txt, statusCheck,propOnPress}) {

    const handleFuncion  =  () =>{
        propOnPress()
    }
    return (
<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
  <Checkbox
    status={statusCheck}
    onPress={handleFuncion}
    color={statusCheck ? '#0CABA8' : 'red'}
  />

  
  <Txt text={txt}/>

</View>

    );
}

