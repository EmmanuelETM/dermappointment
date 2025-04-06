import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDurationDescription } from "@/lib/formatters";
import { type Procedure } from "@/schemas/admin/procedures";
import { type Doctor } from "@/schemas/doctor";

export const ProcedureTab = ({
  selectedDoctor,
  setSelectedProcedureAction,
  setCurrentStepAction,
}: {
  selectedDoctor: Doctor | null;
  setSelectedProcedureAction: (procedure: Procedure | null) => void;
  setCurrentStepAction: (step: number) => void;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Procedure</CardTitle>
        <CardDescription className="text-md">
          Select the procedure.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {selectedDoctor?.procedures.map((procedure) => (
          <Card key={procedure.id} className="rounded-2xl border shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {procedure.name}
              </CardTitle>
              <CardDescription>
                Duration: {formatDurationDescription(procedure.duration)}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-gray-600">
              {procedure.description}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                className="w-full"
                type="button"
                onClick={() => {
                  setSelectedProcedureAction(procedure);
                  setCurrentStepAction(3);
                }}
              >
                Select
              </Button>
            </CardFooter>
          </Card>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStepAction(1)}>
          Back
        </Button>
      </CardFooter>
    </Card>
  );
};
