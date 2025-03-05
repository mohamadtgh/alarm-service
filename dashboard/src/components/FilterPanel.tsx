import { useState } from "react";
import { Card, Select, Button, Input } from "@rewind-ui/core";
import { AlarmTypes, FilterOptions } from "../types";

interface FilterPanelProps {
  onFilterChange: (filters: FilterOptions) => void;
}

const FilterPanel = ({ onFilterChange }: FilterPanelProps) => {
  const [sensorFilter, setSensorFilter] = useState<number | undefined>();
  const [typeFilter, setTypeFilter] = useState<AlarmTypes | undefined>();

  const handleApplyFilters = () => {
    onFilterChange({
      sensorId: sensorFilter,
      type: typeFilter,
    });
  };

  const handleResetFilters = () => {
    setSensorFilter(undefined);
    setTypeFilter(undefined);
    onFilterChange({});
  };

  return (
    <Card className="mb-6">
      <Card.Header>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Filter Alarms</h3>
          <Button color="white" size="sm" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sensor</label>
            <Input
              type="number"
              value={sensorFilter}
              onChange={(e) => setSensorFilter(parseInt(e.target.value))}
              placeholder="Sensor ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alarm Type</label>
            <Select
              value={typeFilter}
              onChange={(e) => {
                if (e.target.value === "0") setTypeFilter(undefined);
                else setTypeFilter(e.target.value as AlarmTypes);
              }}
            >
              <option value={0}>All Types</option>
              <option value={AlarmTypes.Type1}>Type 1</option>
              <option value={AlarmTypes.Type2}>Type 2</option>
              <option value={AlarmTypes.Type3}>Type 3</option>
            </Select>
          </div>
        </div>
      </Card.Body>
      <Card.Footer>
        <Button color="blue" onClick={handleApplyFilters}>
          Apply Filters
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default FilterPanel;
