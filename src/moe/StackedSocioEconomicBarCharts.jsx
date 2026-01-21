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
  { year: "2024", low: 120, middle: 150, high: 116 },
  { year: "2025", low: 180, middle: 140, high: 106 }
];


function SocioEconomicStackedBarChart() {
  return (
    <ResponsiveContainer width="60%" height={400}>
      <BarChart data={data}>
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />

        {/* stackId must be the same to stack */}
        <Bar dataKey="low" stackId="a" fill="#4F81BD" name={"Low Income"}/>
        <Bar dataKey="middle" stackId="a" fill="#C0504D" name={"Middle Income"}/>
        <Bar dataKey="high" stackId="a" fill="#f8bf04" name={"High Income"}/>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default SocioEconomicStackedBarChart;