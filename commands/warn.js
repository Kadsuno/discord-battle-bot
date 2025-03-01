const Warns = require('../models/Warns');

module.exports = {
    name: 'warn',
    description: 'Warn a user',
    async execute(message, args) {
        if (!message.member.permissions.has('Administrator')) {
            return message.reply('Gomen ne~ Only administrators can warn users, Senpai! (＞﹏＜)');
        }

        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('Ara ara~ Who should I warn, Senpai? Please mention them! (｡•́︿•̀｡)');
        }

        const reason = args.slice(1).join(' ') || 'No reason provided desu~';
        
        // Hole oder erstelle Warn-Daten
        let warns = await Warns.findOne({ userId: user.id, guildId: message.guild.id });
        if (!warns) {
            warns = new Warns({
                userId: user.id,
                guildId: message.guild.id,
                warnings: []
            });
        }

        // Füge Warnung hinzu
        warns.warnings.push({
            reason: reason,
            moderator: message.author.id,
            timestamp: new Date()
        });
        await warns.save();

        // Auto-Timeout nach X Warnungen
        if (warns.warnings.length >= 3) {
            const member = message.guild.members.cache.get(user.id);
            await member.timeout(60 * 60 * 1000, 'Received 3 warnings');
        }

        const warnEmbed = {
            color: 0xFFC0CB,
            title: '⚠️ Warning Issued! ⚠️',
            description: `${user.tag} has been warned! Please be more careful next time! (｡•́︿•̀｡)`,
            fields: [
                {
                    name: '💫 Reason',
                    value: reason
                },
                {
                    name: '📊 Total Warnings',
                    value: `${warns.warnings.length} warnings desu~`
                }
            ],
            footer: {
                text: 'Remember to follow the rules with love! ✨'
            }
        };

        await message.channel.send({ embeds: [warnEmbed] });
    }
}; 