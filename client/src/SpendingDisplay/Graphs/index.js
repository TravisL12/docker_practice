import * as d3 from "d3";
import React, { useRef, useEffect, useCallback } from "react";
import { splitDate } from "../../utilities";
import { entries, groupBy, sumBy, times } from "lodash";
import { useSelector } from "react-redux";
import {
  categoriesSelector,
  selectedMonthSelector,
} from "../../state/selectors";

const margin = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 40,
};

const width = 800;
const height = 400;

const bodyWidth = width - (margin.left + margin.right);
const bodyHeight = height - (margin.top + margin.bottom);

const CategoryLinesChart = ({ chartData }) => {
  const graphRef = useRef();
  const categories = useSelector(categoriesSelector);
  const selectedMonth = useSelector(selectedMonthSelector);
  const { year, month } = selectedMonth;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const data = chartData.filter((t) => categories[t.category].visible);
  const groupedCats = entries(groupBy(data, "category"));
  const cumulativeCategories = groupedCats.map(([category, t]) => {
    const groupedDays = groupBy(t, (x) => splitDate(x.date).day);
    const dates = times(daysInMonth, (x) => x + 1).reduce((total, day, i) => {
      const prevDay = i > 0 ? total[i - 1]?.amount : 0;
      total.push({
        category,
        day,
        amount: groupedDays[day]
          ? sumBy(groupedDays[day], "amount") + prevDay
          : prevDay,
      });
      return total;
    }, []);
    return [category, dates];
  });

  const xScale = d3.scaleLinear().range([0, bodyWidth]);
  const yScale = d3.scaleLinear().range([bodyHeight, 0]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  const drawLine = useCallback(
    (d) => {
      return d3
        .line()
        .x((d) => xScale(d.day))
        .y((d) => yScale(d.amount / 100))(d[1]);
    },
    [xScale, yScale]
  );

  const styleLine = useCallback(
    (selection) => {
      selection
        .attr("fill", "none")
        .attr("stroke-width", 4)
        .attr("stroke", (d) => categories[d[0]].color)
        .attr("d", drawLine);
    },
    [categories, drawLine]
  );

  const steppedMax = (value) => {
    if (value > 5000) {
      return 10000;
    }

    if (value > 3000) {
      return 8000;
    }

    if (value > 2000) {
      return 3000;
    }

    return 2000; // min y-axis value
  };

  const updateAxes = useCallback(
    (svg) => {
      const max = cumulativeCategories.reduce((total, [_, val]) => {
        const sum = val[val.length - 1].amount / 100;
        return sum > total ? sum : total;
      }, 0);

      xScale.domain([1, daysInMonth]);
      svg
        .select(".x-axis")
        .transition()
        .call(
          d3
            .axisBottom(xScale)
            .tickSize(-400 + margin.top + margin.bottom)
            .ticks(daysInMonth)
        )
        .selectAll(".tick line")
        .attr("stroke", "lightgray");

      yScale.domain([0, steppedMax(max)]);
      svg
        .select(".y-axis")
        .transition()
        .call(
          d3
            .axisLeft(yScale)
            .tickSize(-width + margin.left + margin.right)
            .tickSizeOuter(0)
        )
        .selectAll(".tick line")
        .attr("stroke", "lightgray");
    },
    [cumulativeCategories, daysInMonth, xScale, yScale]
  );

  const draw = useCallback(() => {
    const svg = d3.select(graphRef.current);
    updateAxes(svg);
    svg
      .selectAll(".lines")
      .selectAll(".line")
      .data(cumulativeCategories, (d) => d[0])
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
        cumulativeCategories.map((d) => d[1]).flat(),
        (d) => `${d.category}-${d.day}`
      )
      .join(
        (enter) => {
          enter
            .append("circle")
            .attr("cx", (d) => xScale(d.day))
            .attr("fill", (d) => categories[d.category].color)
            .attr("cy", (d) => yScale(d.amount / 100))
            .attr("r", 5);

          return enter;
        },
        (update) => {
          update
            .transition()
            .duration(500)
            .attr("cx", (d) => xScale(d.day))
            .attr("fill", (d) => categories[d.category].color)
            .attr("cy", (d) => yScale(d.amount / 100));
        }
      );
  }, [categories, cumulativeCategories, styleLine, updateAxes, xScale, yScale]);

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

export default CategoryLinesChart;
