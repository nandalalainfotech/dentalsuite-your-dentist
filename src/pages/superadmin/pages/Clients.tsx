import { useQuery } from "@apollo/client/react";
import { GET_CLIENTS_QUERY } from "../graphql/clients.query";


interface Client {
    id: string;
    practice_name: string;
    email: string;
    practice_phone: string;
    status: string;
    created_at: string;
}

interface ClientsQueryResponse {
    accounts: Client[];
}

export default function Clients() {
    const { data, loading, error } = useQuery<ClientsQueryResponse>(GET_CLIENTS_QUERY);

    if (loading) return <div>Loading clients...</div>;
    if (error) return <div>Error loading clients</div>;

    const clients: Client[] = data?.accounts || [];

    return (
        <div className="p-6">

            <h1 className="text-2xl font-bold mb-6">Clients</h1>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="w-full">

                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-4">Practice Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Phone</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Created</th>
                        </tr>
                    </thead>

                    <tbody>

                        {clients.map((client) => (
                            <tr key={client.id} className="border-t">

                                <td className="p-4">{client.practice_name}</td>

                                <td className="p-4">{client.email}</td>

                                <td className="p-4">{client.practice_phone}</td>

                                <td className="p-4">
                                    <span
                                        className={`px-3 py-1 rounded text-sm ${client.status === "PENDING"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-green-100 text-green-700"
                                            }`}
                                    >
                                        {client.status}
                                    </span>
                                </td>

                                <td className="p-4">
                                    {new Date(client.created_at).toLocaleDateString()}
                                </td>

                            </tr>
                        ))}

                    </tbody>

                </table>
            </div>
        </div>
    );
}