import { z } from "zod";

export const PopoverItemSchema = z.object({
  column: z.string(),
  title: z.string(),
  options: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
      iconKey: z.string(),
    }),
  ),
});

export type PopoverItem = z.infer<typeof PopoverItemSchema>;

export const PopoverGroupSchema = z.object({
  items: z.array(PopoverItemSchema),
});

export type PopoverGroup = z.infer<typeof PopoverGroupSchema>;
