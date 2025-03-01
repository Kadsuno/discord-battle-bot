const logger = require('../utils/logger');

module.exports = {
    name: 'ban',
    description: 'Bans a user from the server',
    async execute(message, args) {
        // Prüfe Admin-Berechtigung
        if (!message.member.permissions.has('Administrator')) {
            return message.reply('Gomen nasai! You need admin powers to use this command, Senpai! (＞﹏＜)');
        }

        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('Eh?! I need to know who to ban, Senpai! Please mention them~ (｡•́︿•̀｡)');
        }

        const reason = args.slice(1).join(' ') || 'No reason provided';
        const member = message.guild.members.cache.get(user.id);

        try {
            await message.guild.members.ban(user, { reason });
            
            const banEmbed = {
                color: 0xFFC0CB,
                title: '🌸 User has been Banned! 🌸',
                description: `${user.tag} has been banished from our kawaii server! (｡•́︿•̀｡)`,
                fields: [
                    {
                        name: '💫 Reason',
                        value: reason || 'No reason provided desu~'
                    },
                    {
                        name: '👮 Banned by',
                        value: `${message.author.tag} Senpai`
                    }
                ],
                footer: {
                    text: 'Protecting our server with love and determination! ✨'
                },
                timestamp: new Date()
            };

            await message.channel.send({ embeds: [banEmbed] });

            // Erweitertes Logging
            await logger.logAction(message.guild, {
                title: 'Member Banned',
                description: `A member has been banned from the server.`,
                color: 0xFF0000,
                targetUser: user,
                targetMember: member,
                moderator: message.author,
                moderatorMember: message.member,
                fields: [
                    {
                        name: '🎯 Action',
                        value: 'Ban',
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
            message.reply('Uwaa~ I couldn\'t ban that user! Maybe they have special protection? (╥﹏╥)');
        }
    },
}; 