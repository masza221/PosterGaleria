const defaultLocale = "pl";
let locale;
let translations = {};
let translating = false;
const supportedLocales = ["en", "pl", "de", "fr"];

const langButtons = document.querySelectorAll(".langs__item");

langButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    if(translating) return;
    translating = true;
    const newLocale = e.target.getAttribute("data-value");
    if(newLocale === locale)  return translating = false;; 
    setLocale(newLocale);
    localStorage.setItem("locale", newLocale);
  });
});


function getLocalefromStorage() {
  return localStorage.getItem("locale");
}

// ...
document.addEventListener("DOMContentLoaded", () => {
  const initialLocale =
    getLocalefromStorage() || supportedOrDefault(browserLocales(true));
  setLocale(initialLocale);
});
// ...
function isSupported(locale) {
  return supportedLocales.indexOf(locale) > -1;
}
// Retrieve the first locale we support from the given
// array, or return our default locale
function supportedOrDefault(locales) {
  return locales.find(isSupported) || defaultLocale;
}
// ...
function browserLocales(languageCodeOnly = false) {
  return navigator.languages.map((locale) =>
    languageCodeOnly ? locale.split("-")[0] : locale
  );
}

async function setLocale(newLocale) {
  if (newLocale === locale) return;
  const newTranslations = await fetchTranslationsFor(newLocale);
  locale = newLocale;
  translations = newTranslations;
  translatePage();
}
async function fetchTranslationsFor(newLocale) {
  const response = await fetch(`../langs/${getFolderName()}/${newLocale}.json`);
  return await response.json();
}
function getFolderName() {
  const link = window.location.pathname;
  const linkName = link.split("/").pop();
  let folder = linkName.split(".")[0];
  if (folder === "") folder = "index";
  return folder;
}

function translatePage() {
  document.querySelectorAll("[data-lang]").forEach(translateElement);
  createPopup();
  translating = false;
}
function translateElement(element) {
  const key = element.getAttribute("data-lang");
  const translation = translations[key];
  element.innerText = translation;
}

function createPopup() {
  if (!translating) return;

  
  if(document.querySelector(".popup")) document.querySelector(".popup").remove();

  const popup = document.createElement("div");
  const message = translations["message"];
  popup.classList.add("popup");
  popup.innerHTML = `
    <div class="Message Message--green">
      <div class="Message-icon"> &#10003;</div>
      <div class="Message-body">
        <p>${message}</p>
      </div>
    </div>
  `;
  document.querySelector("body").appendChild(popup);


  setTimeout(() => {
    popup.remove();
  }, 4000);
}
