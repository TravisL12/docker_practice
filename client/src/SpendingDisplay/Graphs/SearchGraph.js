import * as d3 from "d3";
import React, { useRef, useEffect, useCallback } from "react";
import { entries, groupBy, sumBy, keys } from "lodash";

const margin = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 55,
};

const width = 800;
const height = 400;

const bodyWidth = width - (margin.left + margin.right);
const bodyHeight = height - (margin.top + margin.bottom);

const SearchGraph = ({ queries, data }) => {
  const graphRef = useRef();
  const groupedQueries = entries(groupBy(data, "query"));
  const cumulativeQueries = groupedQueries.map(([query, t]) => {
    const qData = t[0];
    const groupedDays = groupBy(qData.transactions, (x) =>
      new Date(x.date).getTime()
    );
    const sortedGroupKeys = keys(groupedDays).sort((a, b) => +a - +b);
    const dates = sortedGroupKeys.reduce((total, day, i) => {
      const prevDay = i > 0 ? total[i - 1]?.amount : 0;
      total.push({
        query,
        day,
        amount: groupedDays[day]
          ? sumBy(groupedDays[day], "amount") + prevDay
          : prevDay,
      });
      return total;
    }, []);
    return [query, dates];
  });

  const combinedDates = cumulativeQueries.map(([_, dates]) => dates).flat();
  const timeDomain = d3.extent(combinedDates.map(({ day }) => day));

  const xScale = d3.scaleTime().range([0, bodyWidth]);
  const yScale = d3.scaleLinear().range([bodyHeight, 0]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  const drawLine = useCallback(
    (d) => {
      return d3
        .line()
        .x((d) => {
          return xScale(d.day);
        })
        .y((d) => yScale(d.amount / 100))(d[1]);
    },
    [xScale, yScale]
  );

  const styleLine = useCallback(
    (selection) => {
      selection
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("stroke", (d) => queries[d[0]].color)
        .attr("d", drawLine);
    },
    [queries, drawLine]
  );

  const updateAxes = useCallback(
    (svg) => {
      const max = cumulativeQueries.reduce((total, [_, val]) => {
        const sum = val[val.length - 1] ? val[val.length - 1].amount / 100 : 0;
        return sum > total ? sum : total;
      }, 0);
      xScale.domain(timeDomain); // always show up to todays date

      svg
        .select(".x-axis")
        .transition()
        .call(d3.axisBottom(xScale).tickSize(-400 + margin.top + margin.bottom))
        .selectAll(".tick line")
        .attr("stroke", "lightgray");

      yScale.domain([0, max * 1.2]);
      svg
        .select(".y-axis")
        .transition()
        .call(
          d3
            .axisLeft(yScale)
            .tickSize(-width + margin.left + margin.right)
            .tickSizeOuter(0)
            .tickFormat(d3.format("$,"))
        )
        .selectAll(".tick line")
        .attr("stroke", "lightgray");
    },
    [timeDomain, cumulativeQueries, xScale, yScale]
  );

  const draw = useCallback(() => {
    const svg = d3.select(graphRef.current);
    updateAxes(svg);
    svg
      .selectAll(".lines")
      .selectAll(".line")
      .data(cumulativeQueries, (d) => d[0])
      .join(
        (enter) => {
          const g = enter.append("g").attr("class", "line");
          styleLine(g.append("path"));

          return g;
        },
        (update) => {
          styleLine(update.select("path").transition().duration(500));
        }
      );
    svg
      .selectAll(".lines")
      .selectAll("circle")
      .data(
        cumulativeQueries.map((d) => d[1]).flat(),
        (d) => `${d.query}-${d.day}`
      )
      .join(
        (enter) => {
          enter
            .append("circle")
            .attr("cx", (d) => xScale(d.day))
            .attr("fill", (d) => queries[d.query].color)
            .attr("cy", (d) => yScale(d.amount / 100))
            .attr("r", 3);

          return enter;
        },
        (update) => {
          update
            .transition()
            .duration(500)
            .attr("cx", (d) => xScale(d.day))
            .attr("fill", (d) => queries[d.query].color)
            .attr("cy", (d) => yScale(d.amount / 100));
        }
      );
  }, [queries, cumulativeQueries, styleLine, updateAxes, xScale, yScale]);

  useEffect(() => {
    const main = d3
      .select(graphRef.current)
      .style("background", "rgba(255,255,255,0.5")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    main
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${bodyHeight})`)
      .call(xAxis);

    main.append("g").attr("class", "y-axis").call(yAxis);

    main
      .style("background", "rgba(255,255,255,0.5")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("class", "lines");
  }, []);

  useEffect(() => {
    draw();
  }, [draw]);

  return <svg ref={graphRef}></svg>;
};

export default SearchGraph;
