/**
 * 执行最新app, game列表
 */

import "reflect-metadata";
import { AppDataSource } from "./data-source.js";
import { run } from "./script/index.js";
import { osTypeEnum } from "./const.js";

AppDataSource.initialize()
  .then(async () => {
    console.time('top');
    await Promise.allSettled([
      run(osTypeEnum.ios, true),
      run(osTypeEnum.android, true)
    ]);
    console.timeEnd('top');
  })
  .catch((error) => console.log(error))
  .finally(() => {
    AppDataSource.destroy();
  });
