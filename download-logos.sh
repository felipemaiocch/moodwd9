#!/bin/zsh

# Script para baixar logos de clientes usando Clearbit API
CLIENTS_DIR="/Users/maiocch/Desktop/Mood WD9 site/public/assets/clients"

# Arrays com nomes e domínios das empresas
companies=("Banco do Brasil:bb.com.br" 
           "Petrobras:petrobras.com.br" 
           "KPMG:kpmg.com.br" 
           "Vibra:vibra.com.br" 
           "Magalu:magazineluiza.com.br" 
           "Vivo:vivo.com.br" 
           "BNDES:bndes.gov.br" 
           "Porto Seguro:portoseguro.com.br" 
           "Grupo Fleury:fleury.com.br" 
           "Aegea:aegea.com.br" 
           "ChiliBeans:chilifbeans.com.br" 
           "CPFL Energia:cpfl.com.br")

echo "Baixando logos de clientes..."

for company in $companies; do
    name=$(echo $company | cut -d: -f1)
    domain=$(echo $company | cut -d: -f2)
    filename=$(echo $name | tr ' ' '-' | tr '[:upper:]' '[:lower:]')
    output_file="$CLIENTS_DIR/${filename}.png"
    
    # Usar Clearbit API para pegar logo
    url="https://logo.clearbit.com/$domain"
    
    echo "Baixando: $name ($domain)..."
    curl -s -o "$output_file" "$url"
    
    if [ -f "$output_file" ] && [ -s "$output_file" ]; then
        size=$(ls -lh "$output_file" | awk '{print $5}')
        echo "✓ $name baixado com sucesso ($size)"
    else
        echo "✗ Falha ao baixar $name"
        rm -f "$output_file"
    fi
done

echo ""
echo "Arquivos baixados:"
ls -lh "$CLIENTS_DIR" 2>/dev/null || echo "Nenhum arquivo baixado"
