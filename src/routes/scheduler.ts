
import type {Formula, Clause, Literal, Assignment} from './dpll'
import dpll from './dpll'
import {ATOM, AND, OR, NOT, XOR, IMPL, EQVI} from './logic'

import type {Project, Step} from './types'

export default function solveSchedule(projects: Project[], resources: string[], timeSteps: number = 0): Literal[] {

  if (timeSteps > 10000) {
    throw new Error('Required timestep limit exceeded, check for impossible conditions')
  }

  if (!timeSteps) {
    timeSteps = findMinTime(projects)
  }

  // Parse clauses based on the rules
  // Variables follow structure of `Resource${resource}_Time${time}_Project${project.name}_Step${step.name}`
  // Maybe come up with better separator than underscore in the future

  const formula = AND([
    everyStepHappens(projects, resources, timeSteps),
    noResourceOverlap(projects, resources, timeSteps),
    followProjectOrder(projects, resources, timeSteps),
    stepsLegthsMatch(projects, resources, timeSteps),
  ])

  //In the end in the results, only clauses stated to be true ought to be displayd and analysed
  let satisfiableFromula = dpll(formula)
  if ( satisfiableFromula ) {
    return filterResults(satisfiableFromula)
  } else {
    // Iteratively add timesteps to the process
    return solveSchedule(projects, resources, timeSteps + 1  )
  }
}

function everyStepHappens(projects: Project[], resources: string[], timeSteps: number): Formula {
  let formula: Formula = [] 
  // Every step has to happen
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
  return formula
}

function noResourceOverlap(projects: Project[], resources: string[], timeSteps: number): Formula {
  let formula: Formula = [] 
  // 2. Resource can only be used for one thing at a time
  // Example: If resource1 is used for project1 at t1, it is not used for any other steps at the same time
  // Logical equivalence: p => -q === -p \/ -q
  // [ '!Resource1_Time1_ProjectA_Step1', '!Resource1_Time1_ProjectB_Step1']
  // Repeated for all the step combinastions for timestep and resource. The clauses need to make surethat there is n-1 false assigments for the timestep
  //For each timestep... 
  for (let time = 0; time < timeSteps; time++) {
    let stepLiterals: Literal[] = []
    for ( const project of projects ) {
      for (const step of project.steps) {
        stepLiterals.push( `Resource${step.resource}_Time${time}_Project${project.name}_Step${step.name}` )
      }
    }
    //For each resource...
    for (const resource of resources) {
      const resourceSteps = stepLiterals.filter( step => step.includes(`Resource${resource}_`) )
      //For each combination... 
      for (let i = 0; i < resourceSteps.length; i++) {
        for (let j = i + 1; j < resourceSteps.length; j++) {
          //Add clause
          formula.push([`!${resourceSteps[i]}`, `!${resourceSteps[j]}`]);
        }
      }
    }
  }
  return formula
}

function followProjectOrder(projects: Project[], resources: string[], timeSteps: number): Formula {
  let formula: Formula = [] 
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
  return formula
}

function stepsLegthsMatch(projects: Project[], resources: string[], timeSteps: number): Formula {
  // Long steps need to have the subsequent times for resources
  // If step is happening in t2 it needs to happen in t1 or t2 (and all the combinastions for longer ones)
  // * If step.length == 2 && timeSteps == 4 :
  // *   formula = XOR([ times0to1, times1to2, times2to3 ])

  let stepFormulas: Formula[] = []
  //Loop trough steps
  for ( const project of projects) {
    for( const step of project.steps ) {
      //1. Create atoms for every timeslot into array
      let stepTimeAtoms: Formula[] = []
      for (let time = 0; time < timeSteps; time++) {
        stepTimeAtoms.push( ATOM(`Resource${step.resource}_Time${time}_Project${project.name}_Step${step.name}`) )
      }
      //2. create intervals of right length from atoms
      let intervalFormulas: Formula[] = []
      const duration = step.duration
      for ( let i = 0; i < timeSteps-duration; i++) {
        const intervalFormula = AND(stepTimeAtoms.slice(i, i + duration))
        intervalFormulas.push( intervalFormula )
      }
      //3. throw the interwals to XOR and append to stepFormulas
      stepFormulas.push( XOR(intervalFormulas) )
    }
  }

  return AND(stepFormulas)
}

function findMinTime(projects: Project[]) {
  let minTime = 0
  for (const project of projects) {
    let projectTime: number = 0
    for (const step of project.steps) {
      projectTime += step.duration
    }
    minTime = projectTime > minTime ? projectTime : minTime
  }
  return minTime
}

function filterResults(formula: Assignment): Literal[] {
  let result: Literal[] = []
  for ( const literal in formula) {
    if ( formula[literal] ) {
      result.push(literal)
    }
  }
  return result
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