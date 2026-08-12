---
name: passagem-turno-tfpm
description: Monta a passagem de serviço do TFPM a partir dos dados do turno colados pelo usuário — atualiza o cartão do pátio, gera o print pronto para o grupo e o resumo em texto. Use sempre que aparecerem dados de pátio ferroviário como "Recepção", "VVs", "Classificação", "Formação", "CTR", "Buffer", "GDUs", "GDTs", "Pulmão", "Em descarga", "Última partida", "D+1", "Oferta", "Ofertado", "Capacidade", "Realizado"; quando o usuário colar uma mensagem no formato "Resumo TFPM"; quando mandar um print do Report Diário TFPM; ou quando falar em passagem de serviço, resumo do turno, atualizar o cartão, fechar o turno ou mandar no grupo. Dispare mesmo que ele só cole os números sem pedir nada explicitamente — colar os dados do turno já é o pedido.
---

# Passagem de serviço TFPM

O usuário coordena o pátio ferroviário do TFPM e passa o serviço para o turno
seguinte num grupo de mensagens. Antes, tirava foto da tela do sistema. Esta
skill transforma os dados do turno em duas entregas:

1. **O cartão em imagem** — um PNG que cabe numa tela de celular, com tudo que
   importa, pronto para mandar no grupo.
2. **O resumo em texto** — para quem prefere colar a mensagem.

O trabalho é sempre o mesmo: pegar os números onde eles estiverem, atualizar um
bloco de dados, gerar a imagem e conferir que ela não saiu cortada.

## Os arquivos

Tudo fica na raiz do repositório:

| Arquivo | Papel |
|---|---|
| `cartao-turno.html` | O cartão. Arquivo único, com CSS, JS, dados e logo embutidos. |
| `resumo-tfpm.txt` | O resumo em texto, no formato que vai para o grupo. |
| `.claude/skills/passagem-turno-tfpm/scripts/gerar-print.mjs` | Renderiza o cartão e salva o PNG. |

O `cartao-turno.html` tem um bloco marcado assim:

```
/* =======================================================
   DADOS DO TURNO — é só editar daqui até o "fim dos dados"
   ======================================================= */

var TURNO = { ... };

/* ================== fim dos dados ================== */
```

Mexa **só dentro desse bloco**. O resto do arquivo é layout e não muda de um
turno para o outro.

## Passo 1 — juntar os dados

Os dados chegam de três jeitos, e frequentemente misturados:

- **Texto no formato Resumo TFPM** — a mensagem com 🚂 que circula no grupo.
- **Print do Report Diário TFPM** — a tela do sistema, que traz descarregamento,
  tração e partidas.
- **Lista solta de pátio** — "Recepção: 03 / VVs: 07 lotes / ..." digitada na
  hora.

É comum virem em pedaços: a ocupação do pátio numa mensagem e o print com o
descarregamento em outra. **Junte tudo antes de editar.** Se o usuário mandou
texto e imagem, os dois são do mesmo turno até ele dizer o contrário — leia a
imagem, não trabalhe só com o texto.

Quando algum número não aparecer em lugar nenhum, veja "Quando faltar dado".

## Passo 2 — mapear os campos

Os rótulos do sistema e os do cartão não têm o mesmo nome. Este é o mapa:

| Como aparece no report ou na mensagem | Campo em `TURNO` |
|---|---|
| D+1 | `d1` |
| Oferta | `oferta` |
| Ofertado | `ofertado` |
| Capacidade | `capacidade` |
| Realizado | `realizado` |
| Recepção | `recepcao` |
| VVs | `vvs` |
| Classificação | `classificacao` |
| CTR | `ctr` |
| Formação (M021/M023/…) | `formacao` — lista de prefixos |
| Buffer — GDUs | `gdu` |
| Buffer — GDTs | `gdt` |
| Em Descarga · "M05 em descarga" | `emDescarga` |
| o "D+1" colado no loco em descarga | `emDescargaObs` |
| Liberado · "Tração: 1M9" | `liberado` |
| Pulmão | `pulmao` |
| Última partida | `ultimaPartida` |
| Tração A Frente / Atrás | `sentido` |
| Impactos no Descarregamento · Pontos de Atenção · complicações contadas em texto | `observacoes` — lista |
| turmas que estão passando o serviço | `passagem` |

Três detalhes que já geraram erro:

- **`liberado` recebe o "Tração:"** do resumo e o **"Liberado"** do report — são
  o mesmo campo com nomes diferentes nos dois formatos.
- **A contagem de Formação sai sozinha** do tamanho da lista. Informe os
  prefixos, nunca um número.
- **Números vão com ponto decimal** (`40.16`) no arquivo. A vírgula do padrão
  brasileiro aparece na tela, calculada na hora — se você escrever vírgula ali,
  o JavaScript quebra.

## Passo 3 — atualizar o cartão

Edite o bloco `TURNO` com os valores do turno. `data` e `hora` são o momento da
apuração, não a data em que você está mexendo no arquivo.

O `passagem` é o rodapé. **O padrão é "Passagem de serviço turma A - C"** — é a
troca de sempre, o usuário confirmou. Use esse texto sem perguntar.

Só mude quando ele indicar outra coisa, como já aconteceu com "turma C - A".
Nesse caso vale para aquele turno; o seguinte volta ao padrão, a menos que ele
diga o contrário.

### Quando o turno teve complicação

