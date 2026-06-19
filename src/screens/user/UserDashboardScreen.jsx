// src/screens/user/UserDashboardScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  CheckmarkCircle02Icon,
  LogoutSquare01Icon,
  Activity01Icon,
  Clock01Icon,
  Shield01Icon,
  Dumbbell01Icon,
  Flash01Icon,
  InformationCircleIcon,
  Loading03Icon,
  ArrowRight01Icon,
  GiftIcon,
  Medal02Icon,
  Time01Icon,
  Notification01Icon,
} from '@hugeicons/core-free-icons';
import { useRoute } from '@react-navigation/native';

import BottomNav from '../../components/shared/BottomNav';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import gymlogoimg from '../user/gymlogoimg.png';
import { usePlans } from '../../context/PlansContext';
import { useMembershipRequests } from '../../context/MembershipRequestsContext';
import { useTrainer } from '../../context/TrainerContext';

const s = (size) => scale(size);
const ms = (size) => moderateScale(size, 0.25);
const vs = (size) => verticalScale(size);
const rf = (size) => RFValue(size);

const TRAINER_COLOR = '#22D3EE';
const GOLD = '#C5A059';
const GREEN = '#22C55E';
const BLUE = '#3B82F6';
const PURPLE = '#A855F7';

const DEFAULT_TEMPLATES = {
  cardio_weights: {
    iconColor: GOLD,
    textColor: GOLD,
    badge: 'ELITE',
    workoutLabel: 'Cardio + Weight Lifting',
  },
  weights_only: {
    iconColor: PURPLE,
    textColor: '#c084fc',
    badge: 'LEGENDARY',
    workoutLabel: 'Weight Lifting',
  },
};

/* ─────────────────────────────────────────────────────────────── */
/* PREVIEW MODE STATES                                             */
/* ─────────────────────────────────────────────────────────────── */
const PREVIEW_STATES = [
  { key: 'live',              label: 'LIVE',       color: GREEN         },
  { key: 'trial',             label: 'TRIAL',      color: BLUE          },
  { key: 'pending_elite',     label: 'REQ·ELITE',  color: GOLD          },
  { key: 'pending_legendary', label: 'REQ·LEGEND', color: PURPLE        },
  { key: 'elite',             label: 'ELITE',      color: GOLD          },
  { key: 'legendary',         label: 'LEGENDARY',  color: PURPLE        },
  { key: 'trainer',           label: 'TRAINER',    color: TRAINER_COLOR },
];

const MOCK_DATA = {
  trial: { daysLeft: 5 },
  pending_elite: {
    status: 'pending',
    planName: 'ELITE\nMEMBERSHIP',
    workoutType: 'cardio_weights',
    planDuration: '1 Month',
    planPrice: '49.99',
    planTemplate: DEFAULT_TEMPLATES.cardio_weights,
  },
  pending_legendary: {
    status: 'pending',
    planName: 'LEGENDARY\nMEMBERSHIP',
    workoutType: 'weights_only',
    planDuration: '3 Months',
    planPrice: '129.99',
    planTemplate: DEFAULT_TEMPLATES.weights_only,
  },
  elite: {
    tierName: 'ELITE\nMEMBER',
    daysLeft: 22,
    expiryDate: '15 Feb 2025',
    workoutType: 'cardio_weights',
    template: DEFAULT_TEMPLATES.cardio_weights,
  },
  legendary: {
    tierName: 'LEGENDARY\nMEMBER',
    daysLeft: 78,
    expiryDate: '28 Apr 2025',
    workoutType: 'weights_only',
    template: DEFAULT_TEMPLATES.weights_only,
  },
  trainer: {
    assignedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
};

/* ─────────────────────────────────────────────────────────────── */
/* SMALL HELPERS                                                   */
/* ─────────────────────────────────────────────────────────────── */
const Pill = ({ icon, label, color, bg }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(5),
      paddingHorizontal: s(8),
      paddingVertical: vs(3),
      borderRadius: ms(4),
      alignSelf: 'flex-start',
      backgroundColor: bg || `${color}15`,
      borderWidth: 1,
      borderColor: `${color}30`,
    }}>
    {icon && <HugeiconsIcon icon={icon} size={ms(9)} color={color} />}
    <Text
      style={{
        fontFamily: Fonts.rajdhani.semiBold,
        fontSize: rf(7),
        color,
        letterSpacing: s(1.5),
        textTransform: 'uppercase',
      }}>
      {label}
    </Text>
  </View>
);

/* ─────────────────────────────────────────────────────────────── */
/* STAT CHIP                                                       */
/* ─────────────────────────────────────────────────────────────── */
const StatChip = ({ value, label, color = Colors.zinc[400] }) => (
  <View
    style={{
      alignItems: 'center',
      flex: 1,
      paddingVertical: vs(10),
      borderRadius: ms(12),
      backgroundColor: 'rgba(255,255,255,0.03)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.07)',
    }}>
    <Text
      style={{
        fontFamily: Fonts.orbitron.bold,
        fontSize: rf(18),
        color,
        lineHeight: rf(22),
      }}>
      {value}
    </Text>
    <Text
      style={{
        fontFamily: Fonts.rajdhani.regular,
        fontSize: rf(7),
        color: Colors.zinc[500],
        letterSpacing: s(1.5),
        textTransform: 'uppercase',
        marginTop: vs(2),
      }}>
      {label}
    </Text>
  </View>
);

