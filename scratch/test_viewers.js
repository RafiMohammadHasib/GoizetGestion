async function testViewers() {
  const sources = [
    'https://www.instagram.com/goizetgestion/embed/',
    'https://imginn.com/goizetgestion/',
    'https://dumpoir.com/v/goizetgestion'
  ];

  for (let url of sources) {
    try {
      console.log('Testing:', url);
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      console.log(url, 'status:', res.status);
      const text = await res.text();
      console.log(url, 'length:', text.length);
      if (text.includes('goizetgestion')) {
        console.log(url, 'contains username!');
      }
    } catch (e) {
      console.log(url, 'error:', e.message);
    }
  }
}

testViewers();
