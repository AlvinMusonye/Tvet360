
import { useState, useEffect } from "react";
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Line, Bar, Cell, Tooltip, Legend, LabelList, ComposedChart } from "recharts";
import { Briefcase } from "lucide-react";
import { formatNumberAsCommaSeparatedNumberString } from "../../Dashboards/utils/NumberFormatUtls";
import { fetchTotalStudentEnrollmentForThePastThreeIntakes } from "./service/EnrollmentService";

const EnrollmentForLastThreeIntakes = () => {

    const [intakeData, setIntakeData] = useState([]);

    const data = [
        {"intake": "May 2025", "totalStudentsEnrolled": 36000},
        {"intake": "September 2025", "totalStudentsEnrolled": 46000},
        {"intake": "January 2026", "totalStudentsEnrolled": 26000}
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    useEffect(() => {
        (async () => {
            let resp = await fetchTotalStudentEnrollmentForThePastThreeIntakes();
            setIntakeData(resp.data.reverse());
        })();
    }, []);

    return (
        <div className="w-full mb-4 p-6 shadow">
            <div className="w-full">
                <h2 className="text-lg font-semibold mb-4 flex items-center justify-between gap-2 ">
                    <span className="flex items-center"><Briefcase className="w-5 h-5 me-4" />Last Three Intakes</span>
                </h2>
            </div>
            <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
                data={intakeData}
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
                dataKey="value"
                tickFormatter={(value) => value.toLocaleString()}
                allowDecimals={false}
                />
                <Tooltip 
                formatter={(value) => [`${formatNumberAsCommaSeparatedNumberString(value)} students`, 'Count']}
                labelFormatter={(label) => `Intake: ${label}`}
                />
                <Legend />
                <Bar 
                dataKey="value" 
                name="Number of Students" 
                fill="#8884d8" 
                radius={[4, 4, 0, 0]}
                >
                    <LabelList dataKey="value" position="top" offset={10} 
                    formatter={(value) => `${formatNumberAsCommaSeparatedNumberString(value)}`}
                    />
                {intakeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Bar>

                <Line
                tooltipType="none"
                type="linear"
                dataKey="value"
                name=""
                stroke="#0044ff"
                strokeWidth={3}
                dot={{ r: 4 }}
                />
            </ComposedChart>
            </ResponsiveContainer>
            </div>
        </div>
    );
};

export default EnrollmentForLastThreeIntakes;