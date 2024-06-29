import React from 'react';
import { View, Text } from 'react-native';
import { Provider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { MenuProvider } from 'react-native-popup-menu';

import Splash from './Components/Splash';
import Signup from './Components/Signup';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Provider>
    <Stack.Navigator screenOptions={{headerShown: false}}> 
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
    </Provider>
  );
}

export default function App() {
  return (
    
    <MenuProvider>
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
    </MenuProvider>

  
  );
}


