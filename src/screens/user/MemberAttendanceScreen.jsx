// src/screens/user/MemberAttendanceScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ArrowLeft01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  Clock01Icon,
  Activity01Icon,
  Fire02Icon,
  Login01Icon,
  Logout01Icon,
  AlertCircleIcon,
  Notification01Icon,
  Dumbbell01Icon,
  Medal02Icon,
} from '@hugeicons/core-free-icons';

import BottomNav from '../../components/shared/BottomNav';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import gymlogoimg from '../user/gymlogoimg.png';

const s  = (size) => scale(size);
const ms = (size) => moderateScale(size, 0.25);
const vs = (size) => verticalScale(size);
const rf = (size) => RFValue(size);

const GREEN  = '#22C55E';
const RED    = '#EF4444';
const GOLD   = '#C5A059';
const CYAN   = '#22D3EE';

/* ═══════════════════════════════════════════════════════════════ */
/* TABS                                                            */
/* ═══════════════════════════════════════════════════════════════ */
const TABS = [
  { key: 'week',  label: 'This Week' },
  { key: 'month', label: 'Monthly'   },
  { key: 'year',  label: 'Yearly'    },
];

/* ═══════════════════════════════════════════════════════════════ */
/* DUMMY DATA                                                      */
/* ═══════════════════════════════════════════════════════════════ */
const WEEK_DAYS = [
  { day: 'Mon', date: '13 Jan', status: 'present', checkIn: '6:15 AM', checkOut: '8:30 AM', duration: '2h 15m' },
  { day: 'Tue', date: '14 Jan', status: 'present', checkIn: '6:00 AM', checkOut: '8:45 AM', duration: '2h 45m' },
  { day: 'Wed', date: '15 Jan', status: 'present', checkIn: '6:30 AM', checkOut: '8:15 AM', duration: '1h 45m' },
  { day: 'Thu', date: '16 Jan', status: 'absent',  checkIn: null,       checkOut: null,       duration: null     },
  { day: 'Fri', date: '17 Jan', status: 'present', checkIn: '5:45 AM', checkOut: '8:00 AM', duration: '2h 15m' },
  { day: 'Sat', date: '18 Jan', status: 'present', checkIn: '7:00 AM', checkOut: '9:30 AM', duration: '2h 30m' },
  { day: 'Sun', date: '19 Jan', status: 'rest',    checkIn: null,       checkOut: null,       duration: null     },
];

const MONTH_WEEKS = [
  { week: 'Week 1', present: 5, absent: 1, rest: 1, avgDuration: '2h 10m' },
  { week: 'Week 2', present: 6, absent: 0, rest: 1, avgDuration: '2h 25m' },
  { week: 'Week 3', present: 5, absent: 1, rest: 1, avgDuration: '2h 00m' },
  { week: 'Week 4', present: 6, absent: 0, rest: 1, avgDuration: '2h 30m' },
];

const YEAR_MONTHS = [
  { month: 'Jan',  present: 22, absent: 4, total: 26, pct: 85 },
  { month: 'Feb',  present: 20, absent: 4, total: 24, pct: 83 },
  { month: 'Mar',  present: 24, absent: 3, total: 27, pct: 89 },
  { month: 'Apr',  present: 21, absent: 5, total: 26, pct: 81 },
  { month: 'May',  present: 25, absent: 1, total: 26, pct: 96 },
  { month: 'Jun',  present: 23, absent: 3, total: 26, pct: 88 },
  { month: 'Jul',  present: 22, absent: 5, total: 27, pct: 81 },
  { month: 'Aug',  present: 24, absent: 3, total: 27, pct: 89 },
  { month: 'Sep',  present: 20, absent: 6, total: 26, pct: 77 },
  { month: 'Oct',  present: 25, absent: 2, total: 27, pct: 93 },
  { month: 'Nov',  present: 23, absent: 3, total: 26, pct: 88 },
  { month: 'Dec',  present: 18, absent: 5, total: 23, pct: 78 },
];

