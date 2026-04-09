import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { VenueData, Venue } from "./types";
import { enrichVenue, sortVenues } from "./deadlines";

let cachedVenues: Venue[] | null = null;

export function loadVenues(): Venue[] {
  if (cachedVenues) return cachedVenues;

  const filePath = path.join(process.cwd(), "src", "data", "venues.yaml");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const rawVenues = yaml.load(fileContents) as VenueData[];

  cachedVenues = sortVenues(rawVenues.map(enrichVenue));
  return cachedVenues;
}

export function getVenueById(id: string): Venue | undefined {
  const venues = loadVenues();
  return venues.find((v) => v.id === id);
}

export function getVenuesByCategory(category: string): Venue[] {
  const venues = loadVenues();
  return venues.filter((v) => v.category === category);
}

export function getActiveVenues(): Venue[] {
  const venues = loadVenues();
  return venues.filter((v) => v.status !== "passed");
}

export function getAllSlugs(): string[] {
  const venues = loadVenues();
  return venues.map((v) => v.id);
}
