/*
 * Registros diários de controle de pátio — TFPM.
 *
 * Para lançar um novo registro, copie um dos objetos abaixo, ajuste os
 * valores e acrescente ao início do array. A lista é ordenada por data,
 * do mais recente para o mais antigo; quando dois registros são do mesmo
 * dia (um resumo e um report, por exemplo), vale a ordem deste arquivo.
 *
 * Dois modelos convivem no mesmo arquivo:
 *  - "Resumo TFPM"        — o resumo curto do turno;
 *  - "Report Diário TFPM" — o report completo, com ciclo, TMM e parcial.
 *
 * Tudo além de `data`, `tipo` e `patio` é opcional: o que o registro não
 * tiver simplesmente não aparece no painel, em vez de ficar zerado.
 *
 * Convenções:
 *  - Valores numéricos usam ponto decimal aqui; a formatação pt-BR
 *    (vírgula) é aplicada na exibição.
 *  - `null` significa "ainda não apurado" e é exibido como travessão.
 *  - Em `indicadores`, `melhor` diz qual direção é boa: "menor" ou "maior".
 */

window.REGISTROS = [
  {
    data: "2026-08-04",
    tipo: "Report Diário TFPM",
    envio: "18:30",

    patio: {
      recepcao: { lotes: 0 },
      vvs: { lotes: 4 },
      classificacao: { lotes: 2 },
      formacao: { trens: ["M021", "M023", "1M025"] },
      ctr: { lotes: 4 },
      buffer: { gdu: 16, gdt: 28 },
    },

    indicadores: [
      {
        nome: "Ciclo TFPM",
        programa: 11.87,
        realizado: 12.46,
        melhor: "menor",
        parcelas: [
          { nome: "Ferrovia", programa: 7.25, realizado: 9.03 },
          { nome: "Porto", programa: 4.62, realizado: 3.44 },
        ],
      },
      {
        nome: "TMM — Tempo Médio de Manobra",
        programa: 0.85,
        realizado: 1.34,
        melhor: "menor",
      },
      {
        nome: "Desvios Locos VV → PIAL",
        programa: 0.32,
        realizado: 0.61,
        melhor: "menor",
      },
      {
        nome: "Aguardando Retirada de Locos PIAL",
        rotuloPrograma: "Desafio",
        programa: 0.33,
        realizado: 0.25,
        melhor: "menor",
      },
    ],

    descarregamento: {
      d30: 40.0,
      sx: 40.0,
      d1: 39.0,
      oferta: 40.16,
      ofertado: 31.16,
      capacidade: 40.16,
      realizado: 30.0,
      trens: ["M106", "M102"],
      parcial: {
        horas: ["03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00", "24:00"],
        previsto: [5.0, 15.0, 19.0, 23.0, 27.0, 31.0, 35.58, 40.16],
        descarregado: [7.5, 15.0, 19.0, 22.0, 25.5, 30.0, null, null],
      },
      impactos: [
        "12h — Segregação SSCJ para B178 / VV8 — Vagões aplicados;",
        "15h — Segregação SSCJ para B178;",
        "18h — Segregação SFHJ para O090 e FCSS para C123 / VV8 — Vagões aplicados.",
      ],
    },

    tracao: {
      sentido: "A Frente",
      emDescarga: "2M003",
      pulmao: 7,
      liberado: "M007",
    },

    partidas: {
      programaD: "M027",
      minaD1: "M011",
      ultimaPartida: "M019",
    },

    atencao: [
      "TMM acima do programa devido manobra com ociosidade;",
      "Desvios Locos no PIAL acima devido tempo de M.I. por baixo do PIAL;",
      "Ciclo ferrovia acima devido reflexo de lotes CTR (eixo).",
    ],
  },
];
