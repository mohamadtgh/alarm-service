import { Table, Badge, Button } from "@rewind-ui/core";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import type { Alarm } from "../types";

interface AlarmListProps {
  alarms: Alarm[];
  loading: boolean;
}

const AlarmList = ({ alarms, loading }: AlarmListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (alarms.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No alarms found</p>
      </div>
    );
  }

  return (
    <Table striped hoverable>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Timestamp</Table.Th>
          <Table.Th>Type</Table.Th>
          <Table.Th>Sensor</Table.Th>
          <Table.Th>Visualizations</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {alarms.map((alarm) => (
          <Table.Tr key={alarm.id}>
            <Table.Td>
              <div className="flex flex-col">
                <span>{new Date(alarm.timestamp).toLocaleString()}</span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(alarm.timestamp), { addSuffix: true })}
                </span>
              </div>
            </Table.Td>
            <Table.Td>
              <Badge color={getAlarmTypeColor(alarm.type)} size="md">
                {alarm.type}
              </Badge>
            </Table.Td>
            <Table.Td>{alarm.sensorId}</Table.Td>
            <Table.Td>{alarm.visualizations && alarm.visualizations.length}</Table.Td>
            <Table.Td>
              <Link to={`/alarm/${alarm.id}`}>
                <Button size="sm" color="blue">
                  View Details
                </Button>
              </Link>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};

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

export default AlarmList;
