import React from "react";

interface FilterBarProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  filterLocation: string;
  setFilterLocation: React.Dispatch<React.SetStateAction<string>>;
  locations: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  search,
  setSearch,
  filterLocation,
  setFilterLocation,
  locations,
}) => {
  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="Cari judul, perusahaan, atau lokasi..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        value={filterLocation}
        onChange={(e) => setFilterLocation(e.target.value)}
      >
        <option value="">Semua Lokasi</option>
        {locations.map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterBar;
