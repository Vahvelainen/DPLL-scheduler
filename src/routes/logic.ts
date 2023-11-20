
import type {Formula, Literal } from './dpll'

export function ATOM(literal: Literal): Formula {
  return [ [literal] ]
}

export function AND( formulas: Formula[] ): Formula {
  let new_formula: Formula = []
  for (const formula of formulas) {
    new_formula = [...new_formula, ...formula]
  }
  return new_formula
}

export function OR( formulas: Formula[] ): Formula {
  let new_formula: Formula = []
  //Create formula with every combination of the clauses in two formulas
  let formulasCopy = [...formulas]
  const formula1 = formulasCopy.pop()
  const formula2 = formulasCopy.pop()
  if ( !formula1 ) {
    return []
  }
  if (!formula2) {
    return formula1
  }
  for (let i = 0; i < formula1.length; i++) {
    for (let j = 0; j < formula2.length; j++) {
      //Combined clause
      new_formula.push([...formula1[i], ...formula2[j]]);
    }
  }
  //Recursive until everything has been combined
  return OR([ new_formula, ...formulasCopy ])
}

export function NOT(formula: Formula): Formula {
  // 1. case when formula is like [ [A, B] [C, D] ]
  // Oucome should be like OR([ [[!A] [!B] ], [[!C] [!D]] ])
  // 2. case if there is only single ATOM such as [ [A] ]
  // It will be returned as [ [!A] ] bc how OR works
  let conjunctions: Formula[]  = []
  for (const clause of formula) {
    let conjunction: Formula = []
    for ( const literal of clause ) {
      const new_literal = literal[0] === '!' ? literal.replace('!','') : `!${literal}`
      conjunction.push( [new_literal] )
    }
    conjunctions.push(conjunction)
  }
  return OR(conjunctions)
}

export function XOR( formulas: Formula[] ): Formula {
  // create pairs of formulas
  let pairs: Formula[][] = [];
  for (let i = 0; i < formulas.length; i++) {
      for (let j = i + 1; j < formulas.length; j++) {
          pairs.push([formulas[i], formulas[j]]);
      }
  }
  // at most one
  const at_most_one = AND( pairs.map( pair => NOT( AND(pair) ) ) )
  // at least one
  const at_least_one = OR( formulas )
  return AND([ at_most_one, at_least_one])
}

export function IMPL( condition: Formula, implication: Formula ): Formula {
  //Anoyingly, OR turns literals the other way around in the formula but I digress
  return OR([ NOT(condition), implication ])
}

export function EQVI(formula1: Formula, formula2: Formula): Formula {
  return AND([IMPL(formula1, formula2), IMPL(formula2, formula1)])
}