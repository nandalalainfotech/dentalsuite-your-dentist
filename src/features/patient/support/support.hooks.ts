// src/features/support/useSupport.ts

import { useState } from "react";

import supportService from "./support.service";

import type {
    CreateTicketPayload,
    SendMessagePayload,
    SupportTicket,
    SupportMessage,
} from "./support.types";

export const useSupport = () => {
    const [isLoading, setLoading] =
        useState(false);

    const createTicket = async (
        payload: CreateTicketPayload
    ) => {
        try {
            setLoading(true);

            const response =
                await supportService.createTicket(
                    payload
                );

            return {
                success: true,
                data: response,
            };
        } catch (error: any) {
            return {
                success: false,
                message:
                    error?.response?.data?.message ||
                    "Failed to create ticket",
            };
        } finally {
            setLoading(false);
        }
    };

    const getTickets = async (
        limit = 20,
        cursor?: string
    ): Promise<{
        success: boolean;
        data?: SupportTicket[];
        nextCursor?: string | null;
        hasMore?: boolean;
        message?: string;
    }> => {
        try {
            setLoading(true);

            const response =
                await supportService.getTickets(
                    limit,
                    cursor
                );

            return {
                success: true,
                data: response.tickets ?? [],
                nextCursor:
                    response.nextCursor ?? null,
                hasMore:
                    response.hasMore ?? false,
            };
        } catch (error: any) {
            return {
                success: false,
                message:
                    error?.response?.data?.message ||
                    "Failed to load tickets",
            };
        } finally {
            setLoading(false);
        }
    };

    const getMessages = async (
        ticketId: string,
        limit = 30,
        cursor?: string
    ): Promise<{
        success: boolean;
        data?: SupportMessage[];
        nextCursor?: string | null;
        hasMore?: boolean;
        message?: string;
    }> => {
        try {
            setLoading(true);

            const response =
                await supportService.getMessages(
                    ticketId,
                    limit,
                    cursor
                );

            return {
                success: true,
                data: response.messages ?? [],
                nextCursor:
                    response.nextCursor ?? null,
                hasMore:
                    response.hasMore ?? false,
            };
        } catch (error: any) {
            return {
                success: false,
                message:
                    error?.response?.data?.message ||
                    "Failed to load messages",
            };
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (
        ticketId: string,
        payload: SendMessagePayload
    ) => {
        try {
            setLoading(true);

            const response =
                await supportService.sendMessage(
                    ticketId,
                    payload
                );

            return {
                success: true,
                data: response,
            };
        } catch (error: any) {
            return {
                success: false,
                message:
                    error?.response?.data?.message ||
                    "Failed to send message",
            };
        } finally {
            setLoading(false);
        }
    };

    return {
        createTicket,
        getTickets,
        getMessages,
        sendMessage,
        isLoading,
    };
};

export default useSupport;