# Typescript DPLL Scheduler

Experimental project to find out if clientside javascript is fast enough to run scheduling program based on a logic solver.

The scheduling problem is repserented as "projects" that have steps that need specific resources and take certain time.
Comparable uses cases are many, this program was written with fleet management in mind.

The scheduling is represented as binary logic formula and Davis-Putnam-Logemann-Loveland (DPLL) is used to find a solution with minimun amount of time slots used. The scheduling is converted into collection of clauses representing conditions such as "step1 must happen before step2". The algorithm is
finding a combination of timings to fill each logical condition in least amount of timeslots used. This approach is know as SAT solving.

The binary logic ans DPLL algorithm are written in typescript to see if performance of modern browsers is suitable to preform this calculation fast enough for convienient use. The computer I used was an M1 mac with google chrome.
I found out that even with minimal complexity of two projects, each containing four steps, some combinations would cause calculation time of several seconds.
Real use cases with complextities possibly two orders of manitude higher would likely not be viable. 

Possible future aproach might be use of webassembly or serverside calculations.

## About the implemetation

The repo is based on a svelteKit app.

All the practical code can be found from `src/routes/` 

- `+page.svelte` contains the main program
- Rest of the `.svelte` files contain visual and interactable elements and their logic
- `types.ts` contains object types for the main application, such as the projects that are timed

- `dpll.ts` contains the Davis-Putnam-Logemann-Loveland algorithm and relevant types for SAT solving
- `logic.ts` contains functions fo the logical elements needed to build conditions suchs as AND, OR, NOT
- `scheduler.ts` contains code for the conversion of projects to logical statements and solving the timing problem in least amount of timing slots

## Using the demo

The demo is not made user frendly or appealing due to its poor initial performance.

However, the demo is usable with two projects (A and B) and four resources (A, B, C, D). Projects each consist of four steps. The steps can be altered by switching which resource they occupy (A, B, C, or D), how many time steps they take and also by changing their names. The steps always proceed in the order from top to bottom. Steps from one project cannot happen in paraller, but steps from two projects might if they don't occupy the same resource.

The visual UI shows resources as rows of seven time steps (alterable in `+page.svelte`). "Re-schedule" -button runs the scheduling function. The two tables in the bottom represent the projects and steps. The steps can be altered by clicking the attributes.

![alt text](https://github.com/Vahvelainen/DPLL-scheduler/blob/main/Screenshot.png?raw=true)

## Running the project

To run you need to install dependencies with `npm install` (or `pnpm install` or `yarn`), and start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

