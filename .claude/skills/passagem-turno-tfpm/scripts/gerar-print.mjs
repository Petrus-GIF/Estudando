/*
 * Abre o cartão do turno num navegador do tamanho de um celular, confere se
 * ele cabe sem rolar e salva o PNG pronto para mandar no grupo.
 *
 * A conferência de altura é o ponto principal: o cartão só cumpre o papel se
 * couber numa tela inteira. Um valor mais comprido — um prefixo a mais em
 * Formação, um texto de passagem maior — empurra o conteúdo para baixo, e o
 * print sai cortado sem ninguém perceber até chegar no grupo.
 *
 * Uso:
 *   node gerar-print.mjs <cartao.html> [saida.png] [largura] [altura]
 *
 * Padrão: 390x844 (iPhone 12/13/14), que é o tamanho de tela mais comum.
 * Sai com código 1 se o cartão não couber, para o erro não passar batido.
 */

import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const [, , arquivoArg, saidaArg, largArg, altArg] = process.argv;

if (!arquivoArg) {
  console.error("uso: node gerar-print.mjs <cartao.html> [saida.png] [largura] [altura]");
  process.exit(2);
}

const arquivo = resolve(arquivoArg);
const saida = resolve(saidaArg || "cartao-turno.png");
const largura = Number(largArg) || 390;
const altura = Number(altArg) || 844;

if (!existsSync(arquivo)) {
  console.error("não achei o arquivo: " + arquivo);
  process.exit(2);
}

/* O playwright costuma estar instalado globalmente, não no projeto, então
 * procura nos dois lugares antes de desistir. */
async function carregarPlaywright() {
  try {
    return await import("playwright");
  } catch {}
  try {
    const raizGlobal = execSync("npm root -g", { encoding: "utf8" }).trim();
    const req = createRequire(pathToFileURL(raizGlobal + "/"));
    return req("playwright");
  } catch {}
  console.error(
    "playwright não encontrado. Instale com:  npm install -g playwright\n" +
      "O navegador já vem no ambiente, em /opt/pw-browsers/chromium."
  );
  process.exit(2);
}

const { chromium } = await carregarPlaywright();

/* O Chromium do ambiente fica num caminho fixo; se não estiver lá, deixa o
 * playwright procurar o dele. */
const executablePath = existsSync("/opt/pw-browsers/chromium")
  ? "/opt/pw-browsers/chromium"
  : undefined;

const navegador = await chromium.launch({ executablePath });
const contexto = await navegador.newContext({
  viewport: { width: largura, height: altura },
  deviceScaleFactor: 2, // o print sai nítido no celular
});
const pagina = await contexto.newPage();

const problemas = [];
pagina.on("pageerror", (e) => problemas.push("erro de página: " + e.message));
pagina.on("console", (m) => {
  if (m.type() === "error") problemas.push("erro de console: " + m.text());
});

await pagina.goto(pathToFileURL(arquivo).href);
await pagina.waitForTimeout(400); // deixa fonte e imagem assentarem

const medidas = await pagina.evaluate(() => {
  const raiz = document.documentElement;
  const logo = document.querySelector(".rodape img");
  return {
    alturaConteudo: raiz.scrollHeight,
    alturaTela: raiz.clientHeight,
    sobraHorizontal: raiz.scrollWidth - raiz.clientWidth,
    logoOk: logo ? logo.complete && logo.naturalWidth > 0 : null,
  };
});

await pagina.screenshot({ path: saida });
await contexto.close();
await navegador.close();

const excedeu = medidas.alturaConteudo - medidas.alturaTela;
const coube = excedeu <= 0;

console.log(`tela            ${largura}x${altura}`);
console.log(`conteúdo        ${medidas.alturaConteudo}px`);
console.log(`cabe na tela    ${coube ? "sim" : "NÃO — sobra " + excedeu + "px"}`);
console.log(`sobra lateral   ${medidas.sobraHorizontal}px`);
if (medidas.logoOk !== null) console.log(`logo carregou   ${medidas.logoOk ? "sim" : "NÃO"}`);
console.log(`print salvo em  ${saida}`);

if (problemas.length) {
  console.log("\nproblemas:");
  problemas.forEach((p) => console.log("  - " + p));
}

if (!coube || medidas.sobraHorizontal > 0 || medidas.logoOk === false || problemas.length) {
  process.exit(1);
}
