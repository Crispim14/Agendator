import {  Text, StyleSheet } from 'react-native';
export default function TxtBool({text,txtBool}) {
  return (
    <Text  style={ txtBool ? styles.booleanTrue: styles.booleanFalse }>{text}</Text>
  )
}


const styles = StyleSheet.create({
    booleanTrue: {
      color: 'green',
      fontFamily: 'LeagueSpartan-Regular'
    },
    booleanFalse: {
        color: 'red',
        fontFamily: 'LeagueSpartan-Regular'
      },
  })