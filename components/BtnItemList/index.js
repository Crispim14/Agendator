import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

export default function BtnItemList({ children,propOnPress, bgColor="#0CABA8"}) {

    const handleFuncion  =  () =>{
        propOnPress()
    }

    const dynamicStyles = {
        serviceItem: {
            padding: 16,
            marginVertical: 8,
            borderRadius: 8,
            backgroundColor: '#2A3C4D',
        }
      };

    return (
        <Pressable style={dynamicStyles.serviceItem} onPress={handleFuncion}>

            <Text style={{ fontSize: 15, color: '#E3E3E3', textAlign: 'left', margin: 2, fontFamily: 'LeagueSpartan-SemiBold'}}>{children}</Text>

        </Pressable>
    );
}

