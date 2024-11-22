const baseColors: { [key: string]: string } = {
  'L50': 'bg-blue-100 text-blue-800',
  'J31.0': 'bg-purple-100 text-purple-800',
  'T78.1': 'bg-green-100 text-green-800',
  'T56.8': 'bg-yellow-100 text-yellow-800',
  'R06.2': 'bg-rose-100 text-rose-800',
};

const customColorPairs = [
  { bg: 'bg-red-100', text: 'text-red-800' },
  { bg: 'bg-blue-100', text: 'text-blue-800' },
  { bg: 'bg-green-100', text: 'text-green-800' },
  { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  { bg: 'bg-purple-100', text: 'text-purple-800' },
  { bg: 'bg-pink-100', text: 'text-pink-800' },
  { bg: 'bg-indigo-100', text: 'text-indigo-800' },
  { bg: 'bg-cyan-100', text: 'text-cyan-800' },
];

const entityColors: { [key: string]: string } = { ...baseColors };

export const generateEntityColor = (type: string): string => {
  // Extract the base ICD code without description
  const baseType = type.split(' - ')[0];
  
  if (entityColors[baseType]) {
    return entityColors[baseType];
  }

  // Select a color pair based on the hash of the type string
  const hash = baseType.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  const colorPair = customColorPairs[hash % customColorPairs.length];
  
  const colorClass = `${colorPair.bg} ${colorPair.text}`;
  entityColors[baseType] = colorClass;
  
  return colorClass;
};

export const getEntityColor = (type: string): string => {
  const baseType = type.split(' - ')[0];
  return entityColors[baseType] || generateEntityColor(type);
};