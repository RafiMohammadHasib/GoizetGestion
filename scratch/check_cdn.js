const fs = require('fs');

const html = fs.readFileSync('scratch/ig_page.html', 'utf8');
const regex = /https:\/\/[^"'\\s]+(?:cdninstagram|fbcdn)[^"'\\s]+/gi;
const urls = html.match(regex) || [];
console.log('Found CDN URLs:', urls.length);
const unique = [...new Set(urls)];
console.log('Unique:', unique.length);
unique.slice(0, 15).forEach(u => console.log(u));
