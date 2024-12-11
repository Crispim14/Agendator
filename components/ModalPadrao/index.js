import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';

const ModalPadrao = ({ visible, onClose, navigation }) => {

  const handleClose = () => {
    onClose();
    navigation.navigate('Configuracao', { msg: 'Faça as configurações iniciais para começar a usar o aplicativo.' });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Bem-vindo</Text>
          <Text style={styles.message}>Faça as configurações iniciais para começar a usar o aplicativo.</Text>
          <TouchableOpacity onPress={handleClose} style={styles.okButton}>
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center', // Centraliza verticalmente
    alignItems: 'center', // Centraliza horizontalmente
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo transparente com opacidade
  },
  modalContainer: {
    width: '80%', // Ajusta a largura do modal
    backgroundColor: 'white', // Fundo do modal
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  okButton: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  okButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ModalPadrao;
