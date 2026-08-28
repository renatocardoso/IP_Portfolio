const fs = require('fs');
const path = require('path');

const produtoProjects = require('../src/data/produtoData.js').projetosData;
const graficoProjects = require('../src/data/graficoData.js').projetosData;

// Normalize each project to guarantee standard schema
function normalizeProject(p, defaultCategory) {
  return {
    slug: p.slug,
    title: p.title || '',
    title_en: p.title_en || p.title || '',
    desc_pt: p.desc_pt || '',
    desc_en: p.desc_en || '',
    client: p.client || 'Conceito',
    year: p.year || '2026',
    category: p.category || defaultCategory,
    tags: Array.isArray(p.tags) ? p.tags : [defaultCategory],
    thumbnail: p.thumbnail || '',
    gallery: Array.isArray(p.gallery) ? p.gallery : []
  };
}

const allProjects = [
  ...produtoProjects.map(p => normalizeProject(p, 'produto')),
  ...graficoProjects.map(p => normalizeProject(p, 'grafico'))
];

const projectsDataPath = path.join(__dirname, '../src/data/projects-data.json');
fs.writeFileSync(projectsDataPath, JSON.stringify(allProjects, null, 2), 'utf8');

console.log(`✅ Successfully generated central ${projectsDataPath} with ${allProjects.length} projects!`);
