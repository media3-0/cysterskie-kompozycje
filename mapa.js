(function () {
  "use strict";

  // Pięć punktów nasłuchu na obszarze Przegędzy i polany Kanetowiec.
  // Nagrania: Wikimedia Commons, licencja CC BY-SA 4.0.
  const STOPS = [
    {
      title: "Polana Kanetowiec",
      subtitle: "miejsce ogniskowe i wiata",
      desc:
        "Serce polany, gdzie kończą się leśne dróżki. Wieczorem przestrzeń wypełnia śpiew słowika — długi, kunsztowny, prowadzony jak solowa kadencja.",
      lat: 50.1101,
      lon: 18.6221,
      audio:
        "https://upload.wikimedia.org/wikipedia/commons/5/59/Common_Nightingale_%28Luscinia_megarhynchos%29_%28W1CDR0001376_BD18%29.ogg",
      species: "Słowik rdzawy (Luscinia megarhynchos)",
      author: "British Library",
      page:
        "https://commons.wikimedia.org/wiki/File:Common_Nightingale_(Luscinia_megarhynchos)_(W1CDR0001376_BD18).ogg",
    },
    {
      title: "Stawy pod Kanetowcem",
      subtitle: "wilgotny skraj lasu",
      desc:
        "Przy wodzie dźwięk gęstnieje i wibruje. Donośny, perkusyjny trel strzyżyka odbija się od tafli i zarośli — najmniejszy ptak o jednym z najsilniejszych głosów.",
      lat: 50.1074,
      lon: 18.6176,
      audio:
        "https://upload.wikimedia.org/wikipedia/commons/9/91/Troglodytes_troglodytes_-_Eurasian_Wren_XC474428.mp3",
      species: "Strzyżyk zwyczajny (Troglodytes troglodytes)",
      author: "Marie-Lan Taÿ Pamart",
      page:
        "https://commons.wikimedia.org/wiki/File:Troglodytes_troglodytes_-_Eurasian_Wren_XC474428.mp3",
    },
    {
      title: "Dróżka Kopruszka",
      subtitle: "ścieżka dydaktyczna",
      desc:
        "Śródleśny szlak wśród starych buków. Fletowe, melancholijne frazy kosa niosą się między pniami — muzyka zmierzchu, spokojna i przestronna.",
      lat: 50.1152,
      lon: 18.6271,
      audio:
        "https://upload.wikimedia.org/wikipedia/commons/b/b0/Turdus_merula_-_Common_Blackbird_XC561032.mp3",
      species: "Kos zwyczajny (Turdus merula)",
      author: "Olivier Grimm",
      page:
        "https://commons.wikimedia.org/wiki/File:Turdus_merula_-_Common_Blackbird_XC561032.mp3",
    },
    {
      title: "Kapliczka słupowa",
      subtitle: "przy leśnym szlaku",
      desc:
        "Cichy punkt przy dawnym trakcie. W gęstwinie odzywa się kapela drozda śpiewaka — powtarzane, dobitne motywy układające się w rytmiczną frazę.",
      lat: 50.1344,
      lon: 18.6438,
      audio:
        "https://upload.wikimedia.org/wikipedia/commons/9/96/Erithacus_rubecula_-_European_Robin_XC249306.mp3",
      species: "Rudzik (Erithacus rubecula)",
      author: "Zdeněk Vermouzek",
      page:
        "https://commons.wikimedia.org/wiki/File:Erithacus_rubecula_-_European_Robin_XC249306.mp3",
    },
    {
      title: "Skraj lasu · Przegędza",
      subtitle: "granica wsi i boru",
      desc:
        "Tam, gdzie las spotyka się z zabudową, powietrze wypełnia bogaty, płynny śpiew kapturki — jeden z najbardziej muzykalnych głosów europejskiego lasu.",
      lat: 50.1215,
      lon: 18.6313,
      audio:
        "https://upload.wikimedia.org/wikipedia/commons/2/2f/Sylvia_atricapilla_-_Eurasian_Blackcap_XC559969.mp3",
      species: "Kapturka (Sylvia atricapilla)",
      author: "Marie-Lan Taÿ Pamart",
      page:
        "https://commons.wikimedia.org/wiki/File:Sylvia_atricapilla_-_Eurasian_Blackcap_XC559969.mp3",
    },
  ];

  document.addEventListener("DOMContentLoaded", function () {
    const map = L.map("map", { scrollWheelZoom: true }).setView([50.118, 18.63], 14);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        'Dane mapy © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const stopsPanel = document.querySelector(".stops");
    const markers = [];
    const cards = [];
    const bounds = [];

    function popupHtml(stop, i) {
      return (
        '<div class="popup-card">' +
        "<h3>" + (i + 1) + ". " + stop.title + "</h3>" +
        '<p class="sub">' + stop.species + "</p>" +
        '<audio controls preload="none" src="' + stop.audio + '"></audio>' +
        '<p class="attr">Nagranie: ' + stop.author +
        ' — <a href="' + stop.page + '" target="_blank" rel="noopener">Wikimedia Commons</a>, CC BY-SA 4.0.</p>' +
        "</div>"
      );
    }

    function setActive(i) {
      cards.forEach(function (c, j) {
        c.classList.toggle("is-active", i === j);
      });
    }

    STOPS.forEach(function (stop, i) {
      const icon = L.divIcon({
        className: "",
        html: '<div class="marker-pin"><span>' + (i + 1) + "</span></div>",
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      });

      const marker = L.marker([stop.lat, stop.lon], { icon: icon }).addTo(map);
      marker.bindPopup(popupHtml(stop, i), { maxWidth: 280 });
      marker.on("popupopen", function () {
        setActive(i);
      });
      markers.push(marker);
      bounds.push([stop.lat, stop.lon]);

      const card = document.createElement("button");
      card.type = "button";
      card.className = "stop";
      card.innerHTML =
        '<span class="idx">' + (i + 1) + "</span>" +
        "<h3>" + stop.title + "</h3>" +
        "<p><em>" + stop.subtitle + "</em> — " + stop.desc + "</p>";
      card.addEventListener("click", function () {
        map.setView([stop.lat, stop.lon], 15, { animate: true });
        marker.openPopup();
        setActive(i);
      });
      stopsPanel.appendChild(card);
      cards.push(card);
    });

    if (bounds.length) {
      map.fitBounds(bounds, { padding: [45, 45] });
    }
  });
})();
