import { z } from 'zod';

// Base schemas
const BaseAuthSchema = z.object({
  email: z.string().email('Email invalide').min(5, 'Email trop court'),
  password: z.string().min(8, 'Minimum 8 caractères')
});

export const RegisterSchema = BaseAuthSchema.extend({
  fullName: z.string().min(3, 'Nom complet requis').max(50),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword']
});

export const LoginSchema = BaseAuthSchema;

export const CheckoutSchema = z.object({
  phone: z.string().regex(/^(\+212|0)[5-7][0-9]{8}$/, 'Numéro marocain invalide'),
  address: z.string().min(10, 'Adresse trop courte'),
  deliveryDate: z.date({ required_error: 'Date requise' }),
  deliverySlot: z.string().min(1, 'Créneau horaire requis'),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter les conditions' })
  })
});

export const ContactSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Numéro de téléphone incomplet'),
  company: z.string().optional(),
  inquiryType: z.enum([
    'general', 
    'bulk', 
    'catering', 
    'feedback', 
    'complaint', 
    'partnership'
  ]),
  eventDate: z.string().optional(),
  guestCount: z.string().optional(),
  message: z.string().min(10, 'Message trop court')
}).refine(data => {
  if (['bulk', 'catering'].includes(data.inquiryType)) {
    return !!data.guestCount;
  }
  return true;
}, {
  message: 'Nombre de personnes requis',
  path: ['guestCount']
});