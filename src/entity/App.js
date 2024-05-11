import { EntitySchema } from "typeorm";
import { AppModel } from "../model/App.js";

export const AppEntity = new EntitySchema({
  name: "App",
  tableName: "app",
  target: AppModel,
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    storeId: {
      type: "bigint",
      comment: "appstore id, gooleplay没有该字段",
      default: 0,
    },
    type: {
      type: "varchar",
      comment: "app类型, ios或android",
      default: "",
    },
    appId: {
      type: "varchar",
      comment: "包名",
      default: "",
    },
    title: {
      type: "text",
      comment: "标题",
    },
    description: {
      type: "text",
      comment: "描述",
    },
    icon: {
      type: "text",
      comment: "图表路径",
    },
    url: {
      type: "text",
      comment: "详情页路径",
    },
    score: {
      type: "text",
      comment: "评分",
    },
    price: {
      type: "text",
      comment: "价格",
    },
    free: {
      type: "bool",
      comment: "是否免费",
      default: true,
    },
    currency: {
      type: "text",
      comment: "币种",
    },
    genre: {
      type: "text",
      comment: "分类名称，以英文逗号(,)分割，有多个",
    },
    genreId: {
      type: "text",
      comment: "分类id，以英文逗号(,)分割，有多个",
    },
    released: {
      type: "text",
      comment: "上线时间"
    },
    updated: {
      type: "bigint",
      default: 0,
      comment: "最近更新时间，毫秒时间戳"
    },
    version: {
      type: "text",
      comment: "版本号"
    },
    reviews: {
      type: "bigint",
      default: 0,
      comment: "评分人数"
    },
    contentRating: {
      type: "text",
      comment: "年龄评级"
    },
    size: {
      type: "text",
      comment: "安装包大小"
    },
    languages: {
      type: "text",
      comment: "支持的语言，以英文逗号(,)分割，有多个"
    },
    requiredOsVersion: {
      type: "text",
      comment: "最低系统版本"
    },
    screenshots: {
      type: "text",
      comment: "手机端介绍图，以英文逗号(,)分割，有多个"
    },
    ipadScreenshots: {
      type: "text",
      comment: "ipad端介绍图，以英文逗号(,)分割，有多个"
    },
    supportedDevices: {
      type: "text",
      comment: "支持的设备，以英文逗号(,)分割，有多个"
    },
    developerId: {
      type: "text",
      comment: "开发者id"
    },
    developer: {
      type: "text",
      comment: "开发者名字"
    },
    developerWebsite: {
      type: "text",
      comment: "开发者网站"
    },
    country: {
      type: "text",
      comment: "发行的国家或地区"
    },
    collection: {
      type: "text",
      comment: "采集时的列表（最新，或最热等）"
    },
    category: {
      type: "text",
      comment: "采集时的分类"
    },
    raw: {
      type: "text",
      comment: "采集时的原始json数据"
    },
  },
});
