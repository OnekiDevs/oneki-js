import { Guild, GuildMember, EmbedBuilder, TextChannel } from 'discord.js'
import { Client, Server } from '../utils/classes.js'
import { checkSend, sendError, Util } from '../utils/utils.js'

export default async function (guild: Guild) {
    try {
        if (!(guild.client as Client).servers.has(guild.id))
            (guild.client as Client).servers.set(guild.id, new Server(guild))
        console.log('\x1b[34m%s\x1b[0m', `Nuevo Servidor Desplegado!! ${guild.name} (${guild.id})`)
        ;(guild.client as Client).commands
            .deploy(guild)
            .then(() => console.log('\x1b[32m%s\x1b[0m', 'Comandos Desplegados para ' + guild.name))
        const channel = (guild.client as Client).channels.cache.get(
            (guild.client as Client).constants.newServerLogChannel ?? ''
        ) as TextChannel
        if (channel && checkSend(channel, guild.members.me as GuildMember)) {
            const [u, b] = guild.members.cache.partition(m => !m.user.bot)!
            const owner = await (guild.client as Client).users.fetch(guild.ownerId)
            const embed = new EmbedBuilder()
                .setThumbnail(guild.iconURL() ?? '')
                .setTitle('Me añadieron en un Nuevo Servidor')
                .setDescription(`ahora estoy en ${(guild.client as Client).guilds.cache.size} servidores`)
                .addFields(
                    {
                        name: 'Servidor',
                        value: Util.escapeCodeBlock(guild.name),
                        inline: true
                    },
                    {
                        name: 'ID',
                        value: Util.escapeCodeBlock(guild.id),
                        inline: true
                    },
                    {
                        name: 'Roles',
                        value: Util.escapeCodeBlock(String(guild.roles.cache.size)),
                        inline: true
                    },
                    {
                        name: 'Miembros',
                        value: Util.escapeCodeBlock(`Users: ${u.size}\nBots: ${b.size}`),
                        inline: true
                    },
                    {
                        name: 'Dueño',
                        value: Util.escapeCodeBlock(`${owner.tag}\n${owner.id}`),
                        inline: true
                    }
                )
                .setTimestamp()
                .setColor(Util.resolveColor('Random'))
                .setFooter((guild.client as Client).embedFooter)
                .setImage(guild.bannerURL() ?? '')
            channel.send({
                embeds: [embed]
            })
        }
    } catch (error) {
        sendError(guild.client as Client, error as Error, import.meta.url)
    }
}
