import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';

import { AppProvider } from './src/contexts/AppContext';
import { LEVEL_COLORS } from './src/constants';

import HomeScreen from './src/screens/HomeScreen';
import LevelScreen from './src/screens/LevelScreen';
import UnitScreen from './src/screens/UnitScreen';
import ReviewScreen from './src/screens/ReviewScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import FontTestScreen from './src/screens/FontTestScreen';

const Stack = createStackNavigator();

// Loading screen while fonts load
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#9C27B0' }}>
    <ActivityIndicator size="large" color="#fff" />
    <Text style={{ marginTop: 16, color: '#fff', fontSize: 16 }}>Loading Fonts...</Text>
  </View>
);

const App = () => {
  // Load custom font
  const [fontsLoaded] = useFonts({
    'SassoonPrimary': require('./assets/fonts/SassoonPrimary.otf'),
  });

  // Show loading screen while fonts are loading
  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

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
                  fontFamily: 'SassoonPrimary',
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
            <Stack.Screen
              name="FontTest"
              component={FontTestScreen}
              options={{ title: 'Font Test' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
};

export default App;
