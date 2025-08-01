import type { Generation } from "@/server/modules/generations/domain/entities/Generation";

interface GenerationFilterProps {
  generations: Generation[];
  selectedGeneration: string;
  onGenerationChange: (generationId: string) => void;
  disabled?: boolean;
}

export function GenerationFilter({
  generations,
  selectedGeneration,
  onGenerationChange,
  disabled = false
}: GenerationFilterProps) {
  const handleGenerationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onGenerationChange(event.target.value);
  };

  return (
    <div className="flex flex-col">
      <label htmlFor="generation-select" className="mb-2 text-sm font-medium text-gray-700">
        Generation
      </label>
      <select
        id="generation-select"
        value={selectedGeneration}
        onChange={handleGenerationChange}
        className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        disabled={disabled}
      >
        <option value="all">All Generations</option>
        {generations.map((generation) => (
          <option key={`generation-${generation.id}`} value={generation.id.toString()}>
            {generation.name}
          </option>
        ))}
      </select>
    </div>
  );
}