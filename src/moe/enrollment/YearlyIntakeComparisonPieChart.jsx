import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

import { Briefcase } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatNumberAsCommaSeparatedNumberString } from '../../Dashboards/utils/NumberFormatUtls';


const YearlyIntakeComparisonPieChart = () => {

    const [selectedYear, setSelectedYear] = useState(2025);
    const [selectedEnrollmentData, setSelectedEnrollmentData] = useState([]);

    const yearOptions = [2025, 2024, 2023, 2022, 2021];

    const getEnrollmentData = () => {
        return {
        "2025": [
            {name: "January", value: 16000, color: '#8884d8'}, 
            {name: "May", value: 19000, color: '#82ca9d'}, 
            {name: "September", value: 29000, color: '#ffc658'}
        ],
        "2024": [
            {name: "January", value: 18000, color: '#8884d8'}, 
            {name: "May", value: 18000, color: '#82ca9d'}, 
            {name: "September", value: 27000, color: '#ffc658'}
        ],
        "2023": [
            {name: "January", value: 10000, color: '#8884d8'}, 
            {name: "May", value: 14000, color: '#82ca9d'}, 
            {name: "September", value: 26000, color: '#ffc658'}
        ],
        "2022": [
            {name: "January", value: 13000, color: '#8884d8'}, 
            {name: "May", value: 17000, color: '#82ca9d'}, 
            {name: "September", value: 22000, color: '#ffc658'}
        ],
        "2021": [
            {name: "January", value: 13000, color: '#8884d8'}, 
            {name: "May", value: 16000, color: '#82ca9d'}, 
            {name: "September", value: 25000, color: '#ffc658'}
        ]
    };
    };
    

useEffect(() => {
    console.log("created pie-chart");
    let totalJan = 20;
    let totalMay = 34;
    let totalSept = 45;
    console.log(`Total Jan: ${totalJan}`);
    console.log(`Total May: ${totalMay}`);
    console.log(`Total Sept: ${totalSept}`);

    (async () => {
        setSelectedEnrollmentData(getEnrollmentData()[selectedYear]);
    })();
}, [selectedYear]);
return (<>
    {/* Yearly intake comparison */}
    <div className="bg-white p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4 flex items-center justify-between gap-2 ">
            <span><Briefcase className="w-5 h-5" /> Yearly Intake Distribution</span>
            <div className="flex items-center">
                <label className="block text-md font-medium text-gray-700 mb-1 m-2">Year</label>
                <select
                    name="studentRuralLearner"
                    value={selectedYear}
                    onChange={event => {
                    let newVal = event.target?.value;
                    console.log(newVal);
                    setSelectedYear(newVal);
                    }}
                    className="w-full p-2 border rounded-sm"
                >
                    {yearOptions.map(year => <option value={year}>{`${year}`}</option> )}
                </select>
            </div>
        </h2>
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                data={selectedEnrollmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => 
                    `${name}: ${(percent * 100).toFixed(0)}%`
                }
                
                >
                {
                    selectedEnrollmentData.map((item, index) => (<Cell key={`cell-${index}`} fill={item.color} />))
                }
                </Pie>
                <Tooltip 
                formatter={(value, name) => [ `${formatNumberAsCommaSeparatedNumberString(value)} enrolled`, name]}
                />
                <Legend />
            </PieChart>
            </ResponsiveContainer>
        </div>
    </div>
</>);
};

export default YearlyIntakeComparisonPieChart;