// src/shared/types.ts

import { z } from "zod";

// =================================================================
// --- Schemas de Clientes ---
// =================================================================
export const ClientSchema = z.object({
  id: z.number().optional(),
  user_id: z.string(),
  name: z.string().min(1, "Nome do cliente é obrigatório"),
  phone: z.string().optional().nullable(),
  email: z.string().email({ message: "Email inválido" }).or(z.literal("")).optional().nullable(),
  notes: z.string().optional().nullable(),
});
export const CreateClientSchema = ClientSchema.omit({ id: true, user_id: true });


// =================================================================
// --- Schemas de Profissionais ---
// =================================================================
export const ProfessionalSchema = z.object({
  id: z.number().optional(),
  user_id: z.string(),
  name: z.string().min(1, "Nome do profissional é obrigatório"),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Formato de cor inválido. Use hexadecimal, ex: #RRGGBB").optional().nullable(),
});
export const CreateProfessionalSchema = ProfessionalSchema.omit({ id: true, user_id: true });


// =================================================================
// --- Schemas de Serviços ---
// =================================================================
export const ServiceSchema = z.object({
  id: z.number().optional(),
  user_id: z.string(),
  name: z.string().min(1, "Nome do serviço é obrigatório"),
  description: z.string().optional().nullable(),
  price: z.number().positive("O preço deve ser um número positivo"),
  duration: z.number().int().positive("A duração deve ser um número inteiro positivo (em minutos)"),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Formato de cor inválido. Use hexadecimal, ex: #RRGGBB").optional().nullable(),
});
export const CreateServiceSchema = ServiceSchema.omit({ id: true, user_id: true });


// =================================================================
// --- Schemas de Produtos ---
// =================================================================
export const ProductSchema = z.object({
  id: z.number().optional(),
  user_id: z.string(),
  name: z.string().min(1, "Nome do produto é obrigatório"),
  description: z.string().optional().nullable(),
  price: z.number().positive("O preço deve ser positivo"),
  quantity: z.number().int().min(0, "A quantidade deve ser positiva").default(0),
  image_url: z.string().url("URL da imagem inválida").optional().nullable().or(z.literal('')),
});
export const CreateProductSchema = ProductSchema.omit({ id: true, user_id: true }).extend({
  quantity: z.number().int().min(0, "A quantidade deve ser positiva").optional().default(0),
});

// =================================================================
// --- Schemas de Agendamentos ---
// =================================================================
export const AppointmentSchema = z.object({
  id: z.number().optional(),
  user_id: z.string(),
  client_id: z.number(),
  professional_id: z.number(),
  service_id: z.number(),
  client_name: z.string(),
  service: z.string(),
  price: z.number(),
  appointment_date: z.string(),
  end_date: z.string(),
  attended: z.boolean().default(false),
});

export const AppointmentFormSchema = z.object({
  client_id: z.number({ required_error: "Cliente é obrigatório." }).min(1, "Cliente é obrigatório."),
  professional_id: z.number({ required_error: "Profissional é obrigatório." }).min(1, "Profissional é obrigatório."),
  service_id: z.number({ required_error: "Serviço é obrigatório." }).min(1, "Serviço é obrigatório."),
  price: z.number().positive("Preço deve ser positivo"),
  appointment_date: z.date({ required_error: "A data de início é obrigatória." }),
  end_date: z.date({ required_error: "A data de fim é obrigatória." }),
  attended: z.boolean().default(false).optional(),
}).refine((data) => data.end_date > data.appointment_date, {
  message: "A data de fim deve ser posterior à data de início",
  path: ["end_date"],
});


// =================================================================
// --- Schemas de Entradas Financeiras (COM A CORREÇÃO) ---
// =================================================================
export const FinancialEntrySchema = z.object({
  id: z.number().optional(),
  user_id: z.string(),
  description: z.string().min(1, "Descrição é obrigatória"),
  amount: z.number().positive("O valor deve ser positivo"),
  type: z.enum(["receita", "despesa"]),
  entry_type: z.enum(["pontual", "fixa"]),
  // LINHA CORRIGIDA ABAIXO:
  entry_date: z.date({ required_error: "A data é obrigatória." }), // Alterado de z.string() para z.date()
  appointment_id: z.number().optional().nullable(),
  is_virtual: z.boolean().default(false),
});
export const CreateFinancialEntrySchema = FinancialEntrySchema.omit({ id: true, user_id: true, is_virtual: true, appointment_id: true });


// =================================================================
// --- Schemas de Configurações ---
// =================================================================
export const BusinessHoursSchema = z.object({
  day_of_week: z.number(),
  start_time: z.string().nullable(),
  end_time: z.string().nullable(),
});

// =================================================================
// --- Tipos Derivados ---
// =================================================================
export type ClientType = z.infer<typeof ClientSchema>;
export type ProfessionalType = z.infer<typeof ProfessionalSchema>;
export type ServiceType = z.infer<typeof ServiceSchema>;
export type ProductType = z.infer<typeof ProductSchema>;
export type AppointmentType = z.infer<typeof AppointmentSchema>;
export type FinancialEntryType = z.infer<typeof FinancialEntrySchema>;
export type BusinessHoursType = z.infer<typeof BusinessHoursSchema>;
