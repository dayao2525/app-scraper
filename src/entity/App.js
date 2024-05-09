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
      default: "",
    },
    appId: {
      type: "varchar",
      default: "",
    },
    title: {
      type: "text",
    },
    description: {
      type: "text",
    },
    icon: {
      type: "text",
    },
    url: {
      type: "text",
    },
    score: {
      type: "float",
      default: 0,
    },
    price: {
      type: "float",
      default: 0,
    },
    free: {
      type: "bool",
      default: true,
    },
    currency: {
      type: "text",
    },
    genre: {
      type: "text",
    },
    genreId: {
      type: "text",
    },
    released: {
      type: "text",
    },
    updated: {
      type: "bigint",
      default: 0,
    },
    version: {
      type: "text",
    },
    reviews: {
      type: "bigint",
      default: 0,
    },
    contentRating: {
      type: "text",
    },
    size: {
      type: "float",
      default: 0,
    },
    languages: {
      type: "text",
    },
    requiredOsVersion: {
      type: "text",
    },
    screenshots: {
      type: "text",
    },
    ipadScreenshots: {
      type: "text",
    },
    supportedDevices: {
      type: "text",
    },
    developerId: {
      type: "text",
    },
    developer: {
      type: "text",
    },
    developerWebsite: {
      type: "text",
    },
    country: {
      type: "text",
    },
    collection: {
      type: "text",
    },
    category: {
      type: "text",
    },
    raw: {
      type: "text",
    },
  },
});
