import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { Runtime, Inspector } from "@observablehq/runtime";
import notebook from "796d5ed4c79a827a";

// Example constants for the abacus visualization
const base = 10;
const rails = 7;
const subbase = 5;
const nGroupBeads = 5;
const nOneBeads = 5;
const w = 20;
const h = 20;
const bead = "M0,0a10,10,0,1,0,10,0a10,10,0,1,0,-10,0";

// Utility function to get digits of a number in a given base
function getDigits(n, base) {
  const digits = [];
  while (n > 0) {
    digits.push(n % base);
    n = Math.floor(n / base);
  }
  return digits;
}

// The renderAbacus function
function renderAbacus(n) {
  let digits = getDigits(n, base);
  if (digits.length < rails) digits = digits.concat(Array(rails - digits.length).fill(0));
  const columns = digits.reverse().map(digit => {
    const nGroups = Math.floor(digit / subbase);
    const nOnes = digit % subbase;
    const groupBeads = d3.range(nGroupBeads).map(d => (d < nGroups ? d : d - 1));
    const oneBeads = d3.range(nOneBeads).map(d => (d < nOnes ? d : d + 1));
    return { groupBeads, oneBeads };
  });

  const svg = d3.create("svg")
    .attr("class", "abacus")
    .attr("width", digits.length * w + 4)
    .attr("height", h * 7 + 1 + 5);

  svg.append("path")
    .attr("class", "beam2")
    .attr("d", `M0 ${2 * h + 2}L${digits.length * w + 4} ${2 * h + 2}`);

  svg.append("path")
    .attr("class", "beam2")
    .attr("d", `M0 ${2 * h + 4}L${digits.length * w + 4} ${2 * h + 4}`);

  columns.forEach((bar, i) => {
    const g = svg.append("g")
      .attr("transform", `translate(${w * i + 2}, ${3 * h / 2 + 1 + 2})`);

    g.append("path")
      .attr("class", "rod")
      .attr("d", `M${w / 2} ${-2 * h}L${w / 2} ${h * 6}`);

    const groupG = g.append("g")
      .attr("transform", `translate(0, ${-h / 2 - 1})`);

    bar.groupBeads.forEach(d => {
      groupG.append("path")
        .attr("class", "bead")
        .attr("d", bead)
        .attr("transform", `translate(0, ${d * h})`);
    });

    const oneG = g.append("g")
      .attr("transform", `translate(0, ${h / 2 + 1})`);

    bar.oneBeads.forEach(d => {
      oneG.append("path")
        .attr("class", "bead")
        .attr("d", bead)
        .attr("transform", `translate(0, ${d * h})`);
    });
  });

  svg.append("path")
    .attr("class", "beam")
    .attr("d", `M0 ${2 * h + 3}L${digits.length * w + 4} ${2 * h + 3}`);

  return svg.node();
}

function Notebook() {
  const renderAbacusRef = useRef();

  useEffect(() => {
    const runtime = new Runtime();
    runtime.module(notebook, name => {
      if (name === "renderAbacus") return new Inspector(renderAbacusRef.current);
    });

    // Call renderAbacus and append the result to the ref
    const svgElement = renderAbacus(12345); // Replace 12345 with the number you want to visualize
    if (renderAbacusRef.current) {
      renderAbacusRef.current.innerHTML = "";
      renderAbacusRef.current.appendChild(svgElement);
    }

    return () => runtime.dispose();
  }, []);

  return (
    <>
      <div ref={renderAbacusRef}></div>
      <p>Credit: <a href="https://observablehq.com/d/796d5ed4c79a827a">Abacus DRAFT by Pranav Raj</a></p>
    </>
  );
}

export default Notebook;
