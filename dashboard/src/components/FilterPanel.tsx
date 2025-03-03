import { useState } from "react";
import { Card, Select, Button, Input } from "@rewind-ui/core";
import type { FilterOptions } from "../types";

interface FilterPanelProps {
  sensors: number[];
  alarmTypes: string[];
  onFilterChange: (filters: FilterOptions) => void;
}

const FilterPanel = ({ sensors, alarmTypes, onFilterChange }: FilterPanelProps) => {
  const [sensorFilter, setSensorFilter] = useState<number>(0);
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<string>("");

  const handleApplyFilters = () => {
    onFilterChange({
      sensorId: sensorFilter,
      type: typeFilter,
      dateRange,
    });
  };

  const handleResetFilters = () => {
    setSensorFilter(0);
    setTypeFilter("");
    setDateRange("");
    onFilterChange({
      sensorId: 0,
      type: "",
      dateRange: "",
    });
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
            <Select value={sensorFilter} onChange={(e) => setSensorFilter(Number(e.target.value))}>
              <option value="">All Sensors</option>
              {sensors.map((sensor) => (
                <option key={sensor} value={sensor}>
                  {sensor}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alarm Type</label>
            <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">All Types</option>
              {alarmTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <Input
              type="date"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              placeholder="Select date"
            />
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
