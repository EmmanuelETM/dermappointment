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
import { type Doctor } from "@/schemas/doctor";
import { getColumns } from "./columns";
import { DataTable } from "@/components/tables/data-table";
import { type Procedure } from "@/schemas/admin/procedures";
import { useCurrentUser } from "@/hooks/user-current-user";

export function AppointmentTabs({ doctors }: { doctors: Doctor[] }) {
  const user = useCurrentUser();
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

  // useEffect(() => {
  //   if (selectedProcedure) {
  //     console.log(selectedProcedure);
  //   }
  // }, [selectedProcedure]);

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
      <TabsList className="grid w-full grid-cols-4 gap-2">
        {[
          { value: "doctor", label: "Doctor", step: 1 },
          { value: "procedure", label: "Procedure", step: 2 },
          { value: "dateTime", label: "Date & Time", step: 3 },
          { value: "details", label: "Details", step: 4 },
        ].map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            disabled={currentStep < tab.step}
          >
            <span className="block sm:hidden">{tab.step}</span>
            <span className="hidden sm:block">{tab.label}</span>
          </TabsTrigger>
        ))}
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
            <CardTitle>Procedure</CardTitle>
            <CardDescription>Select the procedure.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {selectedDoctor?.procedures.map((procedure) => (
              <Card
                key={procedure.id}
                className="rounded-2xl border border-gray-200 shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {procedure.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  {procedure.description}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    className="w-full"
                    type="button"
                    onClick={() => {
                      setSelectedProcedure(procedure);
                      setCurrentStep((prevStep) => prevStep + 1);
                    }}
                  >
                    Select
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              Back
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Paso 3 */}

      <TabsContent value="dateTime">
        <Card>
          <CardHeader>
            <CardTitle>Date & Time</CardTitle>
            <CardDescription>
              Set your date and time for the appointment
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
