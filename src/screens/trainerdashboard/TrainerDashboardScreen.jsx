// src/screens/trainer/TrainerDashboardScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  CheckmarkCircle02Icon,
  LogoutSquare01Icon,
  Activity01Icon,
  Clock01Icon,
  Dumbbell01Icon,
  Login01Icon,
  Logout01Icon,
  Calendar03Icon,
  ArrowRight01Icon,
  AlertCircleIcon,
  Notification01Icon,
} from '@hugeicons/core-free-icons';

import BottomNav from '../../components/shared/BottomNav';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import gymlogoimg from '../user/gymlogoimg.png';
import { useTrainer } from '../../context/TrainerContext';

const s  = (size) => scale(size);
const ms = (size) => moderateScale(size, 0.25);
const vs = (size) => verticalScale(size);
const rf = (size) => RFValue(size);

const TRAINER_COLOR = '#22D3EE';
const GOLD          = '#C5A059';
const GREEN         = '#22C55E';

/* ─────────────────────────────────────────────────────────────── */
/* DUMMY DATA                                                      */
/* ─────────────────────────────────────────────────────────────── */
const TODAY_DATA = {
  status:       'present',
  checkinTime:  '6:15 AM',
  checkoutTime: null,
  duration:     '2h 30m',
  isOngoing:    true,
};

const ATTENDANCE_STATS = {
  weekPresent:  5,
  weekAbsent:   1,
  weekTotal:    6,
  monthPresent: 22,
  monthAbsent:  4,
  monthTotal:   26,
};

