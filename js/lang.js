
const defaultLocale = "en";
let locale;
let translations = {};
const switcher =  document.querySelector("#lang");
const supportedLocales = ["en", "pl" , "de" , "fr"];


function getLocalefromStorage() {
    return localStorage.getItem("locale");
}

// ...
document.addEventListener("DOMContentLoaded", () => {
  const initialLocale = getLocalefromStorage() || supportedOrDefault(browserLocales(true));
  setLocale(initialLocale);
  bindLocaleSwitcher(initialLocale);
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
    languageCodeOnly ? locale.split("-")[0] : locale,
  );
}

function bindLocaleSwitcher(initialValue) {
    switcher.value = initialValue;
    switcher.onchange = (e) => {
      // Set the locale to the selected option[value]
      switcher.disabled  = true;
      setLocale(e.target.value);
      localStorage.setItem("locale", e.target.value);
    };
  }
// Load translations for the given locale and translate
// the page to this locale
async function setLocale(newLocale) {
  if (newLocale === locale) return;
  const newTranslations =
    await fetchTranslationsFor(newLocale);
  locale = newLocale;
  translations = newTranslations;
  translatePage();
}
// Retrieve translations JSON object for the given
// locale over the network
async function fetchTranslationsFor(newLocale) {
  const response = await fetch(`../langs/${newLocale}.json`);
  return await response.json();
}
// Replace the inner text of each element that has a
// data-i18n-key attribute with the translation corresponding
// to its data-i18n-key
function translatePage() {
  document
    .querySelectorAll("[data-lang]")
    .forEach(translateElement);
    switcher.disabled = false
}
// Replace the inner text of the given HTML element
// with the translation in the active locale,
// corresponding to the element's data-i18n-key
function translateElement(element) {
  const key = element.getAttribute("data-lang");
  const translation = translations[key];
  element.innerText = translation;
}