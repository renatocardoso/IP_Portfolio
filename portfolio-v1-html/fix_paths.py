import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for f in html_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    modified = False
    
    # Prefix css/ for css files
    new_content = re.sub(r'href=\"([\w-]+\.css)\"', r'href="css/\1"', content)
    if new_content != content:
        content = new_content
        modified = True
        
    # Prefix js/ for js files (ignoring http or cdn starting ones, handled by regex focusing on \w)
    new_content = re.sub(r'src=\"([\w-]+\.js)\"', r'src="js/\1"', content)
    if new_content != content:
        content = new_content
        modified = True
        
    # Prefix img/ for images
    new_content = re.sub(r'src=\"([\w-]+\.(png|jpg|jpeg|svg|gif|webp|svg\+xml))\"', r'src="img/\1"', content)
    if new_content != content:
        content = new_content
        modified = True
        
    # Prefix video/ for mp4
    new_content = re.sub(r'src=\"([\w-]+\.mp4)\"', r'src="video/\1"', content)
    if new_content != content:
        content = new_content
        modified = True
        
    if modified:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f'Updated {f}')
