import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { deleteTrip, getAllTrips } from "../../src/services/databaseService";
import { Trip } from "../../src/types/trip";

const DEST_EMOJIS: Record<string, string> = {
  tokyo: "🗾",
  paris: "🗼",
  bali: "🏝️",
  london: "🇬🇧",
  rome: "🏛️",
  dubai: "🏙️",
  sydney: "🦘",
  bangkok: "🛕",
  barcelona: "💃",
  amsterdam: "🌷",
  prague: "🏰",
  vienna: "🎻",
};

function getEmoji(dest: string): string {
  const key = dest.toLowerCase().split(",")[0].trim();
  return DEST_EMOJIS[key] || "🌍";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function RecentPlansScreen() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadTrips();
    }, []),
  );

  const loadTrips = async () => {
    try {
      const all = await getAllTrips();
      setTrips(all);
    } catch (e) {
      console.error("Failed to load trips", e);
    }
  };

  const handleDelete = (trip: Trip) => {
    Alert.alert(
      "Delete Plan",
      `Remove "${trip.destination}" from your saved plans?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteTrip(trip.id);
            loadTrips();
          },
        },
      ],
    );
  };

  const handleView = (trip: Trip) => {
    router.push({
      pathname: "/result-view",
      params: { id: trip.id },
    });
  };

  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.header}>
          <Text style={s.title}>Recent Plans</Text>
          <Text style={s.sub}>Your saved travel itineraries</Text>
        </View>

        <View style={s.list}>
          {trips.length > 0 ? (
            trips.map((trip) => (
              <View key={trip.id} style={s.card}>
                <TouchableOpacity
                  style={s.cardTouchable}
                  activeOpacity={0.85}
                  onPress={() => handleView(trip)}
                >
                  <View style={s.cardImg}>
                    <Text style={s.cardEmoji}>
                      {getEmoji(trip.destination)}
                    </Text>
                  </View>
                  <View style={s.cardBody}>
                    <Text style={s.cardTitle}>{trip.destination}</Text>
                    <View style={s.cardRow}>
                      <Ionicons
                        name="calendar-outline"
                        size={13}
                        color="#94a3b8"
                      />
                      <Text style={s.cardMeta}>
                        {formatDate(trip.createdAt)}
                      </Text>
                    </View>
                    <View style={s.cardRow}>
                      <Ionicons name="time-outline" size={13} color="#94a3b8" />
                      <Text style={s.cardMeta}>
                        {trip.days} days · {trip.budget}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.deleteBtn}
                  onPress={() => handleDelete(trip)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={s.empty}>
              <Ionicons name="map-outline" size={56} color="#d1d5db" />
              <Text style={s.emptyTitle}>No plans yet</Text>
              <Text style={s.emptySub}>Create your first travel plan!</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F0F4F8" },
  scroll: { paddingBottom: 40 },
  header: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 16 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  sub: { color: "#64748B", fontSize: 14, marginTop: 3 },
  list: { paddingHorizontal: 22, gap: 10 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    overflow: "hidden",
  },
  cardTouchable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  deleteBtn: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  cardImg: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  cardEmoji: { fontSize: 26 },
  cardBody: { flex: 1, marginLeft: 12 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#1E293B" },
  cardRow: { flexDirection: "row", alignItems: "center", marginTop: 3 },
  cardMeta: { fontSize: 12, color: "#94A3B8", marginLeft: 4 },
  empty: { alignItems: "center", paddingTop: 60 },
  emptyTitle: {
    color: "#94A3B8",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
  },
  emptySub: { color: "#94A3B8", fontSize: 13, marginTop: 4 },
});
