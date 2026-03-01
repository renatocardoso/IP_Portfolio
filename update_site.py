import os
import re

directory = r'd:\_JOBS\PORTFOLIO_2024\siteIinfinitaPoesia'

def update_html(content, filename):
    # --- HEADER UPDATE ---
    # Add 'menu-link' class to the specific links: grafico.html, produto.html, Sobre.html
    # We look for <a href="page.html" ...>
    
    patterns = [
        r'<a\s+href=["\']grafico\.html["\']([^>]*)>',
        r'<a\s+href=["\']produto\.html["\']([^>]*)>',
        r'<a\s+href=["\'](?:Sobre|sobre)\.html["\']([^>]*)>'
    ]
    
    for p in patterns:
        def replace_link(match):
            tag = match.group(0)
            # If class attribute exists
            if 'class="' in tag:
                if 'menu-link' not in tag:
                    return tag.replace('class="', 'class="menu-link ')
                return tag
            else:
                # If no class attribute, add it before href (or anywhere, but before href is easy if we replace href=)
                # Actually, let's just replace 'href=' with 'class="menu-link" href='
                return tag.replace('href=', 'class="menu-link" href=')

        content = re.sub(p, replace_link, content, flags=re.IGNORECASE)

    # --- FOOTER UPDATE ---
    
    footer_text = """
        <p><strong>© infinita poesia /*</strong><br>
            Florianópolis - Santa Catarina - Brasil <br>
        </p>
        <div class="footer-links">
            <a href="https://www.instagram.com/infinita_poesia_design" target="_blank">Instagram</a>
            <a href="mailto:renato@infinitapoesia.com.br">Contato</a>
        </div>"""
    
    footer_button = """
        <button type="button" class="back-to-top-btn">↑</button>"""
    
    if filename == 'index.html':
        new_footer_content = f'{footer_text}<!-- Botão voltar ao topo não é necessário na home pois não há scroll -->'
    else:
        new_footer_content = f'{footer_text}{footer_button}'
        
    new_footer = f'<footer class="site-footer">{new_footer_content}</footer>'
    
    # Regex to replace the entire footer block
    footer_pattern = r'<footer class="site-footer">.*?</footer>'
    
    content = re.sub(footer_pattern, new_footer, content, flags=re.DOTALL)
    
    return content

count = 0
for filename in os.listdir(directory):
    if filename.endswith(".html"):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = update_html(content, filename)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filename}")
            count += 1

print(f"Total files updated: {count}")
