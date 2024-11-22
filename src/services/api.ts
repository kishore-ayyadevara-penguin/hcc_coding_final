const BASE_URL = 'https://7ff4-122-175-5-80.ngrok-free.app';

interface RunsResponse {
  runs: { [runId: string]: string };
}

interface NewRunResponse {
  run_id: string;
}

export const initializeNewRun = async (): Promise<string> => {
  const response = await fetch(`${BASE_URL}/new_run`, {
    method: 'POST',
    headers: {
      'accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to initialize new run');
  }

  const data: NewRunResponse = await response.json();
  return data.run_id;
};

export const uploadFile = async (file: File, runId: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BASE_URL}/upload/${runId}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload file');
  }

  const { download_url } = await response.json();
  return download_url;
};

export const processOCR = async (file: File, runId: string): Promise<OCRResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BASE_URL}/ocr/${runId}`, {
    method: 'POST',
    body: formData,
    headers: {
      'accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('OCR processing failed');
  }

  return response.json();
};

export const processPIIRedaction = async (fileContent: string, runId: string) => {
  const response = await fetch(`${BASE_URL}/pii_redaction/${runId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ocr_content: { content: fileContent },
      filters: ["name", "dob", "email_address", "healthcare_number", "phone_number", "numerical_pii"]
    }),
  });

  if (!response.ok) {
    throw new Error('PII redaction failed');
  }

  return response.json();
};

export const processDiseaseExtraction = async (redactedContent: string, runId: string) => {
  const params = new URLSearchParams({
    model: 'custom-model'
  });

  const response = await fetch(`${BASE_URL}/diseases/${runId}?${params}`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([redactedContent]),
  });

  if (!response.ok) {
    throw new Error('Disease extraction failed');
  }

  return response.json();
};

export const processICDMapping = async (diseasesData: any, runId: string) => {
  const response = await fetch(`${BASE_URL}/get_icd_codes/${runId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(diseasesData),
  });

  if (!response.ok) {
    throw new Error('ICD code mapping failed');
  }

  return response.json();
};

export const processFillICDCodes = async (icdData: any, runId: string) => {
  const params = new URLSearchParams({
    model: 'hcc-model'
  });

  const response = await fetch(`${BASE_URL}/fill_icd_codes/${runId}?${params}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(icdData),
  });

  if (!response.ok) {
    throw new Error('Fill ICD codes failed');
  }

  return response.json();
};

export const processHCCMapping = async (filledICDData: any, runId: string) => {
  const response = await fetch(`${BASE_URL}/hcc/${runId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(filledICDData),
  });

  if (!response.ok) {
    throw new Error('HCC code mapping failed');
  }

  return response.json();
};

export const processPaginatedMedicalNotes = async (paginatedContent: { [key: string]: string }, runId: string, hccResults?: any) => {
  const body = hccResults 
    ? {
        paginated_content: paginatedContent,
        payload: hccResults
      }
    : {
        paginated_content: paginatedContent
      };

  const response = await fetch(`${BASE_URL}/process_paginated_medical_notes/${runId}`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Medical notes processing failed');
  }

  return response.json();
};

export const fetchRuns = async (): Promise<RunsResponse> => {
  const response = await fetch(`${BASE_URL}/runs`, {
    method: 'POST',
    headers: {
      'accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch runs');
  }

  return response.json();
};

export const fetchRunData = async (runId: string) => {
  // Download the PDF file
  const downloadResponse = await fetch(`${BASE_URL}/download/${runId}`, {
    method: 'POST',
    headers: {
      'accept': 'application/json'
    }
  });

  if (!downloadResponse.ok) {
    throw new Error('Failed to download PDF');
  }

  const { download_url } = await downloadResponse.json();
  const fileResponse = await fetch(download_url);
  if (!fileResponse.ok) {
    throw new Error('Failed to fetch PDF file');
  }
  const fileBlob = await fileResponse.blob();
  const pdfUrl = URL.createObjectURL(fileBlob);

  // Get OCR data
  const ocrResponse = await fetch(`${BASE_URL}/ocr/${runId}`, {
    method: 'POST',
    headers: {
      'accept': 'application/json'
    }
  });

  if (!ocrResponse.ok) {
    throw new Error('Failed to fetch OCR data');
  }

  const ocrData = await ocrResponse.json();

  // Get medical notes
  const medicalNotesResponse = await processPaginatedMedicalNotes(ocrData.pages, runId);

  return {
    pdfUrl,
    ocrData,
    medicalNotes: medicalNotesResponse
  };
};