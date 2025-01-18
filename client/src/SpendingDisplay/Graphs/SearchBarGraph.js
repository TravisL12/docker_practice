import * as d3 from "d3";
import React, { useRef, useEffect, useCallback } from "react";

const margin = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 55,
};

const width = 600;
const height = 400;

const bodyWidth = width - (margin.left + margin.right);
const bodyHeight = height - (margin.top + margin.bottom);

const SearchBarGraph = ({ data }) => {
  const graphRef = useRef();
  const xScale = d3.scaleBand().range([0, bodyWidth]).padding(0.3);
  const yScale = d3.scaleLinear().range([bodyHeight, 0]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  const textTransform = useCallback(
    (d) => {
      return d > 10
        ? `translate(${xScale.bandwidth() / 2}, 15)`
        : `translate(${xScale.bandwidth() / 2}, -2)`;
    },
    [xScale]
  );

  const draw = useCallback(() => {
    const svg = d3.select(graphRef.current);

    xScale.domain(Object.keys(data));
    svg
      .select(".x-axis")
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .text((d) => {
        return data[d].query;
      });

    yScale.domain([0, d3.max(data, (d) => d.total) * 1.1]);
    svg
      .select(".y-axis")
      .transition()
      .call(d3.axisLeft(yScale).tickFormat(d3.format("$,")));

    svg
      .selectAll(".bars")
      .selectAll(".bar")
      .data(data)
      .join(
        (enter) => {
          const g = enter.append("g").attr("class", "bar");

          g.append("rect")
            .attr("x", (_, i) => xScale(i))
            .attr("y", (d) => yScale(d.total))
            .attr("height", (d) => bodyHeight - yScale(d.total))
            .attr("width", xScale.bandwidth())
            .attr("stroke-width", 1)
            .attr("stroke", "black")
            .attr("fill", (d) => {
              return d.color;
            });

          g.append("text")
            .text((d) => d.totalLabel)
            .join("text")
            .attr("x", (_, i) => xScale(i))
            .attr("y", (d) => yScale(d.total))
            .attr("transform", textTransform)
            .attr("text-anchor", "middle");

          return g;
        },
        (update) => {
          update
            .select("rect")
            .transition()
            .attr("x", (_, i) => xScale(i))
            .attr("y", (d) => yScale(d.total))
            .attr("height", (d) => bodyHeight - yScale(d.total))
            .attr("width", xScale.bandwidth())
            .attr("fill", (d) => {
              return d.color;
            });

          update
            .select("text")
            .transition()
            .text((d) => d.totalLabel)
            .attr("x", (_, i) => xScale(i))
            .attr("y", (d) => yScale(d.total))
            .attr("transform", textTransform);
        },
        (exit) => {
          exit.select("text").remove();
          exit.select("rect").transition().style("opacity", 0);
          exit.transition().remove();
        }
      );
  }, [data, xScale, yScale, textTransform]);

  useEffect(() => {
    const main = d3
      .select(graphRef.current)
      .style("background", "rgba(255,255,255,0.5")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("class", "main")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    main.append("g").attr("class", "bars");

    // create x-axis
    main
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${bodyHeight})`)
      .call(xAxis);

    // create y-axis
    main.append("g").attr("class", "y-axis").call(yAxis);
  }, []);

  useEffect(() => {
    draw();
  }, [draw]);

  return <svg ref={graphRef}></svg>;
};

export default SearchBarGraph;
