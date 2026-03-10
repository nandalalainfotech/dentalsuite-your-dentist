import { interfaceClient } from "../api/apollo/dental_interface";
import { GET_DIRECTORY_QUERY } from "../queries/directory_query";

// 1. Define the expected response shape
interface DirectoryResponse {
  directories: any[]; 
}

export const getDirectoryService = async (practiceId: string) => {
  // 2. Pass the type to the query function: <DirectoryResponse>
  const { data } = await interfaceClient.query<DirectoryResponse>({
    query: GET_DIRECTORY_QUERY,
    variables: { id: practiceId },
    fetchPolicy: "network-only",
  });

  if (!data || !data.directories || data.directories.length === 0) {
    return null;
  }

  return data.directories[0];
};