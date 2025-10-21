let rok = 2025;
let metoda = 100;
let klauzule = 0.05;
let obvod = 0;
let data;
var width = window.innerWidth > 0 ? window.innerWidth : screen.width;
let graf = {
  chart: {
    type: "item",
  },

  title: {
    text: "Vizualizace Poslanecké sněmovny",
  },

  legend: {
    labelFormat: '{name} <span style="opacity: 0.8">{y}</span>',
  },

  series: [
    {
      name: "Počet křesel",
      keys: ["name", "y", "color", "label", "hlasyCelkem"],
      data: [],
      dataLabels: {
        enabled: true,
        format: "{point.label}",
      },
      // Circular options
      center: ["50%", "88%"],
      size: "170%",
      startAngle: -100,
      endAngle: 100,
    },
  ],
};

fetch("data.json")
  .then((resp) => resp.json())
  .then((dataJSON) => {
    data = dataJSON;
    VypoctiMandatyAVykresliGrafATabulku(
      data,
      rok,
      klauzule,
      metoda,
      obvod,
      graf,
      width
    );
  });

function VykresliGraf(graf) {
  Highcharts.chart("chart", graf);
}

function UpravDleSirky(graf, width) {
  width = window.innerWidth > 0 ? window.innerWidth : screen.width;
  if (width < 600) {
    graf.series[0].dataLabels.enabled = false;
  } else {
    graf.series[0].dataLabels.enabled = true;
  }
}

function VypoctiMandatyAVykresliGrafATabulku(
  data,
  rok,
  klauzule,
  metoda,
  obvod,
  graf,
  width
) {
  let dataProGrafATabulku = VypoctiMandatyPS(
    data,
    rok,
    klauzule,
    metoda,
    obvod
  );
  graf.series[0].data = dataProGrafATabulku;

  AktualizujNazev(graf, dataProGrafATabulku.length);
  UpravDleSirky(graf, width);

  VykresliGraf(graf);
  const hlasyCelkemRok = PripravDataRocnik(data, rok).hlasyCelkem;
  VytvorAVykresliTabulku(
    dataProGrafATabulku,
    hlasyCelkemRok
  );
}

function AktualizujNazev(graf, dataLenght) {
  if (dataLenght == 0) {
    graf.title.text = "Žádná strana se nedostala do Poslenecké sněmovny.";
  } else {
    graf.title.text = "Vizualizace Poslanecké sněmovny";
  }
}

function ZmenaRoku(element) {
  rok = parseInt(element.value);
  VypoctiMandatyAVykresliGrafATabulku(
    data,
    rok,
    klauzule,
    metoda,
    obvod,
    graf,
    width
  );
}

function ZmenaObvodu(element) {
  obvod = parseInt(element.value);
  VypoctiMandatyAVykresliGrafATabulku(
    data,
    rok,
    klauzule,
    metoda,
    obvod,
    graf,
    width
  );
}

function ZmenaMetody(element) {
  metoda = parseInt(element.value);
  VypoctiMandatyAVykresliGrafATabulku(
    data,
    rok,
    klauzule,
    metoda,
    obvod,
    graf,
    width
  );
}

function ZmenaKlauzule(element) {
  if (element.value == "") {
    klauzule = 0;
  } else {
    klauzule = parseFloat(element.value) / 100;
  }
  VypoctiMandatyAVykresliGrafATabulku(
    data,
    rok,
    klauzule,
    metoda,
    obvod,
    graf,
    width
  );
}

function VytvorAVykresliTabulku(dataProGrafATabulku) {
  const rokData = PripravDataRocnik(data, rok);
  const hlasyCelkem = rokData.hlasyCelkem;

  const votesByName = {};
  rokData.strany.forEach(p => {
    votesByName[p.nazev] = p.hlasy;
    if (p.nazevDlouhy) votesByName[p.nazevDlouhy] = p.hlasy;
  });

  const rows = dataProGrafATabulku.map(strana => {
    const nazevDlouhy = strana[0];
    const mandatyStrany = parseInt(strana[1], 10) || 0;
    const labelKratky = strana[3];

    const hlasyStranyRaw =
      (votesByName[labelKratky] ?? votesByName[nazevDlouhy] ?? 0);

    const procentoHlasu = hlasyCelkem > 0 ? (hlasyStranyRaw / hlasyCelkem) * 100 : 0;
    const procentoMandatu = (mandatyStrany / 200) * 100;

    const hlasyNaMandat = mandatyStrany > 0
      ? Math.round(hlasyStranyRaw / mandatyStrany)
      : 0;

    const rozdilMandatuAHlasu = (procentoMandatu - procentoHlasu).toFixed(2) + "%";
    const indexDeformace = procentoHlasu > 0
      ? (procentoMandatu / procentoHlasu).toFixed(3)
      : "-";

    const fmt = (n) => n.toLocaleString("cs-CZ");
    return [
      nazevDlouhy,
      fmt(hlasyStranyRaw),
      procentoHlasu.toFixed(2) + "%",
      mandatyStrany,
      procentoMandatu.toFixed(1) + "%",
      fmt(hlasyNaMandat),
      rozdilMandatuAHlasu,
      indexDeformace,
    ];
  });

  NaplnTabulku(rows, [
    "Strana", "Hlasy", "% Hlasů", "Mandáty", "% Mandátů",
    "Hlasy na 1 mandát", "Rozdíl mandátů a hlasů",
    '<a href="#" data-toggle="tooltip" data-placement="left" title="Index deformace dělí procento mandátů, které strana získala, procentem jejích hlasů. Výsledek 1 značí absolutně poměrné zastoupení dané strany. Vyšší hodnota indexu pak značí nadreprezentaci strany, zatímco hodnota nižší než 1 ukazuje, že je strana podreprezentovaná.">Index deformace</a>',
  ]);
}

function NaplnTabulku(rows, headers) {
  const tbl = document.getElementById("_table");
  if (!tbl) return;

  const thead =
    '<thead class="thead-light"><tr>' +
    headers.map((h) => `<th class="text-center">${h}</th>`).join("") +
    "</tr></thead>";

  const tbody =
    "<tbody>" +
    rows
      .map(
        (r) =>
          "<tr>" + r.map((c) => `<td class="text-center">${c}</td>`).join("") + "</tr>"
      )
      .join("") +
    "</tbody>";

  tbl.innerHTML = thead + tbody;

  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });
}

function FormatujCislo(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1&nbsp");
}