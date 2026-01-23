const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8360';

const fetchTotalStudentEnrollmentForThePastThreeIntakes = async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/student-enrollment/student-total-enroll-last-three-intakes`,{
        headers: {'Content-Type': 'application/json'}
    });

    if( response.status === 200 )
    {
        console.log('received response');
    }
    else{
        console.log("Failed to load data");
    }

    return response.json();
};

const fetchTotalStudentEnrollmentForThePastFiveYears = async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/student-enrollment/student-total-enroll-past-five-years`,{
        headers: {'Content-Type': 'application/json'}
    });

    if( response.status === 200 )
    {
        console.log('received response');
    }
    else{
        console.log("Failed to load data");
    }

    return response.json();
};

const fetchTotalStudentEnrollmentForIntakeForThePastFiveYears = async (intake) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/student-enrollment/student-total-enroll-intake-past-five-years?intake=${intake}`,{
        headers: {'Content-Type': 'application/json'}
    });

    if( response.status === 200 )
    {
        console.log('received response');
    }
    else{
        console.log("Failed to load data");
    }

    return response.json();
};

const fetchTotalStudentEnrollmentForAllIntakesForThePastFiveYears = async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/student-enrollment/student-total-enroll-all-intakes-past-five-years`,{
        headers: {'Content-Type': 'application/json'}
    });

    if( response.status === 200 )
    {
        console.log('received response');
    }
    else{
        console.log("Failed to load data");
    }

    return response.json();
};

export {
    fetchTotalStudentEnrollmentForThePastThreeIntakes,
    fetchTotalStudentEnrollmentForThePastFiveYears,
    fetchTotalStudentEnrollmentForIntakeForThePastFiveYears,
    fetchTotalStudentEnrollmentForAllIntakesForThePastFiveYears
};