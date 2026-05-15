import { gql } from "@apollo/client";

// src/features/support/support.query.ts
export const GET_CLINIC_TICKETS = gql`
  query GetClinicTickets($practiceId: uuid!) {
    support_tickets(
      where: { practice_id: { _eq: $practiceId } }
      order_by: { created_at: desc }
    ) {
      id
      request_number
      practice_id
      practice_name
      email
      subject
      enquiry_details
      relates_to
      type
      status
      attachments
      created_at
      updated_at
    }
  }
`;

// Add this to your graphql/support.query.ts
export const GET_ALL_TICKETS = gql`
  query GetAllTickets($limit: Int!, $offset: Int!) {
    support_tickets(
      limit: $limit
      offset: $offset
      order_by: { created_at: desc }
    ) {
      id
      request_number
      subject
      enquiry_details
      email
      relates_to
      status
      attachments
      type
      created_at
      updated_at
      practice_id
      practice_name

      practice_info {
        id
        practice_name
      }
    }
  }
`;

export const CREATE_TICKET = gql`
  mutation CreateTicket($object: support_tickets_insert_input!) {
    insert_support_tickets_one(object: $object) {
      id
      request_number
      practice_id
      subject
      enquiry_details
      status
      created_at
    }
  }
`;

export const UPDATE_TICKET = gql`
  mutation UpdateTicket($id: uuid!, $changes: support_tickets_set_input!) {
    update_support_tickets_by_pk(
      pk_columns: { id: $id }
      _set: $changes
    ) {
      id
      status
      updated_at
    }
  }
`;

export const GET_TICKET_MESSAGES = gql`
  query GetTicketMessages(
    $ticketId: uuid!
    $limit: Int!
    $offset: Int!
  ) {
    support_messages(
      where: { ticket_id: { _eq: $ticketId } }
      limit: $limit
      offset: $offset
      order_by: { created_at: asc }
    ) {
      id
      ticket_id
      sender_id
      sender_type
      message
      attachments
      created_at
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($object: support_messages_insert_input!) {
    insert_support_messages_one(object: $object) {
      id
      ticket_id
      sender_id
      sender_type
      message
      attachments
      created_at
    }
  }
`;

export const CREATE_MESSAGE = gql`
  mutation CreateMessage($object: support_messages_insert_input!) {
    insert_support_messages_one(object: $object) {
      id
    }
  }
`;

export const GET_LAST_REQUEST_NUMBER = gql`
  query GetLastRequestNumber {
    support_tickets(
      limit: 1
      order_by: { request_number: desc }
    ) {
      request_number
    }
  }
`;