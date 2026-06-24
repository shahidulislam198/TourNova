import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const DURATIONS = [
  { days: 3, label: "Weekend", icon: "sunny-outline" },
  { days: 5, label: "Short Trip", icon: "airplane-outline" },
  { days: 7, label: "1 Week", icon: "calendar-outline" },
  { days: 10, label: "10 Days", icon: "calendar-number-outline" },
  { days: 14, label: "2 Weeks", icon: "globe-outline" },
];

const BUDGETS = [
  {
    value: "budget",
    label: "Budget",
    icon: "wallet-outline",
    desc: "Hostels & street food",
  },
  {
    value: "moderate",
    label: "Moderate",
    icon: "card-outline",
    desc: "Comfortable stays",
  },
  {
    value: "luxury",
    label: "Luxury",
    icon: "diamond-outline",
    desc: "5-star experience",
  },
];

const INTERESTS = [
  { icon: "camera-outline", label: "Sightseeing", color: "#6366f1" },
  { icon: "restaurant-outline", label: "Food & Drink", color: "#ef4444" },
  { icon: "footsteps-outline", label: "Walking Tours", color: "#22c55e" },
  { icon: "boat-outline", label: "Cruises", color: "#06b6d4" },
  { icon: "musical-notes-outline", label: "Nightlife", color: "#f59e0b" },
  { icon: "library-outline", label: "Museums", color: "#8b5cf6" },
  { icon: "cart-outline", label: "Shopping", color: "#ec4899" },
  { icon: "fitness-outline", label: "Adventure", color: "#f97316" },
];

