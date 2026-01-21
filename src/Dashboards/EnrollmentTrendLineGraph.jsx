
import { 
  XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';

import { TrendingUp } from 'lucide-react';

const EnrollmentTrendLineGraph = () => {

    const enrollmentData = [
    { year: '2021', totalEnrollment: 54000, employmentAfter: 78 },
    { year: '2022', totalEnrollment: 52000, employmentAfter: 82 },
    { year: '2023', totalEnrollment: 50000, employmentAfter: 85 },
    { year: '2024', totalEnrollment: 63000, employmentAfter: 85 },
    { year: '2025', totalEnrollment: 64000, employmentAfter: 85 },
    ];

    return (<>
    <div className="bg-white p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />Enrollment trend for the past five years
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={enrollmentData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="totalEnrollment" name="Total Enrollment" stroke="#8884d8" activeDot={{ r: 8 }} />
              {/* <Line yAxisId="right" type="monotone" dataKey="employmentAfter" name="Employed After (%)" stroke="#82ca9d" /> */}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>);
};

export default EnrollmentTrendLineGraph;