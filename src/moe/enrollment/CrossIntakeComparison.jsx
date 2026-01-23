import { 
    XAxis, YAxis,
  ComposedChart, Bar, Cell, Tooltip, CartesianGrid, ResponsiveContainer, LabelList, Line,
  Legend
} from 'recharts';

import { Briefcase } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatNumberAsCommaSeparatedNumberString } from '../../Dashboards/utils/NumberFormatUtls';
import { fetchTotalStudentEnrollmentForIntakeForThePastFiveYears } from './service/EnrollmentService';


const CrossIntakeComparison = () => {

    const [selectedIntake, setSelectedIntake] = useState("January");
    const [selectedIntakeData, setSelectedIntakeData] = useState([]);

    const intakeOptions = ["January", "May", "September"];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    const getIntakeData = () => {
        return {
        "January": [
            {year: "2021", value: 18000, color: '#8884d8'}, 
            {year: "2022", value: 17000, color: '#82ca9d'}, 
            {year: "2023", value: 14000, color: '#ffc658'},
            {year: "2024", value: 19000, color: '#ffc658'},
            {year: "2025", value: 16000, color: '#ffc658'}
        ],
        "May": [
            {year: "2021", value: 24000, color: '#8884d8'}, 
            {year: "2022", value: 25000, color: '#82ca9d'}, 
            {year: "2023", value: 22000, color: '#ffc658'},
            {year: "2024", value: 28000, color: '#ffc658'},
            {year: "2025", value: 26000, color: '#ffc658'}
        ],
        "September": [
            {year: "2021", value: 43000, color: '#8884d8'}, 
            {year: "2022", value: 34000, color: '#82ca9d'}, 
            {year: "2023", value: 46000, color: '#ffc658'},
            {year: "2024", value: 48000, color: '#ffc658'},
            {year: "2025", value: 56000, color: '#ffc658'}
        ]
    };
    };
    

useEffect(() => {
    (async () => {
        let resp = await fetchTotalStudentEnrollmentForIntakeForThePastFiveYears(selectedIntake.slice(0,3));
        setSelectedIntakeData(resp.data.reverse());
    })();
}, [selectedIntake]);
return (<>
    {/* Yearly intake comparison */}
    <div className="bg-white p-6 mb-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 flex items-center justify-between gap-2 ">
            <span className="flex items-center"><Briefcase className="w-5 h-5 me-4" />Cross-intake Comparison</span>
            <div className="flex items-center">
                <label className="block text-md font-medium text-gray-700 mb-1 m-2">Intake</label>
                <select
                    name="studentRuralLearner"
                    value={selectedIntake}
                    onChange={event => {
                    let newVal = event.target?.value;
                    console.log(newVal);
                    setSelectedIntake(newVal);
                    }}
                    className="w-full p-2 border rounded-sm"
                >
                    {intakeOptions.map(intake => <option value={intake}>{`${intake}`}</option> )}
                </select>
            </div>
        </h2>
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                    data={selectedIntakeData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                    dataKey="key" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : ''}
                    />
                    <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${formatNumberAsCommaSeparatedNumberString(value)}`}
                    allowDecimals={false}
                    />
                    <Tooltip 
                    formatter={(value) => [`${formatNumberAsCommaSeparatedNumberString(value)} students`, 'Count']}
                    labelFormatter={(label) => `Year: ${label}`}
                    />
                    <Legend />
                    <Bar 
                    dataKey="value" 
                    name="Number of Students" 
                    fill="#8884d8" 
                    radius={[4, 4, 0, 0]}
                    >
                        <LabelList dataKey="value" position="top" offset={10} formatter={(value) => `${formatNumberAsCommaSeparatedNumberString(value)}`} />
                    {selectedIntakeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Bar>

                    <Line
                    tooltipType="none"
                    type="linear"
                    dataKey="value"
                    name="Enrollment Trend"
                    stroke="#0044ff"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    </div>
</>);
};

export default CrossIntakeComparison;