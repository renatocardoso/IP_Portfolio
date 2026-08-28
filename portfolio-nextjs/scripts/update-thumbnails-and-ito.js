const fs = require('fs');
const path = require('path');

const centralPath = path.join(__dirname, '../src/data/projects-data.json');
const projects = JSON.parse(fs.readFileSync(centralPath, 'utf8'));

const targetThumbnails = {
  toko: 'https://41fyotqqdf.ufs.sh/f/047OTbUFRaz70tOgqmwUFRaz7ojmHIOPSXUkt8QMrec156su',
  ito: 'https://41fyotqqdf.ufs.sh/f/047OTbUFRaz7ekVJXH5bSlRH2oJsrVNA31q5kjEYMZe0BXhc',
  atol: 'https://41fyotqqdf.ufs.sh/f/047OTbUFRaz70fzAe3UFRaz7ojmHIOPSXUkt8QMrec156su3'
};

const imageToRemoveFromIto = 'https://41fyotqqdf.ufs.sh/f/047OTbUFRaz7ZRIyxDQu0W5PBHYFcEzubtUCfS18V76QjDAp';

projects.forEach(p => {
  // Update thumbnail if in targetThumbnails
  if (targetThumbnails[p.slug]) {
    const newThumb = targetThumbnails[p.slug];
    const oldThumb = p.thumbnail;
    p.thumbnail = newThumb;

    // Build new gallery: all unique images belonging to project except current thumbnail
    const allImages = [];
    if (oldThumb) allImages.push(oldThumb);
    (p.gallery || []).forEach(g => {
      const src = g.src || g.url;
      if (src) allImages.push(src);
    });
    if (newThumb) allImages.push(newThumb);

    // Filter out target thumbnail and Ito removed image
    const seen = new Set();
    const cleanGallery = [];

    allImages.forEach(src => {
      if (src === newThumb) return; // exclude thumbnail from gallery
      if (p.slug === 'ito' && src === imageToRemoveFromIto) return; // exclude removed image from Ito
      if (!seen.has(src)) {
        seen.add(src);
        cleanGallery.push({ type: 'image', src });
      }
    });

    p.gallery = cleanGallery;
    console.log(`✅ Updated ${p.slug}: Thumbnail = ${newThumb}, Gallery count = ${cleanGallery.length}`);
  }
});

fs.writeFileSync(centralPath, JSON.stringify(projects, null, 2), 'utf8');
console.log('🎉 Updated projects-data.json successfully!');
