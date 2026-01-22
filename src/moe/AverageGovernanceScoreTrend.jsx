
import { 
  XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';

import { TrendingUp } from 'lucide-react';

const AverageGovernanceScoreTrend = () => {

    const averageGovernanceScoreTrendData = [
    { year: '2021', averageGovernanceScore: 4.3 },
    { year: '2022', averageGovernanceScore: 5.8 },
    { year: '2023', averageGovernanceScore: 7.5 },
    { year: '2024', averageGovernanceScore: 6.2 },
    { year: '2025', averageGovernanceScore: 8.4 },
    ];

    return (<>
    <div className="bg-white p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />Average Governance score for the past five years
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={averageGovernanceScoreTrendData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis yAxisId="left" allowDecimals={true}/>
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="averageGovernanceScore" name="Average Governance Score" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>);
};

export default AverageGovernanceScoreTrend;