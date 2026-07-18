import { prisma } from "@/lib/prisma";
import {
  normalizePhone,
  phonesMatch,
  type CustomerCardDTO,
  type CustomerInteractionDTO,
  type CustomerRelatedConsultation,
  type CustomerRelatedSubscriber,
  type CustomerWriteInput,
  type SeedCustomerSpec,
} from "@/lib/customers/types";

function mapIx(row: {
  id: string;
  customerId: string;
  occurredAt: Date;
  channel: string;
  title: string;
  body: string;
  createdAt: Date;
}): CustomerInteractionDTO {
  return {
    id: row.id,
    customerId: row.customerId,
    occurredAt: row.occurredAt.toISOString(),
    channel: row.channel,
    title: row.title,
    body: row.body,
    createdAt: row.createdAt.toISOString(),
  };
}

function mapCard(
  row: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    currentAddress: string | null;
    profileImage: string | null;
    primaryContactMethod: string;
    hasTraded: boolean;
    isSubscribed: boolean;
    pipelineStage: string;
    budgetRange: string | null;
    needsLoan: boolean;
    purpose: string;
    moveUrgency: string;
    moveDate: Date | null;
    familyMembers: string | null;
    preferredBrand: string | null;
    decisionMaker: string | null;
    inquiryDetails: string;
    requestNotes: string;
    specialNotes: string;
    createdAt: Date;
    updatedAt: Date;
    interactions?: Parameters<typeof mapIx>[0][];
  },
): CustomerCardDTO {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    currentAddress: row.currentAddress,
    profileImage: row.profileImage,
    primaryContactMethod: row.primaryContactMethod,
    hasTraded: row.hasTraded,
    isSubscribed: row.isSubscribed,
    pipelineStage: row.pipelineStage,
    budgetRange: row.budgetRange,
    needsLoan: row.needsLoan,
    purpose: row.purpose,
    moveUrgency: row.moveUrgency,
    moveDate: row.moveDate ? row.moveDate.toISOString().slice(0, 10) : null,
    familyMembers: row.familyMembers,
    preferredBrand: row.preferredBrand,
    decisionMaker: row.decisionMaker,
    inquiryDetails: row.inquiryDetails,
    requestNotes: row.requestNotes,
    specialNotes: row.specialNotes,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    interactions: row.interactions?.map(mapIx),
  };
}

export async function listCustomerCardsPrisma(): Promise<CustomerCardDTO[]> {
  const rows = await prisma.customerCard.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map((r) => mapCard(r));
}

export async function getCustomerCardPrisma(id: string): Promise<CustomerCardDTO | null> {
  const row = await prisma.customerCard.findUnique({
    where: { id },
    include: { interactions: { orderBy: { occurredAt: "desc" } } },
  });
  return row ? mapCard(row) : null;
}

export async function createCustomerCardPrisma(
  input: CustomerWriteInput,
): Promise<CustomerCardDTO> {
  if (!input.name?.trim()) throw new Error("이름을 입력하세요.");
  const row = await prisma.customerCard.create({
    data: {
      name: input.name.trim(),
      phone: (input.phone ?? "").trim(),
      email: input.email?.trim() || null,
      currentAddress: input.currentAddress?.trim() || null,
      profileImage: input.profileImage?.trim() || null,
      primaryContactMethod: input.primaryContactMethod ?? "phone",
      hasTraded: input.hasTraded ?? false,
      isSubscribed: input.isSubscribed ?? false,
      pipelineStage: input.pipelineStage ?? "new",
      budgetRange: input.budgetRange?.trim() || null,
      needsLoan: input.needsLoan ?? false,
      purpose: input.purpose ?? "reside",
      moveUrgency: input.moveUrgency ?? "mid",
      moveDate: input.moveDate ? new Date(input.moveDate) : null,
      familyMembers: input.familyMembers?.trim() || null,
      preferredBrand: input.preferredBrand?.trim() || null,
      decisionMaker: input.decisionMaker?.trim() || null,
      inquiryDetails: input.inquiryDetails ?? "",
      requestNotes: input.requestNotes ?? "",
      specialNotes: input.specialNotes ?? "",
    },
  });
  return mapCard(row);
}

