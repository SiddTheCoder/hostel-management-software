export enum AuthProvider {
  LOCAL = "LOCAL",
  GOOGLE = "GOOGLE",
}

export enum HostelStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  SUSPENDED = "SUSPENDED",
}

export enum VerificationStatus {
  UNVERIFIED = "UNVERIFIED",
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

export enum RoomType {
  ONE_SEATER = "ONE_SEATER",
  TWO_SEATER = "TWO_SEATER",
  THREE_SEATER = "THREE_SEATER",
  FOUR_SEATER = "FOUR_SEATER",
  DORMITORY = "DORMITORY",
}

export enum BedStatus {
  AVAILABLE = "AVAILABLE",
  OCCUPIED = "OCCUPIED",
  RESERVED = "RESERVED",
  UNDER_REPAIR = "UNDER_REPAIR",
}

export enum ResidentStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  MOVED_OUT = "MOVED_OUT",
  INACTIVE = "INACTIVE",
}

export enum PaymentStatus {
  UNPAID = "UNPAID",
  PARTIAL = "PARTIAL",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
}

export enum PaymentMethod {
  ESEWA = "ESEWA",
  FONEPAY = "FONEPAY",
  KHALTI = "KHALTI",
  BANK_TRANSFER = "BANK_TRANSFER",
  CASH = "CASH",
}

export enum ProofVerificationStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

export enum NightStatusValue {
  INSIDE = "INSIDE",
  OUTSIDE = "OUTSIDE",
  NOT_VERIFIED = "NOT_VERIFIED",
  SOS = "SOS",
}

export enum NoticeCategory {
  GENERAL = "GENERAL",
  FEE = "FEE",
  FOOD = "FOOD",
  RULE = "RULE",
  EMERGENCY = "EMERGENCY",
  MAINTENANCE = "MAINTENANCE",
}

export enum ComplaintCategory {
  FOOD = "FOOD",
  WATER = "WATER",
  ROOM = "ROOM",
  WIFI = "WIFI",
  PAYMENT = "PAYMENT",
  CLEANLINESS = "CLEANLINESS",
  SECURITY = "SECURITY",
  MAINTENANCE = "MAINTENANCE",
  OTHER = "OTHER",
}

export enum ComplaintStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  REJECTED = "REJECTED",
}

export enum ServiceCategory {
  PLUMBER = "PLUMBER",
  ELECTRICIAN = "ELECTRICIAN",
  DOCTOR_CLINIC = "DOCTOR_CLINIC",
  INTERNET_TECHNICIAN = "INTERNET_TECHNICIAN",
  CLEANER = "CLEANER",
  CARPENTER = "CARPENTER",
  PAINTER = "PAINTER",
  ROOM_REPAIR = "ROOM_REPAIR",
  WATER_SUPPLIER = "WATER_SUPPLIER",
  APPLIANCE_REPAIR = "APPLIANCE_REPAIR",
  OTHER = "OTHER",
}

export enum ProviderStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  HIDDEN = "HIDDEN",
}

export enum MaintenanceStatus {
  PENDING = "PENDING",
  CONTACTED = "CONTACTED",
  SCHEDULED = "SCHEDULED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum InquiryStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  CONVERTED = "CONVERTED",
  CLOSED = "CLOSED",
}

export enum QRStatus {
  PENDING = "PENDING",
  ACTIVATED = "ACTIVATED",
  EXPIRED = "EXPIRED",
}

export enum NotificationPriority {
  INFO = "INFO",
  NORMAL = "NORMAL",
  URGENT = "URGENT",
}

export enum NotificationCategory {
  ANNOUNCEMENT = "ANNOUNCEMENT",
  ALERT = "ALERT",
  REMINDER = "REMINDER",
  INFO = "INFO",
  FOOD_READY = "FOOD_READY",
  ATTENDANCE = "ATTENDANCE",
  SYSTEM = "SYSTEM",
}

export enum LocationZone {
  INSIDE = "INSIDE",
  NEARBY = "NEARBY",
  OUTSIDE = "OUTSIDE",
  UNKNOWN = "UNKNOWN",
}

export enum CommunityPostVisibility {
  PUBLIC = "PUBLIC",
  HOSTEL_ONLY = "HOSTEL_ONLY",
}

export enum ResidentType {
  STUDENT = "STUDENT",
  WORKING_PROFESSIONAL = "WORKING_PROFESSIONAL",
  OTHER = "OTHER",
}
