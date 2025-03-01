const createWelcomeCard = require('../utils/welcomeCard');
const { AttachmentBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        try {
            // Füge Unverified Rolle hinzu
            const unverifiedRole = member.guild.roles.cache.find(role => role.name === 'Unverified');
            if (unverifiedRole) {
                await member.roles.add(unverifiedRole);
            } else {
                console.error('Unverified role not found!');
            }

            // Finde den verification Channel
            const verificationChannel = member.guild.channels.cache.find(ch => ch.name === 'verification');
            if (verificationChannel) {
                const verifyEmbed = {
                    color: 0xFFC0CB,
                    title: '🌸 Welcome to Verification! 🌸',
                    description: `Konnichiwa ${member}! Please type \`!verify\` to gain access to the server! (＾▽＾)ノ`,
                    fields: [
                        {
                            name: '💫 Instructions',
                            value: '1. Read our rules\n2. Type `!verify` in this channel\n3. Get access to all channels!'
                        }
                    ],
                    footer: {
                        text: '✨ We can\'t wait to meet you! ✨'
                    },
                    timestamp: new Date()
                };

                await verificationChannel.send({ embeds: [verifyEmbed] });
            }

            // Erstelle Willkommenskarte
            const canvas = await createWelcomeCard(member);
            const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'welcome-image.png' });

            // Finde den Welcome Channel
            const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
            if (!channel) return;

            // Erstelle das Willkommens-Embed
            const welcomeEmbed = {
                color: 0xFFC0CB,
                title: '🌸 New Member Arrived! 🌸',
                description: `Konnichiwa ${member}! Welcome to our kawaii server! (＾▽＾)ノ`,
                image: {
                    url: 'attachment://welcome-image.png'
                },
                fields: [
                    {
                        name: '💫 Member Count',
                        value: `You are our ${member.guild.memberCount}th member desu~!`
                    },
                    {
                        name: '🌟 Getting Started',
                        value: 'Please read our rules and have fun! (｡♥‿♥｡)'
                    }
                ],
                footer: {
                    text: '✨ Welcome to our kawaii community! ✨'
                },
                timestamp: new Date()
            };

            // Sende die Willkommensnachricht
            await channel.send({ 
                embeds: [welcomeEmbed], 
                files: [attachment] 
            });

        } catch (error) {
            console.error('Error in guildMemberAdd event:', error);
        }
    }
}; 