import { ClickHouse } from "./clickhouse.ts";
import { clickHouseOptions } from "./utils.ts";

async function main() {
  const input = {
    name: "josh",
    age: 30,
    address: { street: "123 main", city: "seattle" },
  };
  const flattenedJSON = insertJSONRow(input);

  const formattedRow = formatRowForInsert(flattenedJSON, input, {
    hostname: "mycpu",
  });

  console.log(formattedRow);
  const clickHouse = new ClickHouse(clickHouseOptions);
  await clickHouse.execute(formattedRow);
}

function formatRowForInsert(
  log: InsertJSONRowOutput,
  source: Record<string, unknown>,
  metadata: RowMetadata
) {
  const stringNames = log["string.names"].map((v) => `'${v}'`).join(",");
  const stringValues = log["string.values"].map((v) => `'${v}'`).join(",");
  const numberNames = log["number.names"].map((v) => `'${v}'`).join(",");
  const numberValues = log["number.values"].join(",");

  const valsForInsert = [stringNames, stringValues, numberNames, numberValues];
  const DBKeys = Object.keys(log)
    .concat(Object.keys(metadata))
    .concat(["_source"])
    .map((k) => `\`${k}\``);

  const insert = valsForInsert
    .map((v) => `[${v}]`)
    .concat(Object.values(metadata).map((v) => `'${v}'`))
    .concat(`'${JSON.stringify(source)}'`)
    .join(",");

  return `INSERT INTO default.myriad (${DBKeys}) VALUES (${insert})`;
}

// function formatDate(date: Date): string {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");
//   const hour = String(date.getHours()).padStart(2, "0");
//   const minute = String(date.getMinutes()).padStart(2, "0");
//   const second = String(date.getSeconds()).padStart(2, "0");

//   return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
// }

function flattenJSON(
  rawJSON: Record<string, unknown>,
  prefix = ""
): { [key: string]: unknown } {
  const result: { [key: string]: unknown } = {};

  for (const key in rawJSON) {
    if (typeof rawJSON[key] === "object" && !Array.isArray(rawJSON[key])) {
      const value = <unknown>rawJSON[key];
      const valuec = <Record<string, unknown>>value;
      const subResult = flattenJSON(valuec, `${prefix}${key}.`);
      Object.assign(result, subResult);
    } else {
      result[`${prefix}${key}`] = rawJSON[key];
    }
  }

  return result;
}

interface InsertJSONRowOutput {
  "string.names": string[];
  "string.values": string[];
  "number.names": string[];
  "number.values": number[];
}

interface RowMetadata {
  _source?: string;
  _timestamp?: Date;
  hostname?: string;
  zone?: string;
}

function insertJSONRow(rawJSON: Record<string, unknown>) {
  const flattened = flattenJSON(rawJSON);
  const output: InsertJSONRowOutput = {
    "string.names": [],
    "string.values": [],
    "number.names": [],
    "number.values": [],
  };

  for (const key in flattened) {
    if (typeof flattened[key] === "string") {
      const value = <unknown>flattened[key];
      const valuec = <string>value;
      output["string.names"].push(key);
      output["string.values"].push(valuec);
    } else if (typeof flattened[key] === "number") {
      const value = <unknown>flattened[key];
      const valuec = <number>value;
      output["number.names"].push(key);
      output["number.values"].push(valuec);
    }
  }

  return output;
}

main();
