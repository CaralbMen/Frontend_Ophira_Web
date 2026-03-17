const URL_BASE= "http://localhost:4000/api/";

export const api={
    get: async (endpoint) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${URL_BASE}${endpoint}`,{
                headers:{
                    'Authorization': token?`Bearer ${token}`: '',
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error en la solicitud GET:", error);
            throw error;
        }
    },
    post: async (endpoint, data)=>{
        const token = localStorage.getItem('token');
        try{
            const response= await fetch(`${URL_BASE}${endpoint}`,{
                method: 'POST',
                headers:{
                    'Authorization': token? `Bearer ${token}`: '',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error en la solicitud POST:", error);
            throw error;
        }
    },
    put: async (endpoint, data)=>{
        const token = localStorage.getItem('token');
        try{
            const response= await fetch(`${URL_BASE}${endpoint}`,{
                method: 'PUT',
                headers:{
                    'Authorization': token? `Bearer ${token}`: '',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error en la solicitud PUT:", error);
            throw error;
        }
    },
    delete: async (endpoint)=>{
        const token = localStorage.getItem('token');
        try{
            const response= await fetch(`${URL_BASE}${endpoint}`,{
                method: 'DELETE',
                headers:{
                    'Authorization': token? `Bearer ${token}`: '',
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error en la solicitud DELETE:", error);
            throw error;
        }  
    }
}