const fs = require('fs');

const html = fs.readFileSync('scratch/ig_page.html', 'utf8');
const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];

for (let i = 0; i < scripts.length; i++) {
  const s = scripts[i];
  if (s.includes('profile_pic_url') || s.includes('edge_owner_to_timeline_media') || s.includes('xdt_api')) {
    console.log(`Script ${i}: length ${s.length}`);
    fs.writeFileSync(`scratch/ig_script_${i}.txt`, s);
  }
}
