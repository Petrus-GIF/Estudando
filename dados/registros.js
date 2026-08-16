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
    data: "2026-08-13",
    tipo: "Report Diário TFPM",
    envio: "18:29",

    patio: {
      recepcao: { lotes: 3 },
      vvs: { lotes: 0 },
      classificacao: { lotes: 2 },
      formacao: { lotes: 3, trens: ["M023", "M025", "2M027"] },
      ctr: { lotes: 5 },
      buffer: {
        gdu: 10,
        gdt: 34,
        nota: "P1A 06 GDT · L-007CL 26 GDT · F5C 10 GDU + 02 GDT, aguardando condições para inversão do amarelo",
      },
    },

    indicadores: [
      {
        nome: "Ciclo TFPM",
        programa: 11.87,
        realizado: 12.25,
        melhor: "menor",
        parcelas: [
          { nome: "Ferrovia", programa: 7.25, realizado: 7.68 },
          { nome: "Porto", programa: 4.62, realizado: 4.58 },
        ],
      },
      { nome: "TMM — Tempo Médio de Manobra", programa: 0.85, realizado: 1.6, melhor: "menor" },
      { nome: "Desvios Locos VV → PIAL", programa: 0.32, realizado: 0.46, melhor: "menor" },
      {
        nome: "Aguardando Retirada de Locos PIAL",
        rotuloPrograma: "Desafio",
        programa: 0.33,
        realizado: 0.33,
        melhor: "menor",
      },
    ],

    descarregamento: {
      d30: 40.0,
      sx: 42.0,
      d1: 44.0,
      oferta: 46.82,
      ofertado: 31.82,
      capacidade: 46.82,
      realizado: 28.5,
      trens: ["M006", "M002"],
      parcial: {
        horas: ["03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00", "24:00"],
        previsto: [4.5, 13.0, 18.5, 24.0, 24.0, 31.6, 39.2, 46.82],
        descarregado: [4.5, 9.0, 15.0, 18.0, 24.0, 28.5, null, null],
      },
      impactos: [
        "VV6 — Erro de leitura da sonda de nível;",
        "12h — Ociosidade por reflexo de M.I. na singela em D-1 / segregação de material FCKL para pátio sul;",
        "15h — Ajuste das parciais;",
        "18h — Ociosidade por perda na circulação dos trens carregados, em virtude da redução de velocidade por eixos tubulares / segregação de lotes FASN para pátio sul.",
      ],
    },

    tracao: { sentido: "A Frente", emDescarga: "M001", pulmao: 5, liberado: "2M005" },
    partidas: { programaD: "M029", minaD1: "M021", ultimaPartida: "M021" },

    atencao: [
      "TMM elevado devido revezamento de equipe da turma C (25 equipes);",
      "Impacto na formação e partida de trens devido restrições em veículos de lotes liberados do CTR — trens impactados M013, M015 e M017; ofensor do ciclo;",
      "Desvio de locos acima devido precaução de via e circulação no X0;",
      "Linhas por cima da oficina central interditadas pelo técnico de segurança, após inspeção: vegetação alta, trilho entre vias e resto de material de construções.",
    ],
  },

  {
    data: "2026-08-12",
    tipo: "Report Diário TFPM",
    envio: "18:24",

    patio: {
      recepcao: { lotes: 8 },
      vvs: { lotes: 2 },
      classificacao: { lotes: 3 },
      formacao: { lotes: 3, trens: ["M023", "M025", "2M027"] },
      ctr: { lotes: 2 },
      buffer: { gdu: 10, gdt: 10, nota: "P1A 10 GDT · F5C 10 GDU" },
    },

    indicadores: [
      {
        nome: "Ciclo TFPM",
        programa: 11.87,
        realizado: 11.37,
        melhor: "menor",
        parcelas: [
          { nome: "Ferrovia", programa: 7.25, realizado: 7.49 },
          { nome: "Porto", programa: 4.62, realizado: 3.88 },
        ],
      },
      { nome: "TMM — Tempo Médio de Manobra", programa: 0.85, realizado: 1.07, melhor: "menor" },
      { nome: "Desvios Locos VV → PIAL", programa: 0.32, realizado: 0.32, melhor: "menor" },
      {
        nome: "Aguardando Retirada de Locos PIAL",
        rotuloPrograma: "Desafio",
        programa: 0.33,
        realizado: 0.27,
        melhor: "menor",
      },
    ],

    descarregamento: {
      d30: 46.0,
      sx: 45.0,
      d1: 48.0,
      oferta: 50.32,
      ofertado: 32.32,
      capacidade: 45.0,
      realizado: 28.5,
      trens: ["M822", "M116"],
      parcial: {
        horas: ["03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00", "24:00"],
        previsto: [5.8, 13.0, 19.0, 25.0, 31.25, 28.0, 36.0, 45.0],
        descarregado: [5.8, 12.23, 16.5, 19.2, 23.0, 28.5, null, null],
      },
      impactos: [
        "VV6 — Vagão aplicado;",
        "9h — V1/V2/V3/V4 segregação de material por formação de carga para atender P4 / V05 vagões aplicados / V08 operação blend;",
        "12h — V1/V3/V4 segregação de material por formação de carga para atender P4 / V02 manobra longa por segregação / TR1108 troca de rolo / V05 vagões aplicados / V08 operação blend com V05;",
        "15h — V1/V2/V3/V4 segregação de material por formação de carga para atender P4 / VV2 trilho avariado.",
      ],
    },

    tracao: { sentido: "A Frente", emDescarga: "2M001", pulmao: 1, liberado: "3M003" },
    partidas: { programaD: "M029", minaD1: "M015", ultimaPartida: "M019" },

    atencao: [
      "TMM elevado devido manobra com ociosidade / segregação de material / tração;",
      "Porto recalculando a capacidade;",
      "V02 ficará indisponível para posicionamento por 4h devido aumento na trinca. Às 15:09 o ALFA 272 trabalhou e liberou a via para circulação normal;",
      "Redução no descarregamento de 50,32 lotes para 45,00 lotes devido segregação de material;",
      "Alarme de emergência atuado no PIAL.",
    ],
  },

  {
    data: "2026-08-09",
    tipo: "Report Diário TFPM",
    envio: "18:48",

    patio: {
      recepcao: { lotes: 3 },
      vvs: { lotes: 0 },
      classificacao: { lotes: 3 },
      formacao: { lotes: 2, trens: ["M025"] },
      ctr: { lotes: 4 },
      buffer: { gdu: 20, gdt: 32, nota: "P1A 02 GDT · Linha 007 04 GDT · F4C 20 GDU · F5C 26 GDT" },
    },

    indicadores: [
      {
        nome: "Ciclo TFPM",
        programa: 11.87,
        realizado: 12.12,
        melhor: "menor",
        parcelas: [
          { nome: "Ferrovia", programa: 7.25, realizado: 7.29 },
          { nome: "Porto", programa: 4.62, realizado: 4.83 },
        ],
      },
      { nome: "TMM — Tempo Médio de Manobra", programa: 0.85, realizado: 1.23, melhor: "menor" },
      { nome: "Desvios Locos VV → PIAL", programa: 0.32, realizado: 0.53, melhor: "menor" },
      {
        nome: "Aguardando Retirada de Locos PIAL",
        rotuloPrograma: "Desafio",
        programa: 0.33,
        realizado: 0.3,
        melhor: "menor",
      },
    ],

    descarregamento: {
      d30: 48.0,
      sx: 48.0,
      d1: 45.0,
      oferta: 49.39,
      ofertado: 40.39,
      capacidade: 49.39,
      realizado: 35.0,
      trens: ["M112", "M108"],
      parcial: {
        horas: ["03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00", "24:00"],
        previsto: [5.5, 11.5, 17.0, 22.5, 28.0, 36.0, 43.0, 49.39],
        descarregado: [5.5, 11.0, 17.0, 24.5, 29.5, 35.0, null, null],
      },
      impactos: [
        "06h — Segregação de lotes para formação de pilhas de SFHJ;",
        "18h — Ociosidade por intrajornada / VV3 falha no encoder do posicionador, operação Blend com VV4 / TR1304 atuação de sonda.",
      ],
    },

    tracao: { sentido: "A Frente", emDescarga: "2M001", pulmao: 6, liberado: "M007" },
    partidas: { programaD: "M033", minaD1: "M015", ultimaPartida: "M023" },

    atencao: [
      "Ciclo e TMM elevados devido baixa disponibilidade de locomotiva;",
      "Tração;",
      "Aumento da previsão de descarregamento de 45,00 lotes para 49,39 lotes devido boa performance;",
      "Desvios de locos acima devido precaução de via e circulações no X04.",
    ],
  },

  {
    data: "2026-08-08",
    tipo: "Report Diário TFPM",
    envio: "18:32",

    patio: {
      recepcao: { lotes: 7 },
      vvs: { lotes: 4 },
      classificacao: { lotes: 3 },
      formacao: { lotes: 2, trens: ["M031", "M033"] },
      ctr: { lotes: 4 },
      buffer: { gdu: 8, gdt: 6, nota: "+ 20 GDUs + 10 GDTs vindo do freio" },
    },

    indicadores: [
      {
        nome: "Ciclo TFPM",
        programa: 11.87,
        realizado: 14.55,
        melhor: "menor",
        parcelas: [
          { nome: "Ferrovia", programa: 7.25, realizado: 9.22 },
          { nome: "Porto", programa: 4.62, realizado: 5.33 },
        ],
      },
      { nome: "TMM — Tempo Médio de Manobra", programa: 0.85, realizado: 1.35, melhor: "menor" },
      { nome: "Desvios Locos VV → PIAL", programa: 0.32, realizado: 0.42, melhor: "menor" },
      {
        nome: "Aguardando Retirada de Locos PIAL",
        rotuloPrograma: "Desafio",
        programa: 0.33,
        realizado: 0.28,
        melhor: "menor",
      },
    ],

    descarregamento: {
      d30: 47.0,
      sx: 48.0,
      d1: 50.0,
      oferta: 52.13,
      ofertado: 40.13,
      capacidade: 52.13,
      realizado: 36.0,
      trens: ["M108", "M004"],
      parcial: {
        horas: ["03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00", "24:00"],
        previsto: [6.5, 12.0, 18.0, 24.0, 31.0, 38.0, 45.0, 52.13],
        descarregado: [4.0, 10.5, 16.0, 22.6, 30.5, 36.0, null, null],
      },
      impactos: [
        "3h — VV1/VV3 sonda atuada TR1304 / VV2 atraso MO;",
        "6h — Manobra acima do orçado, reflexo de liberação de lotes CTR / VV2 atraso MO, troca de chapa de tração;",
        "12h — Manobra acima do orçado por tração atrás (VV1/VV2/VV3/VV6) / VV5 desalinhamento atuado TR1118 e nível alto do chute ER6 / VV6 vagões aplicados / VV7 precaução de via / VV8 tempo de M.I. no X3 W51;",
        "15h — VV4 atraso de manutenção preventiva / VV5 nível alto chute do trailer ER6;",
        "18h — VV3 nível alto de chute / VV4 atraso de M.P. / VV5 e VV8 corte da borda TR1114.",
      ],
    },

    tracao: { sentido: "Atrás", emDescarga: "M005", pulmao: 0, liberado: "2M005" },
    partidas: { programaD: "M037", minaD1: "M023", ultimaPartida: "M029" },

    atencao: [
      "Ciclo ferrovia elevado devido excesso de lotes em RET-FILA (pendente laudo de eixo);",
      "Desvios locos acima do orçado devido tempo de M.I. no PIAL e precaução de via no X04;",
      "Tração atrás;",
      "Aumento na previsão de partida devido a boa performance do terminal.",
    ],
  },

  {
    data: "2026-08-05",
    tipo: "Report Diário TFPM",
    envio: "18:22",

    patio: {
      recepcao: { lotes: 8 },
      vvs: { lotes: 10, nota: "04 vazio ag. linha · 06 entre descarga e ag. posicionar" },
      classificacao: { lotes: 5 },
      formacao: { lotes: 2, trens: ["M017"] },
      ctr: { lotes: 6 },
      buffer: { gdu: 14, gdt: 20 },
    },

    indicadores: [
      {
        nome: "Ciclo TFPM",
        programa: 11.87,
        realizado: 11.44,
        melhor: "menor",
        parcelas: [
          { nome: "Ferrovia", programa: 7.25, realizado: 6.31 },
          { nome: "Porto", programa: 4.62, realizado: 5.13 },
        ],
      },
      { nome: "TMM — Tempo Médio de Manobra", programa: 0.85, realizado: 0.96, melhor: "menor" },
      { nome: "Desvios Locos VV → PIAL", programa: 0.32, realizado: 0.29, melhor: "menor" },
      {
        nome: "Aguardando Retirada de Locos PIAL",
        rotuloPrograma: "Desafio",
        programa: 0.33,
        realizado: 1.17,
        melhor: "menor",
      },
    ],

    descarregamento: {
      d30: 45.0,
      sx: 45.0,
      d1: 45.0,
      oferta: 48.14,
      ofertado: 42.14,
      capacidade: 42.0,
      realizado: 28.5,
      trens: ["M110", "M106"],
      parcial: {
        horas: ["03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00", "24:00"],
        previsto: [6.0, 11.0, 16.5, 22.0, 27.5, 28.5, 35.0, 42.0],
        descarregado: [6.0, 11.0, 16.5, 19.0, 23.5, 28.5, null, null],
      },
      impactos: [
        "12h — Manobra ferroviária acima do orçado por excesso de lotes em RET FILA para o CTR; VV2 fuga de material; VV7 e VV8 falha de translação da EP5;",
        "15h — Manobra ferroviária acima do orçado por excesso de lotes em RET FILA para o CTR; VV5 atraso de M.I.",
      ],
    },

    tracao: { sentido: "A Frente", emDescarga: "M005", pulmao: 4, liberado: "M009" },
    partidas: { programaD: "M023", minaD1: "M013", ultimaPartida: "M015" },

    atencao: [
      "Ciclo TFPM elevado devido segregação de material;",
      "Excesso de lotes em RET-FILA (laudo eixo);",
      "Retirada de locos acima devido ao momento de reflexão pela manhã;",
      "Redução da capacidade de 45,00 lotes para 42,00 lotes devido manobra ferroviária acima do orçado por excesso de lotes em RET FILA para o CTR.",
    ],
  },

  {
    data: "2026-08-04",
    tipo: "Report Diário TFPM",
    envio: "18:30",

    patio: {
      recepcao: { lotes: 0 },
      vvs: { lotes: 4 },
      classificacao: { lotes: 2 },
      formacao: { lotes: 3, trens: ["M021", "M023", "1M025"] },
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
