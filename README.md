# Portfólio — Raquel Rebouças

Site estático (HTML, CSS e JS puros), sem etapa de build.

## Estrutura

- `index.html`: home (Sobre mim, Cases, Textos, Contato)
- `cases/`: uma página por case
- `assets/`: imagens e `dc-runtime.js` (tema claro/escuro, menu mobile, header e animações)

## Rodar localmente

Abra o `index.html` no navegador, ou rode `npx serve .` na pasta.

## Publicar na Vercel

1. Suba esta pasta para um repositório no GitHub.
2. Na Vercel, em **Add New → Project**, importe o repositório.
3. Framework Preset: **Other**. Deixe o build command e o output directory em branco.
4. Clique em **Deploy**. Cada novo commit no GitHub publica uma nova versão automaticamente.
