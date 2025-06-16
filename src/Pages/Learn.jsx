
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useState, useEffect } from 'react';
import { learnService } from '../services/services';
import {LoadingSpinner} from '../components/ui/LoadingSpinner';

const Learn = () => {
  const { programId, moduleId, topicId } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({
    loading: true,
    error: null,
    topic: null,
    resources: [],
    assessments: []
  });

  useEffect(() => {
    const loadContent = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null, notFound: false }));
        
        const response = await learnService.fetchTopicContent(
          programId, 
          moduleId, 
          topicId
        );

        if (response.status === 'success') {
          // Check if we actually got a topic
          if (!response.data || Object.keys(response.data).length === 0) {
            setState({
              loading: false,
              notFound: true,
              error: null,
              topic: null,
              resources: [],
              assessments: []
            });
          } else {
            setState({
              loading: false,
              error: null,
              notFound: false,
              topic: response.data,
              resources: response.data.resources || [],
              assessments: response.data.assessments || []
            });
          }
        } else {
          throw new Error(response.message || 'Failed to load topic');
        }
      } catch (error) {
        // Handle 404 specifically
        const isNotFound = error.response?.status === 404;
        setState({
          loading: false,
          error: isNotFound ? 'Topic not found' : error.message,
          notFound: isNotFound,
          topic: null,
          resources: [],
          assessments: []
        });
      }
    };

    loadContent();
  }, [programId, moduleId, topicId]);

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
        <span className="ml-4">Loading topic content...</span>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Content</h2>
          <p className="mb-6 text-gray-600">{state.error}</p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Try Again
            </Button>
            <Button onClick={() => navigate(-1)}>
              Back to Module
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!state.topic) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold mb-4">Topic Not Available</h2>
          <p className="mb-6 text-gray-600">
            This learning content is not available yet. Please check back later.
          </p>
          <Button onClick={() => navigate(`/programs/${programId}/modules/${moduleId}`)}>
            Return to Module
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header with breadcrumbs */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <button 
              onClick={() => navigate('/programs')}
              className="hover:text-blue-600"
            >
              Programs
            </button>
            <span>/</span>
            <button 
              onClick={() => navigate(`/programs/${programId}`)}
              className="hover:text-blue-600"
            >
              {state.topic.module?.program?.title || 'Program'}
            </button>
            <span>/</span>
            <button 
              onClick={() => navigate(`/programs/${programId}/modules/${moduleId}`)}
              className="hover:text-blue-600"
            >
              {state.topic.module?.title || 'Module'}
            </button>
            <span>/</span>
            <span className="font-medium text-gray-900">
              {state.topic.title}
            </span>
          </nav>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
        {/* Sidebar for resources */}
        {state.resources.length > 0 && (
          <aside className="w-full md:w-64 bg-white p-4 rounded-lg shadow-sm mb-6 md:mb-0 md:mr-6">
            <h3 className="font-medium text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              {state.resources.map(resource => (
                <li key={resource.id}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 hover:bg-gray-100 rounded"
                  >
                    <span className="truncate">{resource.title}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({resource.resource_type})
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* Topic content */}
        <article className="flex-1 bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-4">{state.topic.title}</h1>
          
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: state.topic.formatted_content || state.topic.content }} 
          />

          {/* Assessments section */}
          {state.assessments.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Assessments</h2>
              <div className="space-y-4">
                {state.assessments.map(assessment => (
                  <div key={assessment.id} className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium">{assessment.title}</h3>
                    <p className="text-gray-600 mt-1 mb-3">{assessment.description}</p>
                    <Button
                      onClick={() => navigate(`/assessments/${assessment.id}`)}
                      size="sm"
                    >
                      Start Assessment
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      {/* Navigation footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between">
          <Button 
            variant="outline"
            onClick={() => navigate(`/programs/${programId}/modules/${moduleId}`)}
          >
            Back to Module
          </Button>
          <Button>
            Mark as Complete
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Learn;