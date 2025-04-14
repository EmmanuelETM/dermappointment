import { type FullPayment } from "@/schemas/payment";
import { db } from "@/server/db";
import { payments } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function getUserPayments(userId: string) {
  const data = await db.query.payments.findMany({
    where: eq(payments.userId, userId),
    columns: {
      id: true,
      paymentIntentId: true,
      appointmentId: true,
      amount: true,
      currency: true,
      status: true,
    },
    with: {
      users: {
        columns: {
          name: true,
        },
      },
      appointment: {
        columns: {},
        with: {
          doctors: {
            columns: {
              id: true,
            },
            with: {
              users: {
                columns: {
                  name: true,
                },
              },
            },
          },
          procedures: {
            columns: {
              name: true,
            },
          },
        },
      },
    },
  });

  return data;
}

export async function getUserPaymentsData(
  userId: string,
): Promise<FullPayment[]> {
  const data = await getUserPayments(userId);

  const flatten = data.map((payment) => ({
    id: payment.id,
    paymentIntentId: payment.paymentIntentId,
    appointmentId: payment.appointmentId,
    userId: userId,
    user: payment.users.name,
    amount: payment.amount,
    currency: payment.currency,
    doctor: payment.appointment.doctors.users.name,
    doctorId: payment.appointment.doctors.id,
    procedure: payment.appointment.procedures.name,
    status: payment.status,
  }));

  return flatten;
}
