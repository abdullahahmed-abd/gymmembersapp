// src/screens/user/FriendStatsScreen.js
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  Activity01Icon,
  Fire02Icon,
  Notification03Icon,
} from '@hugeicons/core-free-icons';

import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import { Avatar, StreakBadge } from './MembersFriendScreen';

const s  = (size) => scale(size);
const ms = (size) => moderateScale(size, 0.25);
const vs = (size) => verticalScale(size);
const rf = (size) => RFValue(size);

const GOLD = '#C5A059';

/* ─────────────────────────────────────────────────────────────── */
/* STAT CARD                                                       */
/* ─────────────────────────────────────────────────────────────── */
const StatCard = ({ icon, color, value, label }) => (
  <View style={[st.statCard, { borderColor: `${color}20` }]}>
    <HugeiconsIcon icon={icon} size={ms(20)} color={color} />
    <Text style={[st.statCardNum, { color }]}>{value}</Text>
    <Text style={st.statCardLabel}>{label}</Text>
  </View>
);

/* ═══════════════════════════════════════════════════════════════ */
/* SCREEN                                                         */
/* ═══════════════════════════════════════════════════════════════ */
const FriendStatsScreen = ({ route, navigation }) => {
  const { friend } = route.params;

  const avgPerWeek =
    friend.togetherCheckins > 0
      ? (friend.togetherCheckins / 4).toFixed(1)
      : '0';

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
      }}
      style={{ flex: 1 }}
      blurRadius={10}>
      <LinearGradient
        colors={['rgba(0,0,0,0.82)', 'rgba(0,0,0,0.94)', '#000000']}
        style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>

          {/* ── HEADER ── */}
          <View style={st.header}>
            <TouchableOpacity
              style={st.backBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}>
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                size={ms(18)}
                color={Colors.white}
              />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={st.headerLabel}>GYM TOGETHER</Text>
              <Text style={st.headerTitle}>
                {friend.nickname || friend.name}
              </Text>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={st.scroll}>

            {/* ── PROFILE ROW ── */}
            <View style={st.profileCard}>
              <View style={st.profileRow}>
                <Avatar
                  name={friend.nickname || friend.name}
                  size={60}
                  color={friend.isCurrentlyInGym ? '#22c55e' : GOLD}
                  isOnline={friend.isCurrentlyInGym}
                />
                <View style={{ flex: 1 }}>
                  <Text style={st.profileName}>
                    {friend.nickname || friend.name}
                  </Text>
                  {friend.nickname ? (
                    <Text style={st.profileReal}>{friend.name}</Text>
                  ) : null}
                  <Text style={st.profileId}>{friend.memberId}</Text>
                  <View style={st.profileStatusRow}>
                    <View
                      style={[
                        st.statusDot,
                        {
                          backgroundColor: friend.isCurrentlyInGym
                            ? '#22c55e'
                            : Colors.zinc[600],
                        },
                      ]}
                    />
                    <Text
                      style={[
                        st.statusText,
                        {
                          color: friend.isCurrentlyInGym
                            ? '#22c55e'
                            : Colors.zinc[500],
                        },
                      ]}>
                      {friend.isCurrentlyInGym ? 'In Gym Now' : 'Not in Gym'}
                    </Text>
                  </View>
                </View>
                <StreakBadge streak={friend.currentStreak} />
              </View>
            </View>

            {/* ── STAT GRID ── */}
            <View style={st.statGrid}>
              <StatCard
                icon={CheckmarkCircle02Icon}
                color="#22c55e"
                value={friend.togetherCheckins}
                label={'Together\nCheck-ins'}
              />
              <StatCard
                icon={Activity01Icon}
                color="#a855f7"
                value={friend.togetherCheckouts}
                label={'Together\nCheck-outs'}
              />
              <StatCard
                icon={Fire02Icon}
                color={GOLD}
                value={friend.currentStreak}
                label={'Current\nStreak'}
              />
              <StatCard
                icon={Fire02Icon}
                color="#3B82F6"
                value={friend.bestStreak}
                label={'Best\nStreak'}
              />
            </View>

            {/* ── DETAILS BOX ── */}
            <View style={st.detailsCard}>
              {[
                {
                  label: 'Avg. per week',
                  value: `${avgPerWeek} sessions`,
                },
                {
                  label: 'Friends since',
                  value: new Date(friend.addedAt).toLocaleDateString(
                    'en-US',
                    { day: 'numeric', month: 'short', year: 'numeric' },
                  ),
                },
                {
                  label: 'Last together',
                  value: friend.lastTogether
                    ? new Date(friend.lastTogether).toLocaleDateString(
                        'en-US',
                        { day: 'numeric', month: 'short', year: 'numeric' },
                      )
                    : 'Never',
                },
              ].map((item, idx) => (
                <React.Fragment key={idx}>
                  <View style={st.detailRow}>
                    <Text style={st.detailLabel}>{item.label}</Text>
                    <Text style={st.detailValue}>{item.value}</Text>
                  </View>
                  {idx < 2 && <View style={st.detailDivider} />}
                </React.Fragment>
              ))}
            </View>

            {/* ── STREAK MOTIVATION ── */}
            {friend.currentStreak > 0 && (
              <LinearGradient
                colors={[
                  'rgba(234,179,8,0.12)',
                  'rgba(234,179,8,0.04)',
                  'transparent',
                ]}
                style={st.streakBanner}>
                <HugeiconsIcon
                  icon={Fire02Icon}
                  size={ms(22)}
                  color={GOLD}
                />
                <View style={{ flex: 1, gap: vs(3) }}>
                  <Text style={st.streakBannerTitle}>
                    {friend.currentStreak} Day Streak! 🔥
                  </Text>
                  <Text style={st.streakBannerSub}>
                    {friend.currentStreak >= friend.bestStreak
                      ? "You're at your best streak!"
                      : `${friend.bestStreak - friend.currentStreak} more days to beat your best!`}
                  </Text>
                </View>
              </LinearGradient>
            )}

            {/* ── NUDGE BUTTON ── */}
            <TouchableOpacity
              style={st.nudgeBtn}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('MembersFriend', {
                  openNudge: friend.id,
                })
              }>
              <LinearGradient
                colors={['rgba(234,179,8,0.15)', 'rgba(234,179,8,0.05)']}
                style={st.nudgeBtnGrad}>
                <HugeiconsIcon
                  icon={Notification03Icon}
                  size={ms(16)}
                  color={GOLD}
                />
                <Text style={st.nudgeBtnText}>
                  Send Nudge to {friend.nickname || friend.name.split(' ')[0]}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/* STYLES                                                         */
