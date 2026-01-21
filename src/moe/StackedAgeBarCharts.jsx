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
  { year: "2024", 18: 1520, 19: 1550, 20: 1416, 21: 1232},
  { year: "2025", 18: 1280, 19: 1240, 20: 1046, 21: 12134}
];


function AgeStackedBarCharts() {
  return (
    <ResponsiveContainer width="60%" height={400}>
      <BarChart data={data}>
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />

        {/* stackId must be the same to stack */}
        <Bar dataKey="18" stackId="a" fill="#4F81BD" name={"18 years"}/>
        <Bar dataKey="19" stackId="a" fill="#C0504D" name={"19 years"}/>
        <Bar dataKey="20" stackId="a" fill="#f8bf04" name={"20 years"}/>
        <Bar dataKey="21" stackId="a" fill="#66f804" name={"21 years"}/>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default AgeStackedBarCharts;