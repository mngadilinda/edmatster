// src/components/Programs/ProgramCard.jsx
// src/components/Programs/ProgramsCard.jsx
const ProgramCard = ({ program, onSelect }) => {
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={program.thumbnail} 
        alt={program.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{program.description}</p>
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <span className="font-medium">R{program.price_monthly}/mo</span>
            <span className="text-gray-500 mx-2">|</span>
            <span className="font-medium">R{program.price_yearly}/yr</span>
          </div>
          <button
            onClick={onSelect}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};
  
  export default ProgramCard;