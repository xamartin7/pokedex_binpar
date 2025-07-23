import type { Type } from "@/server/modules/types/domain/entities/Type";

interface TypeFilterProps {
  types: Type[];
  selectedType: string;
  onTypeChange: (typeId: string) => void;
  disabled?: boolean;
}

export function TypeFilter({
  types,
  selectedType,
  onTypeChange,
  disabled = false
}: TypeFilterProps) {
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onTypeChange(event.target.value);
  };

  return (
    <div className="flex flex-col">
      <label htmlFor="type-select" className="mb-2 text-sm font-medium text-gray-700">
        Type
      </label>
      <select
        id="type-select"
        value={selectedType}
        onChange={handleTypeChange}
        className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        disabled={disabled}
      >
        <option key="all-types" value="">All Types</option>
        {types.map((type) => (
          <option key={`type-${type.id}`} value={type.id}>
            {type.name}
          </option>
        ))}
      </select>
    </div>
  );
}
