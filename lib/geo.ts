import { City, Country, State } from "country-state-city";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const nigeriaGeo = require("nigeria-state-lga-data") as {
  getLgas: (state: string) => string[];
};

const NIGERIA_CODE = "NG";

/** country-state-city and nigeria-state-lga-data use different FCT labels */
const NIGERIA_STATE_ALIASES: Record<string, string> = {
  "Abuja Federal Capital Territory": "Federal Capital Territory",
};

export function getCountries() {
  return Country.getAllCountries().sort((a, b) => a.name.localeCompare(b.name));
}

export function getCountryName(isoCode: string): string {
  if (!isoCode) return "";
  return Country.getCountryByCode(isoCode)?.name ?? isoCode;
}

export function getStatesForCountry(countryCode: string) {
  if (!countryCode) return [];
  return State.getStatesOfCountry(countryCode).sort((a, b) => a.name.localeCompare(b.name));
}

export function getStateName(countryCode: string, stateCode: string): string {
  if (!countryCode || !stateCode) return "";
  return State.getStateByCodeAndCountry(stateCode, countryCode)?.name ?? stateCode;
}

function nigeriaStateNameForLga(cscStateName: string): string {
  return NIGERIA_STATE_ALIASES[cscStateName] ?? cscStateName;
}

/** Nigerian LGAs; for other countries, cities in the selected state */
export function getLocalGovernmentsForState(countryCode: string, stateCode: string): string[] {
  if (!countryCode || !stateCode) return [];

  if (countryCode === NIGERIA_CODE) {
    const state = State.getStateByCodeAndCountry(stateCode, countryCode);
    if (!state) return [];
    return nigeriaGeo.getLgas(nigeriaStateNameForLga(state.name)).sort((a, b) => a.localeCompare(b));
  }

  return City.getCitiesOfState(countryCode, stateCode)
    .map((city) => city.name)
    .sort((a, b) => a.localeCompare(b));
}
