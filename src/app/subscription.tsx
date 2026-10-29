import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FontFamily, Layout, Radius, Space } from '@/constants/theme';
import { useReadingTheme } from '@/hooks/use-reading-theme';
import { tapFeedback } from '@/lib/haptics';
import { useSettings } from '@/store/settings';

type PlanId = 'monthly' | 'yearly';

type Plan = {
  id: PlanId;
  title: string;
  price: string;
  perMonth: string;
  duration: string;
  ribbon?: string;
};

/**
 * Prices are placeholders. Real ones come from the store product catalogue so
 * each region sees its own currency — never hardcode these in the shipped app.
 */
const PLANS: Plan[] = [
  {
    id: 'monthly',
    title: 'Monthly Premium',
    price: '₹99.00',
    perMonth: '₹99.00 / month',
    duration: '1 month (auto-renewable)',
  },
  {
    id: 'yearly',
    title: 'Annual Premium',
    price: '₹899.00',
    perMonth: '₹74.92 / month',
    duration: '12 months (auto-renewable)',
    ribbon: 'SAVE 24%',
  },
];

const BENEFITS = [
  {
    title: 'Ad-free reading',
    body: 'No interruptions between you and the verse.',
  },
  {
    title: 'Every translation',
    body: 'Switch between public-domain editions verse by verse.',
  },
  {
    title: 'Offline chapters',
    body: 'Download any chapter and read without a connection.',
  },
];

