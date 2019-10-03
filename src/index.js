function eval() {
  // Do not use eval!!!
  return;
}

function expressionCalculator(expr) {
  // first do what in the brackets
  // calculate expression

  // delete spaces in expr
  let exprWithoutSpaces = "";
  for (let i = 0; i < expr.length; i++) {
    if (expr[i] !== " ") {
      exprWithoutSpaces += expr[i];
    }
  }

  // change all - to 'minus'
  let regExpForChangeMinuses = /-/g;
  exprWithoutSpaces = exprWithoutSpaces.replace(
    regExpForChangeMinuses,
    "minus"
  );

  // RegExp which search just number with braces
  let regExpForJustNumberWithBraces = /\(-{0,1}\d+\.{0,1}\d*\)/;

  // Function which change number in right braces ---> to just number
  let openNumberWithRightBraces = expression => {
    let numberWithRightBraces = expression.match(
      regExpForJustNumberWithBraces
    )[0];
    let numberInRightBraces = numberWithRightBraces.match(
      /-{0,1}\d+\.{0,1}\d*/
    );
    expression = expression.replace(
      regExpForJustNumberWithBraces,
      numberInRightBraces
    );
    return expression;
  };

  // RegExp which search two numbers with * or /
  let regExpForMultiplyAndDivision = /-{0,1}\d+\.{0,1}\d*[\/*]-{0,1}\d+\.{0,1}\d*/;

  // Function which Multiply and Division two numbers
  let multiplyAndDivision = expression => {
    let expressionForMultiplyAndDivision = expression.match(
      regExpForMultiplyAndDivision
    )[0];
    let firstNumber = expressionForMultiplyAndDivision.match(
      /-{0,1}\d+\.{0,1}\d*/
    )[0];
    let secondNumber = expressionForMultiplyAndDivision.match(
      /-{0,1}\d+\.{0,1}\d*$/
    )[0];
    let sign = expressionForMultiplyAndDivision.match(/[/*]/)[0];
    if (sign === "/" && (secondNumber === "0" || firstNumber === "0")) {
      throw new Error("TypeError: Division by zero.");
    }
    let numberWhichChangeExpression =
      sign === "*" ? firstNumber * secondNumber : firstNumber / secondNumber;

    // replace our init expr
    expression = expression.replace(
      regExpForMultiplyAndDivision,
      numberWhichChangeExpression
    );
    return expression;
  };

  // RegExp which search two numbers with + or -
  let regExpForPlusAndMinus = /-{0,1}\d+\.{0,1}\d*e{0,1}-{0,1}\d*\+-{0,1}\d+\.{0,1}\d*e{0,1}-{0,1}\d*|-{0,1}\d+\.{0,1}\d*e{0,1}-{0,1}\d*minus-{0,1}\d+\.{0,1}\d*e{0,1}-{0,1}\d*/;

  // Function which addition and subtraction two numbers
  let plusAndMinus = expression => {
    let expressionForPlusAndMinus = expression.match(regExpForPlusAndMinus)[0];
    let firstNumber = expressionForPlusAndMinus.match(
      /-{0,1}\d+\.{0,1}\d*e{0,1}-{0,1}\d*/
    )[0];
    let secondNumber = expressionForPlusAndMinus.match(
      /-{0,1}\d+\.{0,1}\d*$/
    )[0];
    let sign = expressionForPlusAndMinus.match(/[+]|minus/)[0];
    let numberWhichChangeExpression =
      sign === "minus"
        ? +firstNumber - +secondNumber
        : +firstNumber + +secondNumber;
    numberWhichChangeExpression += "";
    // replace our init expr
    expression = expression.replace(
      regExpForPlusAndMinus,
      numberWhichChangeExpression
    );
    return expression;
  };

  let calculateInExpressionWithoutBraces = expression => {
    while (expression.match(regExpForMultiplyAndDivision) != null) {
      expression = multiplyAndDivision(expression);
    }
    while (expression.match(regExpForPlusAndMinus) != null) {
      expression = plusAndMinus(expression);
    }
    return expression;
  };

  // RegExp which search nested braces
  let regExpForSearchNestedBraces = /\({1}[^()]+\){1}/;

  // Function which search and replace nested braces
  let searchAndReplaceExpressionInBracesToCorrectNumber = () => {
    while (exprWithoutSpaces.match(regExpForSearchNestedBraces) !== null) {
      while (exprWithoutSpaces.match(regExpForJustNumberWithBraces) != null) {
        exprWithoutSpaces = openNumberWithRightBraces(exprWithoutSpaces);
      }

      if (exprWithoutSpaces.match(regExpForSearchNestedBraces) !== null) {
        let expressionInBraces = exprWithoutSpaces.match(
          regExpForSearchNestedBraces
        )[0];
        let resultOfExpressionInBraces = calculateInExpressionWithoutBraces(
          expressionInBraces
        );
        exprWithoutSpaces = exprWithoutSpaces.replace(
          regExpForSearchNestedBraces,
          resultOfExpressionInBraces
        );
      } else {
        return;
      }
    }
  };

  let lastCalculate = () => {
    if (exprWithoutSpaces.match(regExpForSearchNestedBraces) !== null) {
      searchAndReplaceExpressionInBracesToCorrectNumber();
    }
    exprWithoutSpaces = calculateInExpressionWithoutBraces(exprWithoutSpaces);

    if (exprWithoutSpaces.match(/^-{0,1}\d+\.{0,1}\d*$/) !== null) {
      return +exprWithoutSpaces;
    } else {
      return exprWithoutSpaces;
    }
  };

  let result = lastCalculate();
  if (String(result).match(/^-{0,1}\d+\.{0,1}\d*$/) === null) {
    throw new Error("ExpressionError: Brackets must be paired");
  }
  return result;
}

module.exports = {
  expressionCalculator
};
