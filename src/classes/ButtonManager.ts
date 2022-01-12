import fs from "fs";
import { Collection } from "discord.js";
import { Button, Client } from "../utils/classes";
import { join } from "path";

export class ButtonManager extends Collection<string, Button> {
    constructor(client: Client, path: string) {
        super();
        for (const file of fs.readdirSync(path).filter((f) => f.endsWith(".button.js"))) {
            const button = require(join(path, file));

            const btn: Button = new button.default();
            this.set(btn.name, btn);
        }

        client.on('interactionCreate', (interaction) => {
            if (interaction.isButton()) {
                
                const name = this.getName(interaction.customId)
                if (name) this.get(name)?.run(interaction)
                else interaction.deferUpdate()
            }
        })
    }

    getName(customId: string): string | null {
        const btn = this.find((b) => b.regex.test(customId));
        return btn?.name ?? null;
    }
}
