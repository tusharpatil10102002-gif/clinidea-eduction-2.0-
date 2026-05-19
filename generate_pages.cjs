const fs = require('fs');

const template = fs.readFileSync('C:/Users/HP/Desktop/files/ClinicalResearchCoursePage.jsx', 'utf8');
const dataBlocksStr = fs.readFileSync('C:/Users/HP/Desktop/files/all-course-data-blocks.js', 'utf8');

const parts = template.split('// ────────────────────────────────────────────────────────────────────────────');
if (parts.length < 2) {
    console.error("Could not split template. Check the separator.");
    process.exit(1);
}

const topPart = parts[0];
const bottomPart = parts[1];

function extractBlock(blockName) {
  const regex = new RegExp(`export const ${blockName}\\s*=\\s*(\\{[\\s\\S]*?\\n\\}\\;\\s*\\n)`, 'm');
  const match = dataBlocksStr.match(regex);
  if (match) {
    return `const DATA = ${match[1].replace(/};\s*\n$/, '};')}`;
  }
  
  // Fallback if the regex missed it because of trailing characters
  const simpleRegex = new RegExp(`export const ${blockName} = {([\\s\\S]*?)^};`, 'm');
  const simpleMatch = dataBlocksStr.match(simpleRegex);
  if(simpleMatch) {
      return `const DATA = {${simpleMatch[1]}};`;
  }

  console.warn(`Could not find block ${blockName}`);
  return null;
}

const blocks = {
  'ClinicalResearchCrPvDm.jsx': null, 
  'ClinicalResearchPharmacovigilance.jsx': extractBlock('PHARMACOVIGILANCE_DATA'),
  'ClinicalResearchDataManagement.jsx': extractBlock('CDM_DATA'),
  'ClinicalResearchRegulatoryAffairs.jsx': extractBlock('RA_DATA'),
  'ClinicalResearchMedicalWriting.jsx': extractBlock('MEDICAL_WRITING_DATA'),
};

for (const [filename, newBlock] of Object.entries(blocks)) {
  let content = '';
  if (newBlock) {
     const customTopPart = topPart.replace(/const DATA = \{[\s\S]*?\n\};\n/m, newBlock + '\n');
     content = customTopPart + '// ────────────────────────────────────────────────────────────────────────────' + bottomPart;
  } else {
     content = template;
  }
  
  const componentName = filename.split('.')[0];
  content = content.replace(/export default function ClinicalResearchCoursePage/g, `export default function ${componentName}`);
  
  fs.writeFileSync(`src/pages/${filename}`, content);
  console.log(`Updated ${filename}`);
}
console.log('Pages generated successfully!');
