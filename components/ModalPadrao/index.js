import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';


const ModalPadrao = ({ visible, onClose, navigation }) => {

  const handleClose = () => {
    onClose();
    navigation.navigate('Configuracao',{msg: 'Faça as configurações iniciais para começar a usar o aplicativo.'});
  }



  


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View >
      <Text >Bem vindo </Text>
            <TouchableOpacity  onPress={handleClose}>
             { // <AntDesign name="close" size={24} color="black" />  
}
            </TouchableOpacity>
            <View >
              <Text >Bem vindo </Text>
              <Text >xx</Text>
            
            </View>
      

        
      </View>
    </Modal>
  );
};

export default ModalPadrao;