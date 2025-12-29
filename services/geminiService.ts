
import { UserData, DocumentResult } from "../types";

export const generateJobDocuments = async (userData: UserData, identifier: string, feedback?: string): Promise<DocumentResult> => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userData, identifier, feedback })
  });

  if (!response.ok) {
    let errorMessage = "Generation Failed";
    try {
      const err = await response.json();
      errorMessage = err.error || errorMessage;
    } catch (e) {
      // Handle cases where response is not JSON
    }

    if (response.status === 402) {
      // Standardize the error string for the frontend catch block
      throw new Error("Payment required: Please complete your purchase to continue.");
    }
    
    throw new Error(errorMessage);
  }

  return await response.json();
};
