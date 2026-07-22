"use client";

import { useQuery } from "@tanstack/react-query";

import type { Resident, RoomMapFloor } from "@/app/_components/hostel-admin-shared";
import { browserApi } from "@/lib/browser-api";

export type Warden = {
  createdAt?: string;
  email: string;
  hostelId: string;
  id: string;
  name: string;
  permissions: string[];
  phone: string;
  role: string;
  status: "ACTIVE" | "INVITED" | "SUSPENDED" | "REMOVED";
  updatedAt?: string;
  userId: string;
};

/** Room + bed map for the admin's hostel (beds are nested under rooms). */
export function useRoomMap() {
  return useQuery({
    queryFn: () =>
      browserApi<{ floors: RoomMapFloor[] }>("/api/v1/hostel-admin/room-map"),
    queryKey: ["hostel-admin", "room-map"],
  });
}

export function useResidents() {
  return useQuery({
    queryFn: () =>
      browserApi<{ residents: Resident[] }>("/api/v1/hostel-admin/residents"),
    queryKey: ["hostel-admin", "residents"],
  });
}

export function useHostelWardens() {
  return useQuery({
    queryFn: () => browserApi<{ wardens: Warden[] }>("/api/v1/hostel-admin/wardens"),
    queryKey: ["hostel-admin", "wardens"],
  });
}
