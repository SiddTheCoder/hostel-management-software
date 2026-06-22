import { StyleSheet } from "react-native";

export const screenStyles = StyleSheet.create({
  body: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 21,
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
  stack: {
    gap: 16,
  },
  title: {
    color: "#0f172a",
    fontSize: 28,
    fontWeight: "800",
  },
});
