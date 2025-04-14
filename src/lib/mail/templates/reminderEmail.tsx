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
      <Preview>Recordatorio de tu cita médica</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow-md">
            <Heading className="mb-4 text-2xl font-semibold text-gray-800">
              Hola {patientName},
            </Heading>
            <Text className="mb-4 text-gray-700">
              Este es un recordatorio para tu cita médica en DermAppointment.
            </Text>
            <Hr className="my-4 border-t border-gray-300" />
            <Text className="mb-2 text-gray-700">
              <strong>📅 Inicio:</strong> {startTime}
            </Text>
            <Text className="mb-2 text-gray-700">
              <strong>📅 Fin:</strong> {endTime}
            </Text>
            <Text className="mb-2 text-gray-700">
              <strong>🩺 Procedimiento:</strong> {procedureName}
            </Text>
            <Text className="mb-2 text-gray-700">
              <strong>👨‍⚕️ Doctor:</strong> {doctorName}
            </Text>
            {description && (
              <Text className="mb-4 text-gray-700">
                <strong>📝 Descripción:</strong> {description}
              </Text>
            )}
            <Hr className="my-4 border-t border-gray-300" />
            <Text className="mb-4 text-gray-700">¡Nos vemos pronto!</Text>
            <Link
              href={redirect}
              className="text-blue-500 underline hover:text-blue-700"
            >
              Ir a las citas
            </Link>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
