import { Link } from 'react-router-dom';

const TopicsList = ({ topics, programId, moduleId }) => {
  return (
    <div className="space-y-4">
      {topics.map(topic => (
        <div key={topic.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-lg">{topic.title}</h3>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{topic.description || 'No description available'}</p>
            </div>
            <Link 
              to={`/programs/${programId}/modules/${moduleId}/topics/${topic.id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              View
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopicsList;