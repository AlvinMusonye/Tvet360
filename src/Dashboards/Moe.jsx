import React from 'react';

const Moe = () => {
  return (
    <div className="min-h-screen bg-muted p-8">
      <div className="mb-10">
        <div>
          <h2 className="text-2xl font-bold">MoE National Overview</h2>
          <p className="text-gray-600">Real-time monitoring across all TVET institutions</p>
        </div>
      </div>

      {/* Institutional Health & Risk Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-soft border-l-4 border-primary">
          <p className="caption">Total Institutions</p>
          <h3 className="heading-3 mt-2">248</h3>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-soft border-l-4 border-secondary">
          <p className="caption">Avg Governance Score</p>
          <h3 className="heading-3 mt-2">78%</h3>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-soft border-l-4 border-accent">
          <p className="caption">Corruption Risk Index</p>
          <h3 className="heading-3 mt-2 text-red-500">Low (0.12)</h3>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-soft border-l-4 border-tech">
          <p className="caption">Accredited Rate</p>
          <h3 className="heading-3 mt-2">92%</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Student Enrollment & Equity Visualization */}
        <div className="bg-white p-8 rounded-lg shadow-medium">
          <h4 className="heading-3 mb-6">Enrollment by Demographics</h4>
          <div className="h-64 bg-gray-50 rounded-md flex items-center justify-center border border-dashed border-border">
            {/* Visual: Stacked Bar Charts for Gender, Disability, etc. [cite: 244] */}
            <p className="body-small">[Stacked Bar Chart: Gender/Rural/Minority]</p>
          </div>
        </div>

        {/* Financial Oversight */}
        <div className="bg-white p-8 rounded-lg shadow-medium">
          <h4 className="heading-3 mb-6">Funding Absorption Rate</h4>
          <div className="flex justify-around items-end h-64 pb-4">
            {/* Visual: Funding sources breakdown [cite: 291] */}
            <div className="w-12 bg-primary h-[85%] rounded-t-sm" title="Capitation"></div>
            <div className="w-12 bg-primary-light h-[60%] rounded-t-sm" title="HELB"></div>
            <div className="w-12 bg-accent h-[40%] rounded-t-sm" title="CDF"></div>
            <div className="w-12 bg-secondary h-[75%] rounded-t-sm" title="County"></div>
          </div>
          <div className="flex justify-between mt-4 caption">
            <span>Capitation</span><span>HELB</span><span>CDF</span><span>County</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Moe;