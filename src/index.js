import "reflect-metadata";
import { AppDataSource } from "./data-source.js";
import { run as runAndroid } from "./script/android.js";
import { run as runIos } from "./script/ios.js";

// to initialize the initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
AppDataSource.initialize()
  .then(async () => {
    // here you can start to work with your database
    console.time('all');
    await Promise.allSettled([runIos(), runAndroid()]);
    console.timeEnd('all');
  })
  .catch((error) => console.log(error))
  .finally(() => {
    process.exit(0);
  });
