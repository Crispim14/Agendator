import {  Text, StyleSheet } from 'react-native';
export default function TxtBool({text,txtBool}) {
  return (
    <Text  style={ txtBool ? styles.booleanTrue: styles.booleanFalse }>{text}</Text>
  )
}


const styles = StyleSheet.create({
    booleanTrue: {
      color: 'green',
    },
    booleanFalse: {
        color: 'red',
      },
  })