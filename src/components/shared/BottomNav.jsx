// src/components/shared/BottomNav.js
import React, { useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Home01Icon,
  CreditCardIcon,
  User02Icon,
  UserMultipleIcon,
  SettingsIcon,
  Calendar03Icon,
} from '@hugeicons/core-free-icons';

import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const ACCENT = '#C5A059';
const BLACK = '#000000';
const SOFT_BLACK = '#0A0A0A';

const BottomNav = ({ activeTab, onTabChange, userType }) => {
  const route = useRoute();

  const detectedType = useMemo(() => {
    if (userType) return userType;
    if (route.name?.startsWith('Admin')) return 'admin';
    if (route.name?.startsWith('Trainer')) return 'trainer';
    return 'member';
  }, [route.name, userType]);

  const adminTabs = useMemo(
    () => [
      { id: 'dashboard', icon: Home01Icon,       label: 'Home' },
      { id: 'plans',     icon: CreditCardIcon,   label: 'Plans' },
      { id: 'members',   icon: UserMultipleIcon, label: 'Members' },
      { id: 'settings',  icon: SettingsIcon,     label: 'Settings' },
    ],
    []
  );

  const memberTabs = useMemo(
    () => [
      { id: 'home',       icon: Home01Icon,       label: 'Home' },
      { id: 'membership', icon: CreditCardIcon,   label: 'Plans' },
      { id: 'friends',    icon: UserMultipleIcon, label: 'Friends' },
      { id: 'profile',    icon: User02Icon,       label: 'Profile' },
    ],
    []
  );

  const trainerTabs = useMemo(
    () => [
      { id: 'home',       icon: Home01Icon,       label: 'Home' },
      { id: 'attendance', icon: Calendar03Icon,   label: 'Attendance' },
      { id: 'friends',    icon: UserMultipleIcon, label: 'Members' },
      { id: 'profile',    icon: User02Icon,       label: 'Profile' },
    ],
    []
  );

  const tabs =
    detectedType === 'admin'
      ? adminTabs
      : detectedType === 'trainer'
      ? trainerTabs
      : memberTabs;

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topAccent} />

        <View style={styles.inner}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <TouchableOpacity
                key={tab.id}
                style={styles.tab}
                onPress={() => onTabChange(tab.id)}
                activeOpacity={0.85}
              >
                <View style={[styles.tabInner, isActive && styles.tabInnerActive]}>
                  {isActive && <View style={styles.activeIndicator} />}

                  <View
                    style={[
                      styles.iconContainer,
                      isActive && styles.iconContainerActive,
                    ]}
                  >
                    <HugeiconsIcon
                      icon={tab.icon}
                      size={moderateScale(15)}
                      color={isActive ? ACCENT : Colors.zinc[500]}
                      strokeWidth={isActive ? 2.3 : 2}
                    />
                    {isActive && <View style={styles.iconGlow} />}
                  </View>

                  <Text
                    style={[
                      styles.label,
                      isActive && styles.labelActive,
                    ]}
                    numberOfLines={1}
                  >
                    {tab.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: BLACK,
  },

  container: {
    backgroundColor: BLACK,
    paddingHorizontal: scale(10),
    paddingTop: verticalScale(2),
    paddingBottom: verticalScale(2),
    borderTopLeftRadius: moderateScale(22),
    borderTopRightRadius: moderateScale(22),
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 16,
    overflow: 'hidden',
  },

  topAccent: {
    position: 'absolute',
    top: 0,
    left: scale(30),
    right: scale(30),
    height: scale(1.5),
    borderRadius: scale(2),
    backgroundColor: 'rgba(197,160,89,0.35)',
  },

  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: verticalScale(2),
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabInner: {
    width: '100%',
    maxWidth: scale(78),
    minHeight: verticalScale(48),
    borderRadius: moderateScale(14),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(5),
    paddingHorizontal: scale(4),
    position: 'relative',
  },

  tabInnerActive: {
    backgroundColor: SOFT_BLACK,
    borderWidth: 1,
    borderColor: 'rgba(197,160,89,0.18)',
  },

  activeIndicator: {
    position: 'absolute',
    top: verticalScale(2),
    width: scale(18),
    height: scale(2.5),
    borderRadius: scale(2),
    backgroundColor: ACCENT,
  },

  iconContainer: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(15),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    position: 'relative',
  },

  iconContainerActive: {
    backgroundColor: '#15120C',
    borderColor: 'rgba(197,160,89,0.30)',
  },

  iconGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(15),
    backgroundColor: 'rgba(197,160,89,0.06)',
  },

  label: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: RFValue(6.1),
    textTransform: 'uppercase',
    letterSpacing: scale(0.7),
    color: Colors.zinc[500],
    textAlign: 'center',
    marginTop: verticalScale(4),
  },

  labelActive: {
    color: ACCENT,
    fontFamily: Fonts.rajdhani.bold,
    letterSpacing: scale(0.8),
  },
});

export default BottomNav;