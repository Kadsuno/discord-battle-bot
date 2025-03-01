module.exports = {
    name: 'hello',
    description: 'Sends a greeting',
    async execute(message) {
        const helloEmbed = {
            color: 0xFFC0CB,
            title: 'Hello!',
            description: 'Konnichiwa! (＾▽＾)ノ'
        };
        await message.reply({ embeds: [helloEmbed] });
    },
  };
