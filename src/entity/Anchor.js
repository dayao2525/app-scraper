import { EntitySchema } from "typeorm";
import { AnchorModel } from "../model/Anchor.js";

export const AnchorEntity = new EntitySchema({
    name: "Anchor",
    tableName: "anchor",
    target: AnchorModel,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "text",
            comment: "主播用户名",
        },
        url: {
            type: "text",
            comment: "主播主页地址",
        },
        type: {
            type: "varchar",
            comment: "平台类型",
            default: "douyin"
        }
    },
});
