export type PopoverItem = {
  column: string;
  title: string;
  options: {
    value: string;
    label: string;
    iconKey?: string | null;
  }[];
};

export type PopoverGroup = {
  items: PopoverItem[];
};
