const logger = require('../utils/logger');

module.exports = {
    name: 'searchlogs',
    description: 'Search through mod logs',
    async execute(message, args) {
        // Nur Admins dürfen suchen
        if (!message.member.permissions.has('Administrator')) {
            return message.reply('Gomen! Only administrators can search the logs! (＞﹏＜)');
        }

        // Finde den Log-Kanal
        const logChannel = message.guild.channels.cache.find(channel => channel.name === 'mod-logs');
        if (!logChannel) {
            return message.reply('Gomen! I couldn\'t find the mod-logs channel! (╥﹏╥)');
        }

        if (args.length < 2) {
            return message.reply(`
Konnichiwa! Let me help you search through the logs, Senpai! (＾▽＾)ノ

Here's how you can use my search powers desu~:
🌸 \`!searchlogs user @mention\` - I'll find all logs about this user!
🌸 \`!searchlogs mod @mention\` - I'll show you what this moderator has been up to!
🌸 \`!searchlogs action ban/kick/timeout\` - I'll look for specific actions!
🌸 \`!searchlogs reason keyword\` - I'll search through all the reasons!
🌸 \`!searchlogs time 24h/7d/30d\` - I'll time travel through the logs~

Need any help, Senpai? Just ask! (｡♥‿♥｡)
            `);
        }

        const searchType = args[0].toLowerCase();
        const searchValue = args.slice(1).join(' ');
        
        try {
            // Hole die letzten 100 Nachrichten aus dem Log-Kanal
            const messages = await logChannel.messages.fetch({ limit: 100 });
            let filteredLogs = [];

            // Kawaii Lade-Nachricht
            const loadingMsg = await message.channel.send('(＾▽＾) Searching through the logs~ Please wait desu!');

            // Filtere die Logs basierend auf dem Suchtyp
            messages.forEach(msg => {
                if (!msg.embeds.length) return;
                const embed = msg.embeds[0];

                switch(searchType) {
                    case 'user':
                        const mentionedUser = message.mentions.users.first();
                        if (mentionedUser && embed.fields.some(field => 
                            field.value.includes(mentionedUser.id) || 
                            field.value.includes(mentionedUser.tag)
                        )) {
                            filteredLogs.push(embed);
                        }
                        break;

                    case 'mod':
                        const mentionedMod = message.mentions.users.first();
                        if (mentionedMod && embed.footer.text.includes(mentionedMod.tag)) {
                            filteredLogs.push(embed);
                        }
                        break;

                    case 'action':
                        if (embed.fields.some(field => 
                            field.name === '🎯 Action' && 
                            field.value.toLowerCase().includes(searchValue.toLowerCase())
                        )) {
                            filteredLogs.push(embed);
                        }
                        break;

                    case 'reason':
                        if (embed.fields.some(field => 
                            field.name === '📝 Reason' && 
                            field.value.toLowerCase().includes(searchValue.toLowerCase())
                        )) {
                            filteredLogs.push(embed);
                        }
                        break;

                    case 'time':
                        const embedTime = new Date(embed.timestamp).getTime();
                        const now = Date.now();
                        let timeFrame;
                        
                        switch(searchValue.toLowerCase()) {
                            case '24h': timeFrame = 24 * 60 * 60 * 1000; break;
                            case '7d':  timeFrame = 7 * 24 * 60 * 60 * 1000; break;
                            case '30d': timeFrame = 30 * 24 * 60 * 60 * 1000; break;
                            default: timeFrame = 24 * 60 * 60 * 1000;
                        }

                        if (now - embedTime <= timeFrame) {
                            filteredLogs.push(embed);
                        }
                        break;
                }
            });

            // Lösche Lade-Nachricht
            await loadingMsg.delete();

            if (filteredLogs.length === 0) {
                return message.reply('Gomen ne~ I couldn\'t find any logs matching your search! (｡•́︿•̀｡) Maybe try a different search?');
            }

            // Erstelle Kawaii Zusammenfassungs-Embed
            const summaryEmbed = {
                color: 0xFFC0CB,
                title: '🌸 Yatta! Here\'s What I Found! 🌸',
                description: `I found ${filteredLogs.length} logs that match your search, Senpai! (＾▽＾)ノ`,
                fields: [
                    {
                        name: '🔍 Your Search Parameters',
                        value: `Type: ${searchType}\nValue: ${searchValue}\n(｡♥‿♥｡)`,
                        inline: false
                    }
                ],
                footer: {
                    text: `Searched with love for ${message.author.tag} 💕`
                },
                timestamp: new Date()
            };

            // Füge die ersten 5 Ergebnisse hinzu
            filteredLogs.slice(0, 5).forEach((log, index) => {
                summaryEmbed.fields.push({
                    name: `✨ Result ${index + 1}`,
                    value: `🎯 Action: ${log.fields.find(f => f.name === '🎯 Action')?.value || 'N/A'}\n` +
                           `⏰ Time: ${new Date(log.timestamp).toLocaleString()}\n` +
                           `📝 Details: ${log.description}`,
                    inline: false
                });
            });

            if (filteredLogs.length > 5) {
                summaryEmbed.fields.push({
                    name: '💫 Note',
                    value: `Showing 5/${filteredLogs.length} results desu~\nIf you need more specific results, try refining your search, Senpai! (＾▽＾)ノ`,
                    inline: false
                });
            }

            await message.channel.send({ embeds: [summaryEmbed] });

        } catch (error) {
            console.error(error);
            message.reply('Gomen nasai! Something went wrong while searching! (╥﹏╥) Please try again later, Senpai!');
        }
    },
}; 