/* ═══════════════════════════════════════════════════════════════ */
/* DASHBOARD HEADER — same as UserDashboard                       */
/* ═══════════════════════════════════════════════════════════════ */
const DashboardHeader = ({ navigation, userName }) => {
  const initials = userName
    ? userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'T';

  return (
    <View style={headerSt.wrapper}>
      <View style={headerSt.bottomBorder} />
      <View style={headerSt.inner}>
        {/* Left — logo + gym name */}
        <View style={headerSt.left}>
          <View style={headerSt.logoBox}>
            <Image
              source={gymlogoimg}
              style={headerSt.logoImg}
              resizeMode="contain"
            />
          </View>
          <View style={headerSt.gymTextWrap}>
            <Text style={headerSt.gymName}>GYMVERSE</Text>
            <View style={headerSt.gymSubRow}>
              <View style={headerSt.gymSubDot} />
              <Text style={headerSt.gymSub}>FITNESS CENTER</Text>
              <View style={headerSt.gymSubDot} />
            </View>
          </View>
        </View>

        {/* Right — notification + avatar */}
        <View style={headerSt.right}>
          <TouchableOpacity
            style={headerSt.iconBtn}
            activeOpacity={0.7}
            onPress={() => {}}>
            <HugeiconsIcon
              icon={Notification01Icon}
              size={ms(17)}
              color={Colors.zinc[300]}
            />
            <View style={headerSt.notifDot} />
          </TouchableOpacity>

          <TouchableOpacity
            style={headerSt.avatarBtn}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('UserProfile')}>
            <LinearGradient
              colors={[`${TRAINER_COLOR}50`, `${TRAINER_COLOR}18`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={headerSt.avatarGrad}>
              <Text style={headerSt.avatarText}>{initials}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const LOGO_SIZE = ms(46);

const headerSt = StyleSheet.create({
  wrapper: {
    paddingHorizontal: s(18),
    paddingTop: vs(8),
    paddingBottom: vs(12),
    position: 'relative',
  },
  bottomBorder: {
    position: 'absolute',
    bottom: 0,
    left: s(18),
    right: s(18),
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left:    { flexDirection: 'row', alignItems: 'center', gap: s(12) },
  logoBox: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: ms(13),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  logoImg: { width: '310%', height: '170%', top: vs(2) },
  gymTextWrap: { gap: vs(1) },
  gymName: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(13.5),
    color: Colors.white,
    letterSpacing: s(3.5),
    lineHeight: rf(18),
  },
  gymSubRow: { flexDirection: 'row', alignItems: 'center', gap: s(5) },
  gymSubDot: {
    width: s(3),
    height: s(3),
    borderRadius: s(2),
    backgroundColor: `${GOLD}70`,
  },
  gymSub: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(7),
    color: `${GOLD}90`,
    letterSpacing: s(2.2),
    textTransform: 'uppercase',
  },
  right: { flexDirection: 'row', alignItems: 'center', gap: s(10) },
  iconBtn: {
    width: ms(38),
    height: ms(38),
    borderRadius: ms(19),
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: vs(7),
    right: s(8),
    width: s(7),
    height: s(7),
    borderRadius: s(4),
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#000',
  },
  avatarBtn: {
    width: ms(38),
    height: ms(38),
    borderRadius: ms(19),
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: `${TRAINER_COLOR}55`,
  },
  avatarGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatarText: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(10),
    color: TRAINER_COLOR,
    letterSpacing: s(0.8),
  },
});

/* ═══════════════════════════════════════════════════════════════ */
/* MAIN SCREEN                                                     */
/* ═══════════════════════════════════════════════════════════════ */
const TrainerDashboardScreen = ({ navigation }) => {
  const { getTrainer } = useTrainer();

  const currentUser = {
    id:   'user_001',
    name: 'Abdullah Ahmed',
  };

  const trainerData = getTrainer(currentUser.id);

  const daysAsTrainer = trainerData?.assignedAt
    ? Math.floor(
        (Date.now() - new Date(trainerData.assignedAt).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : 0;

  const isToday   = TODAY_DATA.status === 'present';
  const isOngoing = TODAY_DATA.isOngoing;

  const weekRate = Math.round(
    (ATTENDANCE_STATS.weekPresent / ATTENDANCE_STATS.weekTotal) * 100,
  );
  const monthRate = Math.round(
    (ATTENDANCE_STATS.monthPresent / ATTENDANCE_STATS.monthTotal) * 100,
  );

  const membersInside = 42;
  const capacity      = 100;
  const occupancyPct  = (membersInside / capacity) * 100;

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
      }}
      style={{ flex: 1 }}
      blurRadius={9}>
      <LinearGradient
        colors={['rgba(0,0,0,0.82)', 'rgba(0,0,0,0.94)', '#000000']}
        style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>

          {/* ── HEADER ── */}
          <DashboardHeader
            navigation={navigation}
            userName={currentUser.name}
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={st.scroll}>

            {/* ══════════════════════════════════════════════════ */}
            {/* WELCOME                                           */}
            {/* ══════════════════════════════════════════════════ */}
            <View>
              <Text style={st.welcomeLabel}>Welcome back</Text>
              <Text style={st.welcomeName}>{currentUser.name}</Text>
              <View style={st.trainerPill}>
                <HugeiconsIcon
                  icon={Dumbbell01Icon}
                  size={ms(9)}
                  color={TRAINER_COLOR}
                />
                <Text style={st.trainerPillText}>GYM TRAINER</Text>
              </View>
            </View>

            {/* ══════════════════════════════════════════════════ */}
            {/* HERO TRAINER CARD                                 */}
            {/* ══════════════════════════════════════════════════ */}
            <View style={st.heroCard}>
              {/* watermark icon */}
              <View style={st.heroBgIcon}>
                <HugeiconsIcon
                  icon={Dumbbell01Icon}
                  size={ms(100)}
                  color={`${TRAINER_COLOR}08`}
                  strokeWidth={0.5}
                />
              </View>
              {/* gym logo watermark */}
              <View style={st.heroLogoWrap}>
                <Image source={gymlogoimg} style={st.heroLogoImg} />
              </View>
              <LinearGradient
                colors={[`${TRAINER_COLOR}10`, `${TRAINER_COLOR}04`, 'transparent']}
                style={StyleSheet.absoluteFill}
              />

              <View style={st.heroContent}>
                {/* top row */}
                <View style={st.heroTopRow}>
                  <View style={{ flex: 1 }}>
                    {/* active pill */}
                    <View style={st.activePill}>
                      <View style={st.activeDot} />
                      <Text style={st.activePillText}>ACTIVE ROLE</Text>
                    </View>
                    <Text style={st.heroTitle}>GYM{'\n'}TRAINER</Text>
                    <View style={st.heroPTBadge}>
                      <HugeiconsIcon
                        icon={Dumbbell01Icon}
                        size={ms(9)}
                        color={TRAINER_COLOR}
                      />
                      <Text style={st.heroPTText}>PERSONAL TRAINER</Text>
                    </View>
                  </View>

                  {/* days circle */}
                  <View style={st.heroDaysCircle}>
                    <Text style={st.heroDaysNum}>{daysAsTrainer}</Text>
                    <Text style={st.heroDaysLbl}>Days{'\n'}Active</Text>
                  </View>
                </View>

                <View style={st.heroDivider} />

                {/* footer */}
                <View style={st.heroFooter}>
                  <Text style={st.heroFooterDate}>
                    Joined{' '}
                    {trainerData?.assignedAt
                      ? new Date(trainerData.assignedAt).toLocaleDateString(
                          'en-US',
                          { day: 'numeric', month: 'short', year: 'numeric' },
                        )
                      : 'Today'}
                  </Text>

                  {isOngoing ? (
                    <View style={st.inGymChip}>
                      <View style={st.inGymDot} />
                      <Text style={st.inGymText}>IN GYM</Text>
                    </View>
                  ) : isToday ? (
                    <View style={st.presentChip}>
                      <View style={[st.inGymDot, { backgroundColor: TRAINER_COLOR }]} />
                      <Text style={[st.inGymText, { color: TRAINER_COLOR }]}>
                        ACTIVE
                      </Text>
                    </View>
                  ) : (
                    <View style={st.absentChip}>
                      <Text style={st.absentChipText}>ABSENT</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* ══════════════════════════════════════════════════ */}
            {/* TODAY'S ATTENDANCE                                */}
            {/* ══════════════════════════════════════════════════ */}
            <View
              style={[
                st.card,
                {
                  borderColor: isToday
                    ? `${TRAINER_COLOR}20`
                    : 'rgba(239,68,68,0.15)',
                },
              ]}>
              <View style={st.cardPad}>
                {/* header row */}
                <View style={st.cardHeaderRow}>
                  <View style={st.cardHeaderLeft}>
                    <HugeiconsIcon
                      icon={Calendar03Icon}
                      size={ms(13)}
                      color={isToday ? TRAINER_COLOR : '#EF4444'}
                    />
                    <Text style={st.cardHeaderTitle}>TODAY</Text>
                  </View>
                  <View
                    style={[
                      st.statusBadge,
                      {
                        backgroundColor: isToday
                          ? 'rgba(34,197,94,0.08)'
                          : 'rgba(239,68,68,0.08)',
                        borderColor: isToday
                          ? 'rgba(34,197,94,0.20)'
                          : 'rgba(239,68,68,0.20)',
                      },
                    ]}>
                    <Text
                      style={[
                        st.statusBadgeText,
                        { color: isToday ? GREEN : '#EF4444' },
                      ]}>
                      {isToday ? 'PRESENT' : 'ABSENT'}
                    </Text>
                  </View>
                </View>

                {isToday ? (
                  <View style={st.todayGrid}>
                    {/* Check In */}
                    <View style={st.todayItem}>
                      <View
                        style={[
                          st.todayIconBox,
                          { backgroundColor: 'rgba(34,197,94,0.10)' },
                        ]}>
                        <HugeiconsIcon
                          icon={Login01Icon}
                          size={ms(16)}
                          color={GREEN}
                        />
                      </View>
                      <Text style={st.todayLabel}>CHECK IN</Text>
                      <Text style={st.todayValue}>
                        {TODAY_DATA.checkinTime}
                      </Text>
                    </View>

                    <View style={st.todayDivider} />

                    {/* Check Out */}
                    <View style={st.todayItem}>
                      <View
                        style={[
                          st.todayIconBox,
                          {
                            backgroundColor: isOngoing
                              ? `${TRAINER_COLOR}10`
                              : 'rgba(239,68,68,0.10)',
                          },
                        ]}>
                        <HugeiconsIcon
                          icon={Logout01Icon}
                          size={ms(16)}
                          color={isOngoing ? TRAINER_COLOR : '#EF4444'}
                        />
                      </View>
                      <Text style={st.todayLabel}>CHECK OUT</Text>
                      <Text
                        style={[
                          st.todayValue,
                          isOngoing && {
                            color: TRAINER_COLOR,
                            fontSize: rf(9),
                          },
                        ]}>
                        {isOngoing ? 'Still here' : TODAY_DATA.checkoutTime}
                      </Text>
                    </View>

                    <View style={st.todayDivider} />

                    {/* Duration */}
                    <View style={st.todayItem}>
                      <View
                        style={[
                          st.todayIconBox,
                          { backgroundColor: 'rgba(234,179,8,0.10)' },
                        ]}>
                        <HugeiconsIcon
                          icon={Clock01Icon}
                          size={ms(16)}
                          color="#EAB308"
                        />
                      </View>
                      <Text style={st.todayLabel}>DURATION</Text>
                      <Text style={st.todayValue}>{TODAY_DATA.duration}</Text>
                    </View>
                  </View>
                ) : (
                  <View style={st.absentBox}>
                    <HugeiconsIcon
                      icon={AlertCircleIcon}
                      size={ms(28)}
                      color="rgba(239,68,68,0.35)"
                    />
                    <Text style={st.absentTitle}>Not Checked In</Text>
                    <Text style={st.absentSub}>
                      Check in to start your shift
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* ══════════════════════════════════════════════════ */}
            {/* ATTENDANCE OVERVIEW                               */}
            {/* ══════════════════════════════════════════════════ */}
            <View style={st.card}>
              <View style={st.cardPad}>
                <View style={st.cardHeaderRow}>
                  <View style={st.cardHeaderLeft}>
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={ms(13)}
                      color={TRAINER_COLOR}
                    />
                    <Text style={st.cardHeaderTitle}>ATTENDANCE</Text>
                  </View>
                </View>

                <View style={st.attendanceGrid}>
                  {/* This Week */}
                  <View style={st.attendanceBlock}>
                    <Text style={st.attendanceBlockTitle}>This Week</Text>
                    <View style={st.attendanceRow}>
                      <View style={st.attendanceStat}>
                        <Text style={[st.attendanceVal, { color: GREEN }]}>
                          {ATTENDANCE_STATS.weekPresent}
                        </Text>
                        <Text style={st.attendanceStatLabel}>Present</Text>
                      </View>
                      <View style={st.attendanceStat}>
                        <Text
                          style={[
                            st.attendanceVal,
                            { color: '#EF4444' },
                          ]}>
                          {ATTENDANCE_STATS.weekAbsent}
                        </Text>
                        <Text style={st.attendanceStatLabel}>Absent</Text>
                      </View>
                      <View style={st.attendanceStat}>
                        <Text
                          style={[
                            st.attendanceVal,
                            { color: TRAINER_COLOR },
                          ]}>
                          {weekRate}%
                        </Text>
                        <Text style={st.attendanceStatLabel}>Rate</Text>
                      </View>
                    </View>
                    <View style={st.progressTrack}>
                      <View
                        style={[
                          st.progressFill,
                          {
                            width: `${weekRate}%`,
                            backgroundColor: TRAINER_COLOR,
                          },
                        ]}
                      />
                    </View>
                  </View>

                  <View style={st.attendanceSep} />

                  {/* This Month */}
                  <View style={st.attendanceBlock}>
                    <Text style={st.attendanceBlockTitle}>This Month</Text>
                    <View style={st.attendanceRow}>
                      <View style={st.attendanceStat}>
                        <Text style={[st.attendanceVal, { color: GREEN }]}>
                          {ATTENDANCE_STATS.monthPresent}
                        </Text>
                        <Text style={st.attendanceStatLabel}>Present</Text>
                      </View>
                      <View style={st.attendanceStat}>
                        <Text
                          style={[
                            st.attendanceVal,
                            { color: '#EF4444' },
                          ]}>
                          {ATTENDANCE_STATS.monthAbsent}
                        </Text>
                        <Text style={st.attendanceStatLabel}>Absent</Text>
                      </View>
                      <View style={st.attendanceStat}>
                        <Text
                          style={[
                            st.attendanceVal,
                            { color: TRAINER_COLOR },
                          ]}>
                          {monthRate}%
                        </Text>
                        <Text style={st.attendanceStatLabel}>Rate</Text>
                      </View>
                    </View>
                    <View style={st.progressTrack}>
                      <View
                        style={[
                          st.progressFill,
                          {
                            width: `${monthRate}%`,
                            backgroundColor: TRAINER_COLOR,
                          },
                        ]}
                      />
                    </View>
                  </View>
                </View>

                {/* View Full Log */}
                <TouchableOpacity
                  style={st.viewLogBtn}
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate('TrainerAttendanceLog', {
                      trainer: {
                        id: currentUser.id,
                        name: currentUser.name,
                        ...trainerData,
                      },
                    })
                  }>
                  <View style={st.viewLogLeft}>
                    <HugeiconsIcon
                      icon={Login01Icon}
                      size={ms(13)}
                      color={TRAINER_COLOR}
                    />
                    <Text style={st.viewLogText}>
                      View Full Attendance Log
                    </Text>
                  </View>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={ms(13)}
                    color={Colors.zinc[600]}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* ══════════════════════════════════════════════════ */}
            {/* FACILITY STATUS                                   */}
            {/* ══════════════════════════════════════════════════ */}
            <View style={st.card}>
              <View style={st.cardPad}>
                {/* logo watermark */}
                <View style={st.facilityLogoWrap}>
                  <Image source={gymlogoimg} style={st.facilityLogoImg} />
                </View>

                {/* header */}
                <View style={st.cardHeaderRow}>
                  <View style={st.cardHeaderLeft}>
                    <HugeiconsIcon
                      icon={Activity01Icon}
                      size={ms(13)}
                      color={GOLD}
                    />
                    <Text style={st.cardHeaderTitle}>FACILITY STATUS</Text>
                  </View>
                  <View style={st.livePill}>
                    <View style={st.liveDotGreen} />
                    <Text style={st.livePillText}>LIVE</Text>
                  </View>
                </View>

                {/* stat chips */}
                <View style={st.facilityChipRow}>
                  <View style={st.facilityChip}>
                    <Text style={[st.facilityChipNum, { color: Colors.zinc[200] }]}>
                      {membersInside}
                    </Text>
                    <Text style={st.facilityChipLabel}>Inside</Text>
                  </View>
                  <View style={{ width: s(12) }} />
                  <View style={st.facilityChip}>
                    <Text style={[st.facilityChipNum, { color: Colors.zinc[400] }]}>
                      {capacity - membersInside}
                    </Text>
                    <Text style={st.facilityChipLabel}>Available</Text>
                  </View>
                </View>

                {/* bar */}
                <View style={st.barWrap}>
                  <View
                    style={[
                      st.barFill,
                      {
                        width: `${occupancyPct}%`,
                        backgroundColor: Colors.zinc[400],
                      },
                    ]}
                  />
                </View>

                <View style={st.facilityDivider} />

                {/* prediction */}
                <View style={st.predRow}>
                  <View style={st.predLeft}>
                    <View style={st.predClockBox}>
                      <HugeiconsIcon
                        icon={Clock01Icon}
                        size={ms(13)}
                        color={Colors.zinc[400]}
                      />
                    </View>
                    <View>
                      <Text style={st.predLabel}>ESTIMATED IN 15 MIN</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: s(3) }}>
                        <Text style={st.predNumber}>4</Text>
                        <Text style={st.predSuffix}> members will leave</Text>
                      </View>
                    </View>
                  </View>
                  <View style={st.trendChip}>
                    <Text style={st.trendText}>−4</Text>
                  </View>
                </View>

                <View style={st.facilityDivider} />

                <View style={st.expectedRow}>
                  <Text style={st.expectedLabel}>Expected count in 15m</Text>
                  <Text style={st.expectedValue}>38 members</Text>
                </View>
              </View>
            </View>

            {/* ══════════════════════════════════════════════════ */}
            {/* CHECK IN / OUT                                    */}
            {/* ══════════════════════════════════════════════════ */}
            <View style={st.actionRow}>
              <TouchableOpacity
                style={[st.actionCard, { borderColor: `${GREEN}30` }]}
                activeOpacity={0.8}>
                <LinearGradient
                  colors={[`${GREEN}15`, `${GREEN}05`, 'transparent']}
                  style={StyleSheet.absoluteFill}
                />
                <View
                  style={[
                    st.actionIconWrap,
                    {
                      borderColor: `${GREEN}40`,
                      backgroundColor: `${GREEN}15`,
                    },
                  ]}>
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    size={ms(20)}
                    color={GREEN}
                  />
                </View>
                <Text style={[st.actionLabel, { color: GREEN }]}>
                  CHECK IN
                </Text>
                <Text style={st.actionSub}>Tap to scan</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  st.actionCard,
                  { borderColor: 'rgba(255,255,255,0.08)' },
                ]}
                activeOpacity={0.8}>
                <View
                  style={[
                    st.actionIconWrap,
                    {
                      borderColor: 'rgba(255,255,255,0.12)',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                    },
                  ]}>
                  <HugeiconsIcon
                    icon={LogoutSquare01Icon}
                    size={ms(20)}
                    color={Colors.zinc[500]}
                  />
                </View>
                <Text
                  style={[st.actionLabel, { color: Colors.zinc[500] }]}>
                  CHECK OUT
                </Text>
                <Text style={st.actionSub}>Mark departure</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* BOTTOM NAV */}
          <BottomNav
            activeTab="home"
            onTabChange={tab => {
              if (tab === 'attendance')
                navigation.navigate('TrainerAttendanceLog', {
                  trainer: {
                    id: currentUser.id,
                    name: currentUser.name,
                    ...trainerData,
                  },
                });
              if (tab === 'friends')
                navigation.navigate('MembersFriend');
              if (tab === 'profile')
                navigation.navigate('UserProfile');
            }}
            userType="trainer"
          />
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/* STYLES                                                         */
/* ═══════════════════════════════════════════════════════════════ */
const st = StyleSheet.create({
  scroll: {
    paddingHorizontal: s(20),
    gap: vs(14),
    paddingBottom: vs(110),
  },

  /* welcome */
  welcomeLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(8),
    color: Colors.zinc[500],
    letterSpacing: s(2.5),
    textTransform: 'uppercase',
    marginBottom: vs(3),
    fontWeight: '600',
  },
  welcomeName: {
    fontFamily: Fonts.orbitron.extraBold,
    fontSize: rf(19),
    color: Colors.white,
    letterSpacing: s(3.5),
    lineHeight: rf(26),
  },
  trainerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
    marginTop: vs(8),
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(4),
    alignSelf: 'flex-start',
    backgroundColor: `${TRAINER_COLOR}15`,
    borderWidth: 1,
    borderColor: `${TRAINER_COLOR}30`,
  },
  trainerPillText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(7),
    color: TRAINER_COLOR,
    letterSpacing: s(1.5),
    textTransform: 'uppercase',
  },

  /* hero card */
  heroCard: {
    borderRadius: ms(16),
    padding: s(16),
    borderWidth: 1,
    borderColor: `${TRAINER_COLOR}40`,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000000',
  },
  heroBgIcon: {
    position: 'absolute',
    top: -ms(10),
    right: -ms(15),
    opacity: 0.8,
  },
  heroLogoWrap: {
    position: 'absolute',
    top: scale(10),
    right: 0,
    bottom: 0,
    left: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroLogoImg: {
    width: moderateScale(300),
    height: moderateScale(150),
    opacity: 0.10,
  },
  heroContent: { zIndex: 1 },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: vs(12),
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(4),
    alignSelf: 'flex-start',
    backgroundColor: `${TRAINER_COLOR}15`,
    borderWidth: 1,
    borderColor: `${TRAINER_COLOR}30`,
    marginBottom: vs(6),
  },
  activeDot: {
    width: s(5),
    height: s(5),
    borderRadius: s(3),
    backgroundColor: TRAINER_COLOR,
  },
  activePillText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(7),
    color: TRAINER_COLOR,
    letterSpacing: s(1.5),
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(15),
    color: TRAINER_COLOR,
    letterSpacing: s(3.5),
    marginVertical: vs(6),
    lineHeight: rf(22),
  },
  heroPTBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(4),
    alignSelf: 'flex-start',
    backgroundColor: `${TRAINER_COLOR}15`,
    borderWidth: 1,
    borderColor: `${TRAINER_COLOR}30`,
  },
  heroPTText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(7),
    color: TRAINER_COLOR,
    letterSpacing: s(1.5),
    textTransform: 'uppercase',
  },
  heroDaysCircle: {
    width: ms(68),
    height: ms(68),
    borderRadius: ms(34),
    borderWidth: 1.5,
    borderColor: `${TRAINER_COLOR}30`,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroDaysNum: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(20),
    color: TRAINER_COLOR,
    lineHeight: rf(24),
  },
  heroDaysLbl: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(7),
    color: Colors.zinc[500],
    letterSpacing: s(1),
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  heroDivider: {
    height: vs(1),
    backgroundColor: `${TRAINER_COLOR}25`,
    marginVertical: vs(12),
  },
  heroFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroFooterDate: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9),
    color: Colors.zinc[500],
  },
  inGymChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.30)',
    backgroundColor: 'rgba(34,197,94,0.10)',
  },
  inGymDot: {
    width: s(5),
    height: s(5),
    borderRadius: s(3),
    backgroundColor: GREEN,
  },
  inGymText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(8),
    color: GREEN,
    letterSpacing: s(1.5),
  },
  presentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: `${TRAINER_COLOR}30`,
    backgroundColor: `${TRAINER_COLOR}10`,
  },
  absentChip: {
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
    backgroundColor: 'rgba(239,68,68,0.08)',
  },
  absentChipText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(8),
    color: '#EF4444',
    letterSpacing: s(1.5),
  },

  /* shared card */
  card: {
    borderRadius: ms(14),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    backgroundColor: '#000000',
    overflow: 'hidden',
    position: 'relative',
  },
  cardPad: { padding: s(16) },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(14),
  },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: s(6) },
  cardHeaderTitle: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(8),
    color: Colors.zinc[400],
    letterSpacing: s(2.5),
    textTransform: 'uppercase',
  },

  /* status badge */
  statusBadge: {
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(8),
    borderWidth: 1,
  },
  statusBadgeText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(7.5),
    letterSpacing: s(1),
  },

  /* today grid */
  todayGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  todayItem:    { flex: 1, alignItems: 'center', gap: vs(5) },
  todayIconBox: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(14),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(2),
  },
  todayLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(7),
    color: Colors.zinc[500],
    textTransform: 'uppercase',
    letterSpacing: s(0.5),
  },
  todayValue: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(10),
    color: Colors.white,
    textAlign: 'center',
  },
  todayDivider: {
    width: 1,
    height: vs(50),
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginHorizontal: s(8),
  },
  absentBox: {
    alignItems: 'center',
    gap: vs(6),
    paddingVertical: vs(20),
  },
  absentTitle: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(12),
    color: Colors.zinc[400],
  },
  absentSub: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9),
    color: Colors.zinc[600],
  },

  /* attendance */
  attendanceGrid:       { gap: vs(14) },
  attendanceBlock:      { gap: vs(8) },
  attendanceBlockTitle: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(8),
    color: Colors.zinc[300],
    letterSpacing: s(0.5),
    textTransform: 'uppercase',
  },
  attendanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  attendanceStat:      { alignItems: 'center', gap: vs(2) },
  attendanceVal: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(14),
  },
  attendanceStatLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(7.5),
    color: Colors.zinc[500],
    textTransform: 'uppercase',
    letterSpacing: s(0.5),
  },
  attendanceSep: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  progressTrack: {
    height: vs(4),
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: ms(2),
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: ms(2) },

  /* view log */
  viewLogBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: vs(14),
    paddingVertical: vs(12),
    paddingHorizontal: s(14),
    borderRadius: ms(10),
    borderWidth: 1,
    borderColor: `${TRAINER_COLOR}20`,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  viewLogLeft: { flexDirection: 'row', alignItems: 'center', gap: s(8) },
  viewLogText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(9),
    color: Colors.white,
    letterSpacing: s(0.8),
    textTransform: 'uppercase',
  },

  /* facility */
  facilityLogoWrap: {
    position: 'absolute',
    top: 0, right: 0, bottom: 0, left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  facilityLogoImg: {
    width: moderateScale(280),
    height: moderateScale(140),
    opacity: 0.05,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.30)',
  },
  liveDotGreen: {
    width: s(6),
    height: s(6),
    borderRadius: s(3),
    backgroundColor: GREEN,
  },
  livePillText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(7),
    color: GREEN,
    letterSpacing: s(1.5),
  },
  facilityChipRow: { flexDirection: 'row', marginBottom: vs(14) },
  facilityChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(10),
    borderRadius: ms(12),
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  facilityChipNum: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(18),
    lineHeight: rf(22),
  },
  facilityChipLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(7),
    color: Colors.zinc[500],
    letterSpacing: s(1.5),
    textTransform: 'uppercase',
    marginTop: vs(2),
  },
  barWrap: {
    height: vs(5),
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: ms(3),
    overflow: 'hidden',
    marginBottom: vs(4),
  },
  barFill:        { height: '100%', borderRadius: ms(3) },
  facilityDivider:{
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginVertical: vs(14),
  },
  predRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  predLeft:    { flexDirection: 'row', alignItems: 'center', gap: s(10) },
  predClockBox:{
    width: ms(30),
    height: ms(30),
    borderRadius: ms(15),
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  predLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(6.5),
    color: Colors.zinc[600],
    letterSpacing: s(1.5),
    textTransform: 'uppercase',
    marginBottom: vs(2),
  },
  predNumber: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(16),
    color: Colors.zinc[200],
  },
  predSuffix: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(10),
    color: Colors.zinc[400],
  },
  trendChip: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: s(10),
    paddingVertical: vs(5),
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  trendText: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(11),
    color: Colors.zinc[300],
  },
  expectedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expectedLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9),
    color: Colors.zinc[500],
  },
  expectedValue: {
    fontFamily: Fonts.orbitron.regular,
    fontSize: rf(11),
    color: Colors.white,
    fontWeight: '600',
  },

  /* check in/out actions */
  actionRow: { flexDirection: 'row', gap: s(12) },
  actionCard: {
    flex: 1,
    borderRadius: ms(18),
    padding: s(18),
    borderWidth: 1,
    alignItems: 'center',
    gap: vs(10),
    backgroundColor: 'rgba(255,255,255,0.02)',
    overflow: 'hidden',
    position: 'relative',
  },
  actionIconWrap: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(24),
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: rf(8),
    letterSpacing: s(1.8),
    textTransform: 'uppercase',
  },
  actionSub: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(8),
    color: Colors.zinc[600],
    letterSpacing: s(0.5),
  },
});

export default TrainerDashboardScreen;