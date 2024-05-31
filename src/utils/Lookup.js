
 class Lookup {
    pending = false
    queue = []
    async run(event) {
        this.queue.push(event)
        return this.loop()
    }
    async loop() {
        if(this.pending) {
            await sleep(0);
            return this.loop();
        }
        const event = this.queue.shift();
        this.pending = true;
        const rs = await event();
        this.pending = false;
        return rs;
     }
 }

 export const lookup = new Lookup()