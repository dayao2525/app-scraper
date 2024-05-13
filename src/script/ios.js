import store from "app-store-scraper";

export const category = store.category;

export const collection = {
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


/**
 * 采集分类app
 * @param options IFnListOptions
 */
export async function scraper(options) {
  const {
    collection = collection.TOP_FREE_IOS,
    category,
    country = "us",
  } = options ?? {};

  return await store.list({
    collection,
    category,
    country,
    fullDetail: true,
    num: 200,
    throttle: 10,
  });

}

