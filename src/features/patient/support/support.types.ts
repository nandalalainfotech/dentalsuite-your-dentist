// src/features/support/support.types.ts

export type TicketStatus =
  | "OPEN"
  | "RESOLVED";

export interface Attachment {
  url: string;
  name: string;
  type: string;
}

export interface SupportTicket {
  id: string;
  request_number: number;

  patient_id?: string;
  practice_id?: string;

  email?: string;

  subject: string;
  relates_to: string;
  enquiry_details: string;

  type: string;
  status: TicketStatus;

  attachments?: Attachment[];

  created_at: string;
  updated_at: string;
}

export interface SupportMessage {
  id: string;

  ticket_id: string;

  sender_id: string;
  sender_type: string;

  message: string;

  attachments?: string[];

  created_at: string;
  updated_at: string;
}

export interface CreateTicketPayload {
  subject: string;
  relates_to: string;
  enquiry_details: string;
  email: string;
  attachments?: Attachment[];

  type: string;
}

export interface SendMessagePayload {
  message: string;
  attachments?: Attachment[];
}

export interface SupportApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;

  nextCursor?: string | null;
  hasMore?: boolean;
}

export interface PaginatedTicketsResponse {
  success: boolean;
  tickets: SupportTicket[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface PaginatedMessagesResponse {
  success: boolean;
  messages: SupportMessage[];
  nextCursor: string | null;
  hasMore: boolean;
}