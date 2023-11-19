
import type {Formula, Clause, Literal, Assignment} from './dpll'
import dpll from './dpll'

import type {Project, Step} from './types'

export default function solveSchedule(projects: Project[], resources: string[], timeSteps: number = 2 ): Literal[] {
  let formula: Formula = [] 
  //Iteratively add timesteps to the process
  //Parse clauses based on the stuff
  //Follow structure of `Resource${resource}_Time${time}_Project${project.name}_Step${step.name}`
  // Maybe come up with better separator than underscore

  // 1. Every step has to happen (lets start with once)
  // Example: If step1 of project needs to happen on right resource on any of the times
  // p \/ q 
  // [ 'Resource1_Time1_ProjectA_Step1', 'Resource1_Time2_ProjectA_Step1', ...for every step ]
  // This for all the steps
  for (const project of projects) {
    for (const step of project.steps) {
      let clause: Clause = []
      for (let time = 0; time < timeSteps; time++) {
        clause.push( `Resource${step.resource}_Time${time}_Project${project.name}_Step${step.name}` )
      }
      formula.push(clause)
    }
  }

  // 2. Resource can only be used for one thing at a time
  // Example: If resource1 is used for project1 at t1, it is not used for any other steps at the same time
  // Logical equivalence: p => -q === -p \/ -q
  // [ '!Resource1_Time1_ProjectA_Step1', '!Resource1_Time1_ProjectB_Step1']
  // Repeated for all the step combinastions for timestep and resource. The clauses need to make surethat there is n-1 false assigments for the timestep
  //For each timestep... 
  for (let time = 0; time < timeSteps; time++) {
    let allSteps: Literal[] = []
    for ( const project of projects ) {
      for (const step of project.steps) {
        allSteps.push( `Resource${step.resource}_Time${time}_Project${project.name}_Step${step.name}` )
      }
    }
    //For each resource...
    for (const resource of resources) {
      const resourceSteps = allSteps.filter( step => step.includes(`Resource${resource}_`) )
      //For each combination... 
      for (let i = 0; i < resourceSteps.length; i++) {
        for (let j = i + 1; j < resourceSteps.length; j++) {
          //Add clause
          formula.push([`!${resourceSteps[i]}`, `!${resourceSteps[j]}`]);
        }
      }
    }
  }

  // 3. Steps have to happen in right order
  // Example: If step1 of project is happening at t2, later steps of the same project arent happening in previous times
  // Logical equivalence: p => -q === -p \/ -q
  // no former step in latter time OR no latter step in former time
  // [ '!Resource1_Time2_ProjectA_Step1', '!Resource1_Time1_ProjectA_Step2' ]
  // that times for all previous steps, for all different steps
  for (const project of projects) {
    for (let latterTime = 0; latterTime < timeSteps; latterTime++) {
      //Assumes steps are in order all the time, could not be though
      for (let formerStepI = 0; formerStepI < project.steps.length; formerStepI++ ) {
        const formerStep = project.steps[formerStepI]
        //All later steps
        for (let latterStepI = formerStepI + 1 ; latterStepI < project.steps.length; latterStepI++ ) {
          const latterStep = project.steps[latterStepI]
          for (let formerTime = 0; formerTime <= latterTime; formerTime++ ) {
            //check up to current time
            const noFormerStepInLatterTime = `!Resource${formerStep.resource}_Time${latterTime}_Project${project.name}_Step${formerStep.name}`
            const noLatterStepInFormertime = `!Resource${latterStep.resource}_Time${formerTime}_Project${project.name}_Step${latterStep.name}`
            //Add clause
            formula.push([noFormerStepInLatterTime,noLatterStepInFormertime]);
          }
        }
      }
    }
  }

  // 5. Long steps need to have the subsequent times for resources
  // If step is happening in t2 it needs to happen in t1 or t2 (and all the combinastions for longer ones)
  // q => ( y /\ z )
  // This is hard man, it gets added last

  //In the end in the results, only clauses stated to be true ought to be displayd and analysed

  let satisfiableFromula = dpll(formula)
  if ( satisfiableFromula ) {
    let filteredResult: Literal[] = []
    for ( const literal in satisfiableFromula) {
      if ( satisfiableFromula[literal] ) {
        filteredResult.push(literal)
      }
    }
    return filteredResult
  }

  return solveSchedule(projects, resources, timeSteps + 1  )
}

function getCombinations(arr: Array<any>): Array< Array<any> > {
  let combinations = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      combinations.push([arr[i], arr[j]]);
    }
  }
  return combinations;
}