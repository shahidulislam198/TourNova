import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_W = width * 0.42;

const DESTINATIONS = [
  { name: "Tokyo", country: "Japan", emoji: "🗾", color: "#ef4444" },
  { name: "Paris", country: "France", emoji: "🗼", color: "#3b82f6" },
  { name: "Bali", country: "Indonesia", emoji: "🏝️", color: "#22c55e" },
  { name: "New York", country: "USA", emoji: "🗽", color: "#f59e0b" },
  { name: "Dubai", country: "UAE", emoji: "🏙️", color: "#8b5cf6" },
  { name: "Rome", country: "Italy", emoji: "🏛️", color: "#ec4899" },
];

const STYLES = [
  { icon: "business-outline", label: "City", color: "#6366f1", bg: "#EEF2FF" },
  { icon: "leaf-outline", label: "Nature", color: "#22c55e", bg: "#F0FDF4" },
  { icon: "umbrella-outline", label: "Beach", color: "#06b6d4", bg: "#ECFEFF" },
  {
    icon: "trail-sign-outline",
    label: "Adventure",
    color: "#f59e0b",
    bg: "#FFF7ED",
  },
  {
    icon: "restaurant-outline",
    label: "Food",
    color: "#ef4444",
    bg: "#FEF2F2",
  },
  { icon: "moon-outline", label: "Relax", color: "#8b5cf6", bg: "#F5F3FF" },
];

export default function HomeScreen() {
  const router = useRouter();
  const [destination, setDestination] = useState("");

  const goPlan = (dest?: string, style?: string) => {
    router.push({ pathname: "/plan", params: { destination: dest, style } });
  };

  return (
    <View style={s.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {/* ═══════ HERO ═══════ */}
        <View style={s.hero}>
          <View style={s.heroRow}>
            <View>
              <Text style={s.greeting}>Good morning 👋</Text>
              <Text style={s.heroTitle}>Where to next?</Text>
            </View>
            <View style={s.avatar}>
              <Ionicons name="person-outline" size={20} color="#fff" />
            </View>
          </View>

          <View style={s.searchBox}>
            <Ionicons
              name="search"
              size={18}
              color="#6366f1"
              style={{ marginLeft: 14 }}
            />
            <TextInput
              style={s.searchInput}
              placeholder="Search destinations..."
              placeholderTextColor="#94a3b8"
              value={destination}
              onChangeText={setDestination}
              onSubmitEditing={() => goPlan(destination)}
              returnKeyType="search"
            />
            <TouchableOpacity
              style={s.searchBtn}
              onPress={() => goPlan(destination)}
              activeOpacity={0.85}
            >
              <Ionicons name="sparkles" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ═══════ POPULAR ═══════ */}
        <View style={s.section}>
          <View style={s.sectionHead}>
            <Text style={s.sectionTitle}>Popular Destinations</Text>
            <TouchableOpacity>
              <Text style={s.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.destScroll}
          >
            {DESTINATIONS.map((d) => (
              <TouchableOpacity
                key={d.name}
                style={s.destCard}
                onPress={() => goPlan(d.name)}
                activeOpacity={0.85}
              >
                <View style={[s.destImg, { backgroundColor: d.color + "18" }]}>
                  <Text style={s.destEmoji}>{d.emoji}</Text>
                </View>
                <Text style={s.destName}>{d.name}</Text>
                <Text style={s.destCountry}>{d.country}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ═══════ STYLES ═══════ */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Travel Style</Text>
          <View style={s.styleGrid}>
            {STYLES.map((st) => (
              <TouchableOpacity
                key={st.label}
                style={[s.styleChip, { backgroundColor: st.bg }]}
                onPress={() => goPlan(undefined, st.label)}
                activeOpacity={0.8}
              >
                <Ionicons name={st.icon as any} size={16} color={st.color} />
                <Text style={[s.styleLabel, { color: st.color }]}>
                  {st.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ═══════ INSPIRATION ═══════ */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Travel Inspiration</Text>

          <TouchableOpacity
            style={[s.inspo, { backgroundColor: "#F59E0B" }]}
            onPress={() => goPlan(undefined, "Adventure")}
            activeOpacity={0.9}
          >
            <View style={{ flex: 1 }}>
              <View style={s.badge}>
                <Text style={s.badgeText}>TRENDING</Text>
              </View>
              <Text style={s.inspoTitle}>Adventure Awaits</Text>
              <Text style={s.inspoDesc}>Hiking, diving & extreme sports</Text>
            </View>
            <Text style={s.inspoEmoji}>🏔️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.inspo, { backgroundColor: "#06B6D4" }]}
            onPress={() => goPlan(undefined, "Relax")}
            activeOpacity={0.9}
          >
            <View style={{ flex: 1 }}>
              <View style={s.badge}>
                <Text style={s.badgeText}>POPULAR</Text>
              </View>
              <Text style={s.inspoTitle}>Wellness Retreat</Text>
              <Text style={s.inspoDesc}>Spa, yoga & meditation escapes</Text>
            </View>
            <Text style={s.inspoEmoji}>🧘</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F0F4F8" },
  scroll: { paddingBottom: 20 },

  /* Hero */
  hero: {
    backgroundColor: "#4F46E5",
    paddingTop: 56,
    paddingBottom: 30,
    paddingHorizontal: 22,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  heroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: { color: "#C7D2FE", fontSize: 13, fontWeight: "500" },
  heroTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 3,
    letterSpacing: -0.5,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },

  /* Search */
  searchBox: {
    backgroundColor: "#fff",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: "#1E293B",
    height: "100%",
  },
  searchBtn: {
    backgroundColor: "#4F46E5",
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },

  /* Sections */
  section: { marginTop: 26, paddingHorizontal: 22 },
  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  seeAll: { color: "#4F46E5", fontWeight: "700", fontSize: 13 },

  /* Destinations */
  destScroll: { gap: 12, paddingRight: 22 },
  destCard: {
    width: CARD_W,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  destImg: {
    width: "100%",
    height: 95,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  destEmoji: { fontSize: 38 },
  destName: { fontSize: 14, fontWeight: "700", color: "#1E293B" },
  destCountry: { fontSize: 11, color: "#94A3B8", marginTop: 2 },

  /* Styles */
  styleGrid: { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  styleChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
  },
  styleLabel: { marginLeft: 7, fontSize: 13, fontWeight: "700" },

  /* Inspiration */
  inspo: {
    borderRadius: 22,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  badge: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  inspoTitle: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 3,
  },
  inspoDesc: { color: "rgba(255,255,255,0.85)", fontSize: 13 },
  inspoEmoji: { fontSize: 44, marginLeft: 10 },
});