const SUMMARY = {
  week:  { present: 5, absent: 1, rest: 1, totalDuration: '11h 30m', avgDuration: '2h 18m', streak: 3, bestStreak: 8  },
  month: { present: 22, absent: 2, rest: 4, totalDuration: '48h 20m', avgDuration: '2h 12m', streak: 8, bestStreak: 14 },
  year:  { present: 267, absent: 44, rest: 52, totalDuration: '580h', avgDuration: '2h 10m', streak: 8, bestStreak: 22 },
};

/* ═══════════════════════════════════════════════════════════════ */
/* DASHBOARD HEADER (same as UserDashboard)                       */
/* ═══════════════════════════════════════════════════════════════ */
const DashboardHeader = ({ navigation, userName }) => {
  const initials = userName
    ? userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <View style={headerSt.wrapper}>
      <View style={headerSt.bottomBorder} />
      <View style={headerSt.inner}>
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
              colors={[`${GOLD}50`, `${GOLD}18`]}
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
    borderColor: `${GOLD}55`,
  },
  avatarGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatarText: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(10),
    color: GOLD,
    letterSpacing: s(0.8),
  },
});

/* ═══════════════════════════════════════════════════════════════ */
/* STAT PILL                                                       */
/* ═══════════════════════════════════════════════════════════════ */
const StatPill = ({ icon, value, label, color }) => (
  <View style={st.statPill}>
    <HugeiconsIcon icon={icon} size={ms(14)} color={color} />
    <Text style={[st.statPillValue, { color }]}>{value}</Text>
    <Text style={st.statPillLabel}>{label}</Text>
  </View>
);

