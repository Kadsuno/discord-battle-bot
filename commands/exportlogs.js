const { AttachmentBuilder } = require('discord.js');

module.exports = {
    name: 'exportlogs',
    description: 'Export mod logs to file',
    async execute(message, args) {
        if (!message.member.permissions.has('Administrator')) {
            return message.reply('Gomen ne~ Only administrators can export logs, Senpai! (＞﹏＜)');
        }

        // Finde den Log-Kanal
        const logChannel = message.guild.channels.cache.find(channel => channel.name === 'mod-logs');
        if (!logChannel) {
            return message.reply('Ara ara~ I couldn\'t find the mod-logs channel! (╥﹏╥)');
        }

        // Lade-Nachricht
        const loadingMsg = await message.channel.send('(＾▽＾) Preparing your logs export, Senpai~ Please wait desu!');

        try {
            let searchCriteria = {};
            let timeFrame = null;

            // Parse Suchkriterien
            if (args.length >= 2) {
                const [type, ...value] = args;
                switch(type.toLowerCase()) {
                    case 'user':
                        const user = message.mentions.users.first();
                        if (user) searchCriteria.user = user.tag;
                        break;
                    case 'action':
                        searchCriteria.action = value.join(' ');
                        break;
                    case 'time':
                        const timeValue = value[0].toLowerCase();
                        switch(timeValue) {
                            case '24h': timeFrame = 24 * 60 * 60 * 1000; break;
                            case '7d': timeFrame = 7 * 24 * 60 * 60 * 1000; break;
                            case '30d': timeFrame = 30 * 24 * 60 * 60 * 1000; break;
                        }
                        break;
                }
            }

            // Hole die letzten 100 Nachrichten
            const messages = await logChannel.messages.fetch({ limit: 100 });
            let logs = [];

            messages.forEach(msg => {
                if (!msg.embeds.length) return;
                const embed = msg.embeds[0];

                // Filtere nach Suchkriterien
                let shouldInclude = true;
                if (searchCriteria.user && !embed.fields.some(f => f.value.includes(searchCriteria.user))) {
                    shouldInclude = false;
                }
                if (searchCriteria.action && !embed.fields.some(f => 
                    f.name === '🎯 Action' && f.value.toLowerCase().includes(searchCriteria.action.toLowerCase())
                )) {
                    shouldInclude = false;
                }
                if (timeFrame) {
                    const embedTime = new Date(embed.timestamp).getTime();
                    if (Date.now() - embedTime > timeFrame) {
                        shouldInclude = false;
                    }
                }

                if (shouldInclude) {
                    // Formatiere Log-Eintrag
                    const logEntry = {
                        timestamp: new Date(embed.timestamp).toISOString(),
                        action: embed.fields.find(f => f.name === '🎯 Action')?.value || 'N/A',
                        target: embed.fields.find(f => f.name === '👤 User Information')?.value || 'N/A',
                        moderator: embed.fields.find(f => f.name === '👮 Moderator Information')?.value || 'N/A',
                        reason: embed.fields.find(f => f.name === '📝 Reason')?.value || 'N/A'
                    };
                    logs.push(logEntry);
                }
            });

            if (logs.length === 0) {
                await loadingMsg.delete();
                return message.reply('Gomen nasai! I couldn\'t find any logs matching your criteria! (｡•́︿•̀｡)');
            }

            // Erstelle CSV-Inhalt
            const csvHeader = 'Timestamp,Action,Target,Moderator,Reason\n';
            const csvContent = logs.map(log => 
                `"${log.timestamp}","${log.action}","${log.target.replace(/"/g, '""')}","${log.moderator.replace(/"/g, '""')}","${log.reason.replace(/"/g, '""')}"`
            ).join('\n');

            const csvData = csvHeader + csvContent;
            const buffer = Buffer.from(csvData, 'utf-8');
            const attachment = new AttachmentBuilder(buffer, { name: `modlogs_${Date.now()}.csv` });

            // Sende Export
            const exportEmbed = {
                color: 0xFFC0CB,
                title: '🌸 Logs Export Ready! 🌸',
                description: `Yatta! I've prepared your logs export, Senpai! (＾▽＾)ノ`,
                fields: [
                    {
                        name: '📊 Statistics',
                        value: `Total Entries: ${logs.length}\nTime Range: ${timeFrame ? args[1] : 'All available'}\nFormat: CSV`
                    },
                    {
                        name: '💫 Note',
                        value: 'The file contains all matching logs in a spreadsheet-friendly format desu~'
                    }
                ],
                footer: {
                    text: `Exported with love for ${message.author.tag} ✨`
                },
                timestamp: new Date()
            };

            await loadingMsg.delete();
            await message.channel.send({ 
                embeds: [exportEmbed],
                files: [attachment]
            });

        } catch (error) {
            console.error(error);
            await loadingMsg.delete();
            message.reply('Gomen gomen! Something went wrong with the export! (╥﹏╥) Please try again later, Senpai!');
        }
    },
}; 