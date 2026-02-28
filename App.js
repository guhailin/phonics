import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider } from './src/contexts/AppContext';
import { LEVEL_COLORS } from './src/constants';

import HomeScreen from './src/screens/HomeScreen';
import LevelScreen from './src/screens/LevelScreen';
import UnitScreen from './src/screens/UnitScreen';
import ReviewScreen from './src/screens/ReviewScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => {
              // Get color from route params or use default
              let headerColor = '#9C27B0'; // Default purple for Home

              if (route.params?.color) {
                headerColor = route.params.color;
              } else if (route.params?.levelId) {
                headerColor = LEVEL_COLORS[route.params.levelId] || headerColor;
              }

              return {
                headerStyle: {
                  backgroundColor: headerColor,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              };
            }}
          >
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'Phonics World' }}
            />
            <Stack.Screen
              name="Level"
              component={LevelScreen}
              options={({ route }) => ({ title: route.params?.levelTitle || 'Level' })}
            />
            <Stack.Screen
              name="Unit"
              component={UnitScreen}
              options={({ route }) => ({ title: route.params?.unitName || 'Unit' })}
            />
            <Stack.Screen
              name="Review"
              component={ReviewScreen}
              options={{ title: 'Review Mode' }}
            />
            <Stack.Screen
              name="Explore"
              component={ExploreScreen}
              options={{ title: 'Explore Words' }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ title: 'Settings' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
};

export default App;
