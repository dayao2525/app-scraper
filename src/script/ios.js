import store from 'app-store-scraper';
import fs from 'fs/promises'

store.list({
    collection: store.collection.TOP_FREE_IOS,
    num: 200,
    // fullDetail: true,
  })
  .then((rs)=> {
    console.log('rs', toString.call(rs), rs.length);
    fs.writeFile('2.json', JSON.stringify(rs, null, 4), 'utf-8');
    for(let i = 0; i< 4; i++) {
        const app = rs[i]
        store.app({id: app.id, ratings: true}).then((app)=> {
            console.log(app)
        fs.writeFile(`app_${app.id}.json`, JSON.stringify(app, null, 4), 'utf-8');
         }).catch(console.log);
    }


  })
  .catch(console.log);