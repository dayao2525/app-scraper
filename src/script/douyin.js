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

  async function scraper(user) {
    return new Promise(async (resolve, reject) => {
      const SAVE_PATH = pathResolve(DATA_PATH, `${user.name}`);
      await createDir(SAVE_PATH);

      const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: {
          width: 1920,
          height: 800,
        },
        args: ['--proxy-server=39.108.224.245:1080'],
      });
      const page = await browser.newPage();

      const userAgent = new UserAgent({ deviceCategory: "desktop" });
      const randomUserAgent = userAgent.toString();
      console.log(randomUserAgent);

      await page.setUserAgent(randomUserAgent);

      async function destory(e) {
        if (e) {
          await page.screenshot({
            path: pathResolve(SAVE_PATH, "error.png"),
          });
          reject(e);
        }
        await browser.close();
      }
      try {
        if (!user) {
          throw new Error("用户不能为空");
        }
        console.log(`正在抓取用户数据， 用户: ${user.name}`);
        // 当前分页数量
        let count = 1;
        // 监听是否数据加载成功
        page.on("response", async function (response) {
          const url = response.url();
          if (url.includes("https://www.douyin.com/aweme/v1/web/aweme/post/")) {
            try {
              console.log(
                `====== page: ${count} response ${response.ok()} ${response.status()}`
              );
              const text = await response.text();

              if (response.ok()) {
                const json = text;
                // await saveFetchData(`${count}.json`, text, SAVE_PATH);

                if (json) {
                  const response = JSON.parse(json);

                  const list = response.aweme_list ?? [];

                  list.forEach((item) => {
                    result.push({
                      uid: user.id,
                      aweme_id: `douyin-${item.aweme_id}`,
                      create_time: item.create_time,
                      title: item.preview_title,
                      comment_count: item.statistics.comment_count,
                      digg_count: item.statistics.digg_count,
                    });
                  });

                  // 目前只能拿到一页的数据
                  resolve([result, browser]);
                  //   console.log("是否有下一页", response.has_more);
                  //   if (response.has_more) {
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

        await page.goto(user.url);
      } catch (e) {
        browser.isConnected() && (await destory(e));
      }
    });
  }

  for (let i = 0, len = users.length; i < len; i++) {
    const [_result, browser] = await scraper(users[i]);
    await browser.close();
  }
  // await saveFetchData("done.json", JSON.stringify(result, null, 4));
  return result;
}
