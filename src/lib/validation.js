import { z } from "zod";

export const LoginSchema = z.object({
  nis: z.string().min(1),
  password: z.string().min(1),
});

export const BuatSiswaSchema = z.object({
  nis: z.string().min(1),
  nama: z.string().min(1),
  kelas: z.string().min(1),
  password: z.string().min(1),
});

export const BayarSchema = z.object({
  bill_id: z.number(),
  nis: z.string().min(1),
  password: z.string().min(1),
});
