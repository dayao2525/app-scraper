export class AppModel {
    constructor(
        id, 
        storeId,
        type,
        appId,
        title,
        description,
        icon,
        url,
        score,
        price,
        free,
        currency,
        genre,
        genreId,
        released,
        updated,
        version,
        reviews,
        contentRating,
        size,
        languages,
        requiredOsVersion,
        screenshots,
        ipadScreenshots,
        supportedDevices,
        developerId,
        developer,
        developerWebsite,
        country,
        collection,
        category,
        ratings,
        histogram,
        headerImage,
        raw
    ) {
        this.id = id
        // storeId
        this.storeId = storeId
        this.type = type
        // 包名
        this.appId = appId
        // 名字
        this.title = title
        // 描述
        this.description = description
        // 图标路径
        this.icon = icon
        // 商店地址
        this.url = url
        // 评分
        this.score = score
        // 价格
        this.price = price
        // 是否免费
        this.free = free
        // 币种
        this.currency = currency
        // 类型, ios是数组
        this.genre = genre
        // 类型id, ios是数组
        this.genreId = genreId
        // 初始发布时间
        this.released = released
        // 最后更新时间时间戳
        this.updated = updated
        // 最新版本
        this.version = version
        // 评论数量
        this.reviews = reviews
        // 年龄评级
        this.contentRating= contentRating
        // 包大小
        // 只有ios有这个字段，字符串的数字类型
        this.size = size
        // 支持的语言
        this.languages = languages
        this.requiredOsVersion = requiredOsVersion
        // iphone or android封面图集合
        this.screenshots = screenshots
        // ipad封面图集合
        this.ipadScreenshots = ipadScreenshots
        // 支持的设备
        this.supportedDevices = supportedDevices
        // 开发者id
        this.developerId = developerId
        // 开发者名字
        this.developer = developer
        // 开发者网站
        this.developerWebsite = developerWebsite
        // 源数据
        this.raw = raw
        // 采集时的国家
        this.country = country
        // 采集时的集合类型
        this.collection = collection
        // 采集时的分类
        this.category = category
        this.histogram = histogram
        this.ratings = ratings
        this.headerImage = headerImage
    }
}