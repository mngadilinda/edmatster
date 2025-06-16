import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: true
});

// Request interceptor to add auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Response interceptor to handle token refresh
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');
        
        const { data } = await api.post('/auth/token/refresh/', { refresh: refreshToken });
        localStorage.setItem('accessToken', data.access);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
        originalRequest.headers['Authorization'] = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper function for FormData
const createFormDataRequest = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  return formData;
};

// Authentication Services
export const authService = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  logout: () => api.post('/auth/logout/', { 
    refresh: localStorage.getItem('refreshToken') 
  }),
  verify: (token) => api.post('/auth/verify/', { token }),
  refreshToken: () => api.post('/auth/token/refresh/', {
    refresh: localStorage.getItem('refreshToken')
  }),
  getCSRF: () => api.get('/auth/csrf/')
};

// User Profile Services
export const profileService = {
  fetch: () => api.get('/profile/'),
  update: (formData) => {
    const body = new FormData();
    if (formData.first_name) body.append('first_name', formData.first_name);
    if (formData.last_name) body.append('last_name', formData.last_name);
    if (formData.bio) body.append('bio', formData.bio);
    if (formData.avatar) body.append('avatar', formData.avatar);
    
    return api.patch('/profile/', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

// Dashboard Services
export const dashboardService = {
  fetchData: () => api.get('/user/dashboard/'),
  fetchProgress: () => api.get('/user/progress/')
};

// Programs Services
export const programsService = {
  fetchAll: () => api.get('/programs/'),
  fetchDetail: (programId) => api.get(`/programs/${programId}/`),
  fetchModules: (programId) => api.get(`/programs/${programId}/modules/`),
  enroll: (programId) => api.post(`/programs/${programId}/enroll/`)
  
};

// Modules Services
export const modulesService = {
  fetch: (programId, moduleId) => api.get(`/programs/${programId}/modules/${moduleId}/`),
  fetchTopics: (moduleId) => api.get(`/modules/${moduleId}/topics/`)
};

// Learning Services
export const learnService = {
  fetchTopicContent: async (programId, moduleId, topicId) => {
    try {
      const response = await api.get(`/topics/${topicId}/`, {
        params: {
          program_id: programId,
          module_id: moduleId
        },
        validateStatus: (status) => status < 500 // Don't throw for 404
      });
      
      if (response.status === 404) {
        return {
          status: 'error',
          message: 'Topic not found'
        };
      }
      
      return {
        status: 'success',
        data: response.data
      };
      
    } catch (error) {
      // Handle network errors and server errors
      return {
        status: 'error',
        message: error.response?.data?.detail || 
               error.message ||
               'Failed to load topic content'
      };
    }
  }
};

// Topics Services
export const topicsService = {
  fetch: (topicId) => api.get(`/topics/${topicId}/`),
  fetchResources: (topicId) => api.get(`/topics/${topicId}/resources/`),
  markCompleted: (topicId) => api.post(`/topics/${topicId}/mark_completed/`)
};

export const fetchTopic = async (token, programId, moduleId, topicId) => {
  try {
    const response = await api.get(`/topics/${topicId}/`, {
      params: {
        program_id: programId,
        module_id: moduleId
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch topic');
  }
};

export const completeTopic = async (token, programId, moduleId, topicId) => {
  try {
    const response = await api.post(`/topics/${topicId}/complete/`, {
      program_id: programId,
      module_id: moduleId
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to complete topic');
  }
};

// Assessments Services
export const assessmentsService = {
  fetchAll: () => api.get('/assessments/'),
  fetchDetail: (assessmentId) => api.get(`/assessments/${assessmentId}/`),
  submit: (assessmentId, answers) => api.post(`/assessments/${assessmentId}/submit/`, answers),
  fetchResult: (assessmentId) => api.get(`/assessments/${assessmentId}/results/`),
  fetchQuestions: (assessmentId) => api.get(`/assessments/${assessmentId}/questions/`)
};

// Math Assessments
export const mathService = {
  checkAnswer: (data) => api.post('/check-math/', data)
};

// Content Uploads (Educator)
export const contentUploadsService = {
  fetchAll: () => api.get('/content-uploads/'),
  create: (uploadData) => {
    const formData = new FormData();
    formData.append('upload_type', uploadData.upload_type);
    formData.append('text_file', uploadData.text_file);
    
    return api.post('/content-uploads/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  fetchDetail: (uploadId) => api.get(`/content-uploads/${uploadId}/`),
  update: (uploadId, data) => api.patch(`/content-uploads/${uploadId}/`, data),
  delete: (uploadId) => api.delete(`/content-uploads/${uploadId}/`)
};

// User Management (Admin)
export const usersService = {
  fetchAll: (params) => api.get('/admin/users/', { params }),
  approveEducator: (userId) => api.patch(`/admin/users/${userId}/approve/`),
  toggleBan: (userId) => api.patch(`/admin/users/${userId}/toggle_ban/`),
  updateRole: (userId, role) => api.patch(`/admin/users/${userId}/`, { role })
};

export default api;