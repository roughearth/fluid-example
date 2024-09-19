const h = Object.fromEntries([
  "calculate",
  "calculator",
  "result",
  "property",
  "targetA",
  "targetB",
  "pxA",
  "pxB",
  "fixedUnit",
  "variableUnit",
  "format"
].map(e => [e, document.getElementById(e)]));

// Perform the calculations for the "form"
function calculateExpression(shouldCopy) {
  // read in the values
  const [tA, tB, pA, pB] = ["targetA", "targetB", "pxA", "pxB"].map(n => Number(h[n].value));
  const [fx, vru, fmt] = ["fixedUnit", "variableUnit", "format"].map(n => h[n].value);

  // need to divide arguments by 16 if using rem (assuming 1rem is 16px)
  const remFactor = fx === "rem" ? 16 : 1;

  // need to divide arguments by 100 because container/viewport units are 1% of the respective dimension
  const argA = pA / 100 / remFactor;
  const argB = pB / 100 / remFactor;

  // solve the simultaneous equations
  const varResult = (tA - tB) / (argA - argB);
  const fixedResult = tA - argA * varResult;

  // Limit to 3dp
  const [v, f] = [varResult, fixedResult].map(v => Number(v.toFixed(3)));

  let calc;

  // format the result in to a calc() friendly expression
  // (spaces around the operator, and avoid the first operand being negative if possible)
  if (varResult < 0) {
    calc = `${f}${fx} - ${Math.abs(v)}${vru}`;
  }
  else if (fixedResult < 0 && varResult >= 0) {
    calc = `${v}${vru} - ${Math.abs(f)}${fx}`;
  }
  else {
    calc = `${f}${fx} + ${v}${vru}`;
  }

  // calculate the explanatory comment
  const item = vru === "cqi" ? "container" : "viewport";
  const plainText = `/* Evaluates to ${tA}${fx} for a ${pA}px wide ${item}, and ${tB}${fx} for ${pB}px */`;

  // calculate the CSS output
  let cssResult = "";

  if (property.value) {
    cssResult = `${property.value}`;

    if (cssResult.includes(":")) {
      cssResult += " ";
    }
    else {
      cssResult += ": ";
    }
  }

  if (fmt === "calc") {
    cssResult += `calc(${calc});`;

  }
  else {
    const min = `${Math.min(tA, tB)}${fx}`;
    const max = `${Math.max(tA, tB)}${fx}`;

    cssResult += `clamp(${min}, ${calc}, ${max});`;
  }

  // Output the result
  const output = `${plainText}\n${cssResult}`;

  // Copy to clipboard if requested
  if (shouldCopy) {
    navigator.clipboard.writeText(output);
  }

  h.result.innerText = output;

  // update the fixed unit display
  document.querySelectorAll("[data-unit]").forEach(e => e.innerText = fx);
}

calculate.addEventListener("click", () => calculateExpression(true));

calculator.addEventListener("input", e => {
  calculateExpression(false);
});

calculateExpression(false);
