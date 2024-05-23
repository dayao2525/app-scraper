export class CollectionModel {
    constructor(
        id, 
        type,
        collection,
        appIds,
        updateTime
    ) {
        this.id = id
        this.type = type
        this.collection = collection
        this.appIds = appIds
        this.updateTime = updateTime
        
    }
}