/* ═══════════════════════════════════════════════════════════════ */
/* PREVIEW STATE SWITCHER                                          */
/* ═══════════════════════════════════════════════════════════════ */
const PreviewSwitcher = ({ activeState, onSwitch }) => (
  <View style={switcherStyles.wrapper}>
    <View style={switcherStyles.labelRow}>
      <View style={switcherStyles.devDot} />
      <Text style={switcherStyles.devLabel}>DEV PREVIEW</Text>
      <View style={switcherStyles.devDot} />
    </View>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={switcherStyles.scroll}>
      {PREVIEW_STATES.map((state) => {
        const isActive = activeState === state.key;
        return (
          <TouchableOpacity
            key={state.key}
            activeOpacity={0.7}
            onPress={() => onSwitch(state.key)}
            style={[
              switcherStyles.chip,
              {
                borderColor: isActive
                  ? `${state.color}60`
                  : 'rgba(255,255,255,0.08)',
                backgroundColor: isActive
                  ? `${state.color}15`
                  : 'rgba(255,255,255,0.03)',
              },
            ]}>
            <View
              style={[
                switcherStyles.chipDot,
                {
                  backgroundColor: isActive
                    ? state.color
                    : Colors.zinc[600],
                },
              ]}
            />
            <Text
              style={[
                switcherStyles.chipText,
                { color: isActive ? state.color : Colors.zinc[500] },
              ]}>
              {state.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
);

const switcherStyles = StyleSheet.create({
  wrapper:  { marginBottom: vs(6) },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    marginBottom: vs(8),
  },
  devDot: {
    width: s(3),
    height: s(3),
    borderRadius: s(2),
    backgroundColor: '#EF4444',
  },
  devLabel: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(6.5),
    color: '#EF4444',
    letterSpacing: s(2),
    textTransform: 'uppercase',
  },
  scroll:   { gap: s(8), paddingRight: s(4) },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
    paddingHorizontal: s(10),
    paddingVertical: vs(5),
    borderRadius: ms(8),
    borderWidth: 1,
  },
  chipDot:  { width: s(5), height: s(5), borderRadius: s(3) },
  chipText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(7.5),
    letterSpacing: s(1),
  },
});

/* ═══════════════════════════════════════════════════════════════ */
/* CUSTOM HEADER                                                   */
/* ═══════════════════════════════════════════════════════════════ */
const DashboardHeader = ({ navigation, userName }) => {
  const initials = userName
    ? userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <View style={headerStyles.wrapper}>
      <View style={headerStyles.bottomBorder} />
      <View style={headerStyles.inner}>
        <View style={headerStyles.left}>
          <View style={headerStyles.logoBox}>
            <View style={headerStyles.logoGlowRing} />
            <Image
              source={gymlogoimg}
              style={headerStyles.logoImg}
              resizeMode="contain"
            />
          </View>
          <View style={headerStyles.gymTextWrap}>
            <Text style={headerStyles.gymName}>GYMVERSE</Text>
            <View style={headerStyles.gymSubRow}>
              <View style={headerStyles.gymSubDot} />
              <Text style={headerStyles.gymSub}>FITNESS CENTER</Text>
              <View style={headerStyles.gymSubDot} />
            </View>
          </View>
        </View>
        <View style={headerStyles.right}>
          <TouchableOpacity
            style={headerStyles.iconBtn}
            activeOpacity={0.7}
            onPress={() => {}}>
            <HugeiconsIcon
              icon={Notification01Icon}
              size={ms(17)}
              color={Colors.zinc[300]}
            />
            <View style={headerStyles.notifDot} />
          </TouchableOpacity>
          <TouchableOpacity
            style={headerStyles.avatarBtn}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('UserProfile')}>
            <LinearGradient
              colors={[`${GOLD}50`, `${GOLD}18`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={headerStyles.avatarGrad}>
              <Text style={headerStyles.avatarText}>{initials}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const LOGO_SIZE = ms(46);

const headerStyles = StyleSheet.create({
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
    position: 'relative',
  },
  logoGlowRing: { position: 'absolute' },
  logoImg:      { width: '310%', height: '170%', top: vs(2) },
  gymTextWrap:  { gap: vs(1) },
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
/* TRAINER ROLE CARD                                               */
/* ═══════════════════════════════════════════════════════════════ */
const TrainerRoleCard = ({ assignedAt }) => {
  const daysSince = assignedAt
    ? Math.max(
        0,
        Math.floor(
          (Date.now() - new Date(assignedAt).getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : 0;

  return (
    <View style={heroCard.card}>
      <View style={heroCard.bgIcon}>
        <HugeiconsIcon
          icon={Dumbbell01Icon}
          size={ms(100)}
          color={`${TRAINER_COLOR}08`}
          strokeWidth={0.5}
        />
      </View>
      <View style={heroCard.logoWrap}>
        <Image source={gymlogoimg} style={heroCard.logoImg} />
      </View>
      <LinearGradient
        colors={[`${TRAINER_COLOR}10`, `${TRAINER_COLOR}04`, 'transparent']}
        style={StyleSheet.absoluteFill}
      />

      <View style={heroCard.content}>
        <View style={heroCard.topRow}>
          <View style={{ flex: 1 }}>
            <Pill
              icon={Activity01Icon}
              label="Active Role"
              color={TRAINER_COLOR}
            />
            <Text style={[heroCard.title, { color: TRAINER_COLOR }]}>
              GYM{'\n'}TRAINER
            </Text>
            <Pill
              icon={Dumbbell01Icon}
              label="Personal Trainer"
              color={TRAINER_COLOR}
            />
          </View>
          <View
            style={[heroCard.daysBox, { borderColor: `${TRAINER_COLOR}30` }]}>
            <Text style={[heroCard.daysNum, { color: TRAINER_COLOR }]}>
              {daysSince}
            </Text>
            <Text style={heroCard.daysLbl}>Days{'\n'}Active</Text>
          </View>
        </View>

        <View
          style={[
            heroCard.divider,
            { backgroundColor: `${TRAINER_COLOR}25` },
          ]}
        />

        <View style={heroCard.footer}>
          <Text style={heroCard.footerDate}>
            Joined{' '}
            {assignedAt
              ? new Date(assignedAt).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Today'}
          </Text>
          <View style={heroCard.activeChip}>
            <View
              style={{
                width: s(5),
                height: s(5),
                borderRadius: s(3),
                backgroundColor: TRAINER_COLOR,
              }}
            />
            <Text
              style={[heroCard.activeChipText, { color: TRAINER_COLOR }]}>
              ACTIVE
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/* TRIAL MEMBERSHIP CARD                                           */
/* ═══════════════════════════════════════════════════════════════ */
const TrialMembershipCard = ({ daysLeft, onViewPlans }) => {
  const used = 7 - daysLeft;
  const pct  = (used / 7) * 100;

  return (
    <View style={[heroCard.card, { borderColor: 'rgba(255,255,255,0.08)' }]}>
      <View style={heroCard.bgIcon}>
        <HugeiconsIcon
          icon={Shield01Icon}
          size={ms(100)}
          color="rgba(255,255,255,0.04)"
          strokeWidth={0.5}
        />
      </View>
      <View style={heroCard.logoWrap}>
        <Image source={gymlogoimg} style={heroCard.logoImg} />
      </View>

      <View style={heroCard.content}>
        <View style={heroCard.topRow}>
          <View style={{ flex: 1 }}>
            <Pill icon={Clock01Icon} label="Trial Period" color={BLUE} />
            <Text style={[heroCard.title, { color: '#60A5FA' }]}>
              TRIAL{'\n'}ACCESS
            </Text>
            <Pill
              label="Limited Features"
              color={Colors.zinc[500]}
              bg="rgba(255,255,255,0.06)"
            />
          </View>
          <View
            style={[
              heroCard.daysBox,
              { borderColor: 'rgba(255,255,255,0.12)' },
            ]}>
            <Text style={[heroCard.daysNum, { color: Colors.white }]}>
              {daysLeft}
            </Text>
            <Text style={heroCard.daysLbl}>Days{'\n'}Left</Text>
          </View>
        </View>

        <View style={heroCard.progressWrap}>
          <View
            style={[
              heroCard.progressFill,
              { width: `${pct}%`, backgroundColor: BLUE },
            ]}
          />
        </View>
        <Text style={heroCard.progressLabel}>{used} of 7 days used</Text>

        <View
          style={[
            heroCard.divider,
            { backgroundColor: 'rgba(255,255,255,0.08)' },
          ]}
        />

        <View style={heroCard.footer}>
          <Text style={heroCard.footerDate}>
            Trial ends in {daysLeft} days
          </Text>
          <TouchableOpacity
            style={[
              heroCard.footerBtn,
              {
                borderColor: 'rgba(255,255,255,0.12)',
                backgroundColor: 'rgba(255,255,255,0.05)',
              },
            ]}
            onPress={onViewPlans}
            activeOpacity={0.8}>
            <Text style={[heroCard.footerBtnText, { color: GOLD }]}>
              View Plans
            </Text>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={ms(11)}
              color={GOLD}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/* REQUEST PENDING CARD                                            */
/* plan name keeps accent color; duration/amount → white          */
/* background pure black, logo watermark                          */
/* ═══════════════════════════════════════════════════════════════ */
const RequestPendingCard = ({ request }) => {
  const wType       = request?.workoutType || 'cardio_weights';
  const template    =
    request?.planTemplate ||
    DEFAULT_TEMPLATES[wType] ||
    DEFAULT_TEMPLATES['cardio_weights'];
  const accentColor = template?.iconColor || GOLD;
  const textColor   = template?.textColor || GOLD;
  const wLabel      =
    DEFAULT_TEMPLATES[wType]?.workoutLabel || 'Cardio + Weight Lifting';
  const WorkoutIcon =
    wType === 'cardio_weights' ? Activity01Icon : Dumbbell01Icon;

  return (
    <View
      style={[
        heroCard.card,
        { borderColor: `${accentColor}30`, backgroundColor: '#000000' },
      ]}>
      {/* NO tinted gradient — pure black */}
      <View style={heroCard.bgIcon}>
        <HugeiconsIcon
          icon={Shield01Icon}
          size={ms(100)}
          color="rgba(255,255,255,0.04)"
          strokeWidth={0.5}
        />
      </View>
      <View style={heroCard.logoWrap}>
        <Image source={gymlogoimg} style={heroCard.logoImg} />
      </View>

      <View style={heroCard.content}>
        <View style={heroCard.topRow}>
          <View style={{ flex: 1 }}>
            <Pill
              icon={Loading03Icon}
              label="Approval Pending"
              color={accentColor}
            />
            {/* plan name keeps accent/text color */}
            <Text
              style={[heroCard.title, { color: textColor }]}
              numberOfLines={2}>
              {request?.planName || 'Plan'}
            </Text>
            <Pill icon={WorkoutIcon} label={wLabel} color={accentColor} />
          </View>
          <View
            style={[heroCard.daysBox, { borderColor: 'rgba(255,255,255,0.12)' }]}>
            <HugeiconsIcon
              icon={Time01Icon}
              size={ms(28)}
              color={accentColor}
            />
            <Text
              style={[
                heroCard.daysLbl,
                { color: Colors.zinc[500], marginTop: vs(4) },
              ]}>
              Pending
            </Text>
          </View>
        </View>

        {/* info row — values WHITE */}
        <View
          style={[
            heroCard.infoRow,
            { borderColor: 'rgba(255,255,255,0.08)' },
          ]}>
          <View style={heroCard.infoCell}>
            <Text style={heroCard.infoLabel}>Duration</Text>
            {/* ← WHITE */}
            <Text style={[heroCard.infoValue, { color: Colors.white }]}>
              {request?.planDuration || '-'}
            </Text>
          </View>
          <View
            style={[
              heroCard.infoDivider,
              { backgroundColor: 'rgba(255,255,255,0.08)' },
            ]}
          />
          <View style={heroCard.infoCell}>
            <Text style={heroCard.infoLabel}>Amount</Text>
            {/* ← WHITE */}
            <Text style={[heroCard.infoValue, { color: Colors.white }]}>
              ${request?.planPrice || '0'}
            </Text>
          </View>
        </View>

        <View
          style={[
            heroCard.divider,
            { backgroundColor: 'rgba(255,255,255,0.08)' },
          ]}
        />

        <View style={heroCard.footer}>
          <HugeiconsIcon
            icon={InformationCircleIcon}
            size={ms(13)}
            color={Colors.zinc[500]}
          />
          <Text style={heroCard.pendingNote}>
            You'll be notified once approved
          </Text>
        </View>
      </View>
    </View>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/* ELITE / LEGENDARY MEMBERSHIP CARD                               */
/* title + badge pill keep accent color                           */
/* daysLeft number → white, progress bar → white/zinc             */
/* ═══════════════════════════════════════════════════════════════ */
const EliteMembershipCard = ({ membershipData, onExtend }) => {
  const wType       = membershipData?.workoutType || 'cardio_weights';
  const template    =
    membershipData?.template ||
    DEFAULT_TEMPLATES[wType] ||
    DEFAULT_TEMPLATES['cardio_weights'];
  const accentColor = template.iconColor;
  const textColor   = template.textColor;   // used for title text only
  const wLabel      =
    DEFAULT_TEMPLATES[wType]?.workoutLabel || 'Cardio + Weight Lifting';
  const WorkoutIcon =
    wType === 'cardio_weights' ? Activity01Icon : Dumbbell01Icon;
  const daysLeft  = membershipData?.daysLeft || 0;
  const totalDays = 30;
  const pct       = Math.min(100, ((totalDays - daysLeft) / totalDays) * 100);

  return (
    <View
      style={[
        heroCard.card,
        { borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#000000' },
      ]}>
      {/* NO tinted gradient — pure black */}
      <View style={heroCard.bgIcon}>
        <HugeiconsIcon
          icon={Shield01Icon}
          size={ms(100)}
          color="rgba(255,255,255,0.04)"
          strokeWidth={0.5}
        />
      </View>
      <View style={heroCard.logoWrap}>
        <Image source={gymlogoimg} style={heroCard.logoImg} />
      </View>

      <View style={heroCard.content}>
        <View style={heroCard.topRow}>
          <View style={{ flex: 1 }}>
            {/* badge pill keeps accent color */}
            <Pill label={template.badge} color={accentColor} />
            {/* title keeps accent/text color */}
            <Text style={[heroCard.title, { color: textColor }]}>
              {(membershipData?.tierName || 'PREMIUM').toUpperCase()}
            </Text>
            <Pill icon={WorkoutIcon} label={wLabel} color={accentColor} />
          </View>
          {/* days circle — number WHITE */}
          <View
            style={[
              heroCard.daysBox,
              { borderColor: 'rgba(255,255,255,0.12)' },
            ]}>
            <Text style={[heroCard.daysNum, { color: Colors.white }]}>
              {daysLeft}
            </Text>
            <Text style={heroCard.daysLbl}>Days{'\n'}Left</Text>
          </View>
        </View>

        {/* progress bar → white/zinc, NOT accent color */}
        <View style={heroCard.progressWrap}>
          <View
            style={[
              heroCard.progressFill,
              {
                width: `${pct}%`,
                backgroundColor: 'rgba(255,255,255,0.55)',
              },
            ]}
          />
        </View>
        <Text style={heroCard.progressLabel}>
          {Math.round(pct)}% of plan used
        </Text>

        <View
          style={[
            heroCard.divider,
            { backgroundColor: 'rgba(255,255,255,0.08)' },
          ]}
        />

        <View style={heroCard.footer}>
          <Text style={heroCard.footerDate}>
            Exp. {membershipData?.expiryDate || '-'}
          </Text>
          <TouchableOpacity
            style={[
              heroCard.footerBtn,
              {
                borderColor: 'rgba(255,255,255,0.12)',
                backgroundColor: 'rgba(255,255,255,0.05)',
              },
            ]}
            onPress={onExtend}
            activeOpacity={0.8}>
            <Text
              style={[heroCard.footerBtnText, { color: Colors.zinc[300] }]}>
              Extend
            </Text>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={ms(11)}
              color={Colors.zinc[300]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/* HERO CARD SHARED STYLES                                         */
/* ═══════════════════════════════════════════════════════════════ */
const heroCard = StyleSheet.create({
  card: {
    borderRadius: ms(16),
    padding: s(16),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000000',
  },
  bgIcon: {
    position: 'absolute',
    top: -ms(10),
    right: -ms(15),
    opacity: 0.8,
  },
  logoWrap: {
    position: 'absolute',
    top: scale(10),
    right: 0,
    bottom: 0,
    left: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImg: {
    width: moderateScale(300),
    height: moderateScale(150),
    opacity: 0.1,
  },
  content: { zIndex: 1 },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: vs(12),
  },
  title: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(15),
    letterSpacing: s(3.5),
    marginVertical: vs(6),
    lineHeight: rf(22),
  },

  daysBox: {
    width: ms(68),
    height: ms(68),
    borderRadius: ms(34),
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysNum: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(20),
    lineHeight: rf(24),
  },
  daysLbl: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(7),
    color: Colors.zinc[500],
    letterSpacing: s(1),
    textTransform: 'uppercase',
    textAlign: 'center',
  },

  progressWrap: {
    height: vs(4),
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: ms(2),
    overflow: 'hidden',
    marginBottom: vs(4),
  },
  progressFill:  { height: '100%', borderRadius: ms(2) },
  progressLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(8),
    color: Colors.zinc[600],
    letterSpacing: s(1),
    marginBottom: vs(2),
  },

  divider: { height: vs(1), marginVertical: vs(12) },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerDate: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9),
    color: Colors.zinc[500],
  },
  footerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    paddingHorizontal: s(14),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    borderWidth: 1,
  },
  footerBtnText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(9),
    letterSpacing: s(1.2),
  },
  activeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: `${GOLD}35`,
    backgroundColor: `${GOLD}10`,
  },
  activeChipText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(8),
    letterSpacing: s(1.5),
  },

  infoRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: ms(10),
    overflow: 'hidden',
    marginBottom: vs(4),
  },
  infoCell: {
    flex: 1,
    paddingVertical: vs(10),
    paddingHorizontal: s(12),
    alignItems: 'center',
  },
  infoDivider: { width: 1 },
  infoLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(7),
    color: Colors.zinc[600],
    letterSpacing: s(1.2),
    textTransform: 'uppercase',
    marginBottom: vs(3),
  },
  infoValue: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(12),
    color: Colors.white,   // default white — overridden per card
  },
  pendingNote: {
    flex: 1,
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(8),
    color: Colors.zinc[400],
    marginLeft: s(6),
  },
});

/* ═══════════════════════════════════════════════════════════════ */
/* PLAN CARD                                                       */
/* ═══════════════════════════════════════════════════════════════ */
const PlanCard = ({ plan, onSelect, submitting }) => {
  const wType       = plan?.workoutType || 'cardio_weights';
  const template    =
    plan?.template ||
    DEFAULT_TEMPLATES[wType] ||
    DEFAULT_TEMPLATES['cardio_weights'];
  const accentColor = template.iconColor;
  const textColor   = template.textColor;
  const wLabel      =
    DEFAULT_TEMPLATES[wType]?.workoutLabel || 'Cardio + Weight Lifting';
  const WorkoutIcon =
    wType === 'cardio_weights' ? Activity01Icon : Dumbbell01Icon;
  const finalPrice  =
    plan?.hasOffer && plan?.finalPrice
      ? plan.finalPrice.toFixed(2)
      : plan?.price || '0';
  if (!plan) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onSelect(plan)}
      disabled={submitting}
      style={submitting && { opacity: 0.5 }}>
      <View style={[planStyles.card, { borderColor: `${accentColor}30` }]}>
        <LinearGradient
          colors={[`${accentColor}12`, `${accentColor}04`, 'transparent']}
          style={StyleSheet.absoluteFill}
        />
        <View style={planStyles.bgIcon}>
          <HugeiconsIcon
            icon={Shield01Icon}
            size={ms(90)}
            color={`${accentColor}10`}
            strokeWidth={0.5}
          />
        </View>
        <View style={planStyles.header}>
          <View style={{ flex: 1, marginRight: s(12) }}>
            <Pill label={template?.badge || 'PLAN'} color={accentColor} />
            <Text
              style={[
                planStyles.planName,
                { color: textColor, marginTop: vs(8) },
              ]}
              numberOfLines={2}>
              {plan.name || 'Plan'}
            </Text>
          </View>
          <View style={planStyles.priceBox}>
            {plan.hasOffer && plan.offer && (
              <Text style={planStyles.originalPrice}>${plan.price}</Text>
            )}
            <Text style={[planStyles.price, { color: textColor }]}>
              ${finalPrice}
            </Text>
            <Text style={planStyles.duration}>
              /{plan.duration || 'month'}
            </Text>
          </View>
        </View>
        <Pill icon={WorkoutIcon} label={wLabel} color={accentColor} />
        <View
          style={[
            planStyles.divider,
            { backgroundColor: `${accentColor}20`, marginVertical: vs(12) },
          ]}
        />
        {Array.isArray(plan.features) && plan.features.length > 0 && (
          <View style={planStyles.features}>
            {plan.features.slice(0, 4).map((f, i) => (
              <View key={i} style={planStyles.featureRow}>
                <View
                  style={[planStyles.featureDot, { backgroundColor: GREEN }]}
                />
                <Text style={planStyles.featureText}>{f}</Text>
              </View>
            ))}
          </View>
        )}
        {plan.hasOffer && plan.offer?.text && (
          <View style={planStyles.offerBadge}>
            <HugeiconsIcon icon={Flash01Icon} size={ms(11)} color={GOLD} />
            <Text style={planStyles.offerText}>{plan.offer.text}</Text>
          </View>
        )}
        <TouchableOpacity
          style={[
            planStyles.cta,
            {
              borderColor: `${accentColor}40`,
              backgroundColor: `${accentColor}10`,
            },
          ]}
          onPress={() => onSelect(plan)}
          disabled={submitting}
          activeOpacity={0.8}>
          {submitting ? (
            <ActivityIndicator size="small" color={accentColor} />
          ) : (
            <>
              <Text style={[planStyles.ctaText, { color: textColor }]}>
                REQUEST MEMBERSHIP
              </Text>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={ms(13)}
                color={textColor}
              />
            </>
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/* MEMBERSHIP PLANS MODAL                                          */
/* ═══════════════════════════════════════════════════════════════ */
const MembershipPlansModal = ({
  visible,
  onClose,
  plans,
  onSelectPlan,
  loading,
  submitting,
}) => {
  const safePlans = Array.isArray(plans) ? plans.filter(Boolean) : [];
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <Pressable style={modalStyles.overlay} onPress={onClose}>
        <Pressable style={modalStyles.sheet} onPress={() => {}}>
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType={Platform.OS === 'ios' ? 'ultraThinMaterialDark' : 'dark'}
            blurAmount={25}
            reducedTransparencyFallbackColor="rgba(8,8,12,0.98)"
          />
          <View
            style={{ height: 2, backgroundColor: `${GOLD}40`, borderRadius: 1 }}
          />
          <View style={modalStyles.handle} />
          <View style={modalStyles.headerRow}>
            <View>
              <Text style={modalStyles.title}>MEMBERSHIP PLANS</Text>
              <Text style={modalStyles.subtitle}>
                {safePlans.length > 0
                  ? 'Choose your fitness journey'
                  : 'No plans available'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={modalStyles.closeX}>
              <Text style={modalStyles.closeXText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={modalStyles.list}
            bounces={false}>
            {loading ? (
              <View style={modalStyles.center}>
                <ActivityIndicator size="large" color={GOLD} />
                <Text style={modalStyles.loadingText}>Loading Plans...</Text>
              </View>
            ) : safePlans.length === 0 ? (
              <View style={modalStyles.center}>
                <Text style={{ fontSize: rf(30), marginBottom: vs(12) }}>
                  📦
                </Text>
                <Text style={modalStyles.emptyTitle}>No Plans Available</Text>
                <Text style={modalStyles.emptySubtitle}>Check back later</Text>
              </View>
            ) : (
              safePlans.map((plan, i) => (
                <PlanCard
                  key={plan?.id || i}
                  plan={plan}
                  onSelect={onSelectPlan}
                  submitting={submitting}
                />
              ))
            )}
          </ScrollView>
          <TouchableOpacity style={modalStyles.closeBtn} onPress={onClose}>
            <Text style={modalStyles.closeBtnText}>CLOSE</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/* MAIN SCREEN                                                     */
/* ═══════════════════════════════════════════════════════════════ */
const UserDashboardScreen = ({ navigation }) => {
  const route = useRoute();
  const { getActivePlans, loading: plansLoading, refreshPlans } = usePlans();
  const {
    submitRequest,
    getUserRequestStatus,
    getMemberById,
    refreshData,
  } = useMembershipRequests();
  const { isTrainer, getTrainer } = useTrainer();

  const currentUser = {
    id:    'user_001',
    name:  'Abdullah Ahmed',
    phone: '+92 300 1234567',
    email: 'abdullah@example.com',
    photo: null,
  };

  const [activePlans,    setActivePlans]    = useState([]);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [submitting,     setSubmitting]     = useState(false);
  const [previewState,   setPreviewState]   = useState('live');

  const approvedMember    = getMemberById(currentUser.id);
  const pendingRequest    = getUserRequestStatus(currentUser.id);
  const hasPending        = pendingRequest?.status === 'pending';
  const isMemberTrainer   = isTrainer(currentUser.id);
  const trainerData       = getTrainer(currentUser.id);
  const isTrialMember     = !approvedMember || !approvedMember.isActive;
  const isPendingApproval = hasPending;
  const trialData         = { daysLeft: 5 };

  const pendingTemplate =
    pendingRequest?.planTemplate ||
    DEFAULT_TEMPLATES[pendingRequest?.workoutType] ||
    DEFAULT_TEMPLATES['cardio_weights'];
  const pendingAccentColor = pendingTemplate?.iconColor || GOLD;

  const safeLoadPlans = useCallback(() => {
    try {
      const plans = getActivePlans();
      setActivePlans(Array.isArray(plans) ? plans.filter(Boolean) : []);
    } catch {
      setActivePlans([]);
    }
  }, [getActivePlans]);

  useEffect(() => { safeLoadPlans(); }, [safeLoadPlans]);

  useEffect(() => {
    if (showPlansModal) {
      refreshPlans()
        .then(() => safeLoadPlans())
        .catch(() => setActivePlans([]));
    }
  }, [showPlansModal, safeLoadPlans, refreshPlans]);

  useEffect(() => {
    if (route.params?.openPlans) {
      setShowPlansModal(true);
      navigation.setParams({ openPlans: false });
    }
  }, [route.params?.openPlans, navigation]);

  // Auto-redirect disabled for dev preview
  // useEffect(() => {
  //   if (isMemberTrainer) navigation.replace('TrainerDashboard');
  // }, [isMemberTrainer, navigation]);

  const handleSelectPlan = async (plan) => {
    if (!plan) return;
    if (hasPending) {
      Alert.alert('Request Pending', 'You already have a pending request.');
      setShowPlansModal(false);
      return;
    }
    const price = plan.hasOffer ? plan.finalPrice?.toFixed(2) : plan.price;
    Alert.alert(
      'Confirm Request',
      `Request "${plan.name}" for $${price}/${plan.duration || 'month'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit Request',
          onPress: async () => {
            setSubmitting(true);
            try {
              await submitRequest(currentUser, plan);
              setShowPlansModal(false);
              Alert.alert('Request Submitted! 🎉', 'Sent to admin for approval.');
              await refreshData();
            } catch {
              Alert.alert('Error', 'Failed to submit request.');
            } finally {
              setSubmitting(false);
            }
          },
        },
      ],
    );
  };

  /* ─── CARD RENDERING BY PREVIEW STATE ─── */
  const renderMembershipCard = () => {
    if (previewState !== 'live') {
      switch (previewState) {
        case 'trial':
          return (
            <TrialMembershipCard
              daysLeft={MOCK_DATA.trial.daysLeft}
              onViewPlans={() => setShowPlansModal(true)}
            />
          );
        case 'pending_elite':
          return <RequestPendingCard request={MOCK_DATA.pending_elite} />;
        case 'pending_legendary':
          return <RequestPendingCard request={MOCK_DATA.pending_legendary} />;
        case 'elite':
          return (
            <EliteMembershipCard
              membershipData={MOCK_DATA.elite}
              onExtend={() => setShowPlansModal(true)}
            />
          );
        case 'legendary':
          return (
            <EliteMembershipCard
              membershipData={MOCK_DATA.legendary}
              onExtend={() => setShowPlansModal(true)}
            />
          );
        case 'trainer':
          return (
            <TrainerRoleCard assignedAt={MOCK_DATA.trainer.assignedAt} />
          );
        default:
          break;
      }
    }

    // LIVE — real data
    if (isMemberTrainer)
      return <TrainerRoleCard assignedAt={trainerData?.assignedAt} />;
    if (isPendingApproval)
      return <RequestPendingCard request={pendingRequest} />;
    if (isTrialMember)
      return (
        <TrialMembershipCard
          daysLeft={trialData.daysLeft}
          onViewPlans={() => setShowPlansModal(true)}
        />
      );
    return (
      <EliteMembershipCard
        membershipData={{
          tierName:   approvedMember?.tierName,
          daysLeft:   approvedMember?.daysLeft,
          expiryDate: approvedMember?.expiryDate
            ? new Date(approvedMember.expiryDate).toLocaleDateString('en-US', {
                day: 'numeric', month: 'short', year: 'numeric',
              })
            : '-',
          workoutType: approvedMember?.workoutType,
          template:    approvedMember?.template,
        }}
        onExtend={() => setShowPlansModal(true)}
      />
    );
  };

  const renderWelcomeBadge = () => {
    if (previewState !== 'live') {
      switch (previewState) {
        case 'trial':
          return <Pill icon={Clock01Icon}    label="Trial Member"      color={BLUE}          />;
        case 'pending_elite':
          return <Pill icon={Loading03Icon}  label="Approval Pending"  color={GOLD}          />;
        case 'pending_legendary':
          return <Pill icon={Loading03Icon}  label="Approval Pending"  color={PURPLE}        />;
        case 'elite':
          return <Pill icon={Medal02Icon}    label="Elite Member"      color={GOLD}          />;
        case 'legendary':
          return <Pill icon={Medal02Icon}    label="Legendary Member"  color={PURPLE}        />;
        case 'trainer':
          return <Pill icon={Dumbbell01Icon} label="Gym Trainer"       color={TRAINER_COLOR} />;
        default:
          break;
      }
    }
    if (isMemberTrainer)
      return <Pill icon={Dumbbell01Icon} label="Gym Trainer"      color={TRAINER_COLOR} />;
    if (isPendingApproval)
      return <Pill icon={Loading03Icon}  label="Approval Pending" color={pendingAccentColor} />;
    if (isTrialMember)
      return <Pill icon={Clock01Icon}    label="Trial Member"     color={BLUE} />;
    return (
      <Pill
        icon={Medal02Icon}
        label={approvedMember?.tierName || 'Premium Member'}
        color={approvedMember?.template?.iconColor || GOLD}
      />
    );
  };

  const showTrialCTA = () => {
    if (previewState === 'trial') return true;
    if (previewState !== 'live')  return false;
    return isTrialMember && !isPendingApproval && !isMemberTrainer;
  };

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
          <DashboardHeader
            navigation={navigation}
            userName={currentUser.name}
          />

          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={dashStyles.scroll}>

            {/* Welcome */}
            <View style={dashStyles.welcome}>
              <Text style={dashStyles.welcomeLabel}>Welcome back</Text>
              <Text style={dashStyles.welcomeName}>{currentUser.name}</Text>
              <View style={{ marginTop: vs(8) }}>
                {renderWelcomeBadge()}
              </View>
            </View>

            {/* DEV Preview Switcher */}
            <PreviewSwitcher
              activeState={previewState}
              onSwitch={setPreviewState}
            />

            {/* Membership card */}
            {renderMembershipCard()}

            {/* TEST BUTTON */}
            <TouchableOpacity
              onPress={() => navigation.navigate('TrainerDashboard')}
              style={dashStyles.testBtn}
              activeOpacity={0.8}>
              <LinearGradient
                colors={[`${TRAINER_COLOR}20`, `${TRAINER_COLOR}08`]}
                style={dashStyles.testBtnGrad}>
                <HugeiconsIcon
                  icon={Dumbbell01Icon}
                  size={ms(15)}
                  color={TRAINER_COLOR}
                />
                <Text
                  style={[dashStyles.testBtnText, { color: TRAINER_COLOR }]}>
                  TEST — Trainer Dashboard
                </Text>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={ms(13)}
                  color={TRAINER_COLOR}
                />
              </LinearGradient>
            </TouchableOpacity>

            {/* Facility Status */}
            <View style={facilityStyles.card}>
              <View style={facilityStyles.logoWatermark}>
                <Image source={gymlogoimg} style={facilityStyles.logoImg} />
              </View>
              <View style={facilityStyles.headerRow}>
                <View style={facilityStyles.headerLeft}>
                  <HugeiconsIcon
                    icon={Activity01Icon}
                    size={ms(14)}
                    color={GOLD}
                  />
                  <Text style={facilityStyles.headerTitle}>
                    FACILITY STATUS
                  </Text>
                </View>
                <View
                  style={[
                    facilityStyles.livePill,
                    { borderColor: `${GREEN}40` },
                  ]}>
                  <View
                    style={[
                      facilityStyles.liveDot,
                      { backgroundColor: GREEN },
                    ]}
                  />
                  <Text style={[facilityStyles.liveText, { color: GREEN }]}>
                    LIVE
                  </Text>
                </View>
              </View>
              <View style={facilityStyles.chipRow}>
                <StatChip
                  value={membersInside}
                  label="Inside"
                  color={Colors.zinc[200]}
                />
                <View style={{ width: s(12) }} />
                <StatChip
                  value={capacity - membersInside}
                  label="Available"
                  color={Colors.zinc[400]}
                />
              </View>
              <View style={facilityStyles.barWrap}>
                <View
                  style={[
                    facilityStyles.barFill,
                    {
                      width: `${occupancyPct}%`,
                      backgroundColor: Colors.zinc[400],
                    },
                  ]}
                />
              </View>
              <View style={facilityStyles.divider} />
              <View style={facilityStyles.prediction}>
                <View style={facilityStyles.predLeft}>
                  <View style={facilityStyles.clockBox}>
                    <HugeiconsIcon
                      icon={Clock01Icon}
                      size={ms(13)}
                      color={Colors.zinc[400]}
                    />
                  </View>
                  <View>
                    <Text style={facilityStyles.predLabel}>
                      ESTIMATED IN 15 MIN
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'baseline',
                        gap: s(3),
                      }}>
                      <Text style={facilityStyles.predNumber}>4</Text>
                      <Text style={facilityStyles.predSuffix}>
                        {' '}members will leave
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={facilityStyles.trendChip}>
                  <Text style={facilityStyles.trendText}>−4</Text>
                </View>
              </View>
              <View
                style={[facilityStyles.divider, { marginTop: vs(12) }]}
              />
              <View style={facilityStyles.expectedRow}>
                <Text style={facilityStyles.expectedLabel}>
                  Expected count in 15m
                </Text>
                <Text
                  style={[
                    facilityStyles.expectedValue,
                    { color: 'white' },
                  ]}>
                  38 members
                </Text>
              </View>
            </View>

            {/* Check In / Out */}
            <View style={dashStyles.actionRow}>
              <TouchableOpacity
                style={[
                  dashStyles.actionCard,
                  { borderColor: `${GREEN}30` },
                ]}
                activeOpacity={0.8}>
                <LinearGradient
                  colors={[`${GREEN}15`, `${GREEN}05`, 'transparent']}
                  style={StyleSheet.absoluteFill}
                />
                <View
                  style={[
                    dashStyles.actionIconWrap,
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
                <Text style={[dashStyles.actionLabel, { color: GREEN }]}>
                  CHECK IN
                </Text>
                <Text style={dashStyles.actionSub}>Tap to scan</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  dashStyles.actionCard,
                  { borderColor: 'rgba(255,255,255,0.08)' },
                ]}
                activeOpacity={0.8}>
                <View
                  style={[
                    dashStyles.actionIconWrap,
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
                  style={[
                    dashStyles.actionLabel,
                    { color: Colors.zinc[500] },
                  ]}>
                  CHECK OUT
                </Text>
                <Text style={dashStyles.actionSub}>Mark departure</Text>
              </TouchableOpacity>
            </View>

            {/* Trial CTA banner */}
            {showTrialCTA() && (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setShowPlansModal(true)}>
                <LinearGradient
                  colors={[`${GOLD}14`, `${GOLD}05`, 'transparent']}
                  style={dashStyles.ctaBanner}>
                  <View style={dashStyles.ctaLeft}>
                    <View style={dashStyles.ctaIconBox}>
                      <HugeiconsIcon
                        icon={GiftIcon}
                        size={ms(18)}
                        color={GOLD}
                      />
                    </View>
                    <View>
                      <Text style={dashStyles.ctaTitle}>Upgrade Today!</Text>
                      <Text style={dashStyles.ctaSub}>
                        {activePlans.length > 0
                          ? `${activePlans.length} plans available`
                          : 'Check available plans'}
                      </Text>
                    </View>
                  </View>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={ms(18)}
                    color={GOLD}
                  />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </ScrollView>

          <BottomNav
            activeTab="home"
            onTabChange={(tab) => {
              if (tab === 'profile')    navigation.navigate('UserProfile');
              if (tab === 'membership') setShowPlansModal(true);
              if (tab === 'friends')    navigation.navigate('MembersFriend');
            }}
          />

          <MembershipPlansModal
            visible={showPlansModal}
            onClose={() => setShowPlansModal(false)}
            plans={activePlans}
            onSelectPlan={handleSelectPlan}
            loading={plansLoading}
            submitting={submitting}
          />
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/* PLAN CARD STYLES                                                */
/* ═══════════════════════════════════════════════════════════════ */
const planStyles = StyleSheet.create({
  card: {
    padding: s(18),
    borderRadius: ms(16),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#0a0a0a',
  },
  bgIcon: { position: 'absolute', right: -s(15), top: -s(10), opacity: 0.8 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: vs(10),
  },
  planName: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(14),
    letterSpacing: s(2),
  },
  priceBox:      { alignItems: 'flex-end' },
  originalPrice: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9),
    color: Colors.zinc[600],
    textDecorationLine: 'line-through',
  },
  price:    { fontFamily: Fonts.orbitron.bold, fontSize: rf(22) },
  duration: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9),
    color: Colors.zinc[500],
  },
  divider:    { height: 1 },
  features:   { gap: vs(7), marginBottom: vs(12) },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: s(10) },
  featureDot: { width: s(5), height: s(5), borderRadius: s(3) },
  featureText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9),
    color: Colors.zinc[300],
    flex: 1,
  },
  offerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    backgroundColor: `${GOLD}12`,
    paddingHorizontal: s(10),
    paddingVertical: vs(6),
    borderRadius: ms(8),
    marginBottom: vs(14),
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: `${GOLD}20`,
  },
  offerText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(8),
    color: GOLD,
    letterSpacing: s(1),
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(8),
    paddingVertical: vs(14),
    borderRadius: ms(12),
    borderWidth: 1,
  },
  ctaText: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: rf(9),
    letterSpacing: s(1.8),
  },
});

/* ═══════════════════════════════════════════════════════════════ */
/* MODAL STYLES                                                    */
/* ═══════════════════════════════════════════════════════════════ */
const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '92%',
    borderTopLeftRadius: ms(28),
    borderTopRightRadius: ms(28),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#000000',
  },
  handle: {
    width: s(40),
    height: vs(4),
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: ms(2),
    alignSelf: 'center',
    marginTop: vs(14),
    marginBottom: vs(4),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: s(22),
    paddingTop: vs(12),
    paddingBottom: vs(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  title: {
    fontFamily: Fonts.orbitron.bold,
    fontSize: rf(14),
    color: Colors.white,
    letterSpacing: s(3),
    marginBottom: vs(3),
  },
  subtitle: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9),
    color: Colors.zinc[500],
    letterSpacing: s(1),
  },
  closeX: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  closeXText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(11),
    color: Colors.zinc[400],
  },
  list: {
    paddingHorizontal: s(20),
    paddingVertical: vs(16),
    gap: vs(14),
  },
  center: {
    paddingVertical: vs(60),
    alignItems: 'center',
    gap: vs(12),
  },
  loadingText: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(10),
    color: Colors.zinc[500],
    letterSpacing: s(1),
  },
  emptyTitle: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: rf(13),
    color: Colors.zinc[400],
  },
  emptySubtitle: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(10),
    color: Colors.zinc[600],
    textAlign: 'center',
  },
  closeBtn: {
    alignItems: 'center',
    paddingVertical: vs(18),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  closeBtnText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(10),
    color: Colors.zinc[500],
    letterSpacing: s(2.5),
  },
});

/* ═══════════════════════════════════════════════════════════════ */
/* DASHBOARD STYLES                                                */
/* ═══════════════════════════════════════════════════════════════ */
const dashStyles = StyleSheet.create({
  scroll: {
    paddingHorizontal: s(20),
    gap: vs(14),
    paddingBottom: vs(110),
  },
  welcome:      { paddingTop: vs(4), paddingBottom: vs(4) },
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
  testBtn: {
    borderRadius: ms(14),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: `${TRAINER_COLOR}30`,
  },
  testBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(10),
    paddingVertical: vs(14),
    paddingHorizontal: s(20),
  },
  testBtnText: {
    fontFamily: Fonts.rajdhani.bold,
    fontSize: rf(10),
    letterSpacing: s(0.5),
    flex: 1,
  },
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
  ctaBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: s(18),
    borderRadius: ms(16),
    borderWidth: 1,
    borderColor: `${GOLD}20`,
  },
  ctaLeft:   { flexDirection: 'row', alignItems: 'center', gap: s(14) },
  ctaIconBox: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(12),
    backgroundColor: `${GOLD}15`,
    borderWidth: 1,
    borderColor: `${GOLD}25`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaTitle: {
    fontFamily: Fonts.orbitron.semiBold,
    fontSize: rf(11),
    color: GOLD,
    letterSpacing: s(1),
    marginBottom: vs(2),
  },
  ctaSub: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9),
    color: Colors.zinc[500],
  },
});

/* ═══════════════════════════════════════════════════════════════ */
/* FACILITY CARD STYLES                                            */
/* ═══════════════════════════════════════════════════════════════ */
const facilityStyles = StyleSheet.create({
  card: {
    borderRadius: ms(16),
    padding: s(16),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000000',
  },
  logoWatermark: {
    position: 'absolute',
    top: 0, right: 0, bottom: 0, left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImg: {
    width: moderateScale(280),
    height: moderateScale(140),
    opacity: 0.05,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(14),
  },
  headerLeft:  { flexDirection: 'row', alignItems: 'center', gap: s(8) },
  headerTitle: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(8),
    color: GOLD,
    letterSpacing: s(2.5),
    textTransform: 'uppercase',
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(20),
    borderWidth: 1,
  },
  liveDot:  { width: s(6), height: s(6), borderRadius: s(3) },
  liveText: {
    fontFamily: Fonts.rajdhani.semiBold,
    fontSize: rf(7),
    letterSpacing: s(1.5),
  },
  chipRow: { flexDirection: 'row', marginBottom: vs(14) },
  barWrap: {
    height: vs(5),
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: ms(3),
    overflow: 'hidden',
    marginBottom: vs(4),
  },
  barFill: { height: '100%', borderRadius: ms(3) },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginTop: vs(14),
  },
  prediction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: vs(14),
  },
  predLeft:  { flexDirection: 'row', alignItems: 'center', gap: s(10) },
  clockBox:  {
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
    marginTop: vs(12),
  },
  expectedLabel: {
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(9),
    color: Colors.zinc[500],
  },
  expectedValue: {
    fontFamily: Fonts.orbitron.regular,
    fontSize: rf(11),
    fontWeight: '600',
  },
});

export default UserDashboardScreen;