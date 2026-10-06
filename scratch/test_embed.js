async function testEmbed() {
  const res = await fetch('https://www.instagram.com/goizetgestion/embed/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const html = await res.text();
  require('fs').writeFileSync('scratch/ig_embed.html', html);
  console.log('Saved embed, length:', html.length);

  // Look for image urls
  const imgMatches = html.match(/https:\/\/[^"'\\s]+(?:cdninstagram|fbcdn)[^"'\\s]+/gi) || [];
  console.log('CDN matches:', imgMatches.length);
  [...new Set(imgMatches)].slice(0, 10).forEach(u => console.log(u));
}

testEmbed();
