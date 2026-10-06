const https = require('https');
const fs = require('fs');

async function testIG() {
  try {
    const res = await fetch('https://www.instagram.com/goizetgestion/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
      }
    });
    const html = await res.text();
    fs.writeFileSync('scratch/ig_page.html', html);
    console.log('Saved HTML, length:', html.length);
    
    // Check og meta
    const mImage = html.match(/property="og:image" content="([^"]+)"/);
    const mDesc = html.match(/property="og:description" content="([^"]+)"/);
    const mTitle = html.match(/property="og:title" content="([^"]+)"/);
    console.log('og:image:', mImage ? mImage[1] : 'none');
    console.log('og:description:', mDesc ? mDesc[1] : 'none');
    console.log('og:title:', mTitle ? mTitle[1] : 'none');
    
    // Check for sharedData or graphql or serialized json
    const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
    console.log('Total scripts found:', scripts.length);
    for (let s of scripts) {
      if (s.includes('edge_owner_to_timeline_media') || s.includes('profile_pic_url') || s.includes('graphql') || s.includes('xdt_api')) {
        console.log('Found script with media keyword! length:', s.length);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

testIG();
