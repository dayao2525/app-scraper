import puppeteer from "puppeteer";
import Log from "../utils/Log.js";
import { createDir } from "../utils/index.js";
import fs from "fs/promises";
import { resolve as pathResolve } from "path";
import UserAgent from "user-agents";

export async function run(users) {
  const result = [];

  const DATA_PATH = pathResolve(`./data/douyin/${Date.now()}`);
  await createDir(DATA_PATH);

  async function saveFetchData(filename, data, dir = DATA_PATH) {
    const file = pathResolve(dir, filename);
    return fs.writeFile(file, data, "utf-8").catch(console.error);
  }

  /**
   * 读取浏览器配置，
   * 写入cookie,和ua
   */
  async function getEnvInit() {
    const DATA_PATH = pathResolve(`./data/config`);
    await createDir(DATA_PATH);
    const filepath = pathResolve(DATA_PATH, "browser.json");
    try {
      const stats = await fs.stat(filepath);
      if (stats.isFile()) {
        const file = await fs.readFile(filepath, 'utf-8');
        return JSON.parse(file);
      }
    } catch (e) {
      console.log(e);
      await updateEnv({});
      return {};
    }
  }

  async function updateEnv(json) {
    const DATA_PATH = pathResolve(`./data/config`);
    await createDir(DATA_PATH);
    const filepath = pathResolve(DATA_PATH, "browser.json");
    fs.writeFile(filepath, JSON.stringify(json, null, 4), "utf-8").catch(
      console.error
    );
  }

  async function createPage(browser, user, onResponse) {
    const SAVE_PATH = pathResolve(DATA_PATH, `${user.name}`);
    await createDir(SAVE_PATH);

    const page = await browser.newPage();

    const config = await getEnvInit();
    if (!config.userAgent) {
      const userAgent = new UserAgent({ deviceCategory: "desktop" });
      const randomUserAgent = userAgent.toString();
      config.userAgent = randomUserAgent;
      updateEnv(config);
    }
    await page.setUserAgent(config.userAgent);

    if (config.cookies && config.cookies.length) {
      await page.setCookie(...config.cookies);
    }

    async function destory(e) {
      if (e) {
        await page.screenshot({
          path: pathResolve(SAVE_PATH, "error.png"),
        });
        throw e;
      }
      await browser.close();
    }

    // 监听是否数据加载成功
    page.on("response", async function (response) {
      const cookies = await page.cookies();
      if (cookies) {
        config.cookies = cookies;
        updateEnv(config);
      }
      const url = response.url();
      if (url.includes("https://www.douyin.com/aweme/v1/web/aweme/post/")) {
        try {
          const text = await response.text();

          if (response.ok()) {
            const json = text;
            // await saveFetchData(`${count}.json`, text, SAVE_PATH);

            if (json) {
              const res = JSON.parse(json);

              const list = res.aweme_list ?? [];

              list.forEach((item) => {
                result.push({
                  uid: user.id,
                  aweme_id: `douyin-${item.aweme_id}`,
                  create_time: item.create_time,
                  title: item.preview_title ?? '',
                  comment_count: item.statistics.comment_count,
                  digg_count: item.statistics.digg_count,
                });
              });
              typeof onResponse === "function" && onResponse(result, response);
              // 目前只能拿到一页的数据
              // resolve([result, browser]);
              //   console.log("是否有下一页", res.has_more);
              //   if (res.has_more) {
              //     count++;
              //     const acountCloseBtn = ".dy-account-close";
              //     await page.waitForSelector(acountCloseBtn);
              //     await page.click(acountCloseBtn);
              //     // 数据加载完后，模拟滚动到底部加载下一页数据
              //     setTimeout(async () => {
              //       await page.evaluate((_) => {
              //         window.scrollBy(
              //           0,
              //           document.body.scrollHeight -
              //             document.body.clientHeight
              //         );
              //       });
              //       console.log("scroll buttom");
              //       await page.screenshot({
              //         path: pathResolve(SAVE_PATH, "debug.png"),
              //       });
              //     }, 2000);
              //   } else {
              //     resolve(result);
              //   }
            } else {
              throw new Error("response error");
            }
          }
        } catch (e) {
          await destory(e);
        }
      } else if (
        url.includes("https://rmc.bytedance.com/verifycenter/captcha/")
      ) {
        await page.screenshot({
          path: pathResolve(SAVE_PATH, "captcha.png"),
        });
        // await destory(new Error("触发验证码，出错"));
      }
    });

    return {
      page
    }
  }

  async function scraper(browser, user) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!user) {
         
          throw new Error("用户不能为空");
        }
        console.log(`正在抓取用户数据， 用户: ${user.name}`);
        // 当前分页数量
        let count = 1;
        const { page } = await createPage(browser, user, (_result, response) => {
          console.log(
            `====== page: ${count} response ${response.ok()} ${response.status()}`
          );
          resolve(_result)
        });
    
  
        await page.goto(user.url);
      } catch (e) {
        reject(e);
      }
    });
  }

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: 1920,
      height: 800,
    },
    args: ['--proxy-server=39.108.224.245:1080'],
  });

  for (let i = 0, len = users.length; i < len; i++) {
    await scraper(browser, users[i])
  }
  browser.isConnected() && browser.close();
  return result;
}
