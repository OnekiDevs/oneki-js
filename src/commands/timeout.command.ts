import { ApplicationCommandDataResolvable, CommandInteraction, GuildMember } from 'discord.js'
import { Command, Client, CommandType } from '../utils/classes.js'
import { Translator } from '../utils/utils.js'
import ms from 'iblazingx-ms'

export default class Ban extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'timeout',
            description: 'Timeout a memeber',
            defaultPermission: false,
            type: CommandType.guild
        })
    }

    async getData(): Promise<ApplicationCommandDataResolvable> {
        return this.baseCommand
            .addUserOption(option => option.setName('member').setDescription('The member to timeout').setRequired(true))
            .addStringOption(option => option.setName('time').setDescription('The time to timeout').setRequired(true))
            .addStringOption(option => option.setName('reason').setDescription('The reason to timeout'))
            .toJSON()
    }

    async run(interaction: CommandInteraction<'cached'>) {
        const member = interaction.options.getMember('member') as GuildMember
        const reason = interaction.options.getString('reason') as string
        const time = ms(interaction.options.getString('time') as string)
        const translate = Translator(interaction)

        if (interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0)
            return interaction.reply({
                content: translate('timeout_cmd.user_permissions'),
                ephemeral: true
            })

        await member.timeout(time, reason)

        interaction.reply(translate('timeout_cmd.reply', { user: member }))

        //TODO Implementar notas aqui
    }
}
