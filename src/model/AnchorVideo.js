export class AnchorVideoModel {
    constructor(
        id, 
        uid,
        title,
        create_time,
        comment_count,
        digg_count,
        aweme_id
    ) {
        this.id = id
        this.uid = uid
        this.title = title
        this.create_time = create_time
        this.comment_count = comment_count
        this.digg_count = digg_count
        this.aweme_id = aweme_id
    }
}