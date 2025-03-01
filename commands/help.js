module.exports = {
    name: 'help',
    description: 'Shows all available commands',
    async execute(message) {
      const helpEmbed = {
        color: 0xFFC0CB,
        title: '🌸 Hikari-chan\'s Command List! 🌸',
        description: 'Konnichiwa! Here are all the ways I can help you, Senpai! (＾▽＾)ノ',
        fields: [
            {
                name: '✨ Moderation Commands',
                value: `
• !kick - When someone needs a little break from the server~ (｡•́︿•̀｡)
• !ban - For those who really need to reflect on their actions! (＞﹏＜)
• !timeout - A quiet corner for timeout time desu~
• !searchlogs - Let me search through the records for you! 📝
                `
            },
            {
                name: '💫 Utility Commands',
                value: `
• !help - I'll show you this cute list again!
• !ping - Check if I'm awake and genki desu~
                `
            }
        ],
        footer: {
            text: 'Use commands with care and love! ✨ Need help? Just ask Senpai!'
        }
      };
  
      await message.channel.send({ embeds: [helpEmbed] });
    },
};