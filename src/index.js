import './css/styles.css';
import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  countryInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.countryInput.addEventListener('input', debounce(onCountryInput, DEBOUNCE_DELAY));

function wrongCountryNameAlert() {
  Notify.failure('Oops, there is no country with that name');
}

function tooManyMacthesAlert() {
  Notify.info('Too many matches found. Please enter a more specific name.');
}

function onCountryInput() {
  const name = refs.countryInput.value.trim();
  if (name === '') {
    return (refs.countryList.innerHTML = ''), (refs.countryInfo.innerHTML = '');
  }

  fetchCountries(name)
    .then(countries => {
      refs.countryList.innerHTML = '';
      refs.countryInfo.innerHTML = '';
      if (countries.length === 1) {
        refs.countryList.insertAdjacentHTML('beforeend', renderCountryList(countries));
        refs.countryInfo.insertAdjacentHTML('beforeend', renderCountryInfo(countries));
      } else if (countries.length >= 10) {
        tooManyMacthesAlert();
      } else {
        refs.countryList.insertAdjacentHTML('beforeend', renderCountryList(countries));
      }
    })
    .catch(wrongCountryNameAlert);
}

function renderCountryList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `
            <li class="country-list__item list">
                <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}">
                <h2 class="country-list__name">${name.official}</h2>
            </li>
            `;
    })
    .join('');
  return markup;
}

function renderCountryInfo(countries) {
  const markup = countries
    .map(({ capital, population, languages }) => {
      return `
          <ul class="country-info__list list">
              <li class="country-info__item"><p>Capital: ${capital}</p></li>
              <li class="country-info__item"><p>Population: ${population}</p></li>
              <li class="country-info__item"><p>Languages: ${Object.values(languages).join(
                ', ',
              )}</p></li>
          </ul>
          `;
    })
    .join('');
  return markup;
}
