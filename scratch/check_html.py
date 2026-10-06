import re

with open('scratch/ig_page.html', 'r', encoding='utf-8') as f:
    html = f.read()

urls = re.findall(r'https://[^\s"\'\\]+cdninstagram\.com[^\s"\'\\]+', html)
print('Total CDN URLs found:', len(urls))
for u in set(urls):
    print(u[:120])
