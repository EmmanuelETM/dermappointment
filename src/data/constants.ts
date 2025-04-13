export const SKIN_TYPES = [
  "Normal",
  "Dry",
  "Oily",
  "Combiation",
  "Sensitive",
] as const;

export const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const APPOINTMENT_STATUS = [
  "Pending",
  "Confirmed",
  "Cancelled",
  "Completed",
] as const;

export const LOCK_STATUS = ["Pending", "Success"] as const;

export const RELEVANT_TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/La_Paz",
  "America/Santo_Domingo",
  "America/Los_Angeles",
  "America/Chicago",
  "America/Denver",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Madrid",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Kolkata",
] as const;

export const ROLES = ["ADMIN", "PATIENT", "DOCTOR"] as const;

export const LOCATION = ["La Vega", "Puerto Plata"] as const;
