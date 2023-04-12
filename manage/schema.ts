type ColumnTypes = {
  _namespace: string;
  _timestamp: string;
  hostname: string;
  zone: string;
  _source: string;
  "`string.names`": string;
  "`string.values`": string;
  "`number.names`": string;
  "`number.values`": string;
  "`bool.names`": string;
  "`bool.values`": string;
};

const columns: Record<keyof ColumnTypes, string> = {
  _namespace: "String",
  _timestamp: "Datetime",
  hostname: "String",
  zone: "String",
  _source: "String",

  "`string.names`": "Array(String)",
  "`string.values`": "Array(String)",
  "`number.names`": "Array(String)",
  "`number.values`": "Array(Float64)",
  "`bool.names`": "Array(String)",
  "`bool.values`": "Array(UInt8)",
};

export const COLUMNS_MAP = Object.entries(columns).map(
  ([key, value]) => `${key} ${value}`
);
