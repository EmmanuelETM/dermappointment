import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Tailwind,
  Text,
  Heading,
  Hr,
  Link,
} from "@react-email/components";
import * as React from "react";

type ReminderEmailProps = {
  patientName: string;
  procedureName: string;
  doctorName: string;
  startTime: string;
  endTime: string;
  description?: string;
  redirect: string;
};

export default function ReminderEmail({
  patientName,
  procedureName,
  doctorName,
  startTime,
  endTime,
  description,
  redirect,
}: ReminderEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>DermAppointment Reminder</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow-md">
            <Heading className="mb-4 text-2xl font-semibold text-gray-800">
              Hi {patientName},
            </Heading>
            <Text className="mb-4 text-gray-700">
              This is a reminder for your Appointment at DermAppointment.
            </Text>
            <Hr className="my-4 border-t border-gray-300" />
            <Text className="mb-2 text-gray-700">
              <strong>📅 Start:</strong> {startTime}
            </Text>
            <Text className="mb-2 text-gray-700">
              <strong>📅 End:</strong> {endTime}
            </Text>
            <Text className="mb-2 text-gray-700">
              <strong>🩺 Procedure:</strong> {procedureName}
            </Text>
            <Text className="mb-2 text-gray-700">
              <strong>👨‍⚕️ Doctor:</strong> {doctorName}
            </Text>
            {description && (
              <Text className="mb-4 text-gray-700">
                <strong>📝 Description:</strong> {description}
              </Text>
            )}
            <Hr className="my-4 border-t border-gray-300" />
            <Text className="mb-4 text-gray-700">See you soon!</Text>
            <Link
              href={redirect}
              className="text-blue-500 underline hover:text-blue-700"
            >
              Go to Appointments
            </Link>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