export default function PlanScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    destination?: string;
    style?: string;
  }>();

  const [destination, setDestination] = useState(params.destination || "");
  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState("moderate");
  const [selected, setSelected] = useState<string[]>([]);
  const [travelers, setTravelers] = useState("1");

  const toggle = (label: string) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label],
    );
  };

  const handleGenerate = () => {
    if (!destination.trim()) return;
    router.push({
      pathname: "/result",
      params: {
        destination: destination.trim(),
        days: days.toString(),
        budget,
        interests: selected.join(","),
        travelers,
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Plan Your Trip</Text>
          <Text style={s.headerSub}>Tell us what you're looking for ✨</Text>
        </View>

        <View style={s.body}>
          {/* ── Destination ── */}
          <View style={s.card}>
            <View style={s.cardHead}>
              <View style={[s.cardIcon, { backgroundColor: "#EEF2FF" }]}>
                <Ionicons name="location" size={18} color="#6366f1" />
              </View>
              <Text style={s.cardTitle}>Destination</Text>
            </View>
            <View style={s.inputRow}>
              <Ionicons name="search-outline" size={17} color="#94a3b8" />
              <TextInput
                style={s.input}
                placeholder="Enter city or country"
                placeholderTextColor="#94a3b8"
                value={destination}
                onChangeText={setDestination}
              />
            </View>
          </View>

          {/* ── Duration ── */}
          <View style={s.card}>
            <View style={s.cardHead}>
              <View style={[s.cardIcon, { backgroundColor: "#FFF7ED" }]}>
                <Ionicons name="time-outline" size={18} color="#f59e0b" />
              </View>
              <Text style={s.cardTitle}>Duration</Text>
              <Text style={s.cardValue}>{days} days</Text>
            </View>
            <View style={s.pillRow}>
              {DURATIONS.map((d) => (
                <TouchableOpacity
                  key={d.days}
                  style={[s.pill, days === d.days && s.pillActive]}
                  onPress={() => setDays(d.days)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={d.icon as any}
                    size={16}
                    color={days === d.days ? "#fff" : "#94a3b8"}
                  />
                  <Text
                    style={[s.pillLabel, days === d.days && s.pillLabelActive]}
                  >
                    {d.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── Budget ── */}
          <View style={s.card}>
            <View style={s.cardHead}>
              <View style={[s.cardIcon, { backgroundColor: "#F0FDF4" }]}>
                <Ionicons name="cash-outline" size={18} color="#22c55e" />
              </View>
              <Text style={s.cardTitle}>Budget</Text>
            </View>
            {BUDGETS.map((b) => {
              const active = budget === b.value;
              return (
                <TouchableOpacity
                  key={b.value}
                  style={[s.budgetRow, active && s.budgetRowActive]}
                  onPress={() => setBudget(b.value)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[s.budgetIcon, active ? s.budgetIconActive : {}]}
                  >
                    <Ionicons
                      name={b.icon as any}
                      size={18}
                      color={active ? "#fff" : "#94a3b8"}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text
                      style={[s.budgetLabel, active && s.budgetLabelActive]}
                    >
                      {b.label}
                    </Text>
                    <Text style={s.budgetDesc}>{b.desc}</Text>
                  </View>
                  {active && (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color="#22c55e"
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── Interests ── */}
          <View style={s.card}>
            <View style={s.cardHead}>
              <View style={[s.cardIcon, { backgroundColor: "#F5F3FF" }]}>
                <Ionicons name="heart-outline" size={18} color="#8b5cf6" />
              </View>
              <Text style={s.cardTitle}>Interests</Text>
              <Text style={s.cardValue}>{selected.length} selected</Text>
            </View>
            <View style={s.chipGrid}>
              {INTERESTS.map((int) => {
                const isSel = selected.includes(int.label);
                return (
                  <TouchableOpacity
                    key={int.label}
                    style={[
                      s.chip,
                      isSel && {
                        backgroundColor: int.color + "18",
                        borderColor: int.color + "40",
                      },
                    ]}
                    onPress={() => toggle(int.label)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={int.icon as any}
                      size={15}
                      color={isSel ? int.color : "#94a3b8"}
                    />
                    <Text style={[s.chipLabel, isSel && { color: int.color }]}>
                      {int.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── Travelers ── */}
          <View style={s.card}>
            <View style={s.cardHead}>
              <View style={[s.cardIcon, { backgroundColor: "#FFF1F2" }]}>
                <Ionicons name="people-outline" size={18} color="#f43f5e" />
              </View>
              <Text style={s.cardTitle}>Travelers</Text>
            </View>
            <View style={s.stepperRow}>
              <TouchableOpacity
                style={s.stepperBtn}
                onPress={() =>
                  setTravelers((p) => Math.max(1, parseInt(p) - 1).toString())
                }
              >
                <Ionicons name="remove" size={18} color="#4b5563" />
              </TouchableOpacity>
              <Text style={s.stepperValue}>{travelers}</Text>
              <TouchableOpacity
                style={[s.stepperBtn, { backgroundColor: "#EEF2FF" }]}
                onPress={() =>
                  setTravelers((p) => Math.min(20, parseInt(p) + 1).toString())
                }
              >
                <Ionicons name="add" size={18} color="#6366f1" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Button */}
      <View style={s.bottom}>
        <TouchableOpacity
          style={[s.genBtn, !destination.trim() && s.genBtnDisabled]}
          onPress={handleGenerate}
          disabled={!destination.trim()}
          activeOpacity={0.85}
        >
          <Ionicons
            name="sparkles"
            size={20}
            color={destination.trim() ? "#fff" : "#9ca3af"}
          />
          <Text
            style={[s.genBtnText, !destination.trim() && s.genBtnTextDisabled]}
          >
            Generate AI Travel Plan
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F0F4F8" },
  scroll: { paddingBottom: 20 },

  /* Header */
  header: {
    backgroundColor: "#4F46E5",
    paddingTop: 56,
    paddingBottom: 26,
    paddingHorizontal: 22,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  headerSub: { color: "#C7D2FE", fontSize: 14, marginTop: 4 },

  body: { paddingHorizontal: 22, marginTop: 20 },

  /* Card */
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHead: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  cardIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    flex: 1,
  },
  cardValue: { fontSize: 13, color: "#94A3B8", fontWeight: "500" },

  /* Input */
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  input: { flex: 1, marginLeft: 8, fontSize: 15, color: "#1E293B" },

  /* Pills */
  pillRow: { flexDirection: "row", gap: 7 },
  pill: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  pillActive: { backgroundColor: "#4F46E5", borderColor: "#4F46E5" },
  pillLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 3,
  },
  pillLabelActive: { color: "#fff" },

  /* Budget */
  budgetRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 8,
  },
  budgetRowActive: { backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" },
  budgetIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  budgetIconActive: { backgroundColor: "#22C55E" },
  budgetLabel: { fontSize: 14, fontWeight: "600", color: "#334155" },
  budgetLabelActive: { color: "#166534" },
  budgetDesc: { fontSize: 11, color: "#94A3B8", marginTop: 1 },

  /* Chips */
  chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  chipLabel: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },

  /* Stepper */
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  stepperBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  stepperValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E293B",
    minWidth: 30,
    textAlign: "center",
  },

  /* Bottom */
  bottom: {
    paddingHorizontal: 22,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  genBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#4F46E5",
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  genBtnDisabled: { backgroundColor: "#E2E8F0", shadowOpacity: 0 },
  genBtnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  genBtnTextDisabled: { color: "#94A3B8" },
});
