import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

export default function BtnPadrao({ children,propOnPress}) {

    const handleFuncion  =  () =>{
     
        propOnPress()
    }
    return (
        
        <Pressable style={styles.button} onPress={handleFuncion}>

            <Text style={{ fontSize: 20, color: '#E3E3E3', textAlign: 'center', margin: 20, fontFamily: 'LeagueSpartan-SemiBold'}}>{children}</Text>

        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#0CABA8',
        borderRadius: 50,
        margin: 10
    },
});
