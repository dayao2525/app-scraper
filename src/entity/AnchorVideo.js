import { EntitySchema } from "typeorm";
import { AnchorVideoModel } from "../model/AnchorVideo.js";

// 标题，发布时间，评论数量，点赞数量
export const AnchorVideoEntity = new EntitySchema({
    name: "AnchorVideo",
    tableName: "anchor_video",
    target: AnchorVideoModel,
    uniques: [
        {
            name: 'uid-title',
            columns: ['uid', 'title']
        }
    ],
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        uid: {
            type: "int",
            comment: "主播表对应id"
        },
        title: {
            type: "varchar",
            comment: "视频标题",
        },
        create_time: {
            type: "int",
            comment: "发布时间",
            default: 0,
        },
        comment_count: {
            type: "int",
            comment: "评论数量",
            default: 0,
        },
        digg_count: {
            type: "int",
            comment: "点赞数量",
            default: 0,
        },
        aweme_id: {
            type: 'varchar',
            comment: '视频唯一id',
            default: ''
        }
    },
});
