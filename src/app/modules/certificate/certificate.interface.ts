export interface CreateCertificateInput {
  title: string;
  issuer: string;
  issuedDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  imageUrl?: string;
  isPublished: boolean;
  sortOrder: number;
}

export type UpdateCertificateInput = Partial<CreateCertificateInput>;
