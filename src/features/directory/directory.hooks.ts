import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store"; // Adjust path to your store.ts if needed
import { 
  fetchDirectory, 
  updateDirectoryInfo, 
  clearDirectoryMessages 
} from "./directory.slice";
import type { UpdateDirectoryPayload } from "./directory.types";

export const useDirectory = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Select all state properties from the Redux store
  const { data, isLoading, isSaving, error, successMessage } = useSelector(
    (state: RootState) => state.directory
  );

  // Load Directory Data
  const loadDirectory = useCallback((id: string) => {
    if (id) {
      dispatch(fetchDirectory(id));
    }
  }, [dispatch]);

  // Save Base Directory Info (Used in PracticeBaseInfo / PracticeContact)
  const saveDirectoryInfo = useCallback((payload: UpdateDirectoryPayload) => {
    dispatch(updateDirectoryInfo(payload));
  }, [dispatch]);

  // Clear Success/Error Toasts & Messages
  const resetMessages = useCallback(() => {
    dispatch(clearDirectoryMessages());
  }, [dispatch]);

  return {
    // Expose Data
    directoryData: data,
    isLoading,
    isSaving,
    error,
    successMessage,
    
    // Expose Actions
    loadDirectory,
    saveDirectoryInfo,
    resetMessages
  };
};