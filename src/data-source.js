import { DataSource } from "typeorm";
import "reflect-metadata";
import { AppEntity } from "./entity/App.js";
import { AppModel } from "./model/App.js";
import { CollectionEntity } from "./entity/Collection.js";
import { AnchorEntity } from "./entity/Anchor.js";
import { AnchorVideoEntity } from "./entity/AnchorVideo.js";
import { osTypeEnum } from "./const.js";
import dotenv from "dotenv";
import { lookup } from "./utils/Lookup.js";

dotenv.config({ path: [".env.local", ".env"] });

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
};

export const AppDataSource = new DataSource({
  type: "mysql",
  ...dbConfig,
  synchronize: false,
  logging: ["error"],
  entities: [AppEntity, CollectionEntity, AnchorEntity, AnchorVideoEntity],
  subscribers: [],
  migrations: [],
});

export async function transactionHook(event) {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  // 开始事务：
  await queryRunner.startTransaction();

  try {
    await event();
    // 提交事务：
    await queryRunner.commitTransaction();
  } catch (err) {
    // 有错误做出回滚更改
    console.error(err);
    await queryRunner.rollbackTransaction();
  } finally {
    // you need to release query runner which is manually created:
    await queryRunner.release();
  }
}

export async function saveOrUpdate(items, type) {
  await lookup.run(() =>
    transactionHook(async () => {
      const repository = AppDataSource.getRepository("app");

      const saves = [];
      for (let i = 0, len = items.length; i < len; i++) {
        const item = items[i];
        const entiry = new AppModel();
        entiry.id = null;
        entiry.type = type;
        entiry.appId = item.appId;
        entiry.title = item.title || "";
        entiry.description = item.description || "";
        entiry.icon = item.icon || "";
        entiry.url = item.url || "";
        entiry.score = String(item.score ?? "");
        entiry.price = String(item.price ?? "");
        entiry.free = item.free;
        entiry.currency = item.currency || "";
        entiry.version = item.version || "";
        entiry.contentRating = item.contentRating || "";
        entiry.screenshots = item.screenshots.join(",");
        entiry.developerWebsite = item.developerWebsite || "";
        entiry.developerId = item.developerId || "";
        entiry.developer = item.developer || "";
        entiry.reviews = item.reviews ?? 0;
        entiry.released = item.released ?? "";
        entiry.country = item.__country;
        entiry.collection = item.__collection;
        entiry.category = item.__category;
        entiry.ratings = item.ratings ?? 0;
        entiry.histogram = JSON.stringify(item.histogram ?? {});
        entiry.raw = JSON.stringify(item);

        if (type === osTypeEnum.ios) {
          entiry.storeId = item.id;
          entiry.genre = (item.genres ?? []).join(",");
          entiry.genreId = (item.genreIds ?? []).join(",");
          entiry.ipadScreenshots = (item.ipadScreenshots ?? []).join(",");
          entiry.languages = (item.languages ?? []).join(",");
          entiry.size = String(item.size ?? "");
          entiry.updated = new Date(item.updated).getTime();
          entiry.requiredOsVersion = item.requiredOsVersion || "";
          entiry.supportedDevices = (item.supportedDevices ?? []).join(",");
          // 添加封面图
          // ios封面图就是icon字段去除最有一段/后面的内容，然后后面凭借/1200x630wa.png
          entiry.headerImage = item.icon.slice(0, item.icon.lastIndexOf('/')).concat('/1200x630wa.png')
        } else {
          entiry.genre = [item.genre].join(",");
          entiry.genreId = [item.genreId].join(",");
          entiry.requiredOsVersion = item.androidVersion || "";
          entiry.updated = item.updated;
          entiry.supportedDevices = "";
          entiry.size = "";
          entiry.languages = "";
          entiry.ipadScreenshots = "";
          entiry.storeId = 0;
          entiry.headerImage = item.headerImage
        }

        saves.push(entiry);
      }

      await repository
        .createQueryBuilder("app")
        .insert()
        .into("app")
        .values(saves)
        .orUpdate(
          [
            "storeId",
            "title",
            "description",
            "icon",
            "url",
            "score",
            "price",
            "free",
            "currency",
            "country",
            "genre",
            "genreId",
            "released",
            "updated",
            "version",
            "reviews",
            "contentRating",
            "size",
            "languages",
            "requiredOsVersion",
            "screenshots",
            "ipadScreenshots",
            "supportedDevices",
            "developerId",
            "developer",
            "developerWebsite",
            "collection",
            "category",
            "ratings",
            "histogram",
            "headerImage",
            "raw",
          ],
          ["uuid"]
        )
        .execute();
    })
  );
}

export async function saveOrUpdateCollection(type, collection, ids) {
  await lookup.run(() =>
    transactionHook(async () => {
      const repository = AppDataSource.getRepository("collection");

      let entiry = await repository.findOneBy({
        type,
        collection,
      });

      if (!entiry) {
        entiry = {};
        entiry.type = type;
        entiry.collection = collection;
      }
      entiry.appIds = ids.join(",");
      entiry.updateTime = Date.now();

      await repository.save(entiry);
    })
  );
}
