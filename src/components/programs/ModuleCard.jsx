import API_URL from '../../services/modules'
import { Link } from 'react-router-dom';


const ModuleCard = ({ module, programId }) => {
  const thumbnailUrl = module.thumbnail.startsWith('http') 
    ? module.thumbnail 
    : `${API_URL}${module.thumbnail}`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
      <img 
        src={thumbnailUrl}
        alt={module.title}
        className="w-full h-32 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{module.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{module.description}</p>
        <Link
          to={`/topics/?program_id=${programId}&module_id=${module.id}`}
          className="block w-full text-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          View Topics
        </Link>
      </div>
    </div>
  );
};
  
  export default ModuleCard;