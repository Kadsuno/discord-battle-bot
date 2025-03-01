const logger = require('../utils/logger');

module.exports = {
    name: 'timeout',
    description: 'Timeouts a user',
    async execute(message, args) {
        // Prüfe Admin-Berechtigung
        if (!message.member.permissions.has('Administrator')) {
            return message.reply('Gomen ne~ You need admin privileges to timeout users, Senpai! (＞﹏＜)');
        }

        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('Ano... Who should I timeout, Senpai? Please mention them~ (｡•́︿•̀｡)');
        }

        // Standard-Timeout-Zeit: 5 Minuten
        const minutes = parseInt(args[1]) || 5;
        // Maximum 28 Tage (Discord Limit)
        if (minutes > 40320) {
            return message.reply('The maximum timeout duration is 28 days! (｡•́︿•̀｡)');
        }

        const member = message.guild.members.cache.get(user.id);
        const reason = args.slice(2).join(' ') || 'No reason provided';

        try {
            await member.timeout(minutes * 60 * 1000, reason);
            
            const timeoutEmbed = {
                color: 0xFFC0CB,
                title: '🌸 Time-Out Time! 🌸',
                description: `${user.tag} needs some quiet time to reflect! (｡•́︿•̀｡)`,
                fields: [
                    {
                        name: '⏰ Duration',
                        value: `${minutes} minutes desu~`
                    },
                    {
                        name: '💫 Reason',
                        value: reason || 'No reason provided desu~'
                    },
                    {
                        name: '👮 Timed out by',
                        value: `${message.author.tag} Senpai`
                    }
                ],
                footer: {
                    text: 'Taking care of the server with kawaii justice! ✨'
                },
                timestamp: new Date()
            };

            await message.channel.send({ embeds: [timeoutEmbed] });

            // Erweitertes Logging
            await logger.logAction(message.guild, {
                title: 'Member Timed Out',
                description: `A member has been timed out.`,
                color: 0xFFA500,
                targetUser: user,
                targetMember: member,
                moderator: message.author,
                moderatorMember: message.member,
                fields: [
                    {
                        name: '🎯 Action',
                        value: 'Timeout',
                        inline: true
                    },
                    {
                        name: '⏱️ Duration',
                        value: `${minutes} minutes`,
                        inline: true
                    },
                    {
                        name: '📝 Reason',
                        value: reason,
                        inline: true
                    },
                    {
                        name: '📍 Channel',
                        value: `${message.channel.name} (${message.channel.id})`,
                        inline: true
                    },
                    {
                        name: '🕒 Expires',
                        value: `<t:${Math.floor((Date.now() + minutes * 60 * 1000) / 1000)}:F>`,
                        inline: true
                    }
                ]
            });

        } catch (error) {
            console.error(error);
            message.reply('Gomen gomen! I couldn\'t timeout that user! Maybe they\'re too powerful for me? (╥﹏╥)');
        }
    },
}; 