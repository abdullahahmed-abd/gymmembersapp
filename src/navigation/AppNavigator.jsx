// src/navigation/AppNavigator.js (Member App)

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// ═══════════════════════════════════════════════
// AUTH SCREENS
// ═══════════════════════════════════════════════
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginStep1Screen from '../screens/auth/LoginStep1Screen';
import LoginOTPScreen from '../screens/auth/LoginOTPScreen';
import LoginPasswordScreen from '../screens/auth/LoginPasswordScreen';
// ═══════════════════════════════════════════════
// MEMBER SCREENS
// ═══════════════════════════════════════════════
import UserDashboardScreen from '../screens/user/UserDashboardScreen';
import UserProfileScreen from '../screens/user/UserProfileScreen';
import MembersFriendScreen from '../screens/user/MembersFriendScreen';
import SentRequestsScreen from '../screens/user/SentRequestsScreen';
import ReceivedRequestsScreen from '../screens/user/ReceivedRequestsScreen';
import TrainerDashboardScreen from '../screens/trainerdashboard/TrainerDashboardScreen';
import TrainerAttendanceLogScreen from '../screens/trainerdashboard/TrainersAttendenceLog';
import FriendStatsScreen from '../screens/user/FriendStatsScreen';
import MemberAttendanceScreen from '../screens/user/MemberAttendanceScreen';
// NOTE: MembersProfileScreen pehle admin folder me tha
// Member app me move karo: screens/user/MembersProfileScreen
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#000000' },
          cardStyleInterpolator: ({ current: { progress } }) => ({
            cardStyle: {
              opacity: progress,
            },
          }),
        }}
      >
        {/* ══════════════════════════════════════ */}
        {/* AUTH FLOW                              */}
        {/* ══════════════════════════════════════ */}
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
        />
        <Stack.Screen
          name="LoginStep1"
          component={LoginStep1Screen}
        />
        <Stack.Screen
          name="LoginOTP"
          component={LoginOTPScreen}
        />
        <Stack.Screen
          name="LoginPassword"
          component={LoginPasswordScreen}
        />

        {/* ══════════════════════════════════════ */}
        {/* MEMBER FLOW                            */}
        {/* ══════════════════════════════════════ */}
        <Stack.Screen
          name="UserDashboard"
          component={UserDashboardScreen}
        />
        <Stack.Screen
          name="UserProfile"
          component={UserProfileScreen}
        />
        <Stack.Screen
          name="MembersFriend"
          component={MembersFriendScreen}
        />
        
        <Stack.Screen
          name="ReceivedRequests"
          component={ReceivedRequestsScreen}
        />
           <Stack.Screen
          name="TrainerAttendanceLog"
          component={TrainerAttendanceLogScreen}
        />
 <Stack.Screen
          name="SentRequests"
          component={SentRequestsScreen}
        />

       <Stack.Screen
  name="TrainerDashboard"
  component={TrainerDashboardScreen}
/>
  <Stack.Screen
  name="FriendStats"
  component={FriendStatsScreen}
/>
<Stack.Screen name="MemberAttendance" component={MemberAttendanceScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;