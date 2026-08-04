# Controle de Pátio — TFPM

Painel estático para acompanhar a ocupação do pátio e os indicadores do
Report Diário TFPM. Sem dependências, sem build: abra o `index.html` no
navegador.

## Estrutura

```
index.html            layout do painel
assets/estilo.css     estilos (claro e escuro)
assets/app.js         renderização a partir dos dados
dados/registros.js    um objeto por dia apurado
```

A apresentação está separada dos dados de propósito: para lançar um novo
dia basta editar `dados/registros.js`, nada mais.

## Lançando um novo dia

Copie o objeto mais recente em `dados/registros.js`, ajuste os valores e
coloque-o **no início** do array. O seletor de data no topo da página passa
a listar o novo registro automaticamente.

```js
{
  data: "2026-08-05",          // ISO, usado para ordenar
  envio: "18:30",

  patio: {
    recepcao:      { lotes: 0 },
    vvs:           { lotes: 4 },
    classificacao: { lotes: 2 },
    formacao:      { trens: ["M021", "M023", "1M025"] },
    ctr:           { lotes: 4 },
    buffer:        { gdu: 16, gdt: 28 },
  },
  // ...
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

## O que o painel mostra

- **Ocupação do pátio** — Recepção, VVs, Classificação, Formação (com os
  prefixos dos trens), CTR e Buffer aberto em GDU/GDT.
- **Indicadores do ciclo** — Ciclo TFPM (com as parcelas Ferrovia e Porto),
  TMM, Desvios Locos VV → PIAL e Aguardando Retirada de Locos PIAL, cada um
  com programa, realizado e saldo colorido.
- **Descarregamento** — números do dia, parcial de 3 em 3 horas em tabela e
  em gráfico (previsto × descarregado), e os impactos registrados.
- **Tração e partidas** — locos em descarga, pulmão, liberado; programa D,
  mina D+1 e última partida.
- **Pontos de atenção** — as observações do turno.