/* ═══════════════════════════════════════════════════════════════ */
const st = StyleSheet.create({
  /* header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
    paddingHorizontal: s(20),
    paddingTop: vs(8),
    paddingBottom: vs(14),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  backBtn: {
    width: ms(38),
    height: ms(38),
    borderRadius: ms(19),
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLabel: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(7),
    color: Colors.zinc[500],
    letterSpacing: s(2),
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(13),
    color: Colors.white,
    letterSpacing: s(1.5),
  },

  scroll: {
    paddingHorizontal: s(20),
    paddingTop: vs(16),
    gap: vs(14),
    paddingBottom: vs(50),
  },

  /* profile */
  profileCard: {
    backgroundColor: '#000000',
    borderRadius: ms(14),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: s(16),
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(14),
  },
  profileName: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(13),
    color: Colors.white,
    letterSpacing: s(1),
    marginBottom: vs(2),
  },
  profileReal: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9),
    color: Colors.zinc[500],
    marginBottom: vs(2),
  },
  profileId: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(8),
    color: Colors.zinc[600],
    marginBottom: vs(6),
  },
  profileStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
  },
  statusDot: {
    width: s(6),
    height: s(6),
    borderRadius: s(3),
  },
  statusText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(8),
    letterSpacing: s(0.5),
  },

  /* stat grid */
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(10),
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    gap: vs(6),
    backgroundColor: '#000000',
    borderRadius: ms(12),
    borderWidth: 1,
    padding: s(16),
  },
  statCardNum: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(22),
    lineHeight: rf(26),
  },
  statCardLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(7.5),
    color: Colors.zinc[500],
    textAlign: 'center',
    letterSpacing: s(0.5),
  },

  /* details */
  detailsCard: {
    backgroundColor: '#000000',
    borderRadius: ms(14),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: s(14),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: vs(8),
  },
  detailLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9),
    color: Colors.zinc[500],
  },
  detailValue: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(9),
    color: Colors.white,
  },
  detailDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  /* streak banner */
  streakBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
    padding: s(16),
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: 'rgba(234,179,8,0.18)',
  },
  streakBannerTitle: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: rf(11),
    color: GOLD,
    letterSpacing: s(1),
  },
  streakBannerSub: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(8.5),
    color: Colors.zinc[400],
  },

  /* nudge button */
  nudgeBtn: {
    borderRadius: ms(12),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(234,179,8,0.25)',
  },
  nudgeBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(10),
    paddingVertical: vs(16),
  },
  nudgeBtnText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(10),
    color: GOLD,
    letterSpacing: s(1),
  },
});

export default FriendStatsScreen;