/**
 * Types for the stuff
 * Import from here
 */

export type Project = {
  name: string;
  steps: Step[];
}

export type Step = {
  name: string;
  resource: string; // Resources will become a type at some point
  duration: number;
}

export type Timing = {
  step: string; //just the name
  time: number;
  resource: string;
  project: string;
}