import { getAppointmentByLockId } from "@/data/appointments";

export async function waitForAppointment(
  lockId: string,
  maxTries = 10,
  delayMs = 1000,
) {
  for (let i = 0; i < maxTries; i++) {
    const appointment = await getAppointmentByLockId(lockId);
    if (appointment) return appointment;

    await new Promise((res) => setTimeout(res, delayMs));
  }

  return null;
}