export async function updateCustomerCardPrisma(
  id: string,
  input: CustomerWriteInput,
): Promise<CustomerCardDTO> {
  const data: Record<string, unknown> = {};
  if (input.name !== undefined) data.name = input.name.trim();
  if (input.phone !== undefined) data.phone = input.phone.trim();
  if (input.email !== undefined) data.email = input.email?.trim() || null;
  if (input.currentAddress !== undefined)
    data.currentAddress = input.currentAddress?.trim() || null;
  if (input.profileImage !== undefined)
    data.profileImage = input.profileImage?.trim() || null;
  if (input.primaryContactMethod !== undefined)
    data.primaryContactMethod = input.primaryContactMethod;
  if (input.hasTraded !== undefined) data.hasTraded = input.hasTraded;
  if (input.isSubscribed !== undefined) data.isSubscribed = input.isSubscribed;
  if (input.pipelineStage !== undefined) data.pipelineStage = input.pipelineStage;
  if (input.budgetRange !== undefined) data.budgetRange = input.budgetRange?.trim() || null;
  if (input.needsLoan !== undefined) data.needsLoan = input.needsLoan;
  if (input.purpose !== undefined) data.purpose = input.purpose;
  if (input.moveUrgency !== undefined) data.moveUrgency = input.moveUrgency;
  if (input.moveDate !== undefined)
    data.moveDate = input.moveDate ? new Date(input.moveDate) : null;
  if (input.familyMembers !== undefined)
    data.familyMembers = input.familyMembers?.trim() || null;
  if (input.preferredBrand !== undefined)
    data.preferredBrand = input.preferredBrand?.trim() || null;
  if (input.decisionMaker !== undefined)
    data.decisionMaker = input.decisionMaker?.trim() || null;
  if (input.inquiryDetails !== undefined) data.inquiryDetails = input.inquiryDetails;
  if (input.requestNotes !== undefined) data.requestNotes = input.requestNotes;
  if (input.specialNotes !== undefined) data.specialNotes = input.specialNotes;

  const row = await prisma.customerCard.update({ where: { id }, data });
  return mapCard(row);
}

export async function deleteCustomerCardPrisma(id: string) {
  await prisma.customerCard.delete({ where: { id } });
}

export async function findCustomerCardsByPhonePrisma(
  phone: string,
): Promise<CustomerCardDTO[]> {
  const digits = normalizePhone(phone);
  if (!digits) return [];
  const all = await listCustomerCardsPrisma();
  return all.filter((c) => phonesMatch(c.phone, digits));
}

export async function deleteCustomerCardsByPhonesPrisma(phones: string[]) {
  const targets = new Set(phones.map(normalizePhone).filter(Boolean));
  if (!targets.size) return 0;
  const all = await listCustomerCardsPrisma();
  const ids = all.filter((c) => targets.has(normalizePhone(c.phone))).map((c) => c.id);
  for (const id of ids) {
    await prisma.customerCard.delete({ where: { id } });
  }
  return ids.length;
}

export async function addCustomerInteractionPrisma(
  customerId: string,
  input: { occurredAt?: string; channel?: string; title: string; body?: string },
): Promise<CustomerInteractionDTO> {
  const row = await prisma.customerInteraction.create({
    data: {
      customerId,
      occurredAt: input.occurredAt ? new Date(input.occurredAt) : new Date(),
      channel: input.channel ?? "phone",
      title: input.title.trim(),
      body: input.body?.trim() ?? "",
    },
  });
  return mapIx(row);
}

export async function findRelatedByPhonePrisma(phone: string): Promise<{
  consultations: CustomerRelatedConsultation[];
  subscribers: CustomerRelatedSubscriber[];
}> {
  const digits = normalizePhone(phone);
  if (!digits) return { consultations: [], subscribers: [] };

  const [consults, subs] = await Promise.all([
    prisma.consultation.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.emailSubscriber.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
  ]);

  return {
    consultations: consults
      .filter((r) => phonesMatch(r.phone, digits))
      .slice(0, 10)
      .map((r) => ({
        id: r.id,
        clientName: r.clientName,
        category: r.category,
        status: r.status,
        createdAt: r.createdAt.toISOString(),
      })),
    subscribers: subs
      .filter((r) => phonesMatch(r.phone, digits))
      .slice(0, 10)
      .map((r) => ({
        id: r.id,
        name: r.name,
        subscriptionType: r.subscriptionType,
        status: r.status,
        createdAt: r.createdAt.toISOString(),
      })),
  };
}

export async function seedCustomerCardsPrisma(specs: SeedCustomerSpec[]) {
  const created: CustomerCardDTO[] = [];
  for (const spec of specs) {
    const { interactions, ...card } = spec;
    const row = await createCustomerCardPrisma(card);
    for (const ix of interactions ?? []) {
      const at = new Date(Date.now() - ix.daysAgo * 24 * 60 * 60 * 1000).toISOString();
      await addCustomerInteractionPrisma(row.id, {
        occurredAt: at,
        channel: ix.channel,
        title: ix.title,
        body: ix.body,
      });
    }
    const full = await getCustomerCardPrisma(row.id);
    if (full) created.push(full);
  }
  return created;
}
