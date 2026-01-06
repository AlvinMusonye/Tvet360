import React from 'react';

const Sp = () => {
  return (
      <div className="min-h-screen bg-muted p-8">
      <div className="mb-10">
        <div>
          <h2 className="text-2xl font-bold">Service Provider Dashboard</h2>
          <p className="text-gray-600">Manage your programs and assessments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Trend Forecasting */}
        <div className="bg-white p-8 rounded-lg shadow-medium">
          <h4 className="heading-3 mb-6">5-Year Enrollment Projection</h4>
          <div className="h-64 border-b border-l border-border relative flex items-end px-4 gap-8">
             {/* Dotted line extensions for forecasting  */}
             <div className="flex-1 bg-primary/20 h-32 border-t-2 border-primary"></div>
             <div className="flex-1 bg-primary/30 h-48 border-t-2 border-primary"></div>
             <div className="flex-1 bg-primary/40 h-56 border-t-2 border-primary border-dashed" title="Forecasted"></div>
          </div>
          <div className="mt-4 flex justify-between caption">
            <span>2024</span><span>2025</span><span className="text-primary font-bold">2026 (F)</span>
          </div>
        </div>

        {/* Audit & Compliance Table */}
        <div className="bg-white p-8 rounded-lg shadow-medium">
          <h4 className="heading-3 mb-6">OAG Audit Remarks</h4>
          <div className="overflow-hidden rounded-soft border border-border">
            <table className="w-full text-left">
              <thead className="bg-muted">
                <tr>
                  <th className="p-4 caption">Fiscal Year</th>
                  <th className="p-4 caption">Opinion</th>
                  <th className="p-4 caption">Status</th>
                </tr>
              </thead>
              <tbody className="body-small">
                <tr className="border-t border-border">
                  <td className="p-4">2024/25</td>
                  <td className="p-4 font-bold text-success">Unqualified</td>
                  <td className="p-4">85% Resolved</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-4">2023/24</td>
                  <td className="p-4 font-bold text-accent">Qualified</td>
                  <td className="p-4">100% Resolved</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sp; 