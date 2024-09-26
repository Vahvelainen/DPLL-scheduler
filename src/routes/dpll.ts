/**
 * SAT solver with The Davis-Putnam-Logemann-Loveland (DPLL) algorithm
 * Takes inputs of types of Formulas suchs as: 
 * [  ['A', 'B'],
 *    ['!A', '!B']  ]
 *  Where ! in front of a clause means not.
 *  Returns a dictionary of valutions for variables that satisfy every clause in the formula
 * 
 *  Pure literal elimination needs to be added to make this fast as fuck
 */

//Start with the types needed for SAT
export type Literal = string;
export type Clause = Literal[];
export type Formula = Clause[];

export interface Assignment {
  [key: string]: boolean;
}

export default function dpll(formula: Formula, assignment: Assignment = {}): Assignment | null {
  //console.log( 'Clauses: ', formula.length )
  
  //Work on a copy instead of original
  assignment = { ...assignment }

  // Pure literal elimination (makes it super slow for some reason, commented out)
  // assignment = pureLiteralElimination(formula, assignment)

  
  // Unit propagation
  for (const clause of formula) {
    if (clause.length === 1) {
      const literal = clause[0];
      const variable = getLiteralVariable(literal)
      const value = getLiteralValue(literal)
      assignment[variable] = value;

      // Simplify the formula based on the unit
      formula = simplifyFormula(formula, variable, value);
      break;
    }
  }
  
  // Base case: if the formula is empty, we have a satisfying assignment
  if (formula.length === 0) {
    return assignment;
  }
  
  // Base case: if the formula contains an empty clause, the assignment is not satisfying
  if (formula.some(clause => clause.length === 0)) {
    return null;
  }

  // Choose a variable to split on that's not yet assigned
  const variable = chooseVariable(formula, assignment);
  if (variable !== '') {
    const literals: Literal[] = [variable, `!${variable}`];
    for (const literal of literals) {
      const value = getLiteralValue(literal)
      const newAssignment = { ...assignment, [variable]: value };
  
      // Recursively apply DPLL to the simplified formula
      const result = dpll(simplifyFormula(formula, variable, value), newAssignment);
      if (result) {
        return result;
      }
    }
  }

  // Backtrack
  return null

}

function simplifyFormula(formula: Formula, variable: string, value: boolean): Formula {
  // Remove clauses that are now true, and remove false literals from remaining clauses
  let new_formula :Formula = []
  for (const clause of formula) {
    let new_clause :Clause = []
    let remove_clause :boolean = false
    for (const literal of clause) {
      if (getLiteralVariable(literal) !== variable) {
        new_clause.push(literal)
      } else if (getLiteralValue(literal) === value) {
        remove_clause = true
        break
      }
    }
    if (!remove_clause) {
      new_formula.push(new_clause)
    }
  }
  return new_formula
}

function pureLiteralElimination(formula: Formula, assignment: Assignment): Assignment {
  // 1. List all literals in formula
  let literals: Literal[] = []
  for (const clause of formula) {
    for (const literal of clause) {
      literals.push(literal)
    }
  }

  // 2. Loop trough literals and find counterpart, remove both from array if found
  while (literals.length) {
    const literal = literals[0]
    // If not found, add pure literal to assigment
    const counterpart = literal.startsWith('!') ? literal.slice(1) : '!' + literal
    if ( !literals.includes(counterpart) ) {
      assignment[getLiteralVariable(literal)] = getLiteralValue(literal)
    }
    //filter array
    literals = literals.filter( lit => lit !== literal && lit !== counterpart )
  }
  
  return assignment;
}

function chooseVariable(formula: Formula, assignment: Assignment): string {

  //Find remaining variables of the formula
  let variables :string[] = []
  for (const clause of formula) {
    for (const literal of clause) {
      const variable = getLiteralVariable(literal)
      if ( !variables.includes(variable)) {
        variables.push(variable)
      }
    }
  }

  // Choose new variable for case analysis
  let branching_variable :string = ''
  for (const variable of variables) {
    if ( !Object.keys(assignment).includes(variable) ) {
      branching_variable = variable
      break
    }
  }

  //Returns empty string if no unassigned variables are left
  return branching_variable
}

function getLiteralVariable( literal: Literal ): string {
  return literal[0] === '!' ? literal.substring(1) : literal;
}
function getLiteralValue( literal: Literal ): boolean {
  return literal[0] !== '!';
}
