import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { saveTrip } from "../src/services/databaseService";
import { generateTripPlan } from "../src/services/geminiService";
import { TripDay } from "../src/types/trip";

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    destination: string;
    days: string;
    budget: string;
    interests: string;
    travelers: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<TripDay[]>([]);
  const [saved, setSaved] = useState(false);
  const [source, setSource] = useState<"ai" | "mock">("mock");

  useEffect(() => {
    generatePlan();
  }, []);

  const generatePlan = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await generateTripPlan({
        destination: params.destination || "",
        days: parseInt(params.days || "5"),
        budget: params.budget || "moderate",
        interests: params.interests || "",
        travelers: parseInt(params.travelers || "1"),
      });

      setPlan(result.plan);
      setSource(result.source);

      // Save to SQLite
      await saveTrip({
        destination: params.destination || "",
        days: parseInt(params.days || "5"),
        budget: params.budget || "moderate",
        interests: params.interests || "",
        travelers: parseInt(params.travelers || "1"),
        plan: result.plan,
      });
      setSaved(true);
    } catch (err: any) {
      setError(err.message || "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  const dayColors = [
    "#4F46E5",
    "#059669",
    "#D97706",
    "#DC2626",
    "#7C3AED",
    "#0891B2",
    "#DB2777",
  ];

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.headerTitle} numberOfLines={1}>
          {params.destination}
        </Text>
        <Text style={s.headerSub}>
          {params.days} days · {params.budget} · {params.travelers} traveler
          {parseInt(params.travelers || "1") > 1 ? "s" : ""}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {/* Loading */}
        {loading && (
          <View style={s.loadingContainer}>
            <View style={s.loadingCard}>
              <ActivityIndicator size="large" color="#4F46E5" />
              <Text style={s.loadingTitle}>Crafting your itinerary</Text>
              <Text style={s.loadingSub}>
                Our AI is building the perfect {params.days}-day trip to{" "}
                {params.destination}...
              </Text>
              <View style={s.loadingDots}>
                {[0, 1, 2].map((i) => (
                  <View
                    key={i}
                    style={[s.dot, { backgroundColor: dayColors[i] }]}
                  />
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Error */}
        {error && (
          <View style={s.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
            <Text style={s.errorTitle}>Something went wrong</Text>
            <Text style={s.errorText}>{error}</Text>
            <TouchableOpacity style={s.retryBtn} onPress={generatePlan}>
              <Text style={s.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Plan */}
        {!loading && !error && plan.length > 0 && (
          <View style={s.planContainer}>
            {/* Saved badge */}
            {saved && (
              <View style={s.badgeRow}>
                <View style={s.savedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#059669" />
                  <Text style={s.savedText}>Saved to your plans</Text>
                </View>
                {source === "mock" && (
                  <View style={s.mockBadge}>
                    <Ionicons
                      name="phone-landscape-outline"
                      size={14}
                      color="#D97706"
                    />
                    <Text style={s.mockText}>Offline mode</Text>
                  </View>
                )}
              </View>
            )}

            {/* Day cards */}
            {plan.map((day, idx) => (
              <View key={day.day} style={s.dayCard}>
                {/* Day header */}
                <View
                  style={[
                    s.dayHeader,
                    { backgroundColor: dayColors[idx % dayColors.length] },
                  ]}
                >
                  <View>
                    <Text style={s.dayLabel}>DAY {day.day}</Text>
                    <Text style={s.dayTitle}>{day.title}</Text>
                  </View>
                  <View style={s.dayNumber}>
                    <Text style={s.dayNumberText}>{day.day}</Text>
                  </View>
                </View>

                {/* Activities */}
                <View style={s.dayBody}>
                  <View style={s.section}>
                    <View style={s.sectionHead}>
                      <Ionicons
                        name="footsteps-outline"
                        size={16}
                        color={dayColors[idx % dayColors.length]}
                      />
                      <Text style={s.sectionTitle}>Activities</Text>
                    </View>
                    {day.activities.map((act, i) => (
                      <View key={i} style={s.listItem}>
                        <View
                          style={[
                            s.bullet,
                            {
                              backgroundColor:
                                dayColors[idx % dayColors.length],
                            },
                          ]}
                        />
                        <Text style={s.listText}>{act}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Meals */}
                  <View style={s.section}>
                    <View style={s.sectionHead}>
                      <Ionicons
                        name="restaurant-outline"
                        size={16}
                        color={dayColors[idx % dayColors.length]}
                      />
                      <Text style={s.sectionTitle}>Meals</Text>
                    </View>
                    {day.meals.map((meal, i) => (
                      <View key={i} style={s.listItem}>
                        <View
                          style={[
                            s.bullet,
                            {
                              backgroundColor:
                                dayColors[idx % dayColors.length] + "80",
                            },
                          ]}
                        />
                        <Text style={s.listText}>{meal}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Tips */}
                  {day.tips && (
                    <View style={s.tipBox}>
                      <Ionicons name="bulb-outline" size={16} color="#D97706" />
                      <Text style={s.tipText}>{day.tips}</Text>
                    </View>
                  )}

                  {/* Budget Breakdown */}
                  {day.budget && day.budget.length > 0 && (
                    <View style={s.budgetSection}>
                      <View style={s.budgetHeader}>
                        <View style={s.budgetHeaderLeft}>
                          <Ionicons
                            name="wallet-outline"
                            size={18}
                            color="#059669"
                          />
                          <Text style={s.budgetTitle}>Day Budget</Text>
                        </View>
                        {day.totalDayBudget && (
                          <View style={s.budgetTotalBadge}>
                            <Text style={s.budgetTotalText}>
                              ৳{day.totalDayBudget.toLocaleString()}
                            </Text>
                          </View>
                        )}
                      </View>
                      <View style={s.budgetGrid}>
                        {day.budget.map((item, bi) => {
                          const pct = Math.min(
                            100,
                            Math.round(
                              (item.amount / (day.totalDayBudget || 1)) * 100,
                            ),
                          );
                          const color = dayColors[bi % dayColors.length];
                          const icons: Record<string, string> = {
                            Accommodation: "bed-outline",
                            "Food & Drinks": "restaurant-outline",
                            Activities: "footsteps-outline",
                            Transport: "bus-outline",
                          };
                          return (
                            <View key={bi} style={s.budgetItem}>
                              <View style={s.budgetItemTop}>
                                <View
                                  style={[
                                    s.budgetIcon,
                                    { backgroundColor: color + "18" },
                                  ]}
                                >
                                  <Ionicons
                                    name={
                                      (icons[item.category] as any) ||
                                      "cash-outline"
                                    }
                                    size={14}
                                    color={color}
                                  />
                                </View>
                                <Text style={s.budgetItemCat}>
                                  {item.category}
                                </Text>
                                <Text style={[s.budgetItemAmt, { color }]}>
                                  ৳{item.amount.toLocaleString()}
                                </Text>
                              </View>
                              <View style={s.budgetBar}>
                                <View
                                  style={[
                                    s.budgetFill,
                                    {
                                      width: `${pct}%`,
                                      backgroundColor: color,
                                    },
                                  ]}
                                />
                              </View>
                              <Text style={s.budgetPct}>{pct}%</Text>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  )}
                </View>
              </View>
            ))}

            {/* Total Trip Budget */}
            {plan.some((d) => d.totalDayBudget) && (
              <View style={s.totalBudgetCard}>
                <View style={s.totalBudgetRow}>
                  <Ionicons
                    name="calculator-outline"
                    size={20}
                    color="#4F46E5"
                  />
                  <Text style={s.totalBudgetLabel}>Total Trip Budget</Text>
                  <Text style={s.totalBudgetValue}>
                    ৳
                    {plan
                      .reduce((sum, d) => sum + (d.totalDayBudget || 0), 0)
                      .toLocaleString()}
                  </Text>
                </View>
                <View style={s.totalBudgetMeta}>
                  <Text style={s.totalBudgetMetaText}>
                    {parseInt(params.days || "5")} days ·{" "}
                    {parseInt(params.travelers || "1")} traveler
                    {parseInt(params.travelers || "1") > 1 ? "s" : ""} ·{" "}
                    {params.budget} level
                  </Text>
                  <Text style={s.totalBudgetPerDay}>
                    ~৳
                    {Math.round(
                      plan.reduce(
                        (sum, d) => sum + (d.totalDayBudget || 0),
                        0,
                      ) / parseInt(params.days || "5"),
                    ).toLocaleString()}
                    /day
                  </Text>
                </View>
              </View>
            )}

            {/* Bottom actions */}
            <View style={s.actions}>
              <TouchableOpacity
                style={s.actionBtn}
                onPress={() => router.push("/(tabs)/recent")}
              >
                <Ionicons name="bookmark-outline" size={18} color="#4F46E5" />
                <Text style={s.actionText}>View Saved Plans</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.actionBtn, s.actionPrimary]}
                onPress={() => router.back()}
              >
                <Ionicons name="add-circle-outline" size={18} color="#fff" />
                <Text style={[s.actionText, { color: "#fff" }]}>New Plan</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F0F4F8" },
  scroll: { paddingBottom: 40 },

  /* Header */
  header: {
    backgroundColor: "#4F46E5",
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  headerSub: { color: "#C7D2FE", fontSize: 13, marginTop: 3 },

  /* Loading */
  loadingContainer: { paddingHorizontal: 22, paddingTop: 40 },
  loadingCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 20,
  },
  loadingSub: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  loadingDots: { flexDirection: "row", gap: 8, marginTop: 20 },
  dot: { width: 10, height: 10, borderRadius: 5, opacity: 0.6 },

  /* Error */
  errorContainer: {
    paddingHorizontal: 22,
    paddingTop: 60,
    alignItems: "center",
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 12,
  },
  errorText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginTop: 6,
  },
  retryBtn: {
    marginTop: 20,
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  /* Plan */
  planContainer: { paddingHorizontal: 22, paddingTop: 20 },
  badgeRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  savedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  savedText: { color: "#059669", fontSize: 13, fontWeight: "600" },
  mockBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  mockText: { color: "#D97706", fontSize: 13, fontWeight: "600" },

  /* Day Card */
  dayCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
  },
  dayLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  dayTitle: { color: "#fff", fontSize: 17, fontWeight: "700", marginTop: 3 },
  dayNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  dayNumberText: { color: "#fff", fontSize: 16, fontWeight: "800" },

  dayBody: { padding: 18 },
  section: { marginBottom: 16 },
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#334155" },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
    paddingLeft: 4,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    marginRight: 10,
  },
  listText: { flex: 1, fontSize: 14, color: "#475569", lineHeight: 20 },

  tipBox: {
    flexDirection: "row",
    backgroundColor: "#FFFBEB",
    borderRadius: 10,
    padding: 12,
    gap: 8,
    marginTop: 4,
  },
  tipText: { flex: 1, fontSize: 13, color: "#92400E", lineHeight: 18 },

  /* Budget */
  budgetSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  budgetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  budgetHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  budgetTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  budgetTotalBadge: {
    backgroundColor: "#ECFDF5",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  budgetTotalText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#059669",
  },
  budgetGrid: {
    gap: 12,
  },
  budgetItem: {
    gap: 6,
  },
  budgetItemTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  budgetIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  budgetItemCat: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  budgetItemAmt: {
    fontSize: 14,
    fontWeight: "700",
  },
  budgetBar: {
    height: 6,
    backgroundColor: "#F1F5F9",
    borderRadius: 3,
    overflow: "hidden",
    marginLeft: 36,
    marginRight: 36,
  },
  budgetFill: {
    height: "100%",
    borderRadius: 3,
  },
  budgetPct: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "600",
    textAlign: "right",
    marginTop: 2,
  },

  /* Total Budget */
  totalBudgetCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    marginTop: 4,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#EEF2FF",
  },
  totalBudgetRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  totalBudgetLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  totalBudgetValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#4F46E5",
  },
  totalBudgetMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  totalBudgetMetaText: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },
  totalBudgetPerDay: {
    fontSize: 12,
    color: "#6366F1",
    fontWeight: "600",
  },

  /* Actions */
  actions: { flexDirection: "row", gap: 10, marginTop: 8 },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#EEF2FF",
    borderRadius: 14,
    paddingVertical: 14,
  },
  actionPrimary: { backgroundColor: "#4F46E5" },
  actionText: { color: "#4F46E5", fontWeight: "700", fontSize: 14 },
});
