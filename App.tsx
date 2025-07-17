/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ChatScreen } from './src/screens/ChatScreen';
import GraphScreen from './src/screens/GraphScreen';
import { enableScreens } from 'react-native-screens';

enableScreens();

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Tab.Navigator
        screenOptions={() => ({
          headerShown: false,
          tabBarStyle: { backgroundColor: '#121212' },
          tabBarActiveTintColor: '#1976d2',
          tabBarInactiveTintColor: '#aaa',
        })}
      >
        <Tab.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            tabBarLabel: 'Chat',
          }}
        />
        <Tab.Screen
          name="Gráficos"
          component={GraphScreen}
          options={{
            tabBarLabel: 'Graphs',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}