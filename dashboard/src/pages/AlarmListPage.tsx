"use client";

import { useState, useEffect } from "react";
import { Card } from "@rewind-ui/core";
import AlarmList from "../components/AlarmList";
import FilterPanel from "../components/FilterPanel";
import Pagination from "../components/Pagination";
import type { Alarm, FilterOptions } from "../types";
import APIClient from "../api/client";
import { BaseAPIUrl } from "../constants";

const AlarmListPage = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>({});

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const apiClient = new APIClient(BaseAPIUrl);
    const fetchAlarms = async () => {
      setLoading(true);
      try {
        let apiPath = `/alarms/?page=${currentPage}&pageSize=10`;
        if (filters.sensorId) {
          apiPath += `&sensorId=${filters.sensorId}`;
        }
        if (filters.type) {
          apiPath += `&type=${filters.type}`;
        }

        const response = await apiClient.get<Alarm[]>(apiPath);
        const { data = [], error } = response;
        if (error) {
          console.error(response.error);
          return;
        }

        setAlarms(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchAlarms();
  }, [currentPage, filters]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Alarm Management</h1>

      <FilterPanel onFilterChange={handleFilterChange} />

      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold">Alarms</h2>
        </Card.Header>
        <Card.Body className="p-0">
          <AlarmList alarms={alarms} loading={loading} />
        </Card.Body>
        <Card.Footer>
          <Pagination currentPage={currentPage} onPageChange={handlePageChange} />
        </Card.Footer>
      </Card>
    </div>
  );
};

export default AlarmListPage;
