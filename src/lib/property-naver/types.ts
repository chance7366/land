export type FieldDataType = "String" | "Number" | "Boolean" | "Select" | "MultiSelect" | "Date";
export type FormStep = 1 | 2 | 3 | 4;
export type CategoryGroup = "APT_OFFICE" | "VILLA_HOUSE" | "RETAIL_OFFICE" | "LAND";
export type FieldStorage = "column" | "specs";

export type FieldSpec = {
  field_name: string;
  label: string;
  data_type: FieldDataType;
  is_required: boolean;
  options?: string[];
  validation_rule: string;
  naver_sync_note: string;
  step: FormStep;
  category_groups: CategoryGroup[];
  storage: FieldStorage;
};

export const ALL_CATEGORY_GROUPS: CategoryGroup[] = [
  "APT_OFFICE",
  "VILLA_HOUSE",
  "RETAIL_OFFICE",
  "LAND",
];
