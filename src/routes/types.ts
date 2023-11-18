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
  resource: string; // Resources will beacome a type at some point
  duration: number;
}
