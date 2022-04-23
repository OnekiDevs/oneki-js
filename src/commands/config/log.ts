import { Permissions, CommandInteraction, TextChannel, CategoryChannel } from 'discord.js'
import { permissionsError, Translator } from '../../utils/utils.js'
import { Client } from '../../utils/classes.js'

export function message_update(interaction: CommandInteraction<'cached'>) {
    const translate = Translator(interaction)
    const member = interaction.guild?.members.cache.get(interaction.user.id)
    const server = (interaction.client as Client).getServer(interaction.guild)
    if (!member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return permissionsError(interaction, Permissions.FLAGS.ADMINISTRATOR)
    const channel = interaction.options.getChannel('channel') as TextChannel
    server.setMessageUpdateLog(channel.id)
    interaction.reply(translate('config_cmd.set_log', { channel }))
}

export function message_delete(interaction: CommandInteraction<'cached'>) {
    const translate = Translator(interaction)
    const member = interaction.guild?.members.cache.get(interaction.user.id)
    const server = (interaction.client as Client).getServer(interaction.guild)
    if (!member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return permissionsError(interaction, Permissions.FLAGS.ADMINISTRATOR)
    const channel = interaction.options.getChannel('channel') as TextChannel
    server.setMessageDeleteLog(channel.id)
    interaction.reply(translate('config_cmd.set_log', { channel }))
}

export function message_attachment(interaction: CommandInteraction<'cached'>) {
    const translate = Translator(interaction)
    const member = interaction.guild?.members.cache.get(interaction.user.id)
    const server = (interaction.client as Client).getServer(interaction.guild)
    if (!member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return permissionsError(interaction, Permissions.FLAGS.ADMINISTRATOR)
    const channel = interaction.options.getChannel('channel') as TextChannel
    server.setMessageAttachmentLog(channel.id)
    interaction.reply(translate('config_cmd.set_log', { channel }))
}

export async function auto(interaction: CommandInteraction<'cached'>) {
    const member = interaction.guild?.members.cache.get(interaction.user.id)
    const server = (interaction.client as Client).getServer(interaction.guild)

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

export async function invites(interaction: CommandInteraction<'cached'>){
    await interaction.deferReply()
    const translate = Translator(interaction)
    const server = (interaction.client as Client).getServer(interaction.guild)
    
    if(!server.premium) return interaction.editReply(translate('premium'))

    const member = interaction.guild?.members.cache.get(interaction.user.id)
    if (!member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return permissionsError(interaction, Permissions.FLAGS.ADMINISTRATOR)

    const inviteChannel = interaction.options.getChannel('channel') as TextChannel
    server.setInviteChannel(inviteChannel.id)
    interaction.editReply(translate('config_cmd.invites.set_channel', { channel: inviteChannel?.toString() }))
}

export async function member_update(interaction: CommandInteraction<'cached'>){
    const translate = Translator(interaction)
    await interaction.deferReply()
    const server = (interaction.client as Client).getServer(interaction.guild)

    if(!server.premium) return interaction.editReply(translate('premium'))

    const member = interaction.guild?.members.cache.get(interaction.user.id)
    if (!member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return permissionsError(interaction, Permissions.FLAGS.ADMINISTRATOR)

    const userActivitieChannel = interaction.options.getChannel('channel') as TextChannel
    server.setMemberUpdateChannel(userActivitieChannel.id)
    interaction.editReply(translate('useractivitie_event.set_channel', { channel: userActivitieChannel.toString() }))
}

export async function sanction(interaction: CommandInteraction<'cached'>){
    const translate = Translator(interaction)
    await interaction.deferReply()
    const server = (interaction.client as Client).getServer(interaction.guild)

    const member = interaction.guild?.members.cache.get(interaction.user.id)
    if (!member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return permissionsError(interaction, Permissions.FLAGS.ADMINISTRATOR)

    const sanctionChannel = interaction.options.getChannel('channel') as TextChannel
    server.setSanctionChannel(sanctionChannel.id)
    interaction.editReply(translate('sanction_event.set_channel', { channel: sanctionChannel.toString() }))
}