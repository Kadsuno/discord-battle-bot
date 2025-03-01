const createWelcomeCard = require('../utils/welcomeCard');
const { AttachmentBuilder } = require('discord.js');

module.exports = {
    name: 'verify',
    description: 'Verifies a user',
    async execute(message) {
        // Prüfe ob der Command im richtigen Kanal ist
        if (message.channel.name !== 'verification') {
            return message.reply('Gomen! Please use this command in the verification channel! (＞﹏＜)');
        }

        // Prüfe ob der User bereits verifiziert ist
        const unverifiedRole = message.guild.roles.cache.find(role => role.name === 'Unverified');
        if (!unverifiedRole) {
            return message.reply('Gomen! The Unverified role doesn\'t exist! Please contact an admin! (╥﹏╥)');
        }

        if (!message.member.roles.cache.has(unverifiedRole.id)) {
            return message.reply('Ara ara~ You\'re already verified! (｡♥‿♥｡)');
        }

        try {
            // Entferne Unverified Rolle
            await message.member.roles.remove(unverifiedRole);

            // Füge Member Rolle hinzu (falls vorhanden)
            const memberRole = message.guild.roles.cache.find(role => role.name === 'Member');
            if (memberRole) {
                await message.member.roles.add(memberRole);
            }

            // Sende Bestätigung
            const verifyEmbed = {
                color: 0xFFC0CB,
                title: '✨ Verification Complete! ✨',
                description: `Welcome to the server, ${message.member}! You now have access to all channels! (＾▽＾)ノ`,
                fields: [
                    {
                        name: '🌟 Next Steps',
                        value: 'Please check out our rules and have fun! (｡♥‿♥｡)'
                    }
                ],
                footer: {
                    text: '✨ Enjoy your stay in our kawaii community! ✨'
                },
                timestamp: new Date()
            };

            await message.channel.send({ embeds: [verifyEmbed] });

            // Finde den Welcome Channel
            const welcomeChannel = message.guild.channels.cache.find(ch => ch.name === 'welcome');
            if (welcomeChannel) {
                // Erstelle und sende die Willkommenskarte
                const canvas = await createWelcomeCard(message.member);
                const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'welcome-image.png' });

                const welcomeEmbed = {
                    color: 0xFFC0CB,
                    title: '🌸 New Verified Member! 🌸',
                    description: `${message.member} has completed verification! Welcome to our kawaii server! (＾▽＾)ノ`,
                    image: {
                        url: 'attachment://welcome-image.png'
                    },
                    fields: [
                        {
                            name: '💫 Member Count',
                            value: `You are our ${message.guild.memberCount}th member desu~!`
                        }
                    ],
                    footer: {
                        text: '✨ Welcome to our kawaii community! ✨'
                    },
                    timestamp: new Date()
                };

                await welcomeChannel.send({ 
                    embeds: [welcomeEmbed], 
                    files: [attachment] 
                });
            }

            // Lösche die Verify-Nachricht des Users nach 5 Sekunden
            setTimeout(() => message.delete().catch(console.error), 5000);

        } catch (error) {
            console.error(error);
            return message.reply('Gomen! Something went wrong with the verification! (╥﹏╥)');
        }
    },
}; 