import { type FullTransaction } from "@/schemas/transactions";
import { db } from "@/server/db";
import { transactions } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function getUserTransactions(userId: string) {
  const data = await db.query.transactions.findMany({
    where: eq(transactions.userId, userId),
    columns: {
      id: true,
      stripeId: true,
      appointmentId: true,
      type: true,
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

export async function getUserTransactionsData(
  userId: string,
): Promise<FullTransaction[]> {
  const data = await getUserTransactions(userId);

  const flatten = data.map((transactions) => ({
    id: transactions.id,
    stripeId: transactions.stripeId,
    appointmentId: transactions.appointmentId,
    type: transactions.type,
    userId: userId,
    user: transactions.users.name,
    amount: transactions.amount,
    currency: transactions.currency,
    doctor: transactions.appointment.doctors.users.name,
    doctorId: transactions.appointment.doctors.id,
    procedure: transactions.appointment.procedures.name,
    status: transactions.status,
  }));

  return flatten;
}

export async function getPaymentById(paymentId: string) {
  const data = await db.query.transactions.findFirst({
    where: eq(transactions.id, paymentId),
  });

  return data;
}
