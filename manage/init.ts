import { ClickHouse } from "./clickhouse.ts";
import { COLUMNS_MAP } from "./schema.ts";
import { clickHouseOptions } from "./utils.ts";

async function main() {
  const clickHouse = new ClickHouse(clickHouseOptions);
  await clickHouse.execute(`DROP TABLE IF EXISTS myriad`);

  await clickHouse.execute(
    `CREATE TABLE IF NOT EXISTS myriad (${COLUMNS_MAP}) ENGINE = Memory`
  );

  const res = await clickHouse.execute("select * from myriad FORMAT JSON");
  console.log(res);
}

main();