export default function SubscriptionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useReadingTheme();
  const setPremium = useSettings((state) => state.setPremium);

  const [selected, setSelected] = useState<PlanId>('monthly');
  const [showDetails, setShowDetails] = useState(false);
  const plan = PLANS.find((entry) => entry.id === selected) ?? PLANS[0];

  const close = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/settings');
  };

  const onSubscribe = () => {
    tapFeedback();
    const buttons: {
      text: string;
      style?: 'cancel' | 'destructive' | 'default';
      onPress?: () => void;
    }[] = [{ text: 'OK', style: 'cancel' }];

    if (__DEV__) {
      buttons.push({
        text: 'Preview Premium',
        onPress: () => setPremium(true),
      });
    }

    Alert.alert(
      'Premium is coming soon',
      "Subscriptions aren't available yet, and nothing will be charged. Thank you for your interest — we'll let you know when Premium launches.",
      buttons
    );
  };

  const onRestore = () =>
    Alert.alert(
      'Restore purchases',
      'There are no purchases to restore yet. Subscriptions are coming soon.'
    );

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={10}
          onPress={close}
          style={({ pressed }) => [
            styles.closeButton,
            { borderColor: colors.border, opacity: pressed ? 0.6 : 1 },
          ]}>
          <Ionicons name="close" size={18} color={colors.text} />
        </Pressable>

        <Text style={[styles.topTitle, { color: colors.text }]}>Subscription</Text>

        <Pressable accessibilityRole="button" hitSlop={10} onPress={onRestore}>
          <Text style={[styles.restore, { color: colors.accent }]}>Restore</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, Space.lg) + Space.xxl },
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={[styles.badge, { borderColor: `${colors.gold}88` }]}>
          <Ionicons name="star" size={12} color={colors.gold} />
          <Text style={[styles.badgeText, { color: colors.gold }]}>UNLOCK PREMIUM</Text>
        </View>

        <Text style={[styles.headline, { color: colors.text }]}>Read the Gita{'\n'}Ad-Free</Text>
        <Text style={[styles.lede, { color: colors.textSecondary }]}>
          An uninterrupted reading journey with the study tools that make the verses stick.
        </Text>

        {/* Benefits */}
        <View
          style={[
            styles.benefits,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}>
          {BENEFITS.map((benefit) => (
            <View key={benefit.title} style={styles.benefitRow}>
              <View style={[styles.check, { backgroundColor: colors.accent }]}>
                <Ionicons name="checkmark" size={13} color={colors.accentText} />
              </View>
              <View style={styles.benefitText}>
                <Text style={[styles.benefitTitle, { color: colors.text }]}>{benefit.title}</Text>
                <Text style={[styles.benefitBody, { color: colors.textSecondary }]}>
                  {benefit.body}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Plans */}
        {PLANS.map((entry) => {
          const active = entry.id === selected;
          return (
            <Pressable
              key={entry.id}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              onPress={() => {
                tapFeedback();
                setSelected(entry.id);
              }}
              style={({ pressed }) => [
                styles.plan,
                {
                  backgroundColor: active ? colors.accentSoft : colors.surface,
                  borderColor: active ? colors.accent : colors.border,
                  borderWidth: active ? 1.4 : StyleSheet.hairlineWidth,
                  opacity: pressed ? 0.75 : 1,
                },
              ]}>
              {entry.ribbon ? (
                <View style={[styles.ribbon, { backgroundColor: colors.accent }]}>
                  <Text style={[styles.ribbonText, { color: colors.accentText }]}>
                    {entry.ribbon}
                  </Text>
                </View>
              ) : null}

              <View style={styles.planText}>
                <Text style={[styles.planTitle, { color: active ? colors.accent : colors.text }]}>
                  {entry.title}
                </Text>
                <Text style={[styles.planSubtitle, { color: colors.textSecondary }]}>
                  {entry.duration}
                </Text>
              </View>

              <View style={styles.planPrice}>
                <Text style={[styles.priceValue, { color: active ? colors.accent : colors.text }]}>
                  {entry.price}
                </Text>
                <Text style={[styles.priceUnit, { color: colors.textTertiary }]}>
                  {entry.perMonth}
                </Text>
              </View>
            </Pressable>
          );
        })}

        {/* Detail table, collapsed by default — store receipts are reference
            material, not a selling point. */}
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: showDetails }}
          onPress={() => {
            tapFeedback();
            setShowDetails((open) => !open);
          }}
          style={({ pressed }) => [styles.detailsToggle, { opacity: pressed ? 0.6 : 1 }]}>
          <Text style={[styles.detailsLabel, { color: colors.textSecondary }]}>Plan details</Text>
          <Ionicons
            name={showDetails ? 'chevron-up' : 'chevron-down'}
            size={15}
            color={colors.textTertiary}
          />
        </Pressable>

        {showDetails ? (
          <View
            style={[styles.table, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Row label="Subscription Title" value={plan.title} />
            <Row label="Duration / Length" value={plan.duration} />
            <Row label="Price" value={plan.price} />
            <Row label="Price per Unit" value={plan.perMonth} accent />
          </View>
        ) : null}

        {/* CTA */}
        <Pressable
          accessibilityRole="button"
          onPress={onSubscribe}
          style={({ pressed }) => [
            styles.cta,
            { backgroundColor: colors.accent, opacity: pressed ? 0.8 : 1 },
          ]}>
          <Ionicons name="star" size={17} color={colors.accentText} />
          <Text style={[styles.ctaLabel, { color: colors.accentText }]}>
            Subscribe for {plan.price} /{plan.id === 'yearly' ? 'year' : 'month'}
          </Text>
        </Pressable>

        <Pressable accessibilityRole="button" onPress={onRestore} style={styles.restoreLink}>
          <Text style={[styles.restoreLinkLabel, { color: colors.textSecondary }]}>
            Restore Purchases
          </Text>
        </Pressable>

        <View style={[styles.divider, { backgroundColor: colors.hairline }]} />

        <Text style={[styles.legal, { color: colors.textSecondary }]}>
          By subscribing, you agree to our{' '}
          <Text style={{ color: colors.accent }}>Terms of Use</Text> and{' '}
          <Text style={{ color: colors.accent }}>Privacy Policy</Text>.
        </Text>
        <Text style={[styles.legal, styles.legalMuted, { color: colors.textTertiary }]}>
          Payment will be charged to your store account upon confirmation of purchase. Subscription
          automatically renews unless cancelled before the end of the current period. Manage or
          cancel anytime in your account settings.
        </Text>
      </ScrollView>
    </View>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  const { colors } = useReadingTheme();
  return (
    <View style={styles.tableRow}>
      <Text style={[styles.tableLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.tableValue, { color: accent ? colors.accent : colors.text }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.gutter,
    paddingVertical: Space.md,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: { fontFamily: FontFamily.uiBold, fontSize: 17, letterSpacing: -0.3 },
  restore: { fontFamily: FontFamily.uiSemibold, fontSize: 14.5 },
  content: { paddingHorizontal: Layout.gutter, paddingTop: Space.lg, gap: Space.md },
  badge: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Space.md,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  badgeText: { fontFamily: FontFamily.uiBold, fontSize: 10.5, letterSpacing: 1.1 },
  headline: {
    fontFamily: FontFamily.uiBold,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -1.2,
    textAlign: 'center',
    marginTop: Space.sm,
  },
  lede: {
    fontFamily: FontFamily.ui,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: Space.sm,
  },
  benefits: {
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Space.lg,
    gap: Space.lg,
    marginTop: Space.sm,
  },
  benefitRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Space.md },
  check: {
    width: 22,
    height: 22,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  benefitText: { flex: 1, gap: 2 },
  benefitTitle: { fontFamily: FontFamily.uiSemibold, fontSize: 15 },
  benefitBody: { fontFamily: FontFamily.ui, fontSize: 13, lineHeight: 19 },
  plan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
    padding: Space.lg,
    borderRadius: Radius.xl,
  },
  ribbon: {
    position: 'absolute',
    top: -9,
    right: Space.lg,
    paddingHorizontal: Space.sm,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  ribbonText: { fontFamily: FontFamily.uiBold, fontSize: 9.5, letterSpacing: 0.7 },
  planText: { flex: 1, gap: 3 },
  planTitle: { fontFamily: FontFamily.uiBold, fontSize: 17, letterSpacing: -0.3 },
  planSubtitle: { fontFamily: FontFamily.ui, fontSize: 12.5 },
  planPrice: { alignItems: 'flex-end', gap: 2 },
  priceValue: { fontFamily: FontFamily.uiBold, fontSize: 20, letterSpacing: -0.5 },
  priceUnit: { fontFamily: FontFamily.ui, fontSize: 11.5 },
  table: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: Space.xs,
    paddingHorizontal: Space.lg,
  },
  detailsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Space.xs,
  },
  detailsLabel: { fontFamily: FontFamily.uiMedium, fontSize: 13 },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    gap: Space.md,
  },
  tableLabel: { fontFamily: FontFamily.ui, fontSize: 13.5 },
  tableValue: {
    fontFamily: FontFamily.uiSemibold,
    fontSize: 13.5,
    textAlign: 'right',
    flexShrink: 1,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space.sm,
    height: 54,
    borderRadius: Radius.md,
    marginTop: Space.sm,
  },
  ctaLabel: { fontFamily: FontFamily.uiBold, fontSize: 16, letterSpacing: -0.2 },
  restoreLink: { alignItems: 'center', paddingVertical: Space.md },
  restoreLinkLabel: { fontFamily: FontFamily.uiSemibold, fontSize: 14 },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: Space.sm },
  legal: {
    fontFamily: FontFamily.ui,
    fontSize: 12.5,
    lineHeight: 19,
    textAlign: 'center',
  },
  legalMuted: { fontSize: 11.5, lineHeight: 17 },
});
