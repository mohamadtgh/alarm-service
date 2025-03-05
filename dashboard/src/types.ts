export enum AlarmTypes {
  Type1 = "1",
  Type2 = "2",
  Type3 = "3",
}

export interface Alarm {
  id?: number;
  timestamp: string;
  type: AlarmTypes;
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
  sensorId?: number;
  type?: AlarmTypes;
}

export const parseAlarmType = (type: AlarmTypes): string => {
  switch (type) {
    case AlarmTypes.Type1:
      return "Type 1";
    case AlarmTypes.Type2:
      return "Type 2";
    case AlarmTypes.Type3:
      return "Type 3";
    default:
      return "Unknown";
  }
};
