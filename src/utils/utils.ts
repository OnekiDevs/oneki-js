import {
    PermissionResolvable,
    CommandInteraction,
    TextChannel,
    GuildMember,
    Permissions,
    MessageAttachment,
    MessageEmbed
} from 'discord.js'
import Client from './classes'

export function capitalize(input: string): string {
    return (
        input.substring(0, 1).toUpperCase() + input.substring(1).toLowerCase()
    )
}

export function permissionsError(
    interaction: CommandInteraction,
    permissions: PermissionResolvable[] | PermissionResolvable
): any {
    return interaction.reply({
        content: `No tiienes los permissions suficientes, necesitas \`${
            Array.isArray(permissions)
                ? permissions.map((p) => p).join('`, `')
                : permissions.toString()
        }\``,
        ephemeral: true,
    })
}

export function checkSend(channel: TextChannel, member: GuildMember): boolean {
    return channel
        .permissionsFor(member)
        .has([Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.VIEW_CHANNEL])
}

/**
 * generate a string barr progges
 * @param current the current percentage to show
 * @param length the length of the barr
 * @returns a string bar
 */
export function filledBar(current: number, length = 25): string {
    const progress = Math.round(length * (current / 100))
    const emptyProgress = length - progress
    const progressText = '█'.repeat(progress)
    const emptyProgressText = ' '.repeat(emptyProgress)
    return progressText + emptyProgressText
}

export const pollEmojis = [
    '🇦',
    '🇧',
    '🇨',
    '🇩',
    '🇪',
    '🇫',
    '🇬',
    '🇭',
    '🇮',
    '🇯',
    '🇰',
    '🇱',
    '🇲',
    '🇳',
    '🇴',
    '🇵',
    '🇶',
    '🇷',
    '🇸',
    '🇹',
]

export function randomId() {
    return Math.random().toString().slice(-8)
}

export function imgToLink(img: Buffer, client: Client): Promise<string> {
    return new Promise(async (resolve, reject) => {
        const channel = client.channels.cache.get(client.constants.imgChannel!)

        let msg
        if (channel)
            msg = await (channel as TextChannel).send({
                files: [new MessageAttachment(img)],
            })
        else reject('No channel')

        if (msg) resolve(msg.attachments.first()!.url)
        else reject('No message')
    })
}

export async function sendError(client: Client, error: Error, file: string) {
    console.log(
        '\x1b[31m%s\x1b[0m',
        '*****************************************************************\n',
        error,
        '\x1b[31m%s\x1b[0m',
        '*****************************************************************'
    )
    const channel = await client.channels.fetch(client.constants.errorChannel as string)
    if (channel) (channel as TextChannel).send({
        content: process.env.NODE_ENV!=='production'?process.env.DEVELOPER_ID?`<@${process.env.DEVELOPER_ID}>`:null:`<@&${client.constants.jsDiscordRoll}>`,
        embeds: [
            new MessageEmbed()
                .setColor('YELLOW')
                .setTitle('New Error Detected')
                .addField('Error Type', '```cmd\n' + error.name + '\n```', true)
                .addField('Error Message', '```cmd\n' + error.message + '\n```', true)
                .addField('Error In', '```cmd\n'+file+'\n```', true),
            new MessageEmbed()
                .setColor('YELLOW')
                .setTitle('Error Stack')
                .setDescription(`\`\`\`cmd\n${error.stack}\n\`\`\``),
        ],
    })
}
