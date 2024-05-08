import gplay from "google-play-scraper";
import Log from "../utils/Log.js";
import { sleep, createDir } from "../utils/index.js";
import { saveOrUpdate } from "../data-source.js";
import { osTypeEnum, country } from "../const.js";
import fs from "fs/promises";
import { resolve } from "path";

// const category = {
//     APPLICATION: 'APPLICATION',
//     ANDROID_WEAR: 'ANDROID_WEAR',
//     ART_AND_DESIGN: 'ART_AND_DESIGN',
//     AUTO_AND_VEHICLES: 'AUTO_AND_VEHICLES',
//     BEAUTY: 'BEAUTY',
//     BOOKS_AND_REFERENCE: 'BOOKS_AND_REFERENCE',
//     BUSINESS: 'BUSINESS',
//     COMICS: 'COMICS',
//     COMMUNICATION: 'COMMUNICATION',
//     DATING: 'DATING',
//     EDUCATION: 'EDUCATION',
//     ENTERTAINMENT: 'ENTERTAINMENT',
//     EVENTS: 'EVENTS',
//     FINANCE: 'FINANCE',
//     FOOD_AND_DRINK: 'FOOD_AND_DRINK',
//     HEALTH_AND_FITNESS: 'HEALTH_AND_FITNESS',
//     HOUSE_AND_HOME: 'HOUSE_AND_HOME',
//     LIBRARIES_AND_DEMO: 'LIBRARIES_AND_DEMO',
//     LIFESTYLE: 'LIFESTYLE',
//     MAPS_AND_NAVIGATION: 'MAPS_AND_NAVIGATION',
//     MEDICAL: 'MEDICAL',
//     MUSIC_AND_AUDIO: 'MUSIC_AND_AUDIO',
//     NEWS_AND_MAGAZINES: 'NEWS_AND_MAGAZINES',
//     PARENTING: 'PARENTING',
//     PERSONALIZATION: 'PERSONALIZATION',
//     PHOTOGRAPHY: 'PHOTOGRAPHY',
//     PRODUCTIVITY: 'PRODUCTIVITY',
//     SHOPPING: 'SHOPPING',
//     SOCIAL: 'SOCIAL',
//     SPORTS: 'SPORTS',
//     TOOLS: 'TOOLS',
//     TRAVEL_AND_LOCAL: 'TRAVEL_AND_LOCAL',
//     VIDEO_PLAYERS: 'VIDEO_PLAYERS',
//     WATCH_FACE: 'WATCH_FACE',
//     WEATHER: 'WEATHER',
//     GAME: 'GAME',
//     GAME_ACTION: 'GAME_ACTION',
//     GAME_ADVENTURE: 'GAME_ADVENTURE',
//     GAME_ARCADE: 'GAME_ARCADE',
//     GAME_BOARD: 'GAME_BOARD',
//     GAME_CARD: 'GAME_CARD',
//     GAME_CASINO: 'GAME_CASINO',
//     GAME_CASUAL: 'GAME_CASUAL',
//     GAME_EDUCATIONAL: 'GAME_EDUCATIONAL',
//     GAME_MUSIC: 'GAME_MUSIC',
//     GAME_PUZZLE: 'GAME_PUZZLE',
//     GAME_RACING: 'GAME_RACING',
//     GAME_ROLE_PLAYING: 'GAME_ROLE_PLAYING',
//     GAME_SIMULATION: 'GAME_SIMULATION',
//     GAME_SPORTS: 'GAME_SPORTS',
//     GAME_STRATEGY: 'GAME_STRATEGY',
//     GAME_TRIVIA: 'GAME_TRIVIA',
//     GAME_WORD: 'GAME_WORD',
//     FAMILY: 'FAMILY'
//   }

const category = gplay.category;
const collection = gplay.collection;

export async function run() {
  const DATA_PATH = resolve(`./data/android/${Date.now()}`);
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
      collection = gplay.collection.TOP_FREE,
      category,
      country = "us",
    } = options ?? {};

    Log.info(
      `开始采集google play, collection: ${collection}, category: ${category}, country: ${country}`
    );
    try {
      const rs = await gplay.list({
        collection,
        category,
        country,
        fullDetail: true,
        num: 500,
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
          await saveOrUpdate(rs[i], osTypeEnum.android);
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
        // 每一分钟抓一次
        await sleep(60000)
      }
    }
  }
}
