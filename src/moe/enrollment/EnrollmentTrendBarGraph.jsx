import { useState, useEffect } from 'react';
import { 
  XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, Cell, Line, LabelList,
  ComposedChart
} from 'recharts';

import { TrendingUp } from 'lucide-react';
import { formatNumberAsCommaSeparatedNumberString } from '../../Dashboards/utils/NumberFormatUtls';
import { fetchTotalStudentEnrollmentForThePastFiveYears } from './service/EnrollmentService';

const EnrollmentTrendBarGraph = () => {
  const [enrollmentTrend, setEnrollmentTrend] = useState([]);

    const enrollmentData = [
    { year: '2021', totalEnrollment: 54000, employmentAfter: 78 },
    { year: '2022', totalEnrollment: 52000, employmentAfter: 82 },
    { year: '2023', totalEnrollment: 50000, employmentAfter: 85 },
    { year: '2024', totalEnrollment: 63000, employmentAfter: 85 },
    { year: '2025', totalEnrollment: 64000, employmentAfter: 85 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    useEffect(() => {
      (async () => {
        let resp = await fetchTotalStudentEnrollmentForThePastFiveYears();
        setEnrollmentTrend(resp.data.reverse());
      })();
    }, []);

    return (<>
    <div className="bg-white p-6 mb-4 w-full rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />Enrollment trend for the past five years
        </h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={enrollmentTrend}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="key" />
              <YAxis yAxisId="left" orientation="left" dataKey="value" allowDecimals={false} 
              tickFormatter={(value) => value.toLocaleString()}
              tick={{fontSize: 12}}
              />
              <Tooltip 
                formatter={(value) => [`${formatNumberAsCommaSeparatedNumberString(value)} students`, 'Count']}
                labelFormatter={(label) => `Year: ${label}`}
              />
              <Legend />
              <Bar dataKey="value" name="Total Enrollment" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="value" position="top" offset={10} 
                formatter={(value) => `${formatNumberAsCommaSeparatedNumberString(value)}`}/>
                {enrollmentTrend.map((type, index) => (
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
              {/* <Line yAxisId="left" type="monotone" dataKey="totalEnrollment" name="Total Enrollment" stroke="#8884d8" activeDot={{ r: 8 }} /> */}
              {/* <Line yAxisId="right" type="monotone" dataKey="employmentAfter" name="Employed After (%)" stroke="#82ca9d" /> */}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>);
};

export default EnrollmentTrendBarGraph;