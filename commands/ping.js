module.exports = {
    name: 'ping',
    description: 'Check bot latency',
    async execute(message) {
        const sent = await message.channel.send('Checking my pulse desu~ (｡•́︿•̀｡)');
        const timeDiff = sent.createdTimestamp - message.createdTimestamp;
        
        const pingEmbed = {
            color: 0xFFC0CB,
            title: '🌸 Pong! 🌸',
            description: `Yatta! I'm alive and genki desu~! (＾▽＾)ノ`,
            fields: [
                {
                    name: '⚡ Response Time',
                    value: `${timeDiff}ms desu~`,
                    inline: true
                },
                {
                    name: '💓 Heartbeat',
                    value: `${Math.round(message.client.ws.ping)}ms`,
                    inline: true
                }
            ],
            footer: {
                text: 'Always here to help you, Senpai! ✨'
            }
        };
        
        await sent.delete();
        await message.channel.send({ embeds: [pingEmbed] });
    },
};
