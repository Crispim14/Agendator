import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

export default function BtnPadraoMenor({ children,propOnPress, bgColor="#0CABA8"}) {

    const handleFuncion  =  () =>{
        propOnPress()
    }

    const dynamicStyles = {
        backgroundColor: bgColor,
        borderRadius: 50,
        marginHorizontal: 50,
        marginVertical: 5, 
      };

    return (
        <Pressable style={dynamicStyles} onPress={handleFuncion}>

            <Text style={{ fontSize: 15, color: '#E3E3E3', textAlign: 'center', margin: 10, fontFamily: 'LeagueSpartan-SemiBold'}}>{children}</Text>

        </Pressable>
    );
}

