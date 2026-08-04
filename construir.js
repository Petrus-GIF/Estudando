/*
 * Gera painel-tfpm.html: o painel inteiro num arquivo só, com CSS, JS e
 * dados embutidos. Serve para passar o serviço — abre com duplo clique,
 * sem servidor, e pode ser mandado por WhatsApp ou e-mail como anexo único.
 *
 * Rode depois de mexer em dados/registros.js:
 *
 *     node construir.js
 */

const fs = require("fs");
const path = require("path");

const raiz = __dirname;
const ler = (p) => fs.readFileSync(path.join(raiz, p), "utf8");

/* Um "</script>" dentro do JS fecharia a tag cedo demais e quebraria a
 * página; escapar a barra resolve sem alterar o comportamento do código. */
const seguro = (js) => js.replace(/<\/script/gi, "<\\/script");

let html = ler("index.html");

html = html.replace(
  /<link rel="stylesheet" href="assets\/estilo\.css" \/>/,
  "<style>\n" + ler("assets/estilo.css") + "</style>"
);

for (const arquivo of ["dados/registros.js", "assets/app.js"]) {
  const tag = new RegExp('<script src="' + arquivo.replace("/", "\\/") + '"></script>');
  if (!tag.test(html)) throw new Error("não achei a tag de " + arquivo + " no index.html");
  html = html.replace(tag, "<script>\n" + seguro(ler(arquivo)) + "</script>");
}

if (/<link|<script src/.test(html)) {
  throw new Error("sobrou referência externa no arquivo gerado");
}

const saida = path.join(raiz, "painel-tfpm.html");
fs.writeFileSync(saida, html);
console.log("gerado: painel-tfpm.html (" + Math.round(html.length / 1024) + " KB)");
