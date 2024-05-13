import "reflect-metadata";
import { AppDataSource } from "./data-source.js";
import { run } from "./script/index.js";
import { osTypeEnum } from "./const.js";

AppDataSource.initialize()
  .then(async () => {
    console.time('all');
    await Promise.allSettled([
      run(osTypeEnum.ios),
      run(osTypeEnum.android)
    ]);
    console.timeEnd('all');
  })
  .catch((error) => console.log(error))
  .finally(() => {
    process.exit(0);
  });
