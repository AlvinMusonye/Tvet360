
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8360';

const fetchInstitutionTotalsByType = async(token) =>
{
    try{
      const response = await fetch(`${API_BASE_URL}/api/v1/institution/total-by-type`, {
        headers: { "Content-Type": "application/json" /*'Authorization': `Bearer ${token}`*/ }
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
    fetchInstitutionTotalsByType
};