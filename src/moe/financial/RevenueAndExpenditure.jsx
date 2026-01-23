import { Wallet, Banknote, CreditCard, TrendingUp } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, Cell, LabelList, Tooltip, YAxis, XAxis, Legend, CartesianGrid } from "recharts";
import { formatNumberAsCommaSeparatedNumberString } from "../../Dashboards/utils/NumberFormatUtls";

const RevenueAndExpenditure = () => {

    const accrualRevenue = 23;
    const actualRevenue = 3;
    const costPerStudent = 200000;

    const revenueExpenditure = [
        {key: "Revenue", value: 23000000},
        {key: "Expenditure", value: 20000000},
    ];

    const financialData = [
    {
        year: 2021, revenue: 1300000, expenditure: 1300000, 
    },
    {
        year: 2022, revenue: 1600000, expenditure: 1100000,
    },
    {
        year: 2023, revenue: 1400000, expenditure: 1200000, 
    },
    {
        year: 2024, revenue: 1100000, expenditure: 1000000, 
    },
    {
        year: 2025, revenue: 1500000, expenditure: 900000,
    }
  ];

    const COLORS = ['#0088FE', '#ff3232', '#FFBB28', '#FF8042', '#8884D8'];

    return (
        <div className="grid grid-cols-1 gap-4">
            <div className="w-full gap-2 flex flex-col md:flex-row ">

                <div className="bg-white w-full md:w-1/3 flex fex-row rounded p-4 shadow">
                    <div className="w-3/4 grid grid-cols-1">
                        <p className="text-lg font-semibold w-full text-gray-700">Accrual Revenue</p>
                        <p className="text-xl font-bold w-full text-blue-400">KES <span className="text-3xl">{formatNumberAsCommaSeparatedNumberString(accrualRevenue)}</span> Million</p>
                    </div>
                    <div className="w-1/4 flex flex-col justify-center">
                     <Banknote className="w-8 h-8 text-blue-400" />
                    </div>
                </div>

                <div className="bg-white w-full md:w-1/3 flex fex-row rounded p-4 shadow">
                    <div className="w-3/4 grid grid-cols-1">
                        <p className="text-lg font-semibold w-full text-gray-700">Actual Revenue</p>
                        <p className="text-xl font-bold w-full text-green-400">KES <span className="text-3xl">{formatNumberAsCommaSeparatedNumberString(actualRevenue)}</span> Million</p>
                    </div>
                    <div className="w-1/4 flex flex-col justify-center">
                     <CreditCard className="w-8 h-8 text-green-400" />
                    </div>
                </div>

                <div className="bg-white w-full md:w-1/3 flex fex-row rounded p-4 shadow">
                    <div className="w-3/4 grid grid-cols-1">
                        <p className="text-lg font-semibold w-full text-gray-700">Cost per Student</p>
                        <p className="text-xl font-bold w-full text-red-400">KES <span className="text-3xl">{formatNumberAsCommaSeparatedNumberString(costPerStudent)}</span></p>
                    </div>
                    <div className="w-1/4 flex flex-col justify-center">
                     <Wallet className="w-8 h-8 text-red-400" />
                    </div>
                </div>

            </div>


            <div className="w-full flex flex-col bg-white rounded p-4">

                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />Total expenditure vs revenue for current year
                </h2>
                <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                    data={revenueExpenditure}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="key" />
                    <YAxis yAxisId="left" orientation="left" dataKey="value" allowDecimals={false} 
                    tickFormatter={(value) => value.toLocaleString()}
                    tick={{fontSize: 12}}
                    />
                    <Tooltip 
                        formatter={(value) => [`KES ${formatNumberAsCommaSeparatedNumberString(value)}`, 'Total']}
                        labelFormatter={(label) => `Year: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="value" name="" radius={[4, 4, 0, 0]}>
                        <LabelList dataKey="value" position="top" offset={10} 
                        formatter={(value) => `KES ${formatNumberAsCommaSeparatedNumberString(value)}`}/>
                        {revenueExpenditure.map((data, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                    </BarChart>
                </ResponsiveContainer>
                </div>

            </div>

            <div className="w-full  bg-white rounded shadow p-4">
                <div className="w-full ">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />Revenue vs expenditure for the past five years
                    </h2>
                </div>
                <div className="h-80 w-full P-3 ">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                        data={financialData}
                        margin={{ top: 40, right: 30, left: 20, bottom: 5 }}
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
                        
                        <Bar dataKey="revenue" name="Revenue" fill={COLORS[0]} radius={[4, 4, 0, 0]}>
                            <LabelList dataKey="revenue" position="top" offset={10} formatter={(value) => `KES ${formatNumberAsCommaSeparatedNumberString(value)}`} />
                        </Bar>
                        
                        <Bar dataKey="expenditure" name="Expenditure" fill={COLORS[1]} radius={[4, 4, 0, 0]}>
                            <LabelList dataKey="expenditure" position="top" offset={10} formatter={(value) => `KES ${formatNumberAsCommaSeparatedNumberString(value)}`} />
                        </Bar>

                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default RevenueAndExpenditure;