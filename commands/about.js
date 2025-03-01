module.exports = {
    name: 'about',
    description: 'Shows information about Hikari',
    async execute(message) {
      const aboutEmbed = {
        color: 0xFFC0CB,
        title: '🌸 About Hikari 🌸',
        description: `
        Ohayou! I'm Hikari, your personal server assistant! (＾▽＾)ノ

        I was created to fill your Discord server with joy and kawaiiness! 
        With my various features, I help you manage your server 
        while always staying friendly and cute! uwu`
      };
  
      await message.channel.send({ embeds: [aboutEmbed] });
    },
  };