Tudo que o usuário contar fora dos números vai para `observacoes`, uma lista de
frases curtas: segregação, locomotiva com falha, descarga parada, desvio
interditado, atraso na formação. No report do sistema, esse conteúdo aparece em
"Impactos no Descarregamento" e "Pontos de Atenção" — aproveite os dois.

```js
observacoes: [
  "12h — Segregação SSCJ para B178 / VV8, vagões aplicados;",
  "15h — Locomotiva 2M003 com falha, tração remanejada;",
],
```

Com a lista preenchida, uma faixa amarela aparece acima do rodapé e o cartão se
comprime sozinho para caber. Com `observacoes: []` ela some e o cartão volta ao
formato do turno tranquilo.

**Registre a complicação no cartão, não só no texto.** O que circula no grupo é
o print; uma ocorrência que só existe no texto passa batida por quem olhar a
imagem — que é a maioria.

**Cabem três linhas.** Na tela de 375px, a quarta observação já estoura. Se o
turno rendeu mais que isso, junte o que for do mesmo assunto e encurte para o
essencial — hora, o que houve, o que foi feito. O texto do resumo não tem esse
limite e pode carregar o relato completo; use isso a favor: cartão com o que
não pode passar batido, texto com o detalhe.

## Passo 4 — atualizar o texto

Reescreva o `resumo-tfpm.txt` com os mesmos números, mantendo o formato que o
grupo já conhece:

```
🚂🚂🚂*Resumo TFPM*🚂🚂🚂
D+1: 39.00
Oferta: 40.16
Ofertado: 31.16
Capacidade: 40.16
Realizado: 30
Última partida: M019
Tração A Frente: (2M003 em descarga D+1 /// Tração: M007)
07 loco no Pulmão

Recepção: 00
VVs: 04 lotes
Classificação: 02
Formação: M021 / M023 / 1M025
CTR: 04
Buffer:
16 GDUs + 28 GDTs
```

Os asteriscos em volta de "Resumo TFPM" são negrito no WhatsApp — mantenha.

Havendo observações, acrescente no fim, com o mesmo negrito:

```
*Observações:*
- 12h — Segregação SSCJ para B178 / VV8, vagões aplicados;
- 15h — Locomotiva 2M003 com falha, tração remanejada.
```

Aqui pode entrar o relato inteiro, inclusive o que não coube no cartão.

## Passo 5 — gerar o print e conferir

```bash
node .claude/skills/passagem-turno-tfpm/scripts/gerar-print.mjs \
  cartao-turno.html /tmp/cartao-turno.png
```

O script renderiza numa tela de celular, salva o PNG e confere três coisas: se o
conteúdo cabe sem rolar, se não sobrou nada para os lados e se o logo carregou.
Sai com erro se algo falhar.

**Se ele disser que não cabe, conserte antes de entregar.** O print cortado é o
pior desfecho possível: sai bonito na sua tela e chega truncado no grupo, sem
ninguém perceber. Costuma ser texto comprido demais — muitos prefixos em
Formação, um texto de passagem grande. Encurte o que dá ou reduza a tipografia
do trecho que estourou.

Vale conferir também numa tela pequena, que é onde aperta:

```bash
node .claude/skills/passagem-turno-tfpm/scripts/gerar-print.mjs \
  cartao-turno.html /tmp/cartao-pequeno.png 375 667
```

## Passo 6 — entregar

Mande o PNG e o arquivo de texto com `SendUserFile`, e cole o resumo em texto
direto na resposta — assim ele copia sem precisar abrir nada.

Diga em uma linha o que mudou em relação ao turno anterior quando houver algo
que salte aos olhos (realizado bem abaixo da capacidade, pátio lotando,
recepção zerada). O usuário conhece a operação melhor que você, então não
explique o óbvio nem faça diagnóstico; só aponte o que ele veria de qualquer
jeito ao olhar o cartão.

## Quando faltar dado

Não invente e não repita o valor do turno anterior fingindo que é atual — um
número velho no cartão vira decisão errada no turno seguinte.

- **Falta um número do descarregamento ou da tração**: pergunte, citando só o
  que falta. É rápido de responder e evita retrabalho.
- **Falta o horário**: use o horário de envio do report, se estiver no print.
- **Falta a data**: assuma o dia corrente e diga que assumiu.
- **Falta a turma da passagem**: use o padrão "turma A - C", sem perguntar.

## Armadilhas

**Formato não é dado.** Já aconteceu de o usuário mandar uma mensagem no formato
Resumo TFPM só para mostrar o modelo, e os números dela serem exemplo. Se os
valores destoarem do que ele acabou de informar — outra capacidade, outro
programa — ou se ele falar em "modelo", "formato", "assim que eu mando",
confirme antes de lançar.

**O cartão é cópia congelada.** Ele não lê nenhum arquivo de dados em tempo real:
o que está dentro dele é o que aparece. Depois de editar, gere o print de novo,
senão você entrega a imagem do turno passado.

**O logo está embutido como data URI.** Não troque por link nem por arquivo
externo — o cartão precisa abrir no celular sem internet, no meio do pátio.

**O painel grande é outra coisa.** O `index.html` e o `painel-tfpm.html` são o
painel completo, com ciclo, TMM e parcial de hora em hora, alimentados por
`dados/registros.js`. A passagem de serviço não passa por eles. Só mexa lá se o
usuário pedir o painel, ou se ele mandar um report com indicadores de ciclo e
quiser guardar o dia no histórico.
