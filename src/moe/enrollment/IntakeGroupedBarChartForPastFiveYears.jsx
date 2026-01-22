
import { 
  XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';

import { TrendingUp } from 'lucide-react';
import { formatNumberAsCommaSeparatedNumberString } from '../../Dashboards/utils/NumberFormatUtls';

const IntakeGroupedBarChartForPastFiveYears = () => {

    const enrollmentData = [
        {
            year: 2025, January: 36000, May: 43000, September: 64000
        },
        {
            year: 2024, January: 32000, May: 38000, September: 62000
        },
        {
            year: 2023, January: 24000, May: 37000, September: 53000
        },
        {
            year: 2022, January: 18000, May: 23000, September: 58000
        },
        {
            year: 2021, January: 24000, May: 26000, September: 54000
        }
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    return (<>
    <div className="bg-white mb-4 p-6 w-full rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />Enrollment trend for the past five years
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={enrollmentData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
              <Bar dataKey="January" name="January Intake" fill={COLORS[0]} radius={[4, 4, 0, 0]}/>
              <Bar dataKey="May" name="May Intake" fill={COLORS[1]} radius={[4, 4, 0, 0]}/>
              <Bar dataKey="September" name="September Intake" fill={COLORS[2]} radius={[4, 4, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>);
};

export default IntakeGroupedBarChartForPastFiveYears;