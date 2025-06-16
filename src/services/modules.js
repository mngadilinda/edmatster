// src/api/modules.js
const API_URL = 'http://localhost:8000';

export const fetchModule = async (token, programId, moduleId) => {
  const response = await fetch(`${API_URL}/programs/${programId}/modules/${moduleId}/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch module');
  }
  
  return await response.json();
};


export const fetchModuleTopics = async (token, programId, moduleId) => {
  const response = await fetch(`${API_URL}/programs/${programId}/modules/${moduleId}/topics/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch module topics');
  }

  return await response.json();
};

// Optional: If you need module details
export const fetchModuleDetails = async (token, programId, moduleId) => {
  const response = await fetch(`${API_URL}/programs/${programId}/modules/${moduleId}/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch module details');
  }

  return await response.json();
};

export default API_URL;