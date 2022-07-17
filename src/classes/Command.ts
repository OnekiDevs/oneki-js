import { Local } from '../utils/classes.js'
import client from '../client.js'
import { Translator } from '../utils/utils.js'
import {
    ChatInputCommandInteraction,
    AutocompleteInteraction,
    ModalSubmitInteraction,
    SelectMenuInteraction,
    PermissionsBitField,
    SlashCommandBuilder,
    ButtonInteraction,
    Message,
    Guild,
    ApplicationCommandOptionType,
    ChannelType,
    ApplicationCommandType
} from 'discord.js'

export class Command {
    hibrid = false
    name: string
    description: string
    local_names: Local
    local_descriptions: Local
    translator = Translator
    global = true
    options: CommandOptions[] = []
    dm = true
    permissions: PermissionsBitField | null = null

    constructor({
        name,
        description,
        global = true,
        options = [],
        dm = true,
        permissions,
        hibrid = false
    }: cmdOptions) {
        this.name = name['en-US']
        this.description = description['en-US']
        this.local_names = name
        this.local_descriptions = description
        this.global = global
        this.options = options
        this.dm = dm
        this.hibrid = hibrid
        if (permissions) this.permissions = permissions
    }

    /**
     * It creates a command object for the command, and then adds it to the command store
     * @param {Guild} [guild] - The guild to deploy the command to. If this is not provided, the command will be deployed to all guilds.
     * @returns A promise that resolves to an array of commands.
     */
    async deploy(guild?: Guild) {
        console.log(`Deploying command ${this.name}`)

        if (this.global) {
            await this.createData()
            return client.application.commands.create(this.data).catch(console.error)
        }
        if (guild) {
            await this.createData(guild)
            return guild.commands.create(this.data).catch((e: Error) => {
                if (e.message.includes('Missing Access')) console.log('Missing Access on', guild.name, guild.id)
                else console.error(e)
            })
        }
        return Promise.all(
            client.guilds.cache.map(async guild => {
                await this.createData(guild)
                return guild.commands.create(this.data).catch(e => {
                    if (e.message.includes('Missing Access')) console.log('Missing Access on', guild.name, guild.id)
                    // else console.error(e)
                })
            })
        )
    }

    /**
     * It returns the data of the command.
     * @returns {ApplicationCommandDataResolvable} The data is being returned as a JSON object.
     */
    get data() {
        const command: any = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .setNameLocalizations(this.local_names)
            .setDescriptionLocalizations(this.local_descriptions)
            .setDefaultMemberPermissions(this.permissions?.bitfield ?? 0)
            .setDMPermission(this.dm)
            .toJSON()

        command.options = this.parseOption(this.options)

        return command
    }

    parseOption(option: CommandOptions[] = []): any {
        return option.map(o => ({
            ...o,
            name_localizations: o.name,
            name: o.name['en-US'],
            description_localizations: o.description,
            description: o.description['en-US'],
            choices:
                o.type === 3 || o.type === 4 || o.type === 10
                    ? o.choices?.map(c => ({
                          ...c,
                          name_localizations: typeof c.name === 'string' ? null : c.name,
                          name: typeof c.name === 'string' ? c.name : c.name['en-US'],
                          value: c.value
                      }))
                    : null,
            options: 'options' in o ? this.parseOption(o.options) : undefined
        }))
    }

    /**
     * It proces and modify the data of the command.
     * @param {Guild} [guild] - The guild to create the data for.
     */
    async createData(guild?: Guild) {}

    async interacion(interaction: ChatInputCommandInteraction<'cached'>): Promise<any> {
        return interaction.deferReply()
    }

    async message(message: Message<true>, args: string[]): Promise<any> {
        return message
    }

    async button(interaction: ButtonInteraction<'cached'>): Promise<any> {
        return interaction.deferUpdate()
    }

    async select(interacion: SelectMenuInteraction<'cached'>): Promise<any> {
        return interacion.deferUpdate()
    }

    async autocomplete(interacion: AutocompleteInteraction<'cached'>): Promise<any> {
        return interacion
    }

    async modal(interaction: ModalSubmitInteraction<'cached'>): Promise<any> {
        return interaction.deferReply()
    }

    /**
     * It adds an option to the command and returns the Command class.
     * @param {ApplicationCommandOption} option - The option to add to the command.
     * @returns {Command} The ApplicationCommand object
     */
    //addOption(option: ApplicationCommandOption)
    addOption(option: CommandOptions) {
        if (this.options.find(o => o.name === option.name)) {
            const i = this.options.findIndex(o => o.name === option.name)
            this.options.splice(i, 1, option)
        } else this.options.push(option)
        return this
    }

    /**
     * It clears the options array and returns the object
     * @returns {Command} The object itself.
     */
    clearOptions() {
        this.options = []
        return this
    }
}

// export interface hybrid extends Message<true>

interface cmdOptions {
    name: Local
    description: Local
    /** @default true */
    global?: boolean
    options?: CommandOptions[]
    /** @default true */
    dm?: boolean
    permissions?: PermissionsBitField
    /** @default false */
    hibrid?: boolean
}

export interface ChoicesIntegerCommandOption {
    name: Local | string
    value: number
}

export interface ChoicesStringCommandOption {
    name: Local | string
    value: string
}

export interface BaseCommandOption {
    name: Local
    description: Local
    required?: boolean
}

export interface SubcommandCommandOptions {
    type: ApplicationCommandOptionType.Subcommand
    name: Local
    description: Local
    options?: CommandOptions[]
}

export interface SubcommandGroupCommandOptions {
    type: ApplicationCommandOptionType.SubcommandGroup
    options?: SubcommandCommandOptions[]
    name: Local
    description: Local
}

export interface StringCommandOptions extends BaseCommandOption {
    type: ApplicationCommandOptionType.String
    choices?: ChoicesStringCommandOption[]
    autocomplete?: boolean
    min_length?: number
    max_length?: number
}

export interface IntegerCommandOptions extends BaseCommandOption {
    type: ApplicationCommandOptionType.Integer
    choices?: ChoicesIntegerCommandOption[]
    min_value?: number
    max_value?: number
}

export interface BooleanCommandOptions extends BaseCommandOption {
    type: ApplicationCommandOptionType.Boolean
}

export interface UserCommandOptions extends BaseCommandOption {
    type: ApplicationCommandOptionType.User
}

export interface ChannelCommandOptions extends BaseCommandOption {
    type: ApplicationCommandOptionType.Channel
    channel_types?: ChannelType[]
}

export interface RoleCommandOptions extends BaseCommandOption {
    type: ApplicationCommandOptionType.Role
}

export interface MentionableCommandOptions extends BaseCommandOption {
    type: ApplicationCommandOptionType.Mentionable
}

export interface NumberCommandOptions extends BaseCommandOption {
    type: ApplicationCommandOptionType.Number
    min_value?: number
    max_value?: number
    choices?: ChoicesIntegerCommandOption[]
}

export interface AttachmentCommandOptions extends BaseCommandOption {
    type: ApplicationCommandOptionType.Attachment
}

export type CommandOptions =
    | SubcommandCommandOptions
    | SubcommandGroupCommandOptions
    | StringCommandOptions
    | IntegerCommandOptions
    | BooleanCommandOptions
    | UserCommandOptions
    | ChannelCommandOptions
    | RoleCommandOptions
    | MentionableCommandOptions
    | NumberCommandOptions
    | AttachmentCommandOptions

export type ApiCommand = {
    name: string
    description: string
    name_localizations?: Local
    description_localizations?: Local
    type: ApplicationCommandType
    options?: CommandOptions[]
    default_member_permissions?: string
    dm_permission?: boolean
    default_permission?: boolean
}
