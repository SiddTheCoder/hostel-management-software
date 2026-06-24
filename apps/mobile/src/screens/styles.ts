import { StyleSheet } from "react-native";

export const screenStyles = StyleSheet.create({
  body: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 21,
  },
  card: {
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
    padding: 16,
  },
  chip: {
    alignSelf: "flex-start",
    backgroundColor: "#dcfce7",
    borderRadius: 999,
    color: "#047857",
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#10b981",
    borderRadius: 10,
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  buttonSecondary: {
    backgroundColor: "#e2e8f0",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  buttonTextSecondary: {
    color: "#0f172a",
  },
  container: {
    backgroundColor: "#f8fafc",
    flex: 1,
    padding: 20,
  },
  field: {
    gap: 8,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
  },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 15,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  label: {
    color: "#0f172a",
    fontSize: 13,
    fontWeight: "700",
  },
  meta: {
    color: "#64748b",
    fontSize: 12,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  scrollContent: {
    gap: 16,
    padding: 20,
  },
  sectionTitle: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "800",
  },
  stack: {
    gap: 16,
  },
  title: {
    color: "#0f172a",
    fontSize: 28,
    fontWeight: "800",
  },
});
