// src/pages/TopicDetail.jsx
import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchModuleTopics } from '../services/modules';
import { fetchTopic, completeTopic } from '../services/services';
import Breadcrumb from '../components/Common/Breadcrumb';
import {LoadingSpinner} from '../components/ui/LoadingSpinner';
import TopicsList from '../components/Modules/TopicsList';
import VideoPlayer from '../components/Learn/VideoPlayer';
import MarkdownContent from '../components/Learn/MarkdownContent';

const TopicDetail = () => {
  const { user } = useContext(AuthContext);
  const { programId, moduleId, topicId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [mode, setMode] = useState(topicId ? 'view' : 'list');
  const [topic, setTopic] = useState(null);
  const [topics, setTopics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        
        if (mode === 'view') {
          const topicData = await fetchTopic(user.token, programId, moduleId, topicId);
          setTopic(topicData);
          setIsCompleted(topicData.is_completed);
        } else {
          const topicsData = await fetchModuleTopics(user.token, programId, moduleId);
          setTopics(topicsData);
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, navigate, programId, moduleId, topicId, mode]);

  const handleComplete = async () => {
    try {
      await completeTopic(user.token, programId, moduleId, topicId);
      setIsCompleted(true);
    } catch (err) {
      console.error('Error completing topic:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Try Again
          </button>
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
              { name: topic?.program_title || 'Program', href: `/programs/${programId}` },
              { name: topic?.module_title || 'Module', href: `/programs/${programId}/modules/${moduleId}` },
              ...(mode === 'view' ? [{ name: topic?.title }] : [])
            ]}
          />
          
          {mode === 'view' ? (
            <div className="mt-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">{topic.title}</h1>
              <div className="flex items-center space-x-4">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {topic.duration} min
                </span>
                {isCompleted && (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                )}
              </div>
            </div>
          ) : (
            <h1 className="text-2xl font-bold text-gray-900 mt-4">
              {topic?.module_title || 'Module Topics'}
            </h1>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {mode === 'view' ? (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            {topic.media_url && (
              <div className="bg-black">
                <VideoPlayer url={topic.media_url} />
              </div>
            )}

            <div className="px-4 py-5 sm:p-6">
              <MarkdownContent content={topic.content} />

              <div className="mt-8 pt-5 border-t border-gray-200 flex justify-between">
                {topic.previous_lesson && (
                  <button
                    onClick={() => navigate(`/learn/${programId}/${moduleId}/${topic.previous_lesson}`)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Previous Lesson
                  </button>
                )}
                
                <div className="flex space-x-3">
                  {!isCompleted && (
                    <button
                      onClick={handleComplete}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Mark as Complete
                    </button>
                  )}
                  
                  {topic.next_lesson ? (
                    <button
                      onClick={() => navigate(`/learn/${programId}/${moduleId}/${topic.next_lesson}`)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                    >
                      Next Lesson
                    </button>
                  ) : (
                    <button
                      onClick={() => setMode('list')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
                    >
                      Back to Topics
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <TopicsList 
              topics={topics} 
              programId={programId}
              moduleId={moduleId}
              isLoading={loading}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default TopicDetail;