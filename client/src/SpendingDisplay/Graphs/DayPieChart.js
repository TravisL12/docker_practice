import * as d3 from "d3";
import { groupBy, sumBy } from "lodash";
import React, { useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  categoriesSelector,
  selectedMonthSelector,
} from "../../state/selectors";
import { currencyRounded } from "../../utilities";

const mainWidth = 116;
const mainHeight = 106;
const RADIUS = mainWidth / 2 - 10;
const innerRadius = RADIUS / 2 + 5;

const textRotate = (d, arc) => {
  const angle =
    d.endAngle < Math.PI
      ? ((d.startAngle / 2 + d.endAngle / 2) * 180) / Math.PI
      : ((d.startAngle / 2 + d.endAngle / 2 + Math.PI) * 180) / Math.PI;
  return `translate(${arc.centroid(d)})  rotate(${angle})`;
};

const updateText = (d) => {
  const { startAngle, endAngle, value } = d;
  return endAngle - startAngle > 0.7 ? currencyRounded(value) : null;
};

const DayPieChart = ({ data }) => {
  const pieRef = useRef();
  const categories = useSelector(categoriesSelector);
  const selectedMonth = useSelector(selectedMonthSelector);
  const pie = d3
    .pie()
    .value((d) => sumBy(d.value, "amount"))
    .sort((a, b) => d3.ascending(a.key, b.key));
  const groupedData = groupBy(data, (x) => x.category);

  const draw = useCallback(() => {
    const svg = d3.select(pieRef.current);

    const pieData = pie(
      Object.entries(groupedData).map(([key, value]) => ({ key, value }))
    );
    const arcGenerator = d3.arc().innerRadius(innerRadius).outerRadius(RADIUS);
    svg
      .selectAll(".pie")
      .selectAll(".piece")
      .data(pieData, (d) => {
        const { year, month } = selectedMonth;
        return `${year}-${month}-${d.data.key}`;
      })
      .join(
        (enter) => {
          const g = enter.append("g").attr("class", "piece");

          g.append("path")
            .attr("fill", (d) => categories[d.data.key]?.color)
            .style("opacity", 0.7)
            .attr("d", (d) => arcGenerator(d));

          g.append("text")
            .text(updateText)
            .attr("transform", (d) => textRotate(d, arcGenerator))
            .style("text-anchor", "middle")
            .style("font-size", 9);

          return g;
        },
        (update) => {
          update.select("path").attr("d", (d) => arcGenerator(d));

          update
            .select("text")
            .text(updateText)
            .attr("transform", (d) => textRotate(d, arcGenerator))
            .style("text-anchor", "middle")
            .style("font-size", 9);
        }
      );
  }, [categories, groupedData, pie, selectedMonth]);

  useEffect(() => {
    d3.select(pieRef.current)
      .attr("width", mainWidth)
      .attr("height", mainHeight)
      .append("g")
      .attr("class", "pie")
      .attr("transform", `translate(${mainWidth / 2}, ${mainHeight / 2})`);
  }, []);

  useEffect(() => {
    draw();
  }, [data, draw]);

  return <svg ref={pieRef} />;
};

export default DayPieChart;
