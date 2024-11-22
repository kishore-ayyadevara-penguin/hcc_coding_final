interface ICDCode {
  code: string;
  description: string;
}

export const ICD_CODES: ICDCode[] = [
  { code: 'D50.0', description: 'Iron deficiency anemia secondary to blood loss (chronic)' },
  { code: 'D50.1', description: 'Sideropenic dysphagia' },
  { code: 'D50.8', description: 'Other iron deficiency anemias' },
  { code: 'D50.9', description: 'Iron deficiency anemia, unspecified' },
  { code: 'D51.0', description: 'Vitamin B12 deficiency anemia due to intrinsic factor deficiency' },
  { code: 'D51.1', description: 'Vitamin B12 deficiency anemia due to selective vitamin B12 malabsorption with proteinuria' },
  { code: 'D51.2', description: 'Transcobalamin II deficiency' },
  { code: 'D51.3', description: 'Other dietary vitamin B12 deficiency anemia' },
  { code: 'D51.8', description: 'Other vitamin B12 deficiency anemias' },
  { code: 'D51.9', description: 'Vitamin B12 deficiency anemia, unspecified' },
];