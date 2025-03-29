import { type PopoverGroup, type PopoverItem } from "@/types/tables";
import { db } from "@/server/db";

export const fetchProcedures = async () => {
  return await db.query.procedures.findMany();
};

export const fetchSpecialties = async () => {
  return await db.query.specialties.findMany();
};

const mapToPopoverItem = (data: { id: string; name: string }) => ({
  value: data.id,
  label: data.name,
});

export const createProceduresPopover = async (): Promise<PopoverItem> => {
  const proceduresData = await fetchProcedures();

  return {
    column: "procedures",
    title: "Procedures",
    options: proceduresData.map(mapToPopoverItem),
  };
};

export const createSpecialtiesPopover = async (): Promise<PopoverItem> => {
  const specialtiesData = await fetchSpecialties();

  return {
    column: "specialties",
    title: "Specialties",
    options: specialtiesData.map(mapToPopoverItem),
  };
};

export async function popoverConfig() {
  const SpecialtiesPopover: PopoverItem = {
    column: "specialties",
    title: "Specialties",
    options: (await fetchSpecialties()).map(mapToPopoverItem),
  };
  const ProcedurePopover: PopoverItem = {
    column: "procedures",
    title: "Procedures",
    options: (await fetchProcedures()).map(mapToPopoverItem),
  };

  return { items: [SpecialtiesPopover, ProcedurePopover] } as PopoverGroup;
}
