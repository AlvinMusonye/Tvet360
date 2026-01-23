import EnrollmentTrendBarGraph from "./enrollment/EnrollmentTrendBarGraph";
import CrossIntakeComparison from "./enrollment/CrossIntakeComparison";
import EnrollmentForLastThreeIntakes from "./enrollment/EnrollmentForLastThreeIntakes";
import IntakeGroupedBarChartForPastFiveYears from "./enrollment/IntakeGroupedBarChartForPastFiveYears";


const EnrollmentHistory = () => {

    return (
        <div className="grid grid-cols-1 w-full gap-2">
            <p className="font-bold">Enrollment History</p>

            <div className="w-full">
            <EnrollmentForLastThreeIntakes />
            </div>

            <div className="w-full">
            <EnrollmentTrendBarGraph />
            </div>

            <div className="w-full">
            <CrossIntakeComparison />
            </div>
            
            <div className="w-full">
            <IntakeGroupedBarChartForPastFiveYears />
            </div>
        </div>
    );
};

export default EnrollmentHistory;