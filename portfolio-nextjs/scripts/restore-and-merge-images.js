const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 1. Get original main branch produtoData.js content
const mainContent = execSync('git show origin/main:portfolio-nextjs/src/data/produtoData.js', { encoding: 'utf8' });
const code = mainContent.replace('export const projetosData =', 'return');
const mainProjects = (new Function(code))();

const targetSlugs = ['sereno', 'oko', 'nuage', 'jam', 'mandarim', 'zazen', 'kraft', 'iconic', 'sonora'];

// Map main projects by slug
const mainMap = {};
mainProjects.forEach(p => {
  if (targetSlugs.includes(p.slug)) {
    mainMap[p.slug] = p;
  }
});

// 2. Read current central projects-data.json
const centralPath = path.join(__dirname, '../src/data/projects-data.json');
const projectsData = JSON.parse(fs.readFileSync(centralPath, 'utf8'));

// 3. Update the 9 target projects
projectsData.forEach(p => {
  if (targetSlugs.includes(p.slug)) {
    const mainP = mainMap[p.slug];
    if (mainP) {
      // Keep original thumbnail from main
      if (mainP.thumbnail) {
        p.thumbnail = mainP.thumbnail;
      }

      // Combine main gallery + newly uploaded images
      const existingGallery = mainP.gallery || [];
      const currentGallery = p.gallery || [];

      const seenUrls = new Set();
      const combinedGallery = [];

      // Add main gallery images first
      existingGallery.forEach(img => {
        const src = img.src || img.url;
        if (src && !seenUrls.has(src)) {
          seenUrls.add(src);
          combinedGallery.push({ type: 'image', src });
        }
      });

      // Add newly uploaded images
      currentGallery.forEach(img => {
        const src = img.src || img.url;
        if (src && !seenUrls.has(src)) {
          seenUrls.add(src);
          combinedGallery.push({ type: 'image', src });
        }
      });

      p.gallery = combinedGallery;
      console.log(`✅ [${p.slug}] Preserved main thumbnail and combined gallery (${combinedGallery.length} images total).`);
    }
  }
});

// 4. Save updated projects-data.json
fs.writeFileSync(centralPath, JSON.stringify(projectsData, null, 2), 'utf8');
console.log(`🎉 projects-data.json successfully updated!`);
