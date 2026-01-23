

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8360';

const fetchStudentCountData = async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/student-enrollment/student-count`, {
    headers: {"Content-Type": "application/json"}
    });
    
    if (response.status === 200) {
        // let data = await response.json();
        console.log(response);
    }
    else{
        console.error(`Failed to fetch total students: ${response}`);
    }
    
    return response.json();
};

const fetchTotalProgramsOffered = async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/program/count`, {
    headers: {"Content-Type": "application/json"}
    });
    
    if (response.status === 200) {
        // let data = await response.json();
        console.log(response);
    }
    else{
        console.error(`Failed to fetch total students: ${response}`);
    }
    
    return response.json();
};


const fetchInstituionTypeSummaries = async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/student-enrollment/enroll-summary-by-inst-typ`, {
    headers: {"Content-Type": "application/json"}
    });
    
    if (response.status === 200) {
        // let data = await response.json();
        console.log(response);
    }
    else{
        console.error(`Failed to fetch total students: ${response}`);
    }
    
    return response.json();
};

export {
    fetchStudentCountData,
    fetchTotalProgramsOffered,
    fetchInstituionTypeSummaries
};