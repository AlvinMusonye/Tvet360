import { Wallet, Banknote, CreditCard, TrendingUp } from "lucide-react";
import { ResponsiveContainer, ComposedChart, BarChart, LineChart, Bar, Line, Cell, LabelList, Tooltip, YAxis, XAxis, Legend, CartesianGrid } from "recharts";
import { formatNumberAsCommaSeparatedNumberString } from "../../Dashboards/utils/NumberFormatUtls";

const YearOverYearComparison = () => {

    const accrualRevenue = 23;
    const actualRevenue = 14;
    const costPerStudent = 200000;

    const revenueExpenditure = [
        {key: "Revenue", value: 23},
        {key: "Expenditure", value: 20},
    ];

    const COLORS = ['#0088FE', '#ff3232', '#FFBB28', '#FF8042', '#8884D8'];

    const financialData = [
    {
        year: 2021, HELB: 1300000, CAPITATION: 1300000, CDF: 900000, COUNTY: 1400000, 
    },
    {
        year: 2022, HELB: 1600000, CAPITATION: 1100000, CDF: 800000, COUNTY: 1100000, 
    },
    {
        year: 2023, HELB: 1400000, CAPITATION: 1200000, CDF: 700000, COUNTY: 1500000, 
    },
    {
        year: 2024, HELB: 1100000, CAPITATION: 1000000, CDF: 1000000, COUNTY: 1300000, 
    },
    {
        year: 2025, HELB: 1500000, CAPITATION: 900000, CDF: 800000, COUNTY: 1200000, 
    }
  ];

  const totalFinancialData = [
    {
        year: 2021, total: 4300000, 
    },
    {
        year: 2022, total: 4200000, 
    },
    {
        year: 2023, total: 4800000, 
    },
    {
        year: 2024, total: 4600000,
    },
    {
        year: 2025, total: 4400000, 
    }
  ];

    return (
        <div className="grid grid-cols-1 gap-4">
            <div className="w-full  bg-white rounded shadow p-4">
                <div className="w-full ">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />Funding comparison for the past five years
                    </h2>
                </div>
                <div className="h-80 w-full P-3 ">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                        data={financialData}
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
                    <TrendingUp className="w-5 h-5" />Cumulative Funding for the past five years
                    </h2>
                </div>
                <div className="h-80 w-full P-3 ">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                        data={totalFinancialData}
                        margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis  orientation="left"  allowDecimals={false} 
                        tickFormatter={(value) => formatNumberAsCommaSeparatedNumberString(value)}
                        tick={{fontSize: 12}}
                        />
                        <Tooltip 
                            formatter={(value) => [`KES ${formatNumberAsCommaSeparatedNumberString(value)}`, `Funding`]}
                            labelFormatter={(label) => `Year: ${label}`}
                        />
                        <Legend />
                        <Bar dataKey="total" name="Total Funding" fill={COLORS[0]} radius={[4, 4, 0, 0]}>
                            <LabelList dataKey="total" position="top" offset={10} formatter={(value) => `KES ${formatNumberAsCommaSeparatedNumberString(value)}`} />
                        </Bar>

                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default YearOverYearComparison;