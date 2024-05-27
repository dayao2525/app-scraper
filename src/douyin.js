/**
 * 采集抖音列表
 */

import "reflect-metadata";
import { AppDataSource } from "./data-source.js";
import { run } from "./script/douyin.js"
import { AnchorVideoEntity } from "./entity/AnchorVideo.js"

AppDataSource.initialize()
  .then(async () => {
    console.time("douyin");

    // 默认用户列表
    const defaultUserList = [
      {
        name: "LA宝总",
        type: "douyin",
        url: "https://www.douyin.com/user/MS4wLjABAAAAQmR09rGSVExGc-QlVz5OXHgkH73drE4zWY1bDqiMuco",
      }
    ];
    // 这里需要传入表名字
    const repository = AppDataSource.getRepository("anchor");

    for (let i = 0, len = defaultUserList.length; i < len; i++) {
      const user = defaultUserList[i];

      let entiry = await repository.findOneBy({
        type: user.type,
        name: user.name,
      });

      if (!entiry) {
        await repository.save(user);
      }
    }
    const users = await repository.find();
    const result = await run(users);
    await saveOrUpdate(result);
    
    console.timeEnd("douyin");
  })
  .catch((error) => console.log(error))
  .finally(() => {
    AppDataSource.destroy();
  });


  export async function saveOrUpdate(list) {
    // const updates = await AppDataSource.createQueryBuilder()
    // .insert()
    // .into('anchor_video')
    // .values(list)
    // .orUpdate(
    //   ['title', 'create_time', 'comment_count', 'digg_count'],
    //   ['uid', 'title', 'id'],
    //   {
    //   skipUpdateIfNoValuesChanged: true
    // })
    // .orIgnore()
    // .execute();
    // console.log(updates)
    const repository = AppDataSource.getRepository("anchor_video")
    const saves = []
    for(let i=0,len = list.length; i< len ;i++) {
      const item = list[i];
      let entiry = await repository.findOneBy({
          uid: item.uid,
          title: item.title
      })
     
      entiry = {
        ...entiry,
        ...item,
      }
      saves.push(entiry);
    }

    await repository.save(saves)
    
}
