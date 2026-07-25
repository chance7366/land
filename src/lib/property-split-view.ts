import type { Property } from "@prisma/client";

export type SerializedProperty = Omit<
  Property,
  "publishedAt" | "createdAt" | "updatedAt"
> & {
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

export function serializeProperty(p: Property): SerializedProperty {
  return {
    ...p,
    publishedAt: p.publishedAt.toISOString(),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

export function deserializeProperty(row: SerializedProperty): Property {
  return {
    ...row,
    publishedAt: new Date(row.publishedAt),
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}
