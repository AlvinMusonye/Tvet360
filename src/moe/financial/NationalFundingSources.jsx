
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";


const NationalFundingSources = () => {

    const fincancialSources = [
        { name: 'Capitation', value: 45, color: '#0088FE' },
        { name: 'HELB', value: 30, color: '#00C49F' },
        { name: 'NYS', value: 15, color: '#FFBB28' },
        { name: 'CDF', value: 10, color: '#FF8042' },
        { name: 'County', value: 10, color: '#ba42ff' },
    ];

    return (
         <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h3 className="text-lg font-semibold mb-4">National Funding</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h4 className="text-md font-medium mb-4">Average Funding by sources</h4>
                <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={fincancialSources}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                        {fincancialSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip 
                    formatter={(value) => `Ksh ${value} M`}
                    />
                    <Legend />
                    </PieChart>
                </ResponsiveContainer>
                </div>
            </div>
            <div>
                <h4 className="text-md font-medium mb-4">Major Funding Sources</h4>
                <div className="space-y-4">
                {fincancialSources.map((source, index) => (
                    <div key={index} className="border-b pb-2">
                    <div className="flex justify-between items-center">
                        <div>
                        <p className="font-medium">{source.name}</p>
                        {/* <p className="text-sm text-gray-500">{source.name} - {source.value}</p> */}
                        </div>
                        <span className="text-blue-600 font-semibold">{`Ksh ${source.value} Million`}</span>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            </div>
        </div>
    );
};

export default NationalFundingSources;
