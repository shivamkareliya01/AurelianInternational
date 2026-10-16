import worldData from "./worldMapData.json";

export interface MapCountry {
  id: string;
  name: string;
  isServed: boolean;
  isIndia: boolean;
  d: string;
}

export const worldMapConfig = {
  width: worldData.width,
  height: worldData.height,
  graticule: worldData.graticule,
  countries: worldData.countries as MapCountry[],
};
