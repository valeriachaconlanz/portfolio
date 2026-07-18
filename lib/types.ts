export interface City {
  name: string;
  state: string;
  lat: number;
  lon: number;
}

export interface Role {
  id: string;
  org: string;
  title: string;
  city: City;
  start: string;        // "May 2026"
  end: string | null;   // null means current
  bullets: string[];
  stack: string[];
  isAmazon: boolean;
}

export interface Project {
  name: string;
  tagline: string;
  description: string;
  repo: string;
  screenshot: string;
  credit: string;
  stack: { label: string; items: string[] }[];
}

export interface Skill {
  label: string;
  group: 'language' | 'framework' | 'cloud' | 'tool';
}

export interface School {
  name: string;
  credential: string;
  detail: string | null;
  start: string;
  end: string;
}

export interface Award {
  label: string;
  detail: string | null;
}

export interface Profile {
  name: string;
  headline: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  resume: string;
}
