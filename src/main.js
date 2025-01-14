const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const more = document.getElementById("more");

const apiURL = "https://api.lyrics.ovh";

// 曲またはアーティストで検索
async function searchSongs(term) {
  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();

  showData(data);
}

// DOMに曲とアーティストを表示
function showData(data) {
  result.innerHTML = `
    <ul class="songs">
      ${data.data
        .map(
          (song) => `<li>
      <span><strong>${song.artist.name}</strong> - ${song.title}</span>
      <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
    </li>`
        )
        .join("")}
    </ul>
  `;

  if (data.prev || data.next) {
    more.innerHTML = `
      ${
        data.prev
          ? `<button class="btn prev" data-url="${data.prev}">Prev</button>`
          : ""
      }
      ${
        data.next
          ? `<button class="btn next" data-url="${data.next}">Next</button>`
          : ""
      }
    `;
  } else {
    more.innerHTML = "";
  }
  onClickPrev();
  onClickNext();
}

// prevボタンの実装
function onClickPrev() {
  const prevButton = document.querySelector(".prev");
  if (prevButton) {
    prevButton.addEventListener("click", () => {
      const url = prevButton.getAttribute("data-url");
      getMoreSongs(url);
    });
  }
}

// nextボタンの実装
function onClickNext() {
  const nextButton = document.querySelector(".next");
  if (nextButton) {
    nextButton.addEventListener("click", () => {
      const url = nextButton.getAttribute("data-url");
      getMoreSongs(url);
    });
  }
}

// prevボタンとnextボタン
async function getMoreSongs(url) {
  const res = await fetch(`https://thingproxy.freeboard.io/fetch/${url}`);
  const data = await res.json();

  showData(data);
}

// イベントリスナー
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value.trim();

  if (!searchTerm) {
    alert("Please type in a search term");
  } else {
    searchSongs(searchTerm);
  }
});
