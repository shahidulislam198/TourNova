import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.header}>
          <Text style={s.title}>Settings</Text>
          <Text style={s.sub}>Customize your experience</Text>
        </View>

        {/* Preferences */}
        <View style={s.section}>
          <Text style={s.label}>PREFERENCES</Text>
          <View style={s.group}>
            <View style={s.row}>
              <View style={s.rowLeft}>
                <Ionicons name="moon-outline" size={20} color="#6366f1" />
                <Text style={s.rowText}>Dark Mode</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: "#e5e7eb", true: "#a5b4fc" }}
                thumbColor={darkMode ? "#6366f1" : "#f9fafb"}
              />
            </View>
            <View style={[s.row, s.rowBorder]}>
              <View style={s.rowLeft}>
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color="#6366f1"
                />
                <Text style={s.rowText}>Notifications</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: "#e5e7eb", true: "#a5b4fc" }}
                thumbColor={notifications ? "#6366f1" : "#f9fafb"}
              />
            </View>
            <TouchableOpacity style={[s.row, s.rowBorder]}>
              <View style={s.rowLeft}>
                <Ionicons name="language-outline" size={20} color="#6366f1" />
                <Text style={s.rowText}>Language</Text>
              </View>
              <View style={s.rowRight}>
                <Text style={s.rowValue}>English</Text>
                <Ionicons name="chevron-forward" size={15} color="#d1d5db" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={s.row}>
              <View style={s.rowLeft}>
                <Ionicons name="cash-outline" size={20} color="#6366f1" />
                <Text style={s.rowText}>Currency</Text>
              </View>
              <View style={s.rowRight}>
                <Text style={s.rowValue}>USD ($)</Text>
                <Ionicons name="chevron-forward" size={15} color="#d1d5db" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* About */}
        <View style={s.section}>
          <Text style={s.label}>ABOUT</Text>
          <View style={s.group}>
            <View style={[s.row, s.rowBorder]}>
              <View style={s.rowLeft}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#6366f1"
                />
                <Text style={s.rowText}>App Version</Text>
              </View>
              <Text style={s.rowValue}>1.0.0</Text>
            </View>
            <TouchableOpacity style={[s.row, s.rowBorder]}>
              <View style={s.rowLeft}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color="#6366f1"
                />
                <Text style={s.rowText}>Privacy Policy</Text>
              </View>
              <Ionicons name="chevron-forward" size={15} color="#d1d5db" />
            </TouchableOpacity>
            <TouchableOpacity style={s.row}>
              <View style={s.rowLeft}>
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color="#6366f1"
                />
                <Text style={s.rowText}>Terms of Service</Text>
              </View>
              <Ionicons name="chevron-forward" size={15} color="#d1d5db" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>Made with ❤️ by TourNova</Text>
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

  section: { paddingHorizontal: 22, marginTop: 18 },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 1.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  group: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
  rowLeft: { flexDirection: "row", alignItems: "center" },
  rowText: {
    marginLeft: 12,
    fontSize: 15,
    color: "#334155",
    fontWeight: "500",
  },
  rowRight: { flexDirection: "row", alignItems: "center" },
  rowValue: { color: "#94A3B8", fontSize: 14, marginRight: 6 },

  footer: { alignItems: "center", paddingTop: 40 },
  footerText: { color: "#94A3B8", fontSize: 13 },
});
