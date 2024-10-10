import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Appearance } from 'react-native';

export default function SttsBar() {
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  // Listener para mudanças no tema do dispositivo
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme);
    });

    // Cleanup do listener quando o componente desmontar
    return () => subscription.remove();
  }, []);

  return (
    <StatusBar style={theme === 'dark' ? 'light' : 'dark'}
    hidden={true} />
  );
}
