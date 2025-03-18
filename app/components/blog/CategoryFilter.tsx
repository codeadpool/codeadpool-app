interface CategoryFilterProps {
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
  }
  
  export default function CategoryFilter({ 
    categories, 
    activeCategory, 
    onCategoryChange 
  }: CategoryFilterProps) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2"></span>
          Categories
        </h3>
        
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category}>
              <button
                onClick={() => onCategoryChange(category)}
                className={`flex items-center w-full text-left px-3 py-2 rounded-md transition-colors ${
                  activeCategory === category
                    ? 'bg-emerald-900/30 text-emerald-400 border-l-2 border-emerald-500'
                    : 'text-gray-300 hover:bg-gray-700/30'
                }`}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  