# Controle de Pátio — TFPM

Painel estático para acompanhar a ocupação do pátio e os indicadores do
TFPM. Sem dependências, sem build: abra o `index.html` no navegador.

## Para passar o serviço

Cole os dados do turno na conversa com o Claude e peça a passagem. A skill
`passagem-turno-tfpm` atualiza o cartão, gera o print e devolve o resumo em
texto — está em `.claude/skills/passagem-turno-tfpm/`.

Na mão, são três passos:

1. Editar o bloco `DADOS DO TURNO` no **`cartao-turno.html`**.
2. Gerar o print e conferir que ele cabe na tela:

   ```bash
   node .claude/skills/passagem-turno-tfpm/scripts/gerar-print.mjs \
     cartao-turno.html /tmp/cartao-turno.png
   ```

3. Copiar o texto do **`resumo-tfpm.txt`** para o grupo.

O script sai com erro se o cartão não couber — é o que evita mandar print
cortado, que sai inteiro na sua tela e chega truncado no grupo.

### O painel completo

O **`painel-tfpm.html`** é outra coisa: o painel inteiro (ciclo, TMM, parcial
de hora em hora) num arquivo só, para consulta. Depois de lançar um registro
em `dados/registros.js`, gere-o de novo:

```bash
node construir.js
```

Sem isso ele continua mostrando os dados antigos — é uma cópia congelada,
não lê o `dados/registros.js` em tempo real.

## Estrutura

```
index.html            layout do painel
assets/estilo.css     estilos (claro e escuro)
assets/app.js         renderização a partir dos dados
dados/registros.js    um objeto por dia apurado
construir.js          junta tudo em painel-tfpm.html
painel-tfpm.html      arquivo único, gerado — é o que se manda para o turno
```

A apresentação está separada dos dados de propósito: para lançar um novo
dia basta editar `dados/registros.js`, nada mais.

## Os dois modelos

O mesmo painel atende os dois formatos que circulam no turno, identificados
pelo campo `tipo`:

- **`"Resumo TFPM"`** — o resumo curto: ocupação do pátio, números do
  descarregamento, tração e última partida.
- **`"Report Diário TFPM"`** — o report completo: tudo do resumo mais ciclo,
  TMM, desvios, parcial de 3 em 3 horas, impactos e pontos de atenção.

Só `data`, `tipo` e `patio` são obrigatórios. **Todo o resto é opcional** — o
que o registro não trouxer some do painel em vez de aparecer zerado. Um
resumo não precisa fingir que tem ciclo e parcial.

## Lançando um novo dia

Copie o objeto mais parecido em `dados/registros.js`, ajuste os valores e
coloque-o **no início** do array. O seletor de data no topo da página passa
a listar o novo registro automaticamente.

```js
{
  data: "2026-08-05",        // ISO, usado para ordenar
  tipo: "Resumo TFPM",
  envio: null,               // null quando o horário não veio na mensagem

  patio: {
    recepcao:      { lotes: 3 },
    vvs:           { lotes: 7 },
    classificacao: { lotes: 3 },
    formacao:      { trens: ["M27", "M29"] },   // a contagem sai daqui
    ctr:           { lotes: 6 },
    buffer:        { gdu: 10, gdt: 20 },
  },

  descarregamento: {
    d1: 52.00, oferta: 56.20, ofertado: 33.20,
    capacidade: 52.00, realizado: 35.00,
  },

  tracao: {
    sentido: "A Frente",
    emDescarga: "M05",
    emDescargaObs: "D+1",    // opcional, sai em letra miúda sob o valor
    pulmao: 7,
    liberado: "1M9",
  },

  partidas: { ultimaPartida: "M25" },
}
```

### Convenções dos dados

- Números usam ponto decimal no arquivo; a exibição converte para o padrão
  pt-BR (vírgula) e alinha as casas.
- `null` significa "ainda não apurado" — aparece como travessão na tabela e
  interrompe a linha do gráfico, em vez de despencar para zero.
- Em `indicadores`, o campo `melhor` (`"menor"` ou `"maior"`) define a cor do
  saldo. Ciclo, TMM e desvios são "menor é melhor"; o realizado do
  descarregamento é "maior é melhor".
- O saldo não é digitado: sai de `realizado − programa`.
- A contagem de trens em Formação sai do tamanho da lista `trens`.

## O que o painel mostra

- **Ocupação do pátio** — Recepção, VVs, Classificação, Formação (com os
  prefixos dos trens), CTR e Buffer aberto em GDU/GDT.
- **Descarregamento** — os números do dia (D+30, S+X, D+1, oferta, ofertado,
  capacidade, realizado — só os que existirem no registro) e, quando houver,
  o parcial de 3 em 3 horas em tabela e em gráfico previsto × descarregado,
  mais os impactos registrados.
- **Tração e partidas** — sentido, loco em descarga, pulmão e tração
  liberada; programa D, mina D+1 e última partida.
- **Indicadores do ciclo** *(só no report completo)* — Ciclo TFPM com as
  parcelas Ferrovia e Porto, TMM, Desvios Locos VV → PIAL e Aguardando
  Retirada de Locos PIAL, cada um com programa, realizado e saldo colorido.
- **Pontos de atenção** *(só no report completo)* — as observações do turno.
