import { Wallet, Banknote, CreditCard, TrendingUp } from "lucide-react";
import { ResponsiveContainer, ComposedChart, BarChart, LineChart, Bar, Line, Cell, LabelList, Tooltip, YAxis, XAxis, Legend, CartesianGrid } from "recharts";
import { formatNumberAsCommaSeparatedNumberString } from "../../Dashboards/utils/NumberFormatUtls";

const FinancialProjections = () => {

    const accrualRevenue = 23;
    const actualRevenue = 14;
    const costPerStudent = 200000;

    const revenueExpenditure = [
        {key: "Revenue", value: 23},
        {key: "Expenditure", value: 20},
    ];

    const COLORS = ['#0088FE', '#ff3232', '#FFBB28', '#FF8042', '#8884D8'];

    const financialDataProjection = [
    {
        year: 2027, HELB: 1300000, CAPITATION: 1500000, CDF: 900000, COUNTY: 1400000, 
    },
    {
        year: 2028, HELB: 1600000, CAPITATION: 1000000, CDF: 1500000, COUNTY: 1200000, 
    },
    {
        year: 2029, HELB: 1900000, CAPITATION: 1500000, CDF: 1600000, COUNTY: 1300000, 
    }
  ];

  const revenueProjection = [
    {
        year: 2027, totalRevenue: 4300000, totalExpenditure: 4000000, 
    },
    {
        year: 2028, totalRevenue: 4800000, totalExpenditure: 4300000, 
    },
    {
        year: 2029, totalRevenue: 5600000, totalExpenditure: 4700000, 
    }
  ];

    return (
        <div className="grid grid-cols-1 gap-4">
            <div className="w-full  bg-white rounded shadow p-4">
                <div className="w-full ">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />Funding projection for the next three years
                    </h2>
                </div>
                <div className="h-80 w-full P-3 ">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                        data={financialDataProjection}
                        margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis  orientation="left"  allowDecimals={false} 
                        tickFormatter={(value) => formatNumberAsCommaSeparatedNumberString(value)}
                        tick={{fontSize: 12}}
                        />
                        <Tooltip 
                            formatter={(value, key) => [`KES ${formatNumberAsCommaSeparatedNumberString(value)}`, `${key}`]}
                            labelFormatter={(label) => `Year: ${label}`}
                        />
                        <Legend />
                        
                        <Line
                        type="linear"
                        name='HELB'
                        dataKey="HELB"
                        stroke="#0088FE"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        >
                            <LabelList dataKey="HELB" position="top" offset={10} formatter={(value) => `${formatNumberAsCommaSeparatedNumberString(value)}`} />
                        </Line>
                        
                        <Line
                        type="linear"
                        dataKey="CDF"
                        name="CDF"
                        stroke="#ff3232"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        >
                            <LabelList dataKey="CDF" position="top" offset={10} formatter={(value) => `${formatNumberAsCommaSeparatedNumberString(value)}`} />
                        </Line>
                        
                        <Line
                        type="linear"
                        name="County"
                        dataKey="COUNTY"
                        stroke="#FFBB28"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        >
                            <LabelList dataKey="COUNTY" position="top" offset={10} formatter={(value) => `${formatNumberAsCommaSeparatedNumberString(value)}`} />
                        </Line>
                        
                        <Line
                        type="linear"
                        name="Capitation"
                        dataKey="CAPITATION"
                        stroke="#2cff02"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        >
                            <LabelList dataKey="CAPITATION" position="top" offset={10} formatter={(value) => `KES ${formatNumberAsCommaSeparatedNumberString(value)}`} />
                        </Line>

                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="w-full  bg-white rounded shadow p-4">
                <div className="w-full ">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />Revenue vs Expenditure projection for the next three years
                    </h2>
                </div>
                <div className="h-80 w-full P-3 ">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                        data={revenueProjection}
                        margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis  orientation="left"  allowDecimals={false} 
                        tickFormatter={(value) => formatNumberAsCommaSeparatedNumberString(value)}
                        tick={{fontSize: 12}}
                        />
                        <Tooltip 
                            formatter={(value, key) => [`KES ${formatNumberAsCommaSeparatedNumberString(value)}`, `${key}`]}
                            labelFormatter={(label) => `Year: ${label}`}
                        />
                        <Legend />
                        
                        <Line
                        type="linear"
                        name='Total Revenue'
                        dataKey="totalRevenue"
                        stroke="#0088FE"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        >
                            <LabelList dataKey="totalRevenue" position="top" offset={10} formatter={(value) => `${formatNumberAsCommaSeparatedNumberString(value)}`} />
                        </Line>

                        <Line
                        type="linear"
                        name='Total Expenditure'
                        dataKey="totalExpenditure"
                        stroke="#ff3232"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        >
                            <LabelList dataKey="totalExpenditure" position="top" offset={10} formatter={(value) => `${formatNumberAsCommaSeparatedNumberString(value)}`} />
                        </Line>

                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
{/* 
            <div className="w-full  bg-white rounded shadow p-4">
                <div className="w-full ">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />Expenditure projection for the next two years
                    </h2>
                </div>
                <div className="h-80 w-full P-3 ">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                        data={expenditureProjection}
                        margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis  orientation="left"  allowDecimals={false} 
                        tickFormatter={(value) => formatNumberAsCommaSeparatedNumberString(value)}
                        tick={{fontSize: 12}}
                        />
                        <Tooltip 
                            formatter={(value, key) => [`KES ${formatNumberAsCommaSeparatedNumberString(value)}`, `${key}`]}
                            labelFormatter={(label) => `Year: ${label}`}
                        />
                        <Legend />
                        
                        <Line
                        type="linear"
                        name='HELB'
                        dataKey="HELB"
                        stroke="#0088FE"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        >
                            <LabelList dataKey="HELB" position="top" offset={10} formatter={(value) => `${formatNumberAsCommaSeparatedNumberString(value)}`} />
                        </Line>
                        
                        <Line
                        type="linear"
                        dataKey="CDF"
                        name="CDF"
                        stroke="#ff3232"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        >
                            <LabelList dataKey="CDF" position="top" offset={10} formatter={(value) => `${formatNumberAsCommaSeparatedNumberString(value)}`} />
                        </Line>
                        
                        <Line
                        type="linear"
                        name="County"
                        dataKey="COUNTY"
                        stroke="#FFBB28"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        >
                            <LabelList dataKey="COUNTY" position="top" offset={10} formatter={(value) => `${formatNumberAsCommaSeparatedNumberString(value)}`} />
                        </Line>
                        
                        <Line
                        type="linear"
                        name="Capitation"
                        dataKey="CAPITATION"
                        stroke="#2cff02"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        >
                            <LabelList dataKey="CAPITATION" position="top" offset={10} formatter={(value) => `KES ${formatNumberAsCommaSeparatedNumberString(value)}`} />
                        </Line>

                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div> */}
        </div>
    );
};

export default FinancialProjections;