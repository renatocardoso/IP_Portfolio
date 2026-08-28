const fs = require('fs');
const path = require('path');

const uploads = require('../src/data/projects-data.json');
const centralPath = path.join(__dirname, '../src/data/projects-data.json');
let projects = JSON.parse(fs.readFileSync(centralPath, 'utf8'));

// 1. Uploaded CDN map for accurate files
const atolImages = [
  'https://41fyotqqdf.ufs.sh/f/047OTbUFRaz7qmPU0qpQYVuvH9R2MEta3qoSm8Bzg1xbFJ56', // AtolA (1)
  'https://41fyotqqdf.ufs.sh/f/047OTbUFRaz7SctE2ZdxLagkEYQucWCXVx3fwGml1MitZB9q', // AtolB (2)
  'https://41fyotqqdf.ufs.sh/f/047OTbUFRaz70fzAe3UFRaz7ojmHIOPSXUkt8QMrec156su3', // AtolC (3)
  'https://41fyotqqdf.ufs.sh/f/047OTbUFRaz7jFCBxTEkoUPXq74KDfxlYy23B0TVeW5ciJ8S'  // AtolD (4)
];

const kubeImages = [
  'https://41fyotqqdf.ufs.sh/f/047OTbUFRaz7ezeeoI5bSlRH2oJsrVNA31q5kjEYMZe0BXhc', // KubeA (1)
  'https://41fyotqqdf.ufs.sh/f/047OTbUFRaz7dYELxJCVDmHaL07yhbZKojBuAC2Gce59kTpt', // KubeB (2)
  'https://41fyotqqdf.ufs.sh/f/047OTbUFRaz7ScbEpzQxLagkEYQucWCXVx3fwGml1MitZB9q', // KubeC (3)
  'https://41fyotqqdf.ufs.sh/f/047OTbUFRaz7nzRlcP2EsfXp4APkDSxeUbni7ajqIHY92cCm', // KubeD (4)
  'https://41fyotqqdf.ufs.sh/f/047OTbUFRaz7QFj2AM1c6gedqP1zGVAfm5p4aShYIjUxZb7O', // KubeE (5)
  'https://41fyotqqdf.ufs.sh/f/047OTbUFRaz7uUiGpkwjF7GOsuvIRypc2TdB3EY5M0PAf8gz', // KubeF (6)
  'https://41fyotqqdf.ufs.sh/f/047OTbUFRaz7dhjeWfCVDmHaL07yhbZKojBuAC2Gce59kTpt', // KubeG (7)
  'https://41fyotqqdf.ufs.sh/f/047OTbUFRaz7ZRhLsvWu0W5PBHYFcEzubtUCfS18V76QjDAp'  // KubeH (8)
];

const tokoImages = [
  'https://41fyotqqdf.ufs.sh/f/047OTbUFRaz7h0WdxhmkoEjxnf3Q0rWCs2wKOdvh9HUM8P6z', // TokoA (1)
  'https://41fyotqqdf.ufs.sh/f/047OTbUFRaz70tOgqmwUFRaz7ojmHIOPSXUkt8QMrec156su', // TokoB (2)
  'https://41fyotqqdf.ufs.sh/f/047OTbUFRaz7ugZkELwjF7GOsuvIRypc2TdB3EY5M0PAf8gz'  // TokoC (3)
];

const itoImages = [
  'https://41fyotqqdf.ufs.sh/f/047OTbUFRaz7GEoPsvf6E7jguTdaA8N54cKypx1XYCVoR93l', // ItoA (1)
  'https://41fyotqqdf.ufs.sh/f/047OTbUFRaz73HCvxPyiCc7ykYGxUR6KMEBg0odwbe5zNIj8', // ItoB (2)
  'https://41fyotqqdf.ufs.sh/f/047OTbUFRaz7eFtpuP5bSlRH2oJsrVNA31q5kjEYMZe0BXhc', // ItoC (3)
  'https://41fyotqqdf.ufs.sh/f/047OTbUFRaz7cr1rl1nWJGwS0cYtZbunvaj3TUQ1srzDCMOL', // ItoD (4)
  'https://41fyotqqdf.ufs.sh/f/047OTbUFRaz7ekVJXH5bSlRH2oJsrVNA31q5kjEYMZe0BXhc', // ItoE (5)
  'https://41fyotqqdf.ufs.sh/f/047OTbUFRaz7ZRIyxDQu0W5PBHYFcEzubtUCfS18V76QjDAp', // ItoF (6)
  'https://41fyotqqdf.ufs.sh/f/047OTbUFRaz7KeSDSJzqeiax41Jgf9kWy5wsLXTcmG7zvF8B'  // ItoG (7)
];

// Helper to set thumbnail and gallery for a project given specific images array and 1-based thumb index
function updateProjectImages(proj, allImageUrls, thumb1BasedIndex) {
  const thumbUrl = allImageUrls[thumb1BasedIndex - 1];
  proj.thumbnail = thumbUrl;
  const galleryUrls = allImageUrls.filter((_, idx) => idx !== (thumb1BasedIndex - 1));
  proj.gallery = galleryUrls.map(src => ({ type: 'image', src }));
}

// 1. Update Atol (Image 2 as thumb, include AtolD.jpg)
const atol = projects.find(p => p.slug === 'atol');
if (atol) {
  updateProjectImages(atol, atolImages, 2);
  console.log('✅ Updated Atol: Thumbnail = Image 2, Gallery =', atol.gallery.length, 'images (includes atolD.jpg)');
}

// 2. Update Kube (Image 7 as thumb)
const kube = projects.find(p => p.slug === 'kube');
if (kube) {
  updateProjectImages(kube, kubeImages, 7);
  console.log('✅ Updated Kube: Thumbnail = Image 7, Gallery =', kube.gallery.length, 'images');
}

// 3. Update Toko (Image 1 as thumb)
const toko = projects.find(p => p.slug === 'toko');
if (toko) {
  updateProjectImages(toko, tokoImages, 1);
  console.log('✅ Updated Toko: Thumbnail = Image 1, Gallery =', toko.gallery.length, 'images');
}

// 4. Update Ito (Image 4 as thumb)
const ito = projects.find(p => p.slug === 'ito');
if (ito) {
  updateProjectImages(ito, itoImages, 4);
  console.log('✅ Updated Ito: Thumbnail = Image 4, Gallery =', ito.gallery.length, 'images');
}

// 5. Merge Cine and Movie
const cine = projects.find(p => p.slug === 'cine');
const movie = projects.find(p => p.slug === 'movie');

if (movie) {
  if (cine) {
    // Set thumbnail to Cine's thumbnail
    movie.thumbnail = cine.thumbnail;

    // Combine gallery of Cine + Movie
    const seen = new Set();
    const combinedGallery = [];

    // Add Cine gallery images first
    (cine.gallery || []).forEach(img => {
      if (img.src && !seen.has(img.src)) {
        seen.add(img.src);
        combinedGallery.push(img);
      }
    });

    // Add Movie gallery images
    (movie.gallery || []).forEach(img => {
      if (img.src && !seen.has(img.src)) {
        seen.add(img.src);
        combinedGallery.push(img);
      }
    });

    movie.gallery = combinedGallery;
    console.log('✅ Merged Cine into Movie: Thumbnail = Cine thumb, Gallery =', movie.gallery.length, 'images');
  }
}

// Remove Cine project completely
projects = projects.filter(p => p.slug !== 'cine');
console.log('✅ Removed Cine project from dataset. Total remaining projects:', projects.length);

// Save updated projects-data.json
fs.writeFileSync(centralPath, JSON.stringify(projects, null, 2), 'utf8');
console.log('🎉 Saved updated projects-data.json successfully!');
