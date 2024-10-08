import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

export default function BtnPadraoMenor({ children,propOnPress}) {

    const handleFuncion  =  () =>{
        propOnPress()
    }
    return (
        <Pressable style={styles.button} onPress={handleFuncion}>

            <Text style={{ fontSize: 15, color: '#E3E3E3', textAlign: 'center', margin: 10 }}>{children}</Text>

        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#0CABA8',
        borderRadius: 50,
        marginHorizontal: 50,
        marginVertical: 5
    },
});
