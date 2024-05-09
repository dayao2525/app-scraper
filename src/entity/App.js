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
      type: "varchar",
      default: "",
    },
    description: {
      type: "text",
    },
    icon: {
      type: "varchar",
      default: "",
    },
    url: {
      type: "varchar",
      default: "",
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
      type: "varchar",
      default: "",
    },
    genre: {
      type: "text",
      default: "",
    },
    genreId: {
      type: "text",
      default: "",
    },
    released: {
      type: "varchar",
      default: "",
    },
    updated: {
      type: "bigint",
      default: 0,
    },
    version: {
      type: "varchar",
      default: "",
    },
    reviews: {
      type: "int",
      default: 0,
    },
    contentRating: {
      type: "varchar",
      default: "",
    },
    size: {
      type: "float",
      default: 0,
    },
    languages: {
      type: "text",
    },
    requiredOsVersion: {
      type: "varchar",
      default: "",
    },
    screenshots: {
      type: "text",
    },
    ipadScreenshots: {
      type: "text",
    },
    supportedDevices: {
      type: "text",
      default: "",
    },
    developerId: {
      type: "varchar",
      default: "",
    },
    developer: {
      type: "varchar",
      default: "",
    },
    developerWebsite: {
      type: "varchar",
      default: "",
    },
    country: {
      type: "text",
      default: "",
    },
    collection: {
      type: "varchar",
      default: "",
    },
    category: {
      type: "varchar",
      default: "",
    },
    raw: {
      type: "text",
    },
  },
});
