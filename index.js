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
  VytvorAVykresliTabulku(
    dataProGrafATabulku,
    PripravDataRocnik(data, rok).hlasyCelkem
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

function VytvorAVykresliTabulku(dataProGrafATabulku, hlasyCelkem) {
  let dataProTabulku = [];

  dataProGrafATabulku.forEach((strana) => {
    let nazevStrany = strana[0];
    let mandatyStrany = strana[1];
    let hlasyStrany = strana[4];

    let procentoHlasu = (hlasyStrany / hlasyCelkem) * 100;
    let procentoMandatu = (mandatyStrany / 200.0) * 100;

    let hlasyNaMandat = Math.round(hlasyStrany / mandatyStrany);

    let rozdilMandatuAHlasu =
      (procentoMandatu - procentoHlasu).toFixed(2) + "%";

    let indexDeformace = (procentoMandatu / procentoHlasu).toFixed(3);

    procentoHlasu = procentoHlasu.toFixed(2) + "%";
    procentoMandatu = procentoMandatu.toFixed(1) + "%";

    hlasyStrany = FormatujCislo(hlasyStrany);
    hlasyNaMandat = FormatujCislo(hlasyNaMandat);

    let radekTabulky = [
      nazevStrany,
      hlasyStrany,
      procentoHlasu,
      mandatyStrany,
      procentoMandatu,
      hlasyNaMandat,
      rozdilMandatuAHlasu,
      indexDeformace,
    ];

    dataProTabulku.push(radekTabulky);
  });

  NaplnTabulku(dataProTabulku, [
    "Strana",
    "Hlasy",
    "% Hlasů",
    "Mandáty",
    "% Mandátů",
    "Hlasy na 1 mandát",
    "Rozdíl mandátů a hlasů",
    '<a href="#" data-toggle="tooltip" data-placement="left" title="Index deformace dělí procento mandátů, které strana získala, procentem jejích hlasů. Výsledek 1 značí absolutně poměrné zastoupení dané strany. Vyšší hodnota indexu pak značí nadreprezentaci strany, zatímco hodnota nižší než 1 ukazuje, že je strana podreprezentovaná.">Index deformace</a>',
  ]);
}