/* ═══════════════════════════════════════════════════════════════ */
/* DAY ROW (week view)                                             */
/* ═══════════════════════════════════════════════════════════════ */
const DayRow = ({ item, isLast }) => {
  const isPresent = item.status === 'present';
  const isAbsent  = item.status === 'absent';
  const dotColor  = isPresent ? GREEN : isAbsent ? RED : Colors.zinc[600];
  const label     = isPresent ? 'Present' : isAbsent ? 'Absent' : 'Rest Day';

  return (
    <View style={[st.dayRow, !isLast && st.dayRowBorder]}>
      <View style={st.dayDateCol}>
        <Text style={st.dayName}>{item.day}</Text>
        <Text style={st.dayDate}>{item.date}</Text>
      </View>

      <View style={[st.dayDot, { backgroundColor: dotColor }]} />

      <View style={{ flex: 1 }}>
        <Text style={[st.dayStatus, { color: dotColor }]}>{label}</Text>
        {isPresent && (
          <View style={st.dayTimesRow}>
            <View style={st.dayTimeChip}>
              <HugeiconsIcon icon={Login01Icon}  size={ms(9)} color={GREEN} />
              <Text style={st.dayTimeText}>{item.checkIn}</Text>
            </View>
            <View style={st.dayTimeChip}>
              <HugeiconsIcon icon={Logout01Icon} size={ms(9)} color={RED} />
              <Text style={st.dayTimeText}>{item.checkOut}</Text>
            </View>
          </View>
        )}
      </View>

      {isPresent && (
        <View style={st.dayDurationBox}>
          <Text style={st.dayDuration}>{item.duration}</Text>
        </View>
      )}
    </View>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/* WEEK ROW (month view)                                           */
/* ═══════════════════════════════════════════════════════════════ */
const WeekRow = ({ item, isLast }) => {
  const pct = Math.round(
    (item.present / (item.present + item.absent)) * 100,
  );

  return (
    <View style={[st.weekRow, !isLast && st.dayRowBorder]}>
      <View style={{ flex: 1 }}>
        <Text style={st.weekTitle}>{item.week}</Text>
        <View style={st.weekStatsRow}>
          <View style={st.weekStatChip}>
            <View style={[st.weekStatDot, { backgroundColor: GREEN }]} />
            <Text style={st.weekStatText}>{item.present}P</Text>
          </View>
          <View style={st.weekStatChip}>
            <View style={[st.weekStatDot, { backgroundColor: RED }]} />
            <Text style={st.weekStatText}>{item.absent}A</Text>
          </View>
          <View style={st.weekStatChip}>
            <View style={[st.weekStatDot, { backgroundColor: Colors.zinc[600] }]} />
            <Text style={st.weekStatText}>{item.rest}R</Text>
          </View>
        </View>
      </View>

      <View style={st.weekRight}>
        <Text
          style={[
            st.weekPct,
            { color: pct >= 80 ? GREEN : pct >= 60 ? GOLD : RED },
          ]}>
          {pct}%
        </Text>
        <Text style={st.weekAvg}>{item.avgDuration}</Text>
      </View>
    </View>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/* MONTH ROW (year view)                                           */
/* ═══════════════════════════════════════════════════════════════ */
const MonthRow = ({ item, isLast }) => {
  const barColor =
    item.pct >= 85 ? GREEN : item.pct >= 70 ? GOLD : RED;

  return (
    <View style={[st.monthRow, !isLast && st.dayRowBorder]}>
      <View style={st.monthLeft}>
        <Text style={st.monthName}>{item.month}</Text>
        <View style={st.monthBar}>
          <View
            style={[
              st.monthBarFill,
              { width: `${item.pct}%`, backgroundColor: barColor },
            ]}
          />
        </View>
      </View>

      <View style={st.monthMid}>
        <Text style={[st.monthVal, { color: GREEN }]}>{item.present}</Text>
        <Text style={st.monthSlash}>/</Text>
        <Text style={[st.monthVal, { color: Colors.zinc[500] }]}>
          {item.total}
        </Text>
      </View>

      <Text style={[st.monthPct, { color: barColor }]}>{item.pct}%</Text>
    </View>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/* MAIN SCREEN                                                     */
/* ═══════════════════════════════════════════════════════════════ */
const MemberAttendanceScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('week');

  const userName = 'Abdullah Ahmed';
  const summary  = SUMMARY[activeTab];
  const totalDays = summary.present + summary.absent;
  const pct       = totalDays > 0 ? Math.round((summary.present / totalDays) * 100) : 0;

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

          {/* HEADER */}
          <DashboardHeader navigation={navigation} userName={userName} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={st.scroll}>

            {/* PAGE TITLE */}
            <View style={st.pageTitleRow}>
              <TouchableOpacity
                style={st.backBtn}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}>
                <HugeiconsIcon
                  icon={ArrowLeft01Icon}
                  size={ms(16)}
                  color={Colors.white}
                />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={st.pageLabel}>MY ATTENDANCE</Text>
                <Text style={st.pageTitle}>Attendance Log</Text>
              </View>
              <View style={st.memberPill}>
                <HugeiconsIcon
                  icon={Medal02Icon}
                  size={ms(10)}
                  color={GOLD}
                />
                <Text style={st.memberPillText}>MEMBER</Text>
              </View>
            </View>

            {/* TAB SWITCHER */}
            <View style={st.tabRow}>
              {TABS.map(tab => {
                const isActive = activeTab === tab.key;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    style={[st.tab, isActive && st.tabActive]}
                    onPress={() => setActiveTab(tab.key)}
                    activeOpacity={0.7}>
                    <Text
                      style={[st.tabText, isActive && st.tabTextActive]}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* SUMMARY CARD */}
            <View style={st.summaryCard}>
              <View style={st.summaryTopRow}>
                {/* rate circle */}
                <View style={st.rateCircle}>
                  <Text style={st.rateNum}>{pct}</Text>
                  <Text style={st.ratePct}>%</Text>
                </View>

                {/* stat pills */}
                <View style={st.summaryStats}>
                  <View style={st.summaryStatRow}>
                    <StatPill
                      icon={CheckmarkCircle02Icon}
                      value={summary.present}
                      label="Present"
                      color={GREEN}
                    />
                    <StatPill
                      icon={Cancel01Icon}
                      value={summary.absent}
                      label="Absent"
                      color={RED}
                    />
                  </View>
                  <View style={st.summaryStatRow}>
                    <StatPill
                      icon={Clock01Icon}
                      value={summary.avgDuration}
                      label="Avg Session"
                      color={CYAN}
                    />
                    <StatPill
                      icon={Fire02Icon}
                      value={summary.streak}
                      label="Streak"
                      color={GOLD}
                    />
                  </View>
                </View>
              </View>

              {/* progress bar */}
              <View style={st.summaryBar}>
                <View
                  style={[
                    st.summaryBarFill,
                    {
                      width: `${pct}%`,
                      backgroundColor:
                        pct >= 85 ? GREEN : pct >= 65 ? GOLD : RED,
                    },
                  ]}
                />
              </View>

              {/* bottom row */}
              <View style={st.summaryBottom}>
                <View style={st.summaryBottomItem}>
                  <Text style={st.summaryBottomLabel}>Total Hours</Text>
                  <Text style={st.summaryBottomValue}>
                    {summary.totalDuration}
                  </Text>
                </View>
                <View style={st.summaryBottomDivider} />
                <View style={st.summaryBottomItem}>
                  <Text style={st.summaryBottomLabel}>Best Streak</Text>
                  <Text style={[st.summaryBottomValue, { color: GOLD }]}>
                    {summary.bestStreak} Days
                  </Text>
                </View>
                <View style={st.summaryBottomDivider} />
                <View style={st.summaryBottomItem}>
                  <Text style={st.summaryBottomLabel}>Rest Days</Text>
                  <Text
                    style={[
                      st.summaryBottomValue,
                      { color: Colors.zinc[400] },
                    ]}>
                    {summary.rest}
                  </Text>
                </View>
              </View>
            </View>

            {/* DETAIL LIST */}
            <View style={st.listCard}>
              <View style={st.listHeader}>
                <HugeiconsIcon
                  icon={Calendar03Icon}
                  size={ms(13)}
                  color={Colors.zinc[400]}
                />
                <Text style={st.listHeaderTitle}>
                  {activeTab === 'week'
                    ? 'DAILY BREAKDOWN'
                    : activeTab === 'month'
                    ? 'WEEKLY BREAKDOWN'
                    : 'MONTHLY BREAKDOWN'}
                </Text>
              </View>

              {activeTab === 'week' &&
                WEEK_DAYS.map((item, idx) => (
                  <DayRow
                    key={idx}
                    item={item}
                    isLast={idx === WEEK_DAYS.length - 1}
                  />
                ))}

              {activeTab === 'month' &&
                MONTH_WEEKS.map((item, idx) => (
                  <WeekRow
                    key={idx}
                    item={item}
                    isLast={idx === MONTH_WEEKS.length - 1}
                  />
                ))}

              {activeTab === 'year' &&
                YEAR_MONTHS.map((item, idx) => (
                  <MonthRow
                    key={idx}
                    item={item}
                    isLast={idx === YEAR_MONTHS.length - 1}
                  />
                ))}
            </View>

            {/* PERFORMANCE BANNER */}
            {pct >= 90 && (
              <LinearGradient
                colors={[`${GREEN}14`, `${GREEN}05`, 'transparent']}
                style={st.perfBanner}>
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  size={ms(20)}
                  color={GREEN}
                />
                <View style={{ flex: 1, gap: vs(3) }}>
                  <Text style={st.perfTitle}>Excellent Consistency! 🏆</Text>
                  <Text style={st.perfSub}>
                    Your attendance rate is above 90%. Outstanding discipline!
                  </Text>
                </View>
              </LinearGradient>
            )}

            {pct < 90 && pct >= 75 && (
              <LinearGradient
                colors={[`${GOLD}14`, `${GOLD}05`, 'transparent']}
                style={st.perfBanner}>
                <HugeiconsIcon
                  icon={Activity01Icon}
                  size={ms(20)}
                  color={GOLD}
                />
                <View style={{ flex: 1, gap: vs(3) }}>
                  <Text style={[st.perfTitle, { color: GOLD }]}>
                    Good Progress 💪
                  </Text>
                  <Text style={st.perfSub}>
                    {100 - pct}% away from excellent. Keep pushing!
                  </Text>
                </View>
              </LinearGradient>
            )}

            {pct < 75 && (
              <LinearGradient
                colors={[`${RED}12`, `${RED}04`, 'transparent']}
                style={st.perfBanner}>
                <HugeiconsIcon
                  icon={AlertCircleIcon}
                  size={ms(20)}
                  color={RED}
                />
                <View style={{ flex: 1, gap: vs(3) }}>
                  <Text style={[st.perfTitle, { color: RED }]}>
                    Needs Improvement ⚠️
                  </Text>
                  <Text style={st.perfSub}>
                    Your attendance is below 75%. Stay consistent to reach your goals!
                  </Text>
                </View>
              </LinearGradient>
            )}

            {/* STREAK MOTIVATION */}
            {summary.streak > 0 && (
              <LinearGradient
                colors={[`${GOLD}12`, `${GOLD}04`, 'transparent']}
                style={st.streakBanner}>
                <HugeiconsIcon
                  icon={Fire02Icon}
                  size={ms(22)}
                  color={GOLD}
                />
                <View style={{ flex: 1, gap: vs(3) }}>
                  <Text style={st.streakBannerTitle}>
                    {summary.streak} Day Streak! 🔥
                  </Text>
                  <Text style={st.streakBannerSub}>
                    {summary.streak >= summary.bestStreak
                      ? "You're at your best streak ever! Keep going!"
                      : `${summary.bestStreak - summary.streak} more days to beat your record of ${summary.bestStreak}!`}
                  </Text>
                </View>
              </LinearGradient>
            )}

            {/* LEGEND */}
            <View style={st.legendCard}>
              <Text style={st.legendTitle}>LEGEND</Text>
              <View style={st.legendRow}>
                {[
                  { color: GREEN,            label: 'Present'  },
                  { color: RED,              label: 'Absent'   },
                  { color: Colors.zinc[600], label: 'Rest Day' },
                ].map((item, idx) => (
                  <View key={idx} style={st.legendItem}>
                    <View
                      style={[st.legendDot, { backgroundColor: item.color }]}
                    />
                    <Text style={st.legendText}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* BOTTOM NAV */}
          <BottomNav
            activeTab="profile"
            onTabChange={tab => {
              if (tab === 'home')       navigation.navigate('UserDashboard');
              if (tab === 'profile')    navigation.navigate('UserProfile');
              if (tab === 'membership') navigation.navigate('UserDashboard', { openPlans: true });
              if (tab === 'friends')    navigation.navigate('MembersFriend');
            }}
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
    paddingTop: vs(12),
    gap: vs(14),
    paddingBottom: vs(110),
  },

  /* page title */
  pageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
  },
  backBtn: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageLabel: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(7),
    color: Colors.zinc[500],
    letterSpacing: s(2),
    textTransform: 'uppercase',
  },
  pageTitle: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(14),
    color: Colors.white,
    letterSpacing: s(1.5),
  },
  memberPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
    paddingHorizontal: s(8),
    paddingVertical: vs(4),
    borderRadius: ms(6),
    backgroundColor: `${GOLD}15`,
    borderWidth: 1,
    borderColor: `${GOLD}30`,
  },
  memberPillText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(7),
    color: GOLD,
    letterSpacing: s(1.5),
  },

  /* tabs */
  tabRow: {
    flexDirection: 'row',
    gap: s(8),
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: ms(12),
    padding: s(4),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  tab: {
    flex: 1,
    paddingVertical: vs(10),
    borderRadius: ms(10),
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  tabText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(9),
    color: Colors.zinc[500],
    letterSpacing: s(1),
    textTransform: 'uppercase',
  },
  tabTextActive: { color: Colors.white },

  /* summary card */
  summaryCard: {
    backgroundColor: '#000000',
    borderRadius: ms(16),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: s(16),
  },
  summaryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(16),
    marginBottom: vs(16),
  },
  rateCircle: {
    width: ms(80),
    height: ms(80),
    borderRadius: ms(40),
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  rateNum: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(24),
    color: Colors.white,
    lineHeight: rf(28),
  },
  ratePct: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(12),
    color: Colors.zinc[500],
    marginTop: vs(2),
  },
  summaryStats: { flex: 1, gap: vs(8) },
  summaryStatRow: { flexDirection: 'row', gap: s(8) },

  /* stat pill */
  statPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: s(8),
    paddingVertical: vs(6),
  },
  statPillValue: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(9),
  },
  statPillLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(6.5),
    color: Colors.zinc[500],
    letterSpacing: s(0.3),
  },

  /* summary bar */
  summaryBar: {
    height: vs(6),
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: ms(3),
    overflow: 'hidden',
    marginBottom: vs(14),
  },
  summaryBarFill: {
    height: '100%',
    borderRadius: ms(3),
  },

  /* summary bottom */
  summaryBottom: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryBottomItem: {
    flex: 1,
    alignItems: 'center',
    gap: vs(3),
  },
  summaryBottomLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(6.5),
    color: Colors.zinc[500],
    letterSpacing: s(1),
    textTransform: 'uppercase',
  },
  summaryBottomValue: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(11),
    color: Colors.white,
  },
  summaryBottomDivider: {
    width: 1,
    height: vs(30),
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  /* list card */
  listCard: {
    backgroundColor: '#000000',
    borderRadius: ms(16),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: s(14),
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    marginBottom: vs(14),
  },
  listHeaderTitle: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(8),
    color: Colors.zinc[400],
    letterSpacing: s(2),
    textTransform: 'uppercase',
  },

  /* day row */
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    paddingVertical: vs(12),
  },
  dayRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  dayDateCol: {
    width: ms(42),
    alignItems: 'center',
  },
  dayName: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(9),
    color: Colors.white,
  },
  dayDate: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(7),
    color: Colors.zinc[600],
    marginTop: vs(1),
  },
  dayDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
  },
  dayStatus: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(9),
    letterSpacing: s(0.5),
    marginBottom: vs(3),
  },
  dayTimesRow: {
    flexDirection: 'row',
    gap: s(6),
    flexWrap: 'wrap',
  },
  dayTimeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(3),
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    borderRadius: ms(4),
  },
  dayTimeText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(7),
    color: Colors.zinc[400],
  },
  dayDurationBox: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: s(8),
    paddingVertical: vs(4),
    borderRadius: ms(6),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  dayDuration: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: rf(8),
    color: Colors.white,
  },

  /* week row */
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: vs(14),
  },
  weekTitle: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: rf(10),
    color: Colors.white,
    letterSpacing: s(0.5),
    marginBottom: vs(6),
  },
  weekStatsRow: {
    flexDirection: 'row',
    gap: s(8),
    flexWrap: 'wrap',
  },
  weekStatChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
  },
  weekStatDot: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
  },
  weekStatText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(8),
    color: Colors.zinc[400],
  },
  weekRight: {
    alignItems: 'flex-end',
    gap: vs(3),
  },
  weekPct: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(16),
  },
  weekAvg: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(7.5),
    color: Colors.zinc[500],
  },

  /* month row */
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(12),
    gap: s(12),
  },
  monthLeft: {
    flex: 1,
    gap: vs(6),
  },
  monthName: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: rf(10),
    color: Colors.white,
    letterSpacing: s(1),
  },
  monthBar: {
    height: vs(4),
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: ms(2),
    overflow: 'hidden',
  },
  monthBarFill: {
    height: '100%',
    borderRadius: ms(2),
  },
  monthMid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(2),
  },
  monthVal: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(11),
  },
  monthSlash: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(10),
    color: Colors.zinc[600],
  },
  monthPct: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(12),
    width: ms(45),
    textAlign: 'right',
  },

  /* performance banner */
  perfBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
    padding: s(16),
    borderRadius: ms(14),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  perfTitle: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: rf(11),
    color: GREEN,
    letterSpacing: s(0.8),
  },
  perfSub: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(8.5),
    color: Colors.zinc[400],
  },

  /* streak banner */
  streakBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
    padding: s(16),
    borderRadius: ms(14),
    borderWidth: 1,
    borderColor: `${GOLD}18`,
  },
  streakBannerTitle: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: rf(11),
    color: GOLD,
    letterSpacing: s(0.8),
  },
  streakBannerSub: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(8.5),
    color: Colors.zinc[400],
  },

  /* legend */
  legendCard: {
    backgroundColor: '#000000',
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: s(14),
  },
  legendTitle: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(7),
    color: Colors.zinc[500],
    letterSpacing: s(2),
    textTransform: 'uppercase',
    marginBottom: vs(10),
  },
  legendRow: {
    flexDirection: 'row',
    gap: s(20),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
  },
  legendDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
  },
  legendText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(8),
    color: Colors.zinc[400],
  },
});

export default MemberAttendanceScreen;