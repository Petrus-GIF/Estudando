/* Renderiza o registro diário de controle de pátio a partir de window.REGISTROS. */

(function () {
  "use strict";

  var registros = (window.REGISTROS || []).slice();
  var TRAVESSAO = "—";

  /* ---------- utilidades ---------- */

  function num(valor, casas) {
    if (valor === null || valor === undefined || valor === "") return TRAVESSAO;
    return Number(valor).toLocaleString("pt-BR", {
      minimumFractionDigits: casas === undefined ? 2 : casas,
      maximumFractionDigits: casas === undefined ? 2 : casas,
    });
  }

  function comSinal(valor, casas) {
    if (valor === null || valor === undefined) return TRAVESSAO;
    var texto = num(Math.abs(valor), casas);
    if (Math.abs(valor) < 0.005) return num(0, casas);
    return (valor > 0 ? "+" : "-") + texto;
  }

  function dataLonga(iso) {
    var p = iso.split("-");
    return p[2] + "/" + p[1] + "/" + p[0];
  }

  function el(tag, classe, texto) {
    var n = document.createElement(tag);
    if (classe) n.className = classe;
    if (texto !== undefined && texto !== null) n.textContent = texto;
    return n;
  }

  function limpar(no) {
    while (no.firstChild) no.removeChild(no.firstChild);
  }

  /* Classe de cor do saldo: depende de qual direção é boa para o indicador. */
  function classeSaldo(saldo, melhor) {
    if (Math.abs(saldo) < 0.005) return "";
    var favoravel = melhor === "maior" ? saldo > 0 : saldo < 0;
    return favoravel ? "bom" : "ruim";
  }

  function cartaoNumero(rotulo, valor, classe) {
    var no = el("div", "numero");
    no.appendChild(el("span", "rotulo", rotulo));
    no.appendChild(el("span", "valor" + (classe ? " " + classe : ""), valor));
    return no;
  }

  /* ---------- ocupação do pátio ---------- */

  function renderPatio(patio) {
    var alvo = document.getElementById("patio");
    limpar(alvo);

    function setor(nome, valor, unidade, extras) {
      var vazio = valor === 0;
      var no = el("div", "setor" + (vazio ? " vazio" : ""));
      no.appendChild(el("p", "setor-nome", nome));
      no.appendChild(
        el("p", "setor-valor", typeof valor === "number" ? String(valor).padStart(2, "0") : valor)
      );
      if (unidade) no.appendChild(el("p", "setor-unidade", unidade));
      if (extras) no.appendChild(extras);
      alvo.appendChild(no);
      return no;
    }

    setor("Recepção", patio.recepcao.lotes, plural(patio.recepcao.lotes, "lote", "lotes"));
    setor("VVs", patio.vvs.lotes, plural(patio.vvs.lotes, "lote", "lotes"));
    setor(
      "Classificação",
      patio.classificacao.lotes,
      plural(patio.classificacao.lotes, "lote", "lotes")
    );

    var trens = patio.formacao.trens || [];
    var lista = el("ul", "etiquetas");
    trens.forEach(function (t) {
      lista.appendChild(el("li", null, t));
    });
    setor("Formação", trens.length, plural(trens.length, "trem", "trens"), lista);

    setor("CTR", patio.ctr.lotes, plural(patio.ctr.lotes, "lote", "lotes"));

    var buffer = patio.buffer;
    var detalhe = el("dl", "detalhe");
    [
      ["GDU", buffer.gdu],
      ["GDT", buffer.gdt],
    ].forEach(function (par) {
      var caixa = el("div");
      caixa.appendChild(el("dt", null, par[0]));
      caixa.appendChild(el("dd", null, String(par[1])));
      detalhe.appendChild(caixa);
    });
    setor("Buffer", buffer.gdu + buffer.gdt, "vagões no total", detalhe);
  }

  function plural(n, singular, plural_) {
    return n === 1 ? singular : plural_;
  }

  /* ---------- indicadores ---------- */

  function renderIndicadores(indicadores) {
    var alvo = document.getElementById("indicadores");
    limpar(alvo);

    indicadores.forEach(function (ind) {
      var saldo = ind.realizado - ind.programa;
      var no = el("div", "indicador");
      no.appendChild(el("h3", null, ind.nome));

      var trio = el("div", "trio");
      [
        [ind.rotuloPrograma || "Programa", num(ind.programa), ""],
        ["Realizado", num(ind.realizado), classeSaldo(saldo, ind.melhor)],
        ["Saldo", comSinal(saldo), classeSaldo(saldo, ind.melhor)],
      ].forEach(function (col) {
        var caixa = el("div");
        caixa.appendChild(el("span", "rotulo", col[0]));
        caixa.appendChild(el("span", "valor" + (col[2] ? " " + col[2] : ""), col[1]));
        trio.appendChild(caixa);
      });
      no.appendChild(trio);

      if (ind.parcelas && ind.parcelas.length) {
        var tabela = el("table", "parcelas");
        var thead = el("thead");
        var linha = el("tr");
        ["Parcelas", "Programa", "Realizado", "Saldo"].forEach(function (t) {
          linha.appendChild(el("th", null, t));
        });
        thead.appendChild(linha);
        tabela.appendChild(thead);

        var tbody = el("tbody");
        ind.parcelas.forEach(function (p) {
          var s = p.realizado - p.programa;
          var tr = el("tr");
          tr.appendChild(el("td", null, p.nome));
          tr.appendChild(el("td", null, num(p.programa)));
          tr.appendChild(el("td", classeSaldo(s, ind.melhor), num(p.realizado)));
          tr.appendChild(el("td", classeSaldo(s, ind.melhor), comSinal(s)));
          tbody.appendChild(tr);
        });
        tabela.appendChild(tbody);
        no.appendChild(tabela);
      }

      alvo.appendChild(no);
    });
  }

  /* ---------- descarregamento ---------- */

  function renderDescarregamento(d) {
    var resumo = document.getElementById("descarga-resumo");
    limpar(resumo);

    var aderencia = d.realizado - d.capacidade;
    [
      ["D+30", num(d.d30), ""],
      ["S+X", num(d.sx), ""],
      ["D+1", num(d.d1), ""],
      ["Oferta", num(d.oferta), "bom"],
      ["Ofertado", num(d.ofertado), ""],
      ["Capacidade", num(d.capacidade), "bom"],
      ["Realizado", num(d.realizado), classeSaldo(aderencia, "maior")],
    ].forEach(function (c) {
      resumo.appendChild(cartaoNumero(c[0], c[1], c[2]));
    });

    if (d.trens && d.trens.length) {
      var no = el("div", "numero");
      no.appendChild(el("span", "rotulo", "Trens"));
      var lista = el("ul", "etiquetas");
      d.trens.forEach(function (t) {
        lista.appendChild(el("li", null, t));
      });
      no.appendChild(lista);
      resumo.appendChild(no);
    }

    renderParcial(d.parcial);
    renderGrafico(d.parcial);

    var impactos = document.getElementById("descarga-impactos");
    limpar(impactos);
    impactos.appendChild(el("h3", null, "Impactos no descarregamento"));
    impactos.appendChild(listaTexto(d.impactos, "Sem impactos registrados."));
  }

  function renderParcial(parcial) {
    var tabela = document.getElementById("descarga-parcial");
    limpar(tabela);

    var thead = el("thead");
    var cabecalho = el("tr");
    cabecalho.appendChild(el("th", null, ""));
    parcial.horas.forEach(function (h) {
      cabecalho.appendChild(el("th", null, h));
    });
    thead.appendChild(cabecalho);
    tabela.appendChild(thead);

    var tbody = el("tbody");

    var linhaPrevisto = el("tr");
    linhaPrevisto.appendChild(el("th", null, "Previsto"));
    parcial.previsto.forEach(function (v) {
      linhaPrevisto.appendChild(el("td", null, num(v)));
    });
    tbody.appendChild(linhaPrevisto);

    var linhaReal = el("tr");
    linhaReal.appendChild(el("th", null, "Descarregado"));
    parcial.descarregado.forEach(function (v, i) {
      if (v === null || v === undefined) {
        linhaReal.appendChild(el("td", null, TRAVESSAO));
        return;
      }
      var desvio = v - parcial.previsto[i];
      linhaReal.appendChild(el("td", classeSaldo(desvio, "maior"), num(v)));
    });
    tbody.appendChild(linhaReal);

    tabela.appendChild(tbody);
  }

  function renderGrafico(parcial) {
    var alvo = document.getElementById("descarga-grafico");
    limpar(alvo);

    var L = 46, R = 34, T = 12, B = 28; /* R folga para o rótulo das 24:00 */
    var W = 800, H = 260;
    var largura = W - L - R;
    var altura = H - T - B;

    var todos = parcial.previsto.concat(parcial.descarregado).filter(function (v) {
      return typeof v === "number";
    });
    var maximo = Math.ceil(Math.max.apply(null, todos) / 10) * 10;
    var n = parcial.horas.length;

    function x(i) {
      return L + (n === 1 ? largura / 2 : (largura * i) / (n - 1));
    }
    function y(v) {
      return T + altura - (altura * v) / maximo;
    }

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("role", "img");
    svg.setAttribute(
      "aria-label",
      "Curva de descarregamento previsto contra realizado ao longo do dia"
    );

    function svgEl(tag, atributos) {
      var no = document.createElementNS("http://www.w3.org/2000/svg", tag);
      Object.keys(atributos).forEach(function (k) {
        no.setAttribute(k, atributos[k]);
      });
      return no;
    }

    var corFraca = "currentColor";

    /* grade horizontal + rótulos do eixo Y, em passos redondos */
    var passo = Math.max(10, Math.ceil(maximo / 8 / 10) * 10);
    for (var marca = 0; marca * passo <= maximo; marca++) {
      var v = marca * passo;
      svg.appendChild(
        svgEl("line", {
          x1: L, y1: y(v), x2: W - R, y2: y(v),
          stroke: corFraca, "stroke-opacity": v === 0 ? 0.35 : 0.12,
        })
      );
      var rotulo = svgEl("text", {
        x: L - 8, y: y(v) + 4, "text-anchor": "end",
        "font-size": 11, fill: corFraca, "fill-opacity": 0.6,
      });
      rotulo.textContent = num(v, 0);
      svg.appendChild(rotulo);
    }

    /* rótulos do eixo X */
    parcial.horas.forEach(function (h, i) {
      var t = svgEl("text", {
        x: x(i), y: H - 8, "text-anchor": "middle",
        "font-size": 11, fill: corFraca, "fill-opacity": 0.6,
      });
      t.textContent = h;
      svg.appendChild(t);
    });

    function serie(valores, cor, tracejado) {
      var pontos = [];
      for (var i = 0; i < valores.length; i++) {
        if (typeof valores[i] !== "number") break; // interrompe onde ainda não há apuração
        pontos.push(x(i) + "," + y(valores[i]));
      }
      if (!pontos.length) return;

      svg.appendChild(
        svgEl("polyline", {
          points: pontos.join(" "),
          fill: "none",
          stroke: cor,
          "stroke-width": 2,
          "stroke-linejoin": "round",
          "stroke-linecap": "round",
          "stroke-dasharray": tracejado ? "5 4" : "none",
        })
      );

      pontos.forEach(function (p) {
        var xy = p.split(",");
        svg.appendChild(svgEl("circle", { cx: xy[0], cy: xy[1], r: 3.5, fill: cor }));
      });
    }

    var estilo = getComputedStyle(document.documentElement);
    var verde = estilo.getPropertyValue("--verde").trim() || "#00a19b";
    var cinza = estilo.getPropertyValue("--texto-fraco").trim() || "#66757f";

    serie(parcial.previsto, cinza, true);
    serie(parcial.descarregado, verde, false);

    alvo.appendChild(svg);

    var legenda = el("div", "legenda");
    legenda.appendChild(el("span", "lg-previsto", "Previsto"));
    legenda.appendChild(el("span", "lg-real", "Descarregado"));
    alvo.appendChild(legenda);
  }

  /* ---------- tração, partidas e textos ---------- */

  function renderTracao(t) {
    var alvo = document.getElementById("tracao");
    limpar(alvo);
    alvo.appendChild(cartaoNumero("Sentido", t.sentido, ""));
    alvo.appendChild(cartaoNumero("Em descarga", t.emDescarga, ""));
    alvo.appendChild(cartaoNumero("Pulmão", t.pulmao + " locos", ""));
    alvo.appendChild(cartaoNumero("Liberado", t.liberado, "bom"));
  }

  function renderPartidas(p) {
    var alvo = document.getElementById("partidas");
    limpar(alvo);
    alvo.appendChild(cartaoNumero("Programa D", p.programaD, ""));
    alvo.appendChild(cartaoNumero("Mina D+1", p.minaD1, ""));
    alvo.appendChild(cartaoNumero("Última partida", p.ultimaPartida, "bom"));
  }

  function listaTexto(itens, vazio) {
    if (!itens || !itens.length) return el("p", null, vazio);
    var ul = el("ul", "lista-texto");
    itens.forEach(function (i) {
      ul.appendChild(el("li", null, i));
    });
    return ul;
  }

  function renderAtencao(itens) {
    var alvo = document.getElementById("atencao");
    limpar(alvo);
    alvo.appendChild(listaTexto(itens, "Nenhum ponto de atenção registrado."));
  }

  /* ---------- orquestração ---------- */

  function render(registro) {
    document.getElementById("envio").textContent =
      "Envio: " + dataLonga(registro.data) + " " + registro.envio;
    renderPatio(registro.patio);
    renderIndicadores(registro.indicadores);
    renderDescarregamento(registro.descarregamento);
    renderTracao(registro.tracao);
    renderPartidas(registro.partidas);
    renderAtencao(registro.atencao);
  }

  function iniciar() {
    if (!registros.length) {
      document.getElementById("conteudo").textContent =
        "Nenhum registro em dados/registros.js.";
      return;
    }

    registros.sort(function (a, b) {
      return b.data.localeCompare(a.data);
    });

    var seletor = document.getElementById("seletor-data");
    registros.forEach(function (r, i) {
      var opcao = el("option", null, dataLonga(r.data));
      opcao.value = String(i);
      seletor.appendChild(opcao);
    });
    seletor.addEventListener("change", function () {
      render(registros[Number(seletor.value)]);
    });

    render(registros[0]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
