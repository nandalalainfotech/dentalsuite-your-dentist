// src/features/support/support.service.ts

import { localClient } from "../../api/apollo/localClient";

import {
  GET_CLINIC_TICKETS,
  CREATE_TICKET,
  UPDATE_TICKET,
  GET_ALL_TICKETS,
  GET_LAST_REQUEST_NUMBER,
  GET_TICKET_MESSAGES,
  SEND_MESSAGE,
} from "../../pages/practice/dashboard/graphql/support.query";

import type {
  CreateTicketInput,
  SupportTicket,
  TicketStatus,
  UpdateTicketInput,
} from "./support.types";

// --- 1. GET CLINIC TICKETS ---
const getClinicTickets = async (
  practiceId: string): Promise<SupportTicket[]> => {
  const response = await localClient.query({
    query: GET_CLINIC_TICKETS,
    variables: { practiceId },
    fetchPolicy: "network-only",
  });

  return (response.data as any).support_tickets || [];
};

// --- 2. GET ALL TICKETS ---
const getAllTickets = async (limit = 10, offset = 0): Promise<SupportTicket[]> => {
  const response = await localClient.query({
    query: GET_ALL_TICKETS,
    variables: {
      limit,
      offset,
    },
    fetchPolicy: "network-only",
  });

  const data = response.data as any;

  return (data.support_tickets || []).map((ticket: any) => ({
    ...ticket,
    practice_name:
      ticket.practice_info?.practice_name || "Unknown Practice",
  }));
};

// --- 3. CREATE TICKET ---
const createTicket = async (
  payload: CreateTicketInput
): Promise<SupportTicket> => {
  const response = await localClient.mutate({
    mutation: CREATE_TICKET,
    variables: {
      object: {
        ...payload,
        type: "PRACTICE_ADMIN",
        status: "OPEN",
      },
    },
  });

  return (response.data as any).insert_support_tickets_one;
};

// --- 4. UPDATE TICKET ---
const updateTicket = async (
  input: UpdateTicketInput
): Promise<SupportTicket> => {
  const { id, ...changes } = input;

  const response = await localClient.mutate({
    mutation: UPDATE_TICKET,
    variables: {
      id,
      changes,
    },
  });

  return (response.data as any).update_support_tickets_by_pk;
};

// --- 5. UPDATE TICKET STATUS ---
const updateTicketStatus = async (
  id: string,
  status: TicketStatus
): Promise<SupportTicket> => {
  return await updateTicket({ id, status });
};

// --- 6. GET NEXT REQUEST NUMBER ---
const getNextRequestNumber = async (): Promise<number> => {
  const response = await localClient.query({
    query: GET_LAST_REQUEST_NUMBER,
    fetchPolicy: "network-only",
  });

  const data = response.data as any;

  const latest =
    data?.support_tickets?.[0]?.request_number || 0;

  return latest + 1;
};

// --- 7. GET TICKET MESSAGES ---
const getTicketMessages = async (ticketId: string, limit = 20, offset = 0) => {
  const response = await localClient.query({
    query: GET_TICKET_MESSAGES,
    variables: {
      ticketId,
      limit,
      offset,
    },
    fetchPolicy: "network-only",
  });

  return (response.data as any).support_messages || [];
};

// --- 8. SEND MESSAGE ---
const sendMessage = async (payload: any) => {
  const response = await localClient.mutate({
    mutation: SEND_MESSAGE,
    variables: {
      object: payload,
    },
  });

  return (response.data as any).insert_support_messages_one;
};

const supportService = {
  getClinicTickets,
  getAllTickets,
  getNextRequestNumber,
  createTicket,
  updateTicket,
  updateTicketStatus,
  getTicketMessages,
  sendMessage,
};

export default supportService;