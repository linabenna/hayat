/**
 * HAYAT App
 * Main App Component
 */

import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar, StyleSheet} from 'react-native';
import {AuthScreen} from './src/screens/AuthScreen';
import {HomeScreen} from './src/screens/HomeScreen';
import {useAppStore} from './src/store/useAppStore';
import {FamilyGuardianAgent} from './src/agents/FamilyGuardianAgent';
import {ResidencyIdentityAgent} from './src/agents/ResidencyIdentityAgent';
import {ComplianceSentinelAgent} from './src/agents/ComplianceSentinelAgent';
import {WellBeingAgent} from './src/agents/WellBeingAgent';
import {lyraOrchestrator} from './src/services/lyra';

const Stack = createStackNavigator();

const App: React.FC = () => {
  const isAuthenticated = useAppStore(state => state.isAuthenticated);

  useEffect(() => {
    // Register all agents with orchestrator
    const familyGuardian = new FamilyGuardianAgent();
    const residencyIdentity = new ResidencyIdentityAgent();
    const complianceSentinel = new ComplianceSentinelAgent();
    const wellBeing = new WellBeingAgent();

    // Set up dependencies
    residencyIdentity.setFamilyGuardian(familyGuardian);
    wellBeing.setFamilyGuardian(familyGuardian);

    // Register agents
    lyraOrchestrator.registerAgent(familyGuardian);
    lyraOrchestrator.registerAgent(residencyIdentity);
    lyraOrchestrator.registerAgent(complianceSentinel);
    lyraOrchestrator.registerAgent(wellBeing);
  }, []);

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <Stack.Screen name="Home" component={HomeScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
