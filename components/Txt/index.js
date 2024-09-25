import {  Text, StyleSheet } from 'react-native';
export default function ({text}) {
  return (
    <Text  style={styles.text}>{text}</Text>
  )
}


const styles = StyleSheet.create({
    text: {
      color: '#E3E3E3',
    },
  })