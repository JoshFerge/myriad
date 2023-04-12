import { ClickHouse, ClickHouseOptions } from "./clickhouse.ts";
import { COLUMNS_MAP } from "./schema.ts";

const clickHouseOptions: ClickHouseOptions = {
  url: "http://localhost:8123",
  user: "default",
  password: "",
  database: "default",
};

async function main() {
  const clickHouse = new ClickHouse(clickHouseOptions);
  await clickHouse.execute(`DROP TABLE IF EXISTS myriad`);

  await clickHouse.execute(
    `CREATE TABLE IF NOT EXISTS myriad (${COLUMNS_MAP}) ENGINE = Memory`
  );

  await clickHouse.execute(testInsertData());

  const res = await clickHouse.execute("select * from myriad FORMAT JSON");
  console.log(res);
}

function testInsertData() {
  const ts = formatDate(new Date());
  return `INSERT INTO myriad (_namespace, _timestamp,hostname,zone) VALUES ('global','${ts}','vm1','us-central1' )`;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

main();
