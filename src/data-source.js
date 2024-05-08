import { DataSource } from "typeorm"
import "reflect-metadata"
import { AppEntity } from "./entity/App.js"
import { osTypeEnum } from "./const.js"
import dotenv from "dotenv";

dotenv.config({ path: [".env.local", ".env"] });

const dbConfig = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
}


export const AppDataSource = new DataSource({
    type: "mysql",
    ...dbConfig,
    synchronize: true,
    logging: ["error"],
    entities: [AppEntity],
    subscribers: [],
    migrations: [],
})

export async function saveOrUpdate(item, type) {
    // 这里需要传入表名字
    const repository = AppDataSource.getRepository("app")

    // 同一个国家的app才是唯一
    let entiry = await repository.findOneBy({
        appId: item.appId,
        country: item.__country
    })
    let isUpdate = true;

    if(!entiry) {
        isUpdate = false;
        entiry = {}
    }
    entiry.type = type
    entiry.appId = item.appId
    entiry.title = item.title
    entiry.description = item.description
    entiry.icon = item.icon
    entiry.url = item.url
    entiry.score = item.score
    entiry.price = item.price
    entiry.free = item.free
    entiry.currency = item.currency
    entiry.version = item.version
    entiry.contentRating = item.contentRating
    entiry.screenshots = item.screenshots.join(',')
    entiry.developerWebsite = item.developerWebsite
    entiry.developerId = item.developerId
    entiry.developer = item.developer
    entiry.reviews = item.reviews
    entiry.released = item.released
    entiry.country = item.__country
    entiry.collection = item.__collection
    entiry.category = item.__category
    entiry.raw = JSON.stringify(item)

    if (type === osTypeEnum.ios) {
        entiry.storeId = item.id;
        entiry.genre = item.genres.join(',')
        entiry.genreId = item.genreIds.join(',')
        entiry.ipadScreenshots = item.ipadScreenshots.join(',')
        entiry.languages = item.languages.join(',')
        entiry.size = item.size
        entiry.updated = new Date(item.updated).getTime()
        entiry.requiredOsVersion = item.requiredOsVersion
        entiry.supportedDevices = item.supportedDevices.join(',')
    } else {
        entiry.genre = [item.genre].join(',')
        entiry.genreId = [item.genreId].join(',')
        entiry.requiredOsVersion = item.androidVersion
        entiry.updated = item.updated
        entiry.supportedDevices = ''
        entiry.size = 0
        entiry.languages = ''
        entiry.ipadScreenshots = ''
        entiry.storeId = 0
    }
    await repository.save(entiry)
}