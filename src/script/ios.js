import store from "app-store-scraper";
import Log from "../utils/Log.js";
import { sleep, createDir } from "../utils/index.js";
import { saveOrUpdate } from "../data-source.js";
import { osTypeEnum, country } from "../const.js";
import fs from "fs/promises";
import { resolve } from "path";

const category = store.category;
const collection = {
  NEW_IOS: "newapplications",
  NEW_FREE_IOS: "newfreeapplications",
  NEW_PAID_IOS: "newpaidapplications",
  TOP_FREE_IOS: "topfreeapplications",
  TOP_FREE_IPAD: "topfreeipadapplications",
  TOP_GROSSING_IOS: "topgrossingapplications",
  TOP_GROSSING_IPAD: "topgrossingipadapplications",
  TOP_PAID_IOS: "toppaidapplications",
  TOP_PAID_IPAD: "toppaidipadapplications",
};

export async function run() {
  const DATA_PATH = resolve(`./data/ios/${Date.now()}`);
  await createDir(DATA_PATH);

  async function saveFetchData(filename, data) {
    const file = resolve(DATA_PATH, filename);
    return fs.writeFile(file, data, "utf-8").catch(console.error);
  }

  /**
   * 采集分类app
   * @param options IFnListOptions
   */
  async function scraper(options) {
    const {
      collection = collection.TOP_FREE_IOS,
      category,
      country = "us",
    } = options ?? {};

    Log.info(
      `开始采集app store, collection: ${collection}, category: ${category}, country: ${country}`
    );
    try {
      const rs = await store.list({
        collection,
        category,
        country,
        fullDetail: true,
        num: 200,
      });

      if (rs && rs.length) {
        await saveFetchData(
          `${country}-${category}-${collection}.json`,
          JSON.stringify(rs, null, 4)
        );
        for (let i = 0, len = rs.length; i < len; i++) {
          // 扩展国家字段，用于入库
          rs[i].__country = country;
          rs[i].__collection = collection;
          rs[i].__category = category;
          await saveOrUpdate(rs[i], osTypeEnum.ios);
        }
      }
      Log.info(`采集完成，已采集${rs.length}条数据`);
    } catch (e) {
      await saveFetchData(
        `error-${country}-${category}-${collection}.log`,
        e.stack ?? e.message
      );
    }
  }

  // 按国家采集
  for (let i = 0, len = country.length; i < len; i++) {
    for (let [_key, cateVal] of Object.entries(category)) {
      for (let [_colKey, colVal] of Object.entries(collection)) {
        await scraper({
          collection: colVal,
          category: cateVal,
          country: String(country[i].value).toLocaleLowerCase(),
        });
        // 每二十秒抓一次
        await sleep(20000);
      }
    }
  }
}
