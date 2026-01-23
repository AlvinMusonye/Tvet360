
import { 
  XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';

import { TrendingUp } from 'lucide-react';

const AverageCorruptionRiskIndexTrend = () => {

    const averageCorruptionRiskIndexData = [
    { year: '2021', averageCorruptionRiskIndex: 5.4 },
    { year: '2022', averageCorruptionRiskIndex: 4.2 },
    { year: '2023', averageCorruptionRiskIndex: 4.5 },
    { year: '2024', averageCorruptionRiskIndex: 3.8 },
    { year: '2025', averageCorruptionRiskIndex: 2.3 },
    ];

    return (<>
    <div className="bg-white p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />Average Corruption risk index for the past five years
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={averageCorruptionRiskIndexData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis yAxisId="left" allowDecimals={true}/>
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" type="monotone" dataKey="averageCorruptionRiskIndex" name="Average Corruption Risk Index" fill="#8884d8" activeDot={{ r: 8 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>);
};

export default AverageCorruptionRiskIndexTrend;