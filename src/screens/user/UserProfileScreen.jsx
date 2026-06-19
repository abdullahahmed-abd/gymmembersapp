import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

import Header from '../../components/shared/Header';
import GlassCard from '../../components/shared/GlassCard';
import GlassButton from '../../components/shared/GlassButton';
import BottomNav from '../../components/shared/BottomNav';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const s = (size) => scale(size);
const ms = (size) => moderateScale(size, 0.25);
const vs = (size) => verticalScale(size);
const rf = (size) => RFValue(size);

const UserProfileScreen = ({ navigation }) => {
  const user = {
    name: 'MARCUS T.',
    memberId: 'ATH-84920',
    membership: 'ELITE TIER',
    joinedDate: '14 Nov 2025',
    billingCycle: 'Monthly',
    attendance: '22 / 26 Days',
    attendancePct: 85,
    streak: '8 Days',
    status: 'Active',
  };

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  const profileItems = [
    {
      icon: 'shield',
      label: 'Membership',
      value: user.membership,
      color: Colors.gold,
    },
    {
      icon: 'clock',
      label: 'Joined Date',
      value: user.joinedDate,
      color: Colors.zinc[300],
    },
    {
      icon: 'credit-card',
      label: 'Billing Cycle',
      value: user.billingCycle,
      color: Colors.zinc[300],
    },
    {
      icon: 'calendar',
      label: 'Attendance',
      value: user.attendance,
      color: Colors.green,
    },
  ];

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48' }}
      style={styles.background}
      blurRadius={16}>
      <LinearGradient
        colors={['rgba(0,0,0,0.70)', 'rgba(0,0,0,0.90)', '#000000']}
        style={styles.gradient}>
        <Header title="PROFILE" />

        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          
          {/* HERO PROFILE CARD */}
          <GlassCard style={styles.heroCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarWrap}>
                <LinearGradient
                  colors={['rgba(197,160,89,0.22)', 'rgba(197,160,89,0.08)']}
                  style={styles.avatarGlow}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarInitials}>{initials}</Text>
                  </View>
                </LinearGradient>

                <View style={styles.statusIndicator}>
                  <View style={styles.statusDot} />
                </View>
              </View>

              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileId}>ID: {user.memberId}</Text>

              <View style={styles.statusPill}>
                <View style={styles.statusPillDot} />
                <Text style={styles.statusPillText}>{user.status}</Text>
              </View>
            </View>

            <View style={styles.quickStatsRow}>
              <View style={styles.quickStatBox}>
                <Text style={[styles.quickStatValue, { color: Colors.gold }]}>Elite</Text>
                <Text style={styles.quickStatLabel}>Tier</Text>
              </View>

              <View style={styles.quickDivider} />

              <View style={styles.quickStatBox}>
                <Text style={[styles.quickStatValue, { color: Colors.green }]}>
                  {user.attendancePct}%
                </Text>
                <Text style={styles.quickStatLabel}>Attendance</Text>
              </View>

              <View style={styles.quickDivider} />

              <View style={styles.quickStatBox}>
                <Text style={[styles.quickStatValue, { color: Colors.zinc[200] }]}>
                  {user.streak}
                </Text>
                <Text style={styles.quickStatLabel}>Streak</Text>
              </View>
            </View>
          </GlassCard>

          {/* ATTENDANCE CARD */}
       <TouchableOpacity
  activeOpacity={0.85}
  onPress={() => navigation.navigate('MemberAttendance')}
  style={styles.attendanceCardTouchable}
>
  <GlassCard style={styles.attendanceCard}>
    <View style={styles.attendanceHeader}>
      <View style={styles.attendanceTitleRow}>
        <Icon name="calendar" size={18} color={Colors.green} />
        <Text style={styles.attendanceTitle}>ATTENDANCE</Text>
      </View>

      <View style={styles.attendanceRight}>
        <Text style={styles.attendancePercent}>{user.attendancePct}%</Text>
        <Icon name="chevron-right" size={16} color={Colors.zinc[500]} />
      </View>
    </View>

    <View style={styles.attendanceBar}>
      <LinearGradient
        colors={[Colors.green, '#22c55eaa']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.attendanceFill, { width: `${user.attendancePct}%` }]}
      />
    </View>

    <View style={styles.attendanceFooter}>
      <Text style={styles.attendanceFooterText}>Present this month</Text>
      <Text style={styles.attendanceFooterValue}>{user.attendance}</Text>
    </View>

    <View style={styles.attendanceTapRow}>
      <Text style={styles.attendanceTapText}>Tap to view weekly, monthly & yearly log</Text>
      <Icon name="arrow-right" size={12} color={Colors.zinc[600]} />
    </View>
  </GlassCard>
</TouchableOpacity>

          {/* INFO SECTION */}
          <View style={styles.infoSection}>
            {profileItems.map((item, index) => (
              <GlassCard key={index} style={styles.infoCard}>
                <View style={styles.infoLeft}>
                  <View style={styles.infoIconWrap}>
                    <Icon name={item.icon} size={18} color={item.color} />
                  </View>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                </View>

                <Text style={[styles.infoValue, { color: item.color }]}>
                  {item.value}
                </Text>
              </GlassCard>
            ))}
          </View>

          {/* SIGN OUT */}
          <GlassButton
            variant="outline"
            style={styles.signOutButton}
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
              })
            }>
            <View style={styles.signOutContent}>
              <Icon name="log-out" size={16} color="#ef4444" />
              <Text style={styles.signOutText}>Sign Out</Text>
            </View>
          </GlassButton>
        </ScrollView>

        <BottomNav
          activeTab="profile"
          onTabChange={(tab) => {
            if (tab === 'home') navigation.navigate('UserDashboard');
            if (tab === 'profile') {}
            if (tab === 'membership') {
              navigation.navigate('UserDashboard', { openPlans: true });
            }
            if (tab === 'friends') navigation.navigate('MembersFriend');
          }}
        />
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: s(24),
    paddingTop: vs(22),
    paddingBottom: vs(120),
    gap: vs(14),
  },

  heroCard: {
    padding: ms(18),
    borderRadius: ms(18),
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: vs(16),
  },
  avatarGlow: {
    width: ms(108),
    height: ms(108),
    borderRadius: ms(54),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(197,160,89,0.25)',
  },
  avatar: {
    width: ms(90),
    height: ms(90),
    borderRadius: ms(45),
    backgroundColor: Colors.zinc[900],
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(24),
    color: Colors.gold,
    letterSpacing: s(1.5),
  },
  statusIndicator: {
    position: 'absolute',
    bottom: ms(6),
    right: ms(6),
    width: ms(18),
    height: ms(18),
    borderRadius: ms(9),
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#000',
  },
  statusDot: {
    width: ms(9),
    height: ms(9),
    borderRadius: ms(4.5),
    backgroundColor: Colors.green,
  },
  profileName: {
    fontFamily: Fonts.orbitron.extraBold,
    fontSize: rf(20),
    color: Colors.white,
    letterSpacing: s(3),
    marginBottom: vs(4),
  },
  profileId: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(8),
    color: Colors.zinc[400],
    letterSpacing: s(2),
    textTransform: 'uppercase',
    marginBottom: vs(12),
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    paddingHorizontal: s(12),
    paddingVertical: vs(5),
    borderRadius: ms(20),
    backgroundColor: 'rgba(34,197,94,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.25)',
  },
  statusPillDot: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
    backgroundColor: Colors.green,
  },
  statusPillText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(8),
    color: Colors.green,
    letterSpacing: s(1),
    textTransform: 'uppercase',
  },

  quickStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: vs(20),
    paddingTop: vs(16),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  quickStatBox: {
    flex: 1,
    alignItems: 'center',
    gap: vs(3),
  },
  quickStatValue: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(13),
  },
  quickStatLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(7),
    color: Colors.zinc[500],
    letterSpacing: s(1.5),
    textTransform: 'uppercase',
  },
  quickDivider: {
    width: 1,
    height: vs(30),
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
attendanceCardTouchable: {
  borderRadius: ms(18),
},

attendanceCard: {
  padding: ms(16),
  borderRadius: ms(18),
},

attendanceHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: vs(12),
},

attendanceTitleRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: s(8),
},

attendanceTitle: {
  fontFamily: Fonts.rajdhani.semiBold,
  fontSize: rf(8),
  color: Colors.white,
  letterSpacing: s(2),
  textTransform: 'uppercase',
},

attendanceRight: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: s(6),
},

attendancePercent: {
  fontFamily: Fonts.orbitron.bold,
  fontSize: rf(14),
  color: Colors.green,
},

attendanceBar: {
  height: vs(8),
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderRadius: ms(10),
  overflow: 'hidden',
  marginBottom: vs(10),
},

attendanceFill: {
  height: '100%',
  borderRadius: ms(10),
},

attendanceFooter: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

attendanceFooterText: {
  fontFamily: Fonts.rajdhani.regular,
  fontSize: rf(8),
  color: Colors.zinc[500],
  letterSpacing: s(0.8),
},

attendanceFooterValue: {
  fontFamily: Fonts.orbitron.semiBold,
  fontSize: rf(10),
  color: Colors.white,
},

attendanceTapRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: s(6),
  marginTop: vs(10),
  paddingTop: vs(10),
  borderTopWidth: 1,
  borderTopColor: 'rgba(255,255,255,0.05)',
},

attendanceTapText: {
  fontFamily: Fonts.rajdhani.regular,
  fontSize: rf(7.5),
  color: Colors.zinc[600],
  letterSpacing: s(0.4),
},
  infoSection: {
    gap: vs(12),
  },
  infoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: ms(16),
    borderRadius: ms(14),
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
    flex: 1,
  },
  infoIconWrap: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(10),
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(10),
    color: Colors.white,
    letterSpacing: s(1.5),
    textTransform: 'uppercase',
  },
  infoValue: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: rf(9),
    textAlign: 'right',
    marginLeft: s(10),
  },

  signOutButton: {
    borderColor: 'rgba(239, 68, 68, 0.25)',
    marginTop: vs(8),
  },
  signOutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(8),
  },
  signOutText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(10),
    color: '#ef4444',
    letterSpacing: s(1.5),
    textTransform: 'uppercase',
  },
});

export default UserProfileScreen;