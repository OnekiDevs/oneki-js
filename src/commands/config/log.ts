import { Permissions, CommandInteraction, TextChannel, CategoryChannel } from 'discord.js'
import { permissionsError } from '../../utils/utils.js'
import { Client } from '../../utils/classes.js'

export function message_update(interaction: CommandInteraction<'cached'>) {
    const member = interaction.guild?.members.cache.get(interaction.user.id)
    let server = (interaction.client as Client).servers.get(interaction.guildId)
    if (!server) server = (interaction.client as Client).newServer(interaction.guild)
    if (!member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return permissionsError(interaction, Permissions.FLAGS.ADMINISTRATOR)
    const channel = interaction.options.getChannel('channel') as TextChannel
    server.setMessageUpdateLog(channel.id)
    interaction.reply(server.translate('config_cmd.set_log', { channel }))
}

export function message_delete(interaction: CommandInteraction<'cached'>) {
    const member = interaction.guild?.members.cache.get(interaction.user.id)
    let server = (interaction.client as Client).servers.get(interaction.guildId)
    if (!server) server = (interaction.client as Client).newServer(interaction.guild)
    if (!member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return permissionsError(interaction, Permissions.FLAGS.ADMINISTRATOR)
    const channel = interaction.options.getChannel('channel') as TextChannel
    server.setMessageDeleteLog(channel.id)
    interaction.reply(server.translate('config_cmd.set_log', { channel }))
}

export function message_attachment(interaction: CommandInteraction<'cached'>) {
    const member = interaction.guild?.members.cache.get(interaction.user.id)
    let server = (interaction.client as Client).servers.get(interaction.guildId)
    if (!server) server = (interaction.client as Client).newServer(interaction.guild)
    if (!member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return permissionsError(interaction, Permissions.FLAGS.ADMINISTRATOR)
    const channel = interaction.options.getChannel('channel') as TextChannel
    server.setMessageAttachmentLog(channel.id)
    interaction.reply(server.translate('config_cmd.set_log', { channel }))
}

export async function auto(interaction: CommandInteraction<'cached'>) {
    const member = interaction.guild?.members.cache.get(interaction.user.id)
    let server = (interaction.client as Client).servers.get(interaction.guildId)
    if (!server) server = (interaction.client as Client).newServer(interaction.guild)

    if (!member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return permissionsError(interaction, Permissions.FLAGS.ADMINISTRATOR)
    const category = (interaction.options.getChannel('category') ?? interaction.guild.channels.create('logs', {
        type: 4,
        permissionOverwrites: [{
            id: interaction.guildId,
            deny: 'VIEW_CHANNEL',
            type: 'role'
        }]
    })) as CategoryChannel

    const cm = await category.createChannel('messages', {
        type: 0
    })
    server.setMessageDeleteLog(cm.id)
    server.setMessageUpdateLog(cm.id)

    const ca = await category.createChannel('attachments', {
        type: 0,
        nsfw: true
    })
    server.setMessageAttachmentLog(ca.id)
}