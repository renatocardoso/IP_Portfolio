const fs = require('fs');
const path = require('path');

const projectsUpload = require('../src/data/projects-data.json');
const { projetosData: existingData } = require('../src/data/produtoData.js');

const uploadMap = {};
projectsUpload.forEach(p => {
  uploadMap[p.projectId.toLowerCase()] = p.images;
});

const slugToFolder = {
  'sereno': 'sereno',
  'oko': 'oko',
  'nuage': 'nuage',
  'jam': 'jam',
  'mandarim': 'mandarin',
  'zazen': 'zazen',
  'kraft': 'kraft',
  'iconic': 'iconic',
  'sonora': 'sonora',
  'moon': 'moon',
  'space': 'space',
  'acqua': 'acqua'
};

// 1. Update existing projects with new CDN images
const updatedExisting = existingData.map(p => {
  const folderKey = slugToFolder[p.slug];
  if (folderKey && uploadMap[folderKey]) {
    const images = uploadMap[folderKey];
    return {
      ...p,
      thumbnail: images[0].url,
      gallery: images.map(img => ({ type: 'image', src: img.url }))
    };
  }
  return p;
});

// 2. New projects configuration
const newProjectsConfig = [
  { folder: 'akio', title: 'Akio', slug: 'akio' },
  { folder: 'atol', title: 'Atol', slug: 'atol' },
  { folder: 'base', title: 'Base', slug: 'base' },
  { folder: 'cadeira', title: 'Cadeira', slug: 'cadeira' },
  { folder: 'carpedien', title: 'Carpe diem', slug: 'carpe-diem' },
  { folder: 'egoiste', title: 'Egoiste', slug: 'egoiste' },
  { folder: 'farfale', title: 'Farfale', slug: 'farfale' },
  { folder: 'ito', title: 'Ito', slug: 'ito' },
  { folder: 'kaicai', title: 'Haicai', slug: 'haicai' },
  { folder: 'kube', title: 'Kube', slug: 'kube' },
  { folder: 'mandarina', title: 'Mandarina', slug: 'mandarina' },
  { folder: 'movie', title: 'Movie', slug: 'movie' },
  { folder: 'pulp', title: 'Pulp', slug: 'pulp' },
  { folder: 'tera', title: 'Tera', slug: 'tera' },
  { folder: 'timeless', title: 'Timeless', slug: 'timeless' },
  { folder: 'toko', title: 'Toko', slug: 'toko' },
  { folder: 'triskel', title: 'Triskel', slug: 'triskel' },
  { folder: 'yo', title: 'Yo', slug: 'yo' }
];

const newProjects = newProjectsConfig.map(item => {
  const images = uploadMap[item.folder] || [];
  // Select a thumbnail (first image) and put all remaining images into gallery
  const thumbIdx = 0;
  const thumbnail = images[thumbIdx] ? images[thumbIdx].url : '';
  const gallery = images.filter((_, idx) => idx !== thumbIdx).map(img => ({ type: 'image', src: img.url }));

  return {
    slug: item.slug,
    title: item.title,
    title_en: item.title,
    desc_pt: '',
    desc_en: '',
    client: 'Conceito',
    year: '2026',
    category: 'produto',
    thumbnail: thumbnail,
    tags: ['produto'],
    gallery: gallery.length > 0 ? gallery : [{ type: 'image', src: thumbnail }]
  };
});

const finalData = [...updatedExisting, ...newProjects];

const jsCode = `export const projetosData = ${JSON.stringify(finalData, null, 4)};\n`;

const targetPath = path.join(__dirname, '../src/data/produtoData.js');
fs.writeFileSync(targetPath, jsCode, 'utf8');

console.log(`✅ Successfully updated ${targetPath} with ${finalData.length} projects!`);
