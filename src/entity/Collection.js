import { EntitySchema } from "typeorm";
import { CollectionModel } from "../model/Collection.js";

export const CollectionEntity = new EntitySchema({
    name: "Collection",
    tableName: "collection",
    target: CollectionModel,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        type: {
            type: "varchar",
            comment: "app类型, ios或android",
            default: "",
        },
        /**
         * 
           安卓： 
           export enum collection {
                TOP_FREE = 'TOP_FREE',
                TOP_PAID = 'TOP_PAID',
                GROSSING = 'GROSSING',
            }

            ios:
            export const collection = {
                TOP_FREE_IOS: "topfreeapplications",
                TOP_FREE_IPAD: "topfreeipadapplications",
                TOP_GROSSING_IOS: "topgrossingapplications",
                TOP_GROSSING_IPAD: "topgrossingipadapplications",
                TOP_PAID_IOS: "toppaidapplications",
                TOP_PAID_IPAD: "toppaidipadapplications",
            };
         */
        collection: {
            type: "varchar",
            comment: "集合类型",
            default: "",
        },
        appIds: {
            type: "text",
            comment: "包名集合，逗号分隔",
        },
        updateTime: {
            type: "bigint",
            default: 0,
            comment: "最后更新时间",
        },
    },
});
