import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { AudioOutputs } from "lavalink-client";

import type { CommandInteractionOptionResolver, GuildMember } from "discord.js";
import type { Command } from "../types/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("audio_output")
        .setDescription("Set the audio output channel")
        .addStringOption(o => o.setName("channel").setDescription("To what output-channel do you want to set the bot?").addChoices(
            { name: "Left", value: "left" },
            { name: "Right", value: "right" },
            { name: "Mono", value: "mono" },
            { name: "Stereo", value: "stereo" },
        )),
    execute: async (client, interaction) => {
        if (!interaction.guildId) return;

        const vcId = (interaction.member as GuildMember)?.voice?.channelId;
        if (!vcId) return interaction.reply({ flags: [MessageFlags.Ephemeral], content: "Join a Voice Channel " });

        const player = client.lavalink.getPlayer(interaction.guildId);
        if (!player) return interaction.reply({ flags: [MessageFlags.Ephemeral], content: "I'm not connected" });
        if (player.voiceChannelId !== vcId) return interaction.reply({ flags: [MessageFlags.Ephemeral], content: "You need to be in my Voice Channel" })

        await player.filterManager.setAudioOutput((interaction.options as CommandInteractionOptionResolver).getString("channel") as AudioOutputs);

        await interaction.reply({
            content: `Now playing from the \`${player.filterManager.filters.audioOutput} Audio-Channel\``
        })
    }

} as Command;
