export type TicketStatus = 'OPEN' | 'RESOLVED';

export const TICKET_STATUS = {
  OPEN: 'OPEN',
  RESOLVED: 'RESOLVED',
} as const;


export interface TicketAttachment {
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface SupportTicket {
  id: string;
  request_number: number;
  practice_id: string;
  email: string;
  subject: string;
  enquiry_details: string;
  relates_to: string;
  practice_name: string;
  type: 'PRACTICE_ADMIN' | 'PATIENT';
  status: TicketStatus;
  attachments: TicketAttachment[];
  created_at: string;
  updated_at: string;
}


export interface CreateTicketInput {
  request_number: number;
  email: string;
  subject: string;
  enquiry_details: string;
  relates_to: string;
  practice_id: string;
  attachments?: TicketAttachment[];
}


export interface UpdateTicketInput {
  id: string;

  status?: TicketStatus;
  enquiry_details?: string;

  attachments?: TicketAttachment[];
}


export interface SupportMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_type: 'PRACTICE_ADMIN' | 'SUPER_ADMIN';
  message: string;
  attachments?: TicketAttachment[];

  created_at: string;
  updated_at: string;
}