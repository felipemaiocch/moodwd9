#!/usr/bin/env python3
import os
import requests
from urllib.parse import urljoin

# Mapeamento de empresas com seus domínios para buscar logos via API
companies = {
    "banco-do-brasil": "bb.com.br",
    "petrobras": "petrobras.com.br",
    "kpmg": "kpmg.com.br",
    "vibra": "vibra.com.br",
    "magalu": "magalu.com.br",
    "vivo": "vivo.com.br",
    "bndes": "bndes.gov.br",
    "porto-seguro": "portoseguro.com.br",
    "fleury": "fleury.com.br",
    "aegea": "aegea.com.br",
    "chilifbeans": "chilifbeans.com.br",
    "cpfl": "cpfl.com.br"
}

# Diretório de destino
output_dir = "/Users/maiocch/Desktop/Mood WD9 site/public/assets/clients"
os.makedirs(output_dir, exist_ok=True)

# Usar API LogoSo (https://logo.so/) que é mais confiável
for filename, domain in companies.items():
    url = f"https://logo.so/image/{domain}?size=500"
    filepath = os.path.join(output_dir, f"{filename}.png")
    
    try:
        print(f"Baixando logo para {filename} ({domain})...")
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        with open(filepath, 'wb') as f:
            f.write(response.content)
        print(f"✓ Salvo: {filename}.png ({len(response.content)} bytes)")
    except Exception as e:
        print(f"✗ Erro ao baixar {filename}: {e}")

print("\n✓ Download concluído!")
print(f"Logos salvos em: {output_dir}")
