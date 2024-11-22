export interface Entity {
  id: string;
  text: string;
  type: string;
  start: number;
  end: number;
  icd_code?: string;
}

export interface OCRResponse {
  file_content: string;
  pages: { [key: string]: string };
}

export interface ProcessingStatus {
  ocr: boolean;
  pii: boolean;
  disease: boolean;
  icd: boolean;
  hcc: boolean;
}

export interface PageMapping {
  icd_code: string;
  text: string;
  position: [number, number];
}

export interface MedicalNotesResponse {
  page_mappings: { [key: string]: PageMapping[] };
  all_entities: string[];
}