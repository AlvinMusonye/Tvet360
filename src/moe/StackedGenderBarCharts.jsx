import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const data = [
  { year: "2024", males: 120, females: 150 },
  { year: "2025", males: 180, females: 140 }
];


function GenderStackedBarChart() {
  return (
    <ResponsiveContainer width="60%" height={400}>
      <BarChart data={data}>
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />

        {/* stackId must be the same to stack */}
        <Bar dataKey="males" stackId="a" fill="#4F81BD" name={"Males"}/>
        <Bar dataKey="females" stackId="a" fill="#C0504D" name={"Females"}/>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default GenderStackedBarChart;
