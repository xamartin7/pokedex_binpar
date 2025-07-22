import type { PokemonStat } from "@/server/modules/pokemon/domain/entities/Pokemon";

export default function StatBar({ stat }: { stat: PokemonStat }) {
    const getStatColor = (value: number) => {
      if (value >= 100) return "bg-green-500";
      if (value >= 80) return "bg-yellow-500";
      if (value >= 60) return "bg-orange-500";
      return "bg-red-500";
    };
  
    const maxStat = 200; // Maximum possible stat value for width calculation
    const percentage = Math.min((stat.base_stat / maxStat) * 100, 100);
  
    return (
      <div className="flex items-center space-x-3">
        <span className="w-20 text-sm font-medium text-gray-700 capitalize">
          {stat.stat.name.replace('-', ' ')}
        </span>
        <div className="flex-1 bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${getStatColor(stat.base_stat)}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="w-12 text-sm font-bold text-gray-800">
          {stat.base_stat}
        </span>
      </div>
    );
  }