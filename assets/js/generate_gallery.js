const fs = require('fs');
const path = require('path');

const galleryDir = path.join(__dirname, 'gallery');
const categories = ['birds', 'mammals', 'reptiles'];
const allImages = [];

categories.forEach(category => {
    const dirPath = path.join(galleryDir, category);
    if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        files.forEach(file => {
            if (file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.png')) {
                allImages.push({
                    url: `gallery/${category}/${file}`,
                    category: category
                });
            }
        });
    }
});

// Shuffle the array to randomize images across all categories
for (let i = allImages.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allImages[i], allImages[j]] = [allImages[j], allImages[i]];
}

const fileContent = `window.galleryImages = ${JSON.stringify(allImages, null, 2)};`;

fs.writeFileSync(path.join(__dirname, 'gallery-data.js'), fileContent);
console.log('Successfully generated gallery-data.js with ' + allImages.length + ' images.');
