/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import {
    Plus,
    Search,
    Trash2,
    Pencil,
    Loader2,
    Briefcase
} from "lucide-react";

import { useQuery, useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";

import { localClient } from "../../../api/apollo/localClient";


import type { AllService } from "../../../features/directory/directory.types";
import { GET_ALL_SERVICES, CREATE_SERVICE, UPDATE_SERVICE, DELETE_SERVICE } from "../graphql/allservices.query";

interface GetAllServicesResponse {
    all_services: AllService[];
}

export default function AllServices() {

    const [search, setSearch] = useState("");
    const [serviceName, setServiceName] = useState("");

    const [editingId, setEditingId] = useState<string | null>(null);

    // FETCH SERVICES
    const {
        data,
        loading,
        refetch
    } = useQuery<GetAllServicesResponse>(
        GET_ALL_SERVICES,
        {
            client: localClient,
            fetchPolicy: "network-only"
        }
    );

    // CREATE SERVICE
    const [createService, { loading: creating }] = useMutation(
        CREATE_SERVICE,
        {
            client: localClient
        }
    );

    // UPDATE SERVICE
    const [updateService] = useMutation(
        UPDATE_SERVICE,
        {
            client: localClient
        }
    );

    // DELETE SERVICE
    const [deleteService] = useMutation(
        DELETE_SERVICE,
        {
            client: localClient
        }
    );

    // SERVICES
    const services = data?.all_services ?? [];

    // FILTERED SERVICES
    const filteredServices = services.filter((service: AllService) =>
        service.service_name
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    // ADD / UPDATE
    const handleAddOrUpdate = async () => {

        if (!serviceName.trim()) {
            return toast.error("Service name required");
        }

        try {

            // UPDATE
            if (editingId) {

                await updateService({
                    variables: {
                        id: editingId,
                        service_name: serviceName
                    }
                });

                toast.success("Service updated successfully");

            } else {

                // CREATE
                await createService({
                    variables: {
                        service_name: serviceName
                    }
                });

                toast.success("Service added successfully");
            }

            setServiceName("");
            setEditingId(null);

            await refetch();

        } catch (error: any) {

            console.error(error);

            toast.error(
                error?.message || "Something went wrong"
            );
        }
    };

    // EDIT
    const handleEdit = (service: AllService) => {

        setEditingId(service.id);

        setServiceName(service.service_name);
    };

    // DELETE
    const handleDelete = async (id: string) => {

        try {

            await deleteService({
                variables: { id }
            });

            toast.success("Service deleted successfully");

            await refetch();

        } catch (error) {

            console.error(error);

            toast.error("Failed to delete service");
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">

                <div>
                    <h1 className="text-3xl font-black text-gray-900">
                        All Services
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage services available for practices
                    </p>
                </div>
            </div>

            {/* ADD SECTION */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm mb-8">

                <div className="flex items-center gap-3 mb-5">

                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-orange-500" />
                    </div>

                    <div>
                        <h2 className="font-bold text-gray-900">
                            {editingId
                                ? "Edit Service"
                                : "Add New Service"}
                        </h2>

                        <p className="text-sm text-gray-500">
                            Create new services visible in practice dropdown
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">

                    <input
                        type="text"
                        placeholder="Enter service name..."
                        value={serviceName}
                        onChange={(e) =>
                            setServiceName(e.target.value)
                        }
                        className="flex-1 h-12 px-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-400"
                    />

                    <button
                        onClick={handleAddOrUpdate}
                        disabled={creating}
                        className="h-12 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                        {creating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Plus className="w-4 h-4" />
                        )}

                        {editingId ? "Update" : "Add"}
                    </button>
                </div>
            </div>

            {/* SEARCH */}
            <div className="flex items-center bg-white border border-gray-300 rounded-2xl px-5 py-4 mb-6 shadow-sm">

                <Search className="w-4 h-4 text-gray-400" />

                <input
                    type="text"
                    placeholder="Search services..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full outline-none bg-transparent px-3 text-sm"
                />
            </div>

            {/* LIST */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

                {loading ? (

                    <div className="flex justify-center py-16">
                        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                    </div>

                ) : filteredServices.length === 0 ? (

                    <div className="py-20 text-center">

                        <Briefcase className="w-10 h-10 mx-auto text-gray-300 mb-3" />

                        <p className="text-gray-400 font-medium">
                            No services found
                        </p>
                    </div>

                ) : (

                    <div className="divide-y divide-gray-100">

                        {filteredServices.map((service: AllService) => (

                            <div
                                key={service.id}
                                className="flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-all"
                            >

                                <div>

                                    <h3 className="font-semibold text-gray-800">
                                        {service.service_name}
                                    </h3>

                                    <p className="text-xs text-gray-400 mt-1">
                                        Created {
                                            service.created_at
                                                ? new Date(
                                                    service.created_at
                                                ).toLocaleDateString()
                                                : "-"
                                        }
                                    </p>

                                </div>

                                <div className="flex items-center gap-2">

                                    {/* EDIT */}
                                    <button
                                        onClick={() => handleEdit(service)}
                                        className="w-10 h-10 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>

                                    {/* DELETE */}
                                    <button
                                        onClick={() => handleDelete(service.id)}
                                        className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}