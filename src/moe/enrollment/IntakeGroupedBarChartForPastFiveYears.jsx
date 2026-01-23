import { useState, useEffect } from 'react';
import { 
  XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Bar, LabelList, Line
} from 'recharts';

import { TrendingUp } from 'lucide-react';
import { formatNumberAsCommaSeparatedNumberString } from '../../Dashboards/utils/NumberFormatUtls';
import { fetchTotalStudentEnrollmentForAllIntakesForThePastFiveYears } from './service/EnrollmentService';

const IntakeGroupedBarChartForPastFiveYears = () => {
  const enrollmentData = [
    {
        year: 2021, January: 0, May: 0, September: 0
    },
    {
        year: 2022, January: 0, May: 0, September: 0
    },
    {
        year: 2023, January: 0, May: 0, September: 0
    },
    {
        year: 2024, January: 0, May: 0, September: 0
    },
    {
        year: 2025, January: 0, May: 0, September: 0
    }
  ];

  const [loadedEnrollmentData, setLoadedEnrollmentData] = useState(enrollmentData);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    useEffect(() => {
      (async () => {
        let resp = await fetchTotalStudentEnrollmentForAllIntakesForThePastFiveYears();

        let totals = [];

        if(Array.isArray(resp.data))
        {
          resp.data.map(item => {
            totals.push({
              "year": item.key,
              "January": item.value[0].value,
              "May": item.value[1].value,
              "September": item.value[2].value,
            });
          });
        }
        setLoadedEnrollmentData(totals.reverse());
      })();
    }, []);

    return (<>
    <div className="bg-white mb-4 p-6 w-full rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />Enrollment trend for the past five years
        </h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={loadedEnrollmentData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis  orientation="left"  allowDecimals={false} 
              tickFormatter={(value) => formatNumberAsCommaSeparatedNumberString(value)}
              tick={{fontSize: 12}}
              />
              <Tooltip 
                formatter={(value, key) => [`${formatNumberAsCommaSeparatedNumberString(value)} students`, `${key}`]}
                labelFormatter={(label) => `Year: ${label}`}
              />
              <Legend />
              <Bar dataKey="January" name="January Intake" fill={COLORS[0]} radius={[4, 4, 0, 0]}>
                <LabelList dataKey="January" position="top" offset={10} formatter={(value) => `${formatNumberAsCommaSeparatedNumberString(value)}`} />
              </Bar>
              <Line
              tooltipType="none"
              type="linear"
              name=''
              dataKey="January"
              stroke="#0088FE"
              strokeWidth={3}
              dot={{ r: 4 }}
              />

              <Bar dataKey="May" name="May Intake" fill={COLORS[1]} radius={[4, 4, 0, 0]}>
                <LabelList dataKey="May" position="top" offset={10} formatter={(value) => `${formatNumberAsCommaSeparatedNumberString(value)}`} />
              </Bar>
              <Line
              tooltipType="none"
              type="linear"
              dataKey="May"
              name=''
              stroke="#00C49F"
              strokeWidth={3}
              dot={{ r: 4 }}
              />

              <Bar dataKey="September" name="September Intake" fill={COLORS[2]} radius={[4, 4, 0, 0]}>
                <LabelList dataKey="September" position="top" offset={10} formatter={(value) => `${formatNumberAsCommaSeparatedNumberString(value)}`} />
              </Bar>
              <Line
              tooltipType="none"
              type="linear"
              name=''
              dataKey="September"
              stroke="#FFBB28"
              strokeWidth={3}
              dot={{ r: 4 }}
              />

            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>);
};

export default IntakeGroupedBarChartForPastFiveYears;