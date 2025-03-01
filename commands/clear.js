module.exports = {
    name: 'clear',
    description: 'Clears messages',
    async execute(message) {
        // Prüfe Berechtigungen
        if (!message.member.permissions.has('ManageMessages')) {
            return message.reply('Gomen ne~ You don\'t have permission to use this command! (＞﹏＜)');
        }

        if (!message.guild.members.me.permissions.has('ManageMessages')) {
            return message.reply('Gomen! I don\'t have permission to delete messages! (╥﹏╥)');
        }

        try {
            // Lösche die Command-Nachricht
            await message.delete();

            // Lösche die letzte Nachricht
            const messages = await message.channel.messages.fetch({ limit: 1 });
            await message.channel.bulkDelete(messages);

            // Sende Bestätigung
            const clearEmbed = {
                color: 0xFFC0CB,
                title: 'Clear',
                description: 'Message deleted successfully! (＾▽＾)ノ'
            };

            // Sende temporäre Bestätigung die nach 5 Sekunden verschwindet
            const reply = await message.channel.send({ embeds: [clearEmbed] });
            setTimeout(() => reply.delete(), 5000);

        } catch (error) {
            console.error(error);
            if (error.code === 50034) {
                return message.channel.send('Gomen! I can\'t delete messages that are older than 14 days! (╥﹏╥)');
            }
            return message.channel.send('Gomen! Something went wrong while trying to delete messages! (＞﹏＜)');
        }
    },
};
