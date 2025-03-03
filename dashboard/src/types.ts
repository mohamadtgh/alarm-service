export interface Alarm {
  id?: number;
  timestamp: string;
  type: string;
  sensorId: number;
  visualizations: Visualization[];
}

export interface Visualization {
  id?: number;
  alarmId: number;
  imageBase64: string;
  timestamp: string;
}

export interface FilterOptions {
  sensorId: number;
  type: string;
  dateRange: string;
}
