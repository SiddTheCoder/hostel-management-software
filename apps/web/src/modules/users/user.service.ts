import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/models/User";

type UserRecord = {
  _id: Types.ObjectId;
  createdAt?: Date;
  demoDataLabel?: string;
  email?: string;
  hostelIds?: Types.ObjectId[];
  isDemoData?: boolean;
  lastLoginAt?: Date;
  name?: string;
  phone?: string;
  role?: string;
  status?: string;
};

function serializeUser(user: UserRecord) {
  return {
    createdAt: user.createdAt?.toISOString(),
    demoDataLabel: user.demoDataLabel ?? "",
    email: user.email,
    hostelIds: (user.hostelIds ?? []).map((hostelId) => hostelId.toString()),
    id: user._id.toString(),
    isDemoData: Boolean(user.isDemoData),
    lastLoginAt: user.lastLoginAt?.toISOString(),
    name: user.name ?? "Unnamed user",
    phone: user.phone,
    role: user.role ?? "PUBLIC_USER",
    status: user.status ?? "ACTIVE",
  };
}

export async function listPlatformUsers() {
  await connectToDatabase();

  const users = await UserModel.find({ isDeleted: { $ne: true } })
    .sort({ createdAt: -1 })
    .limit(250)
    .lean<UserRecord[]>();

  return {
    users: users.map(serializeUser),
  };
}
