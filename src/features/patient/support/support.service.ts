// src/features/support/support.service.ts

import axios from "axios";

import type {
    CreateTicketPayload,
    SendMessagePayload,
} from "./support.types";
import API_ENDPOINTS from "../../../config/api";

const API_URL =
    API_ENDPOINTS.SUPPORT;

const getAuthHeaders = () => {
    const patientToken =
        localStorage.getItem(
            "patient_access_token"
        );

    const practiceToken =
        localStorage.getItem(
            "access_token"
        );

    const token =
        patientToken || practiceToken;

    return {
        Authorization: `Bearer ${token}`,
    };
};

const createTicket = async (
    payload: CreateTicketPayload
) => {
    const response =
        await axios.post(
            `${API_URL}/tickets`,
            payload,
            {
                headers: getAuthHeaders(),
            }
        );

    return response.data;
};

const getTickets = async (
    limit = 20,
    cursor?: string
) => {
    const response =
        await axios.get(
            `${API_URL}/tickets`,
            {
                headers: getAuthHeaders(),
                params: {
                    limit,
                    cursor,
                },
            }
        );

    return response.data;
};

const getMessages = async (
    ticketId: string,
    limit = 30,
    cursor?: string
) => {
    const response =
        await axios.get(
            `${API_URL}/tickets/${ticketId}/messages`,
            {
                headers: getAuthHeaders(),
                params: {
                    limit,
                    cursor,
                },
            }
        );

    return response.data;
};

const sendMessage = async (
    ticketId: string,
    payload: SendMessagePayload
) => {
    const response =
        await axios.post(
            `${API_URL}/tickets/${ticketId}/messages`,
            payload,
            {
                headers: getAuthHeaders(),
            }
        );

    return response.data;
};

const supportService = {
    createTicket,
    getTickets,
    getMessages,
    sendMessage,
};

export default supportService;