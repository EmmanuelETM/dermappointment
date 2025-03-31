// import { AppointmentForm } from "@/components/forms/appointment-form";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

//49:17
// export default function NewAppointmentPage() {
//   return (
//     <Card className="m-2">
//       <CardHeader>
//         <CardTitle>New Appointment</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <AppointmentForm />
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Doctor } from "@/schemas/doctor";
import { getColumns } from "./columns";
import { DataTable } from "@/components/tables/data-table";
import { Procedure } from "@/schemas/admin/procedures";

export function AppointmentTabs({ doctors }: { doctors: Doctor[] }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(
    null,
  );
  const columns = getColumns(
    setSelectedDoctor,
    setSelectedProcedure,
    setCurrentStep,
  );

  return (
    <Tabs
      value={
        currentStep === 1
          ? "doctor"
          : currentStep === 2
            ? "procedure"
            : currentStep === 3
              ? "dateTime"
              : "details"
      }
      className="m-2"
      onValueChange={(value) => {
        if (
          (value === "doctor" && currentStep > 1) ||
          (value === "procedure" && currentStep > 2) ||
          (value === "dateTime" && currentStep > 3)
        ) {
          setCurrentStep(
            value === "doctor" ? 1 : value === "procedure" ? 2 : 3,
          );
        }
      }}
    >
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="doctor">Doctor</TabsTrigger>
        <TabsTrigger value="procedure" disabled={currentStep < 2}>
          Procedure
        </TabsTrigger>
        <TabsTrigger value="dateTime" disabled={currentStep < 3}>
          Date & Time
        </TabsTrigger>
        <TabsTrigger value="details" disabled={currentStep < 4}>
          Details
        </TabsTrigger>
      </TabsList>

      {/* Paso 1 */}
      <TabsContent value="doctor">
        <Card>
          <CardHeader>
            <CardTitle>Doctors</CardTitle>
            <CardDescription>Choose the doctor.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="mx-auto">
              <DataTable columns={columns} data={doctors} filter="name" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Paso 2 */}
      <TabsContent value="procedure">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password. Click next when ready.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              Back
            </Button>
            <Button onClick={() => setCurrentStep(3)}>Next</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Paso 3 */}

      <TabsContent value="dateTime">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password. Click next when ready.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">Content</CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(2)}>
              Back
            </Button>
            <Button onClick={() => setCurrentStep(4)}>Next</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Paso 4 */}

      <TabsContent value="details">
        <Card>
          <CardHeader>
            <CardTitle>Time</CardTitle>
            <CardDescription>Finish</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">Check everything</CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(3)}>
              Back
            </Button>
            <Button onClick={() => alert("Finished!")}>Finish</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

//   <div className="container mx-auto px-4">
//     <div className="mb-2 flex items-center justify-between">
//       <p className="py-2 text-lg font-bold">Procedures</p>
//       <ProceduresFormDialog />
//     </div>
//     <DataTable columns={columns} data={data} filter="name" />
//   </div>
