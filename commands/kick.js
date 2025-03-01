const logger = require('../utils/logger');

module.exports = {
    name: 'kick',
    description: 'Kicks a user from the server',
    async execute(message, args) {
        // Prüfe Admin-Berechtigung
        if (!message.member.permissions.has('Administrator')) {
            return message.reply('Gomen ne~ Only administrators can use this command! (＞﹏＜)');
        }

        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('Ara ara~ Please mention a user to kick, Senpai! (｡•́︿•̀｡)');
        }

        const reason = args.slice(1).join(' ') || 'No reason provided';
        const member = message.guild.members.cache.get(user.id);

        try {
            await member.kick(reason);
            
            const kickEmbed = {
                color: 0xFFC0CB,
                title: '🌸 User has been Kicked! 🌸',
                description: `${user.tag} has been removed from the server! (｡•́︿•̀｡)`,
                fields: [
                    {
                        name: '💫 Reason',
                        value: reason || 'No reason provided desu~'
                    },
                    {
                        name: '👮 Kicked by',
                        value: `${message.author.tag} Senpai`
                    }
                ],
                footer: {
                    text: 'Protecting the server with kawaii power! ✨'
                },
                timestamp: new Date()
            };

            await message.channel.send({ embeds: [kickEmbed] });

            // Erweitertes Logging
            await logger.logAction(message.guild, {
                title: 'Member Kicked',
                description: `A member has been kicked from the server.`,
                color: 0xFF6B6B,
                targetUser: user,
                targetMember: member,
                moderator: message.author,
                moderatorMember: message.member,
                fields: [
                    {
                        name: '🎯 Action',
                        value: 'Kick',
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
                    }
                ]
            });

        } catch (error) {
            console.error(error);
            message.reply('Gomen nasai! I couldn\'t kick that user! Maybe they\'re too powerful for me? (╥﹏╥)');
        }
    },
}; 