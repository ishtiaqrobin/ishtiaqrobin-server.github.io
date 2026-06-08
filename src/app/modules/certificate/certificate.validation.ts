// import { z } from "zod";

// const createCertificateZodSchema = z.object({
//   title: z.string("title is required"),
//   issuer: z.string("issuer is required"),
//   issuedDate: z.string("issuedDate is required"),
//   expiryDate: z.string().optional(),
//   credentialId: z.string().optional(),
//   credentialUrl: z.string().optional(),
//   imageUrl: z.string().optional(),
//   isPublished: z.boolean().optional(),
//   sortOrder: z.number().optional(),
// });

// const updateCertificateZodSchema = createCertificateZodSchema.partial();

// export const CertificateValidation = {
//   createCertificateZodSchema,
//   updateCertificateZodSchema,
// };

import { z } from "zod";

const createCertificateZodSchema = z.object({
  title: z.string("title is required"),
  issuer: z.string("issuer is required"),
  issuedDate: z.string("issuedDate is required"),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  // z.coerce handles FormData strings ("true"/"false", "0"/"1") AND native types
  isPublished: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().optional(),
});

const updateCertificateZodSchema = createCertificateZodSchema.partial();

export const CertificateValidation = {
  createCertificateZodSchema,
  updateCertificateZodSchema,
};
