import { TextChannel, GuildMember, EmbedBuilder, Message } from 'discord.js'
import { checkSend, sendError } from '../utils/utils.js'
import client from '../client.js'

export default async function (msg: Message<true>) {
    try {
        if (!msg.guild) return
        if (!client.servers.has(msg.guild.id)) return
        const server = client.getServer(msg.guild)
        if (!server?.logsChannels.Attachment) return
        if (msg.channel.id === server.logsChannels.Attachment) return
        const channel: TextChannel = client.channels.cache.get(server.logsChannels.Attachment) as TextChannel
        if (channel && checkSend(channel, msg.guild?.members.me as GuildMember)) {
            channel.send({
                files: msg.attachments.map(attachment => attachment),
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`attachments sent by ${msg.member?.displayName}`)
                        .setThumbnail(msg.member?.displayAvatarURL() as string)
                        .addFields({
                            name: 'Canal',
                            value: '```' + `${msg.channel} | ${msg.channel.name}` + '```'
                        })
                        .setURL(msg.url)
                ],
                content: msg.author.id
            })
        } else {
            if (
                msg.guild?.publicUpdatesChannel &&
                checkSend(msg.guild?.publicUpdatesChannel, msg.guild.members.me as GuildMember)
            )
                msg.guild?.publicUpdatesChannel.send({
                    content: `El canal <#${server.logsChannels.messageDelete}> esta configurado para mostrar logs de Attachments, sin embargo no tengo acceso a ese canal o no existe.\nSe eliminara de la configuracion, para volver a activarlo debe ejecutar el comando **/config log message_attachment** nuevamente`
                })
            else {
                const channel = msg.guild.channels.cache.find(
                    c => c.isTextBased() && checkSend(c as TextChannel, msg.guild?.members.me as GuildMember)
                )
                if (channel)
                    (channel as TextChannel).send(
                        `El canal <#${server.logsChannels.messageDelete}> esta configurado para mostrar logs de attachments, sin embargo no tengo acceso a ese canal o no existe.\nSe eliminara de la configuracion, para volver a activarlo debe ejecutar el comando **/config log message_attachment** nuevamente`
                    )
            }
            server.removeMessageDeleteLog()
        }
    } catch (error) {
        sendError(error as Error, import.meta.url)
    }
}
