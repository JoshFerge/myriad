# Myriad

Open Source Log Storage / Querying platform Built on top of ClickHouse. Inspired by https://www.uber.com/blog/logging/




TODO 4/12:
- [ ] research ingestion tools more
- [ ] write ingest server in Typescript that takes freeform json and converts it into key / value arrays
- [ ] License
- [ ] research open source biz models
- [ ] determine API to link up with Grafana
- [ ] look into OpenAPI format // link up with chatGPT?
- [ ] support fluentd plugin
 -[ ] 


TODO 4/11:

- [x] Outline each individual component of system, and what it will be built in
- [x] Specify table schema
- [x] Dev environment / Docker Compose



Components:

- Ingester: Rust based clickhouse writes
- Index Optimizer: Typescript/Deno
- Query Service: Typescript/Deno
