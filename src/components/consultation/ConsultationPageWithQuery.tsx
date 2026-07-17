"use client";

import { useSearchParams } from "next/navigation";
import { ConsultationPageClient } from "@/components/consultation/ConsultationPageClient";
import type { ConsultationStatus } from "@prisma/client";

type BoardRow = {
  caseId: string;
  category: string;
  status: ConsultationStatus;
  createdAt: string;
};

export function ConsultationPageWithQuery({ boardRows }: { boardRows: BoardRow[] }) {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("propertyId");
  return <ConsultationPageClient boardRows={boardRows} propertyId={propertyId} />;
}
