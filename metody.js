function PridelMandatyPS_Delitel(
    dataRocnik,
    prvniCifraRady,
    increment,
    klauzule
  ) {
    let data = Kopie(dataRocnik);
  
    let mandatyKraju = VypoctiMandatyKraju(PripravHlasyAMandatyKraje(data));
  
    data = AplikujKlauzuli(data, klauzule, 2*klauzule, 3*klauzule);
  
    if (NikdoNepostoupil(data)) {
      return [];
    }
  
    let mandatyStran = PripravDataStran(data);
  
    let radaDelitelu = VypoctiRaduDelitelu(prvniCifraRady, increment);
  
    mandatyStran = PridelMandatyVKrajich_Delitel(
      mandatyStran,
      mandatyKraju,
      radaDelitelu,
      data
    );
  
    mandatyStran = VypoctiPocetHlasuNaMandat(mandatyStran);
  
    return mandatyStran;
  }
  
  function PridelMandatyPS_Delitel_Celostatni(
    dataRocnik,
    prvniCifraRady,
    increment,
    klauzule
  ) {
    let data = Kopie(dataRocnik);
  
    data = AplikujKlauzuli(data, klauzule, 2*klauzule, 3*klauzule);
  
    if (NikdoNepostoupil(data)) {
      return [];
    }
  
    let dataStran = PripravDataStranCelostatni(data);
  
    let radaDelitelu = VypoctiRaduDelitelu(prvniCifraRady, increment);
  
    let dataStranSPodili = PridejPodily(dataStran, radaDelitelu, 200);
  
    let mandatyStran = PridelMandatyObvodu_Delitel(dataStranSPodili, 200);
  
    mandatyStran = VypoctiPocetHlasuNaMandat(mandatyStran);
  
    return mandatyStran;
  }
  
  function PripravDataStranCelostatni(dataRocnik) {
    let data = Kopie(dataRocnik);
  
    let dataStran = data.strany;
  
    dataStran.forEach((strana) => {
      strana.mandaty = 0;
      strana.hlasyCelkem = strana.hlasy;
    });
  
    return dataStran;
  }
  
  function PridelMandatyPS_Kvota(dataRocnik, kvota, klauzule) {
    let data = Kopie(dataRocnik);
  
    let mandatyKraju = VypoctiMandatyKraju(PripravHlasyAMandatyKraje(data));
  
    data = AplikujKlauzuli(data, klauzule, 2*klauzule, 3*klauzule);
  
    if (NikdoNepostoupil(data)) {
      return [];
    }
  
    let mandatyStran = PripravDataStran(data);
  
    mandatyStran = PridelMandatyVKrajich_Kvota(
      mandatyKraju,
      mandatyStran,
      data,
      kvota
    ); // 1. skrutinium (krajske)
  
    let zbytekMandatu = VypoctiZbytekMandatu(mandatyStran, 200);
  
    mandatyStran = VypoctiMandatyVObvodu_Kvota(
      mandatyStran,
      zbytekMandatu,
      kvota
    ); // 2. skrutinium (celorepublikove)
  
    zbytekMandatu = VypoctiZbytekMandatu(mandatyStran, 200);
  
    mandatyStran = MetodaNejvetsichZbytku(mandatyStran, zbytekMandatu); // 3. skrutinium (metoda nejvetsich zbytku)
  
    mandatyStran = VypoctiPocetHlasuNaMandat(mandatyStran);
  
    return mandatyStran;
  }

  function PridelMandatyPS_DveKvoty(dataRocnik, kvota1s, kvota2s, klauzule) {
    let data = Kopie(dataRocnik);
  
    let mandatyKraju = VypoctiMandatyKraju(PripravHlasyAMandatyKraje(data));
  
    data = AplikujKlauzuli(data, klauzule, (8/5) * klauzule,  (11/5) * klauzule); // soucasny voleb model 5,8,11
  
    if (NikdoNepostoupil(data)) {
      return [];
    }
  
    let mandatyStran = PripravDataStran(data);
  
    mandatyStran = PridelMandatyVKrajich_Kvota(
      mandatyKraju,
      mandatyStran,
      data,
      kvota1s
    ); // 1. skrutinium (krajske)
  
    let zbytekMandatu = VypoctiZbytekMandatu(mandatyStran, 200);
  
    mandatyStran = VypoctiMandatyVObvodu_Kvota(
      mandatyStran,
      zbytekMandatu,
      kvota2s
    ); // 2. skrutinium (celorepublikove)
  
    zbytekMandatu = VypoctiZbytekMandatu(mandatyStran, 200);
  
    mandatyStran = MetodaNejvetsichZbytku(mandatyStran, zbytekMandatu); // 3. skrutinium (metoda nejvetsich zbytku)
  
    mandatyStran = VypoctiPocetHlasuNaMandat(mandatyStran);
  
    return mandatyStran;
  }
  
  function PridelMandatyPS_Kvota_Celostatni(dataRocnik, kvota, klauzule) {
    let data = Kopie(dataRocnik);
  
    if(kvota == -2 || kvota == -3){
      data = AplikujKlauzuli(data, klauzule, (8/5) * klauzule,  (11/5) * klauzule); // soucasny voleb model 5,8,11
    } else {
      data = AplikujKlauzuli(data, klauzule, 2*klauzule, 3*klauzule);
    }
  
    if (NikdoNepostoupil(data)) {
      return [];
    }
  
    let mandatyStran = PripravDataStranCelostatni(data);
  
    mandatyStran = VypoctiMandatyVObvodu_Kvota(mandatyStran, 200, kvota);
  
    let zbytekMandatu = VypoctiZbytekMandatu(mandatyStran, 200);
  
    mandatyStran = MetodaNejvetsichZbytku(mandatyStran, zbytekMandatu);
  
    mandatyStran = VypoctiPocetHlasuNaMandat(mandatyStran);
  
    return mandatyStran;
  }
  
  function VypoctiMandatyKraju(hlasyAMandaty) {
    hlasyAMandaty = VypoctiMandatyVObvodu_Kvota(hlasyAMandaty, 200, 0); // Hereova kvota
  
    let zbytekMandatu = VypoctiZbytekMandatu(hlasyAMandaty, 200);
  
    let mandatyKraju = MetodaNejvetsichZbytku(hlasyAMandaty, zbytekMandatu);
  
    return mandatyKraju;
  }
  
  function MetodaNejvetsichZbytku(hlasyAMandaty, mandatyKRozdeleni) {
    while (mandatyKRozdeleni > 0) {
      let max = 0;
      let maxIndex = -1;
  
      for (let index = 0; index < hlasyAMandaty.length; index++) {
        if (hlasyAMandaty[index].hlasy > max) {
          max = hlasyAMandaty[index].hlasy;
          maxIndex = index;
        }
      }
      hlasyAMandaty[maxIndex].mandaty++;
      hlasyAMandaty[maxIndex].hlasy = 0;
      mandatyKRozdeleni--;
    }
  
    return hlasyAMandaty;
  }
  
  function VypoctiMandatyVObvodu_Kvota(hlasyAMandaty, mandatyKRozdeleni, kvota) {
    let hlasyCelkem = VypoctiHlasyCelkem(hlasyAMandaty);
    let hlasyAMandaty_kopie = Kopie(hlasyAMandaty);
    let mandatyPredPridelenim = VypoctiMandatyCelkem(hlasyAMandaty);
  
    let mandatoveCislo = VypoctiMandatoveCislo(
      hlasyCelkem,
      mandatyKRozdeleni,
      kvota
    );
  
    hlasyAMandaty = VypoctiMandatyAZbytkyHlasu(hlasyAMandaty, mandatoveCislo);
  
    // Zkouska zda imperaliho kvota nerozdelila o hlas navic
  
    if (
      mandatyPredPridelenim + mandatyKRozdeleni >=
      VypoctiMandatyCelkem(hlasyAMandaty)
    ) {
      return hlasyAMandaty;
    } else if (kvota == -2) { //upravena imperaliho
      let decIndex = 0;
      let min = hlasyAMandaty[0].hlasy;

      for (let index = 1; index < hlasyAMandaty.length; index++) {
        if (hlasyAMandaty[index].mandaty >= 1 && hlasyAMandaty[index].hlasy < min) {
          min = hlasyAMandaty[index].hlasy;
          decIndex = index;
        }
      }
      hlasyAMandaty[decIndex].mandaty--; // Bereme mandat strane s nejmensim zbytkem hlasu, pricitame hlasy ve velikosti mandatovehoCisla.
      hlasyAMandaty[decIndex].hlasy += mandatoveCislo;

      return hlasyAMandaty;
    } else {
      mandatoveCislo = VypoctiMandatoveCislo(hlasyCelkem, mandatyKRozdeleni, -1); // Zvolime pro tento obvod Droopovu kvotu jako nahradu za imperaliho
  
      hlasyAMandaty = hlasyAMandaty_kopie;
      hlasyAMandaty = VypoctiMandatyAZbytkyHlasu(hlasyAMandaty, mandatoveCislo);
  
      return hlasyAMandaty;
    }
  }
  
  function VypoctiMandatoveCislo(hlasyCelkem, mandaty, kvota) {
    if (kvota == -1) {
      return Math.floor(hlasyCelkem / (mandaty + 1) + 1); // Droopova kvota ma flag -1 protoze ma jiny vzorec nez ostatni kvoty
    }

    if (kvota == -2){ // -2 je flag, aktualne definovana imperaliho kvota
      return Math.round(hlasyCelkem / (mandaty + 2))
    }

    if (kvota == -3){ // -3 je flag, aktualne definovana H-B kvota
      return Math.round(hlasyCelkem / (mandaty + 1))
    }

    if (kvota == 0) {
      return Math.round(hlasyCelkem / mandaty);
    }
  
    return Math.ceil(hlasyCelkem / (mandaty + kvota));
  }

  function VypoctiMandatyAZbytkyHlasu(hlasyAMandaty, mandatoveCislo) {
    hlasyAMandaty.forEach((strana) => {
      let mandaty = Math.floor(strana.hlasy / mandatoveCislo);
  
      strana.mandaty += mandaty;
      strana.hlasy -= mandatoveCislo * mandaty;
    });
    return hlasyAMandaty;
  }
  
  function VypoctiZbytekMandatu(hlasyAMandaty, mandatyKRozdeleni) {
    let mandatyCelkem = VypoctiMandatyCelkem(hlasyAMandaty);
  
    return mandatyKRozdeleni - mandatyCelkem;
  }
  
  function PripravHlasyAMandatyKraje(dataRocnik) {
    let hlasyAMandaty = [];
  
    dataRocnik.kraje.forEach((kraj) => {
      hlasyAMandaty.push({
        mandaty: 0,
        hlasy: kraj.hlasyCelkem,
      });
    });
  
    return hlasyAMandaty;
  }
  
  function PripravHlasyAMandatyStran_Kraj(hlasyKraj) {
    let hlasyAMandaty = [];
  
    hlasyKraj.forEach((hlasyStrany) => {
      hlasyAMandaty.push({
        hlasy: hlasyStrany,
        mandaty: 0,
      });
    });
  
    return hlasyAMandaty;
  }
  
  function VypoctiHlasyCelkem(hlasyAMandaty) {
    let hlasyCelkem = 0;
  
    hlasyAMandaty.forEach((subjekt) => {
      hlasyCelkem += subjekt.hlasy;
    });
  
    return hlasyCelkem;
  }
  
  function AplikujKlauzuli(dataRocnik, klauzule, klauzule_koalice2, klauzule_koalice3) {
    let hlasyCelkem = dataRocnik.hlasyCelkem;
  
    for (
      let indexStrany = dataRocnik.strany.length - 1;
      indexStrany >= 0;
      indexStrany--
    ) {
      let strana = dataRocnik.strany[indexStrany];
  
      if (
        MaStranaDostHlasu(
          strana.hlasy,
          hlasyCelkem,
          klauzule,
          klauzule_koalice2,
          klauzule_koalice3,
          strana.pocetSubjektu
        ) == false
      ) {
        dataRocnik = VymazStranu(dataRocnik, indexStrany);
      }
    }
  
    return dataRocnik;
  }
  
  function MaStranaDostHlasu(hlasyStrany, hlasyCelkem, klauzule, klauzule_koalice2, klauzule_koalice3,pocetSubjektu) {
    let podilHlasu = hlasyStrany / hlasyCelkem;
    
    if (pocetSubjektu == 1) {
      return podilHlasu >= klauzule;
    }

    if (pocetSubjektu == 2) {
      return podilHlasu >= klauzule_koalice2;
    }

    if (pocetSubjektu >= 3) {
      return podilHlasu >= klauzule_koalice3;
    }
  }
  
  function VymazStranu(dataRocnik, indexStrany) {
    dataRocnik.kraje.forEach((kraj) => {
      kraj.strany.splice(indexStrany, 1);
    });
  
    dataRocnik.strany.splice(indexStrany, 1);
  
    return dataRocnik;
  }
  
  function PripravDataStran(dataRocnik) {
    let strany = [];
  
    let dataStran = dataRocnik.strany;
  
    dataStran.forEach((strana) => {
      strana.hlasyCelkem = strana.hlasy;
      strana.hlasy = 0;
      strana.mandaty = 0;
      strana.hlasyNaMandat = 0;
      strany.push(strana);
    });
  
    return strany;
  }
  
  function PridelMandatyVKrajich_Kvota(mandatyKraj, mandatyStranCR, data, kvota) {
    let pocetKraju = mandatyKraj.length;
  
    for (let indexKraj = 0; indexKraj < pocetKraju; indexKraj++) {
      let hlasyKraj = data.kraje[indexKraj].strany;
  
      let hlasyAMandaty = PripravHlasyAMandatyStran_Kraj(hlasyKraj);
  
      mandatyAHlasy = VypoctiMandatyVObvodu_Kvota(
        hlasyAMandaty,
        mandatyKraj[indexKraj].mandaty,
        kvota
      );
  
      mandatyStranCR = PrictiMandatyAZbytkyHlasu(mandatyStranCR, mandatyAHlasy);
    }
    return mandatyStranCR;
  }
  
  function PrictiMandatyAZbytkyHlasu(mandatyStranCR, hlasyAMandaty) {
    for (let index = 0; index < mandatyStranCR.length; index++) {
      mandatyStranCR[index].mandaty += hlasyAMandaty[index].mandaty;
      mandatyStranCR[index].hlasy += hlasyAMandaty[index].hlasy;
    }
    return mandatyStranCR;
  }
  
  function VypoctiPocetHlasuNaMandat(mandatyStran) {
    mandatyStran.forEach((strana) => {
      if (strana.mandaty == 0) {
        strana.hlasyNaMandat = 0;
      } else {
        strana.hlasyNaMandat = Math.floor(strana.hlasyCelkem / strana.mandaty);
      }
    });
  
    return mandatyStran;
  }
  
  function VypoctiMandatyCelkem(poleObjektuSMandaty) {
    let suma = 0;
  
    poleObjektuSMandaty.forEach((objekt) => {
      suma += objekt.mandaty;
    });
  
    return suma;
  }
  
  function Kopie(obejkt) {
    return JSON.parse(JSON.stringify(obejkt));
  }
  
  function VypoctiRaduDelitelu(prvniCifraRady, increment) {
    let rada = [];
  
    rada.push(prvniCifraRady);
  
    let cifra = Math.floor(prvniCifraRady);
  
    for (let i = 0; i < 200; i++) {
      cifra += increment;
  
      rada.push(cifra);
    }
  
    return rada;
  }
  
  function PridelMandatyVKrajich_Delitel(
    mandatyStran,
    mandatyKraju,
    radaDelitelu,
    data
  ) {
    for (let indexKraj = 0; indexKraj < mandatyKraju.length; indexKraj++) {
      let mandatyKRozdeleni = mandatyKraju[indexKraj].mandaty;
      let hlasyKraj = data.kraje[indexKraj].strany;
  
      let hlasyAMandatyStran_Kraj = PripravHlasyAMandatyStran_Kraj(hlasyKraj);
  
      hlasyAMandatyStran_Kraj = PridejPodily(
        hlasyAMandatyStran_Kraj,
        radaDelitelu,
        mandatyKRozdeleni
      );
  
      hlasyAMandatyStran_Kraj = PridelMandatyObvodu_Delitel(
        hlasyAMandatyStran_Kraj,
        mandatyKRozdeleni
      );
  
      mandatyStran = PrictiMandatyAZbytkyHlasu(
        mandatyStran,
        hlasyAMandatyStran_Kraj
      );
    }
  
    return mandatyStran;
  }
  
  function PridelMandatyObvodu_Delitel(hlasyAMandatyStran, mandatyKRozdeleni) {
    while (mandatyKRozdeleni > 0) {
      let max = 0;
      let maxIndex = 0;
  
      for (let i = 0; i < hlasyAMandatyStran.length; i++) {
        if (hlasyAMandatyStran[i].podily[0] > max) {
          max = hlasyAMandatyStran[i].podily[0];
          maxIndex = i;
        }
      }
  
      hlasyAMandatyStran[maxIndex].mandaty++;
      mandatyKRozdeleni--;
      hlasyAMandatyStran[maxIndex].podily.shift();
    }
  
    return hlasyAMandatyStran;
  }
  
  function PridejPodily(hlasyAMandatyStran, radaDelitelu, mandatyKRozdeleni) {
    hlasyAMandatyStran.forEach((strana) => {
      strana["podily"] = [];
  
      for (let i = 0; i < mandatyKRozdeleni; i++) {
        strana.podily.push(strana.hlasy / radaDelitelu[i]);
      }
    });
  
    return hlasyAMandatyStran;
  }
  
  function VypoctiMandatyPS(data, rok, klauzule, metoda, obvod) {
    let dataRocnik = PripravDataRocnik(data, rok);
    let mandatyStran = [];
  
    if (obvod == 0) {
      // Obvody jsou jednotlive kraje
      if (metoda < 10) {
        mandatyStran = PridelMandatyPS_Kvota(dataRocnik, metoda, klauzule); // Metoda odpovida typu kvoty
      } else if (metoda <= 30) {
        let increment = 1;
        let privniCifra = 1; // D'Hontuv delitel
  
        if (metoda == 20) {
          privniCifra = 1.42; // Modifikovany D'Hontuv delitel
        } else if (metoda == 30) {
          privniCifra = 2; // Imperialiho delitel
        }
        mandatyStran = PridelMandatyPS_Delitel(
          dataRocnik,
          privniCifra,
          increment,
          klauzule
        );
      } else {
        if (metoda == 40) {
          mandatyStran = PridelMandatyPS_Delitel(dataRocnik, 1, 2, klauzule); // Sainte-Lagueuv delitel
        } else if (metoda == 50) {
          mandatyStran = PridelMandatyPS_Delitel(dataRocnik, 1.4, 2, klauzule); // Modifikovany Sainte-Lagueuv delitel
        } else if (metoda == 60) {
          mandatyStran = PridelMandatyPS_Delitel(dataRocnik, 1, 3, klauzule); // Dansky delitel
        } else if (metoda == 100){
          mandatyStran = PridelMandatyPS_DveKvoty(dataRocnik, -2, -3, klauzule); // -2 upravena Imperaliho, -3 upravenaa H-B
        }
      }
    } else {
      // Pouze jeden obvod a to cela ČR
      if (metoda < 10) {
        mandatyStran = PridelMandatyPS_Kvota_Celostatni(
          dataRocnik,
          metoda,
          klauzule
        ); // Metoda odpovida typu kvoty
      } else if (metoda <= 30) {
        let increment = 1;
        let privniCifra = 1; // D'Hontuv delitel
  
        if (metoda == 20) {
          privniCifra = 1.42; // Modifikovany D'Hontuv delitel
        } else if (metoda == 30) {
          privniCifra = 2; // Imperialiho delitel
        }
        mandatyStran = PridelMandatyPS_Delitel_Celostatni(
          dataRocnik,
          privniCifra,
          increment,
          klauzule
        );
      } else {
        if (metoda == 40) {
          mandatyStran = PridelMandatyPS_Delitel_Celostatni(
            dataRocnik,
            1,
            2,
            klauzule
          ); // Sainte-Lagueuv delitel
        } else if (metoda == 50) {
          mandatyStran = PridelMandatyPS_Delitel_Celostatni(
            dataRocnik,
            1.4,
            2,
            klauzule
          ); // Modifikovany Sainte-Lagueuv delitel
        } else if (metoda == 60) {
          mandatyStran = PridelMandatyPS_Delitel_Celostatni(
            dataRocnik,
            1,
            3,
            klauzule
          ); // Dansky delitel
        } else if (metoda == 100) {
          mandatyStran = PridelMandatyPS_Kvota_Celostatni(
            dataRocnik,
            -2,
            klauzule
          ); // -2 aktualni imperaliho kvota
        } 
      }
    }
  
    return UpravDataProGraf(mandatyStran);
  }
  
  function FormatujCislo(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1&nbsp");
  }
  
  function UpravDataProGraf(mandatyStran) {
    let dataProGraf = [];
  
    while (mandatyStran.length > 0) {
      let maxIndex = 0;
      let max = 0;
      let strana = [];
  
      for (let index = 0; index < mandatyStran.length; index++) {
        if (mandatyStran[index].hlasyCelkem > max) {
          maxIndex = index;
          max = mandatyStran[index].hlasyCelkem;
        }
      }
  
      strana = mandatyStran[maxIndex];
  
      let dataStrany = [
        strana.nazevDlouhy,
        strana.mandaty,
        strana.barva,
        strana.nazev,
        strana.hlasyCelkem,
      ];
  
      if (strana.mandaty > 0) {
        dataProGraf.push(dataStrany);
      }
  
      mandatyStran.splice(maxIndex, 1);
    }
  
    return dataProGraf;
  
    mandatyStran.forEach((strana) => {
      let dataStrany = [
        strana.nazevDlouhy,
        strana.mandaty,
        strana.barva,
        strana.nazev,
        FormatujCislo(strana.hlasyNaMandat),
      ];
  
      if (strana.mandaty > 0) {
        dataProGraf.push(dataStrany);
      }
    });
  
    return dataProGraf;
  }
  
  function PripravDataRocnik(data, rok) {
    for (let indexRoku = 0; indexRoku < data.roky.length; indexRoku++) {
      if (data.roky[indexRoku].rok == rok) {
        return Kopie(data.roky[indexRoku]);
      }
    }
  }
  
  function NikdoNepostoupil(data) {
    return data.strany.length == 0;
  }
  
  function ZobrazTabulku(headData, tableData) {
    var table = document.getElementById("_table");
    var rows = table.getElementsByTagName("tr");
  
    if (rows.length > 0) {
      table.deleteRow(0);
      for (var i = rows.length - 1; i >= 0; i++) {
        table.deleteRow(i);
      }
    }
  
    table.deleteTHead();
    table.deleteTBody();
  
    var tableHead = document.createElement("thead");
    var tableBody = document.createElement("tbody");
  
    var hRow = document.createElement("tr");
    headData.forEach((headCellData) => {
      var hCell = document.createElement("th");
      hCell.appendChild(document.createTextNode(headCellData));
      hRow.appendChild(hCell);
    });
  
    tableHead.appendChild(hRow);
  
    tableData.forEach(function (rowData) {
      var row = document.createElement("tr");
  
      rowData.forEach(function (cellData) {
        var cell = document.createElement("td");
        cell.appendChild(document.createTextNode(cellData));
        row.appendChild(cell);
      });
  
      tableBody.appendChild(row);
    });
  
    table.appendChild(tableHead);
    table.appendChild(tableBody);
  }
  
  class TableCsv {
    /**
     * @param {HTMLTableElement} root The table element which will display the CSV data.
     */
    constructor(root) {
      this.root = root;
    }
  
    /**
     * Clears existing data in the table and replaces it with new data.
     *
     * @param {string[][]} data A 2D array of data to be used as the table body
     * @param {string[]} headerColumns List of headings to be used
     */
    update(data, headerColumns = []) {
      this.clear();
      this.setHeader(headerColumns);
      this.setBody(data);
    }
  
    /**
     * Clears all contents of the table (incl. the header).
     */
    clear() {
      this.root.innerHTML = "";
    }
  
    /**
     * Sets the table header.
     *
     * @param {string[]} headerColumns List of headings to be used
     */
    setHeader(headerColumns) {
      this.root.insertAdjacentHTML(
        "afterbegin",
        `
              <thead>
                  <tr>
                      ${headerColumns.map((text) => `<th>${text}</th>`).join("")}
                  </tr>
              </thead>
          `
      );
    }
  
    /**
     * Sets the table body.
     *
     * @param {string[][]} data A 2D array of data to be used as the table body
     */
    setBody(data) {
      const rowsHtml = data.map((row) => {
        return `
                  <tr>
                      ${row.map((text) => `<td>${text}</td>`).join("")}
                  </tr>
              `;
      });
  
      this.root.insertAdjacentHTML(
        "beforeend",
        `
              <tbody>
                  ${rowsHtml.join("")}
              </tbody>
          `
      );
    }
  }
  
  const tableRoot = document.querySelector("#_table");
  const tableCsv = new TableCsv(tableRoot);
  
  function NaplnTabulku(dataTabulky, hlavicka) {
    tableCsv.update(dataTabulky, hlavicka);
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }
  