const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8360';

const fetchInstitutions = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/institution/get`, /*{
        headers: { 'Authorization': `Bearer ${token}` },
      }*/);
      const result = await response.json();
      if (result.status === 200 && Array.isArray(result.data)) {
        console.log(result.data);
        return result.data;
      }

      return [];
    } catch (err) {
      console.error('Failed to fetch institutions', err);
      return [];
    }
};

const fetchInstitutionsByType = async (token, type) => {
    try {
        console.log(type);
        let instType = {
            "instType": type
        };
      const response = await fetch(`${API_BASE_URL}/api/v1/institution/get-by-type?instType=${type}`, /*{
        headers: { 'Authorization': `Bearer ${token}` },
      }*/);
      const result = await response.json();
      if (result.status === 200 && Array.isArray(result.data)) {
        
        console.log(result.data);
        return result.data;
      }
    } catch (err) {
      console.error('Failed to fetch institutions', err);
    }
};

const fetchInstitutionsByCounty = async (token, county) => {
    try {
        console.log(county);
        let instCounty = {
            "county": county
        };
      const response = await fetch(`${API_BASE_URL}/api/v1/institution/get-by-county?county=${county}`, /*{
        headers: { 'Authorization': `Bearer ${token}` },
      }*/);
      const result = await response.json();
      if (result.status === 200 && Array.isArray(result.data)) {
        
        console.log(result.data);
        return result.data;
      }
    } catch (err) {
      console.error('Failed to fetch institutions', err);
    }
};

const fetchInstitutionsByTypeAndCounty = async (token, type, county) => {
    try {
        console.log(type);
        let instType = {
            "instType": type
        };
      const response = await fetch(`${API_BASE_URL}/api/v1/institution/get-by-type-and-county?instType=${type}&county=${county}`, /*{
        headers: { 'Authorization': `Bearer ${token}` },
      }*/);
      const result = await response.json();
      if (result.status === 200 && Array.isArray(result.data)) {
        
        console.log(result.data);
        return result.data;
      }
    } catch (err) {
      console.error('Failed to fetch institutions', err);
    }
};

const fetchInstitutionCounties = async(token) =>
{
    try{
      const response = await fetch(`${API_BASE_URL}/api/v1/institution/get-counties-with-institutions`, /*{
        headers: { 'Authorization': `Bearer ${token}` },
      }*/);
      const result = await response.json();
      if (result.status === 200 && Array.isArray(result.data)) {
        console.log(result.data);
        return result.data;
      }
      
      return [];
    } catch (err) {
      console.error('Failed to fetch institution counties', err);
      return [];
    }
}

const fetchInstitutionTypes = async(token) =>
{
    try{
      const response = await fetch(`${API_BASE_URL}/api/v1/institution/get-types-of-institutions`, /*{
        headers: { 'Authorization': `Bearer ${token}` },
      }*/);
      const result = await response.json();
      if (result.status === 200 && Array.isArray(result.data)) {
        console.log(result.data);
        return result.data;
      }
      
      return [];
    } catch (err) {
      console.error('Failed to fetch institution types', err);
      return [];
    }
}

const fetchProgramsForInstitutions = async(token, insts) =>
{
    try{
      console.log(insts);
      const response = await fetch(`${API_BASE_URL}/api/v1/program/get-for-any-institution`, {
        headers: { "Content-Type": "application/json" /*'Authorization': `Bearer ${token}`*/ },
        method: "POST",
        body: JSON.stringify({"institutionRegistrationNumbers": [...insts.map(inst => inst.institutionRegistrationNumber)]})
      });
      const result = await response.json();
      if (result.status === 200 && Array.isArray(result.data)) {
        console.log(result.data);
        return result.data;
      }
      
      return [];
    } catch (err) {
      console.error('Failed to fetch institution types', err);
      return [];
    }
}

const fetchStudentsForPrograms = async(token, progs, pageNumber) =>
{
    try{
      console.log(progs);
      let programCodes = [...progs.map(prog => prog.programCode)];
      console.log(programCodes);
      const response = await fetch(`${API_BASE_URL}/api/v1/student-enrollment/student-dtl-any-prog?pageNumber=${pageNumber}`, {
        headers: { "Content-Type": "application/json" /*'Authorization': `Bearer ${token}`*/ },
        method: "POST",
        body: JSON.stringify({"programCodes": [...programCodes]})
      });
      const result = await response.json();
      if (response.status === 200 ) {
        console.log(result.data);
        return result;
      }else{
        console.log(response.status);
        console.warn("============================ Got error status code ========================");
        console.error(result);
      }
      
      return [];
    } catch (err) {
      console.error('Failed to fetch institution types', err);
      return [];
    }
}


export {
    fetchInstitutions, 
    fetchInstitutionsByCounty,
    fetchInstitutionsByType,
    fetchInstitutionCounties,
    fetchInstitutionTypes,
    fetchInstitutionsByTypeAndCounty,
    fetchProgramsForInstitutions,
    fetchStudentsForPrograms
};