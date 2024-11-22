interface ICDCodeResult {
  [code: string]: string;
}

export const searchICDCodes = async (query: string): Promise<ICDCodeResult> => {
  if (!query || query.length < 3) {
    return {};
  }

  try {
    const response = await fetch(
      `https://7ff4-122-175-5-80.ngrok-free.app/search/codes?query=${encodeURIComponent(query)}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data || {};
  } catch (error) {
    console.error('Error searching ICD codes:', error);
    return {};
  }
}