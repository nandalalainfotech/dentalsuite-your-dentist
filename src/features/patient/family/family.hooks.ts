import { useEffect, useState } from "react";
import {
    getFamilyMembers,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
} from "./family.service";
import type { FamilyMember } from "./family.types";

export const useFamilyMembers = () => {
    const [members, setMembers] =
        useState<FamilyMember[]>([]);

    const [loading, setLoading] =
        useState(true);

    const fetchMembers = async () => {
        try {
            const response =
                await getFamilyMembers();

            const formattedMembers =
                response.familyMembers.map(
                    (member: FamilyMember) => ({
                        id: member.id,
                        first_name: member.first_name,
                        last_name: member.last_name,
                        email: member.email,
                        mobile_number: member.mobile_number,
                        gender: member.gender,
                        date_of_birth:
                            member.date_of_birth,
                        relation:
                            member.relation,
                        is_active: false,
                    }),
                );

            setMembers(formattedMembers);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const createMember = async (
        payload: any,
    ) => {
        await addFamilyMember(payload);

        await fetchMembers();
    };

    const editMember = async (
        memberId: string,
        payload: any,
    ) => {
        await updateFamilyMember(
            memberId,
            payload,
        );

        await fetchMembers();
    };

    const removeMember = async (
        memberId: string,
    ) => {
        await deleteFamilyMember(
            memberId,
        );

        await fetchMembers();
    };

    return {
        members,
        loading,
        fetchMembers,
        createMember,
        editMember,
        removeMember,
    };
};