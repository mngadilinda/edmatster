
import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchModuleTopics } from '../services/modules';
import TopicsList from '../components/Modules/TopicsList';
import Breadcrumb from '../components/Common/Breadcrumb';

const ModuleDetail = () => {
  const { user } = useContext(AuthContext);
  const { programId, moduleId } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [topics, setTopics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        const topicsData = await fetchModuleTopics(user.token, programId, moduleId);
        setTopics(topicsData);
        
        // If you need module details too:
        // const moduleData = await fetchModuleDetails(user.token, programId, moduleId);
        // setModule(moduleData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, navigate, programId, moduleId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Breadcrumb 
            items={[
              { name: 'Programs', href: '/programs' },
              { name: 'Current Program', href: `/programs/${programId}` },
              { name: module?.title || 'Module' }
            ]}
          />
          <h1 className="text-2xl font-bold text-gray-900 mt-4">
            {module?.title || 'Module Topics'}
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          {topics && topics.length > 0 ? (
            <TopicsList 
              topics={topics} 
              programId={programId} 
              moduleId={moduleId} 
            />
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No topics available</h3>
              <p className="mt-1 text-gray-500">This module doesn't contain any topics yet</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ModuleDetail;