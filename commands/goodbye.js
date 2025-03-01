module.exports = {
    name: 'goodbye',
    description: 'Sends a goodbye message',
    async execute(message) {
        const goodbyeEmbed = {
            color: 0xFFC0CB,
            title: 'Goodbye!',
            description: 'Sayonara! Mata ne~ (｡♥‿♥｡)'
        };
        await message.reply({ embeds: [goodbyeEmbed] });
    },
  };
