import {
  Html,
  Head,
  Preview,
  Body,
  Container,
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
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#f9f9f9" }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <Heading>Hola {patientName},</Heading>
          <Text>
            This is a reminder for your appointment at DermAppointment.
          </Text>
          <Hr />
          <Text>
            <strong>📅 Start:</strong> {startTime}
            <strong>📅 End:</strong> {endTime}
          </Text>
          <Text>
            <strong>🩺 Procedure:</strong> {procedureName}
          </Text>
          <Text>
            <strong>👨‍⚕️ Doctor:</strong> {doctorName}
          </Text>
          {description && (
            <Text>
              <strong>📝 Description:</strong> {description}
            </Text>
          )}
          <Hr />
          <Text>See you soon!</Text>
          <Link href={redirect}>Go to Appointments</Link>
        </Container>
      </Body>
    </Html>
  );
}
