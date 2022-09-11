import './css/styles.css';
import fetchCountries from './js/fetchCountry';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryBox = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function createCountryList(country) {
    const listMarkup = country
        .map(({ flags, name }) => {
            return `<li class=country-list__item>
                        <img src="${flags.svg}" alt="${name.official}" /> <h1>${name.official}</h1>
                    </li>`;
        }).join('');
    countryList.innerHTML = listMarkup;
}

function createCountryBox(country) {
    const {
        flags: { svg },
        name: { official },
        capital,
        population,
        languages,
    } = country;
    const boxMarkup = `<div class=country-image>
        <img src="${svg}" alt="${official}" /> <h2>${official}</h2>
    </div>
    <div class=country-card>
        <p> <span>Capital</span>: ${capital} </p>
        <p> <span>Population</span>: ${population} </p>
        <p> <span>Languages</span>: ${Object.values(languages).join(', ')} </p>
    </div>`;
    countryBox.innerHTML = boxMarkup;
}

function searchCountry(evt) {
    const onSearchCountry = evt.target.value;
    clearInput();
    if (!onSearchCountry) {
        return;
    }
    fetchCountries(onSearchCountry)
        .then(country => {
            if (country.length > 10) {
                Notify.info("Too many matches found. Please enter a more specific name.");
                return;
            }
            if (country.length === 1) {
                createCountryBox(country[0]);
                return;
            }
            createCountryList(country)
        })
        .catch(error => {
            Notify.failure("Oops, there is no country with that name.")
        });
}

function clearInput() {
    countryList.innerHTML = '';
    countryBox.innerHTML = '';
}