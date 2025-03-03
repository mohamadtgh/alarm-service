"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Badge, Button } from "@rewind-ui/core";
import VisualizationGallery from "../components/VisualizationGallery";
import type { Alarm } from "../types";
import APIClient from "../api/client";
import { BaseAPIUrl } from "../constants";

const AlarmDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [alarm, setAlarm] = useState<Alarm | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      return;
    }
    const apiClient = new APIClient(BaseAPIUrl);
    const fetchAlarm = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<Alarm>(`/alarms/${id}`);
        const { data, error } = response;
        if (error) {
          console.error(response.error);
          return;
        }

        setAlarm(data as Alarm);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchAlarm();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!alarm) {
    return (
      <Card className="text-center py-8">
        <p className="text-red-500 mb-4">{"Alarm not found"}</p>
        <Link to="/">
          <Button color="blue">Back to Alarms</Button>
        </Link>
      </Card>
    );
  }

  // Helper function to get color based on alarm type
  const getAlarmTypeColor = (type: string): "red" | "yellow" | "green" | "blue" => {
    switch (type.toLowerCase()) {
      case "critical":
        return "red";
      case "warning":
        return "yellow";
      case "info":
        return "blue";
      case "resolved":
        return "green";
      default:
        return "blue";
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link to="/">
          <Button color="white">Back to Alarms</Button>
        </Link>
      </div>

      <Card className="mb-6">
        <Card.Header>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Alarm Details</h2>
            <Badge color={getAlarmTypeColor(alarm.type)} size="lg">
              {alarm.type}
            </Badge>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Alarm ID</p>
              <p className="font-medium">{alarm.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Timestamp</p>
              <p className="font-medium">{new Date(alarm.timestamp).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sensor ID</p>
              <p className="font-medium">{alarm.sensorId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Visualizations</p>
              <p className="font-medium">{alarm.visualizations && alarm.visualizations.length}</p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {alarm.visualizations && <VisualizationGallery visualizations={alarm.visualizations} />}
    </div>
  );
};

export default AlarmDetailPage;
