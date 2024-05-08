import fs from 'fs/promises'
import { dirname } from 'path'

export function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, time ?? 2000)
    })
}

// 递归创建目录
export async function createDir(dir) {
    try {
      const stat = await fs.stat(dir);
      if (!stat.isDirectory()) {
        throw new Error("is not a directory");
      }
    } catch (e) {
      await createDir(dirname(dir))
      await fs.mkdir(dir);
    }
  }