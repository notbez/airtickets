// screens/HomeScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LoadingOverlay from '../components/LoadingOverlay';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { API_BASE } from '../constants/api';

export default function HomeScreen() {
  const nav = useNavigation();

  const [from, setFrom] = useState("Дубай, ОАЭ");
  const [to, setTo] = useState("Выберите направление");

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [passengers, setPassengers] = useState("Пассажиры");
  const [showPassengers, setShowPassengers] = useState(false);

  const [cls, setCls] = useState("Эконом");
  const [showClass, setShowClass] = useState(false);

  const [loading, setLoading] = useState(false);

  const formatDate = (d) =>
    `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}.${d.getFullYear()}`;

  const onSearch = async () => {
    setLoading(true);
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;

    try {
      const res = await fetch(
        `${API_BASE}/flights/search?from=${from}&to=${to}&date=${iso}`
      );
      const data = await res.json();

      setTimeout(() => {
        setLoading(false);
        nav.navigate('Results', { results: data.results || [] });
      }, 700);
    } catch {
      const mock = Array.from({ length: 4 }).map((_, i) => ({
        id: `mock-${i}`,
        provider: "mock",
        from,
        to,
        date: iso,
        departTime: `${9 + i}:00`,
        arriveTime: `${12 + i}:30`,
        price: 4500 + i * 900,
        currency: "RUB",
        seats: 5 - i,
        flightNumber: `ON-${100 + i}`,
      }));

      setTimeout(() => {
        setLoading(false);
        nav.navigate("Results", { results: mock });
      }, 700);
    }
  };

  const Field = ({ label, icon, value, onPress }) => (
    <View style={{ marginBottom: 18, flex: 1 }}>
      <Text style={styles.fieldLabel}>{label}</Text>

      <TouchableOpacity style={styles.fieldBox} onPress={onPress}>
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color="#0E70C0"
          style={{ marginRight: 10 }}
        />
        <Text style={styles.fieldValue}>{value}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Найди свой рейс</Text>
        </View>

        <View style={styles.card}>
          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity style={styles.tabActive}>
              <Text style={styles.tabActiveTxt}>В одну сторону</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabTxt}>Туда-обратно</Text>
            </TouchableOpacity>
          </View>

          {/* Поля */}
          <Field
            label="Откуда"
            icon="airplane-takeoff"
            value={from}
            onPress={() =>
              nav.navigate("SelectCity", {
                target: "from",
                onSelect: (v) => setFrom(v),
              })
            }
          />

          <Field
            label="Куда"
            icon="airplane-landing"
            value={to}
            onPress={() =>
              nav.navigate("SelectCity", {
                target: "to",
                onSelect: (v) => setTo(v),
              })
            }
          />

          <Field
            label="Дата вылета"
            icon="calendar"
            value={formatDate(date)}
            onPress={() => setShowPicker(true)}
          />

          {/* Пассажиры + Класс В ОДНОЙ ЛИНИИ */}
          <View style={{ flexDirection: "row", gap: 14, marginBottom: 18 }}>
            {/* Пассажиры */}
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Пассажиры</Text>

              <TouchableOpacity
                style={styles.fieldBox}
                onPress={() => {
                  setShowPassengers(!showPassengers);
                  setShowClass(false);
                }}
              >
                <MaterialCommunityIcons
                  name="account-group"
                  size={22}
                  color="#0E70C0"
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.fieldValue}>{passengers}</Text>
              </TouchableOpacity>

              {showPassengers && (
                <View style={styles.dropdown}>
                  {[1, 2, 3, 4].map((n) => (
                    <TouchableOpacity
                      key={n}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setPassengers(n.toString());
                        setShowPassengers(false);
                      }}
                    >
                      <Text style={styles.dropdownText}>{n}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Класс */}
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Класс</Text>

              <TouchableOpacity
                style={styles.fieldBox}
                onPress={() => {
                  setShowClass(!showClass);
                  setShowPassengers(false);
                }}
              >
                <MaterialCommunityIcons
                  name="seat-recline-normal"
                  size={22}
                  color="#0E70C0"
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.fieldValue}>{cls}</Text>
              </TouchableOpacity>

              {showClass && (
                <View style={styles.dropdown}>
                  {["Эконом", "Бизнес"].map((c) => (
                    <TouchableOpacity
                      key={c}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setCls(c);
                        setShowClass(false);
                      }}
                    >
                      <Text style={styles.dropdownText}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Поиск */}
          <TouchableOpacity style={styles.searchBtn} onPress={onSearch}>
            <Text style={styles.searchTxt}>Поиск рейса</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(e, selected) => {
            setShowPicker(false);
            if (selected) setDate(selected);
          }}
        />
      )}

      {loading && <LoadingOverlay />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#1EA6FF",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },

  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginTop: 10,
  },

  card: {
    backgroundColor: "#fff",
    marginTop: -20,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 20,
    paddingBottom: 60,
  },

  tabs: {
    flexDirection: "row",
    marginBottom: 20,
  },

  tabActive: {
    backgroundColor: "#1EA6FF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginRight: 10,
  },

  tabActiveTxt: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  tab: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: "#E8E8E8",
  },

  tabTxt: {
    color: "#666",
    fontWeight: "600",
    fontSize: 16,
  },

  fieldLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
    marginLeft: 4,
  },

  fieldBox: {
    backgroundColor: "#F3F3F3",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  fieldValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },

  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: -6,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },

  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  dropdownText: {
    fontSize: 16,
    color: "#333",
  },

  searchBtn: {
    marginTop: 10,
    backgroundColor: "#1EA6FF",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  searchTxt: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});