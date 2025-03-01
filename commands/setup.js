module.exports = {
    name: 'setup',
    description: 'Sets up verification system',
    async execute(message) {
        if (!message.member.permissions.has('Administrator')) {
            return message.reply('Gomen! Only administrators can use this command! (＞﹏＜)');
        }

        try {
            const setupEmbed = {
                color: 0xFFC0CB,
                title: '🌸 Setting up Server! 🌸',
                description: 'Starting setup process... (＾▽＾)ノ',
                fields: [],
                timestamp: new Date()
            };

            const statusMessage = await message.channel.send({ embeds: [setupEmbed] });

            // Erstelle oder finde Unverified Rolle
            let unverifiedRole = message.guild.roles.cache.find(role => role.name === 'Unverified');
            if (!unverifiedRole) {
                unverifiedRole = await message.guild.roles.create({
                    name: 'Unverified',
                    color: '#808080',
                    reason: 'Setup verification system'
                });
                setupEmbed.fields.push({
                    name: '✨ Role Created',
                    value: 'Created Unverified role'
                });
            }

            // Erstelle oder finde Member Rolle
            let memberRole = message.guild.roles.cache.find(role => role.name === 'Member');
            if (!memberRole) {
                memberRole = await message.guild.roles.create({
                    name: 'Member',
                    color: '#FFC0CB',
                    reason: 'Setup verification system'
                });
                setupEmbed.fields.push({
                    name: '✨ Role Created',
                    value: 'Created Member role'
                });
            }

            // Erstelle oder finde Verification Channel
            let verificationChannel = message.guild.channels.cache.find(ch => ch.name === 'verification');
            if (!verificationChannel) {
                verificationChannel = await message.guild.channels.create({
                    name: 'verification',
                    type: 0,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: ['ViewChannel']
                        },
                        {
                            id: unverifiedRole.id,
                            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
                        },
                        {
                            id: memberRole.id,
                            deny: ['ViewChannel']
                        }
                    ]
                });
                setupEmbed.fields.push({
                    name: '✨ Channel Created',
                    value: 'Created verification channel'
                });
            }

            // Erstelle oder finde Welcome Channel
            let welcomeChannel = message.guild.channels.cache.find(ch => ch.name === 'welcome');
            if (!welcomeChannel) {
                welcomeChannel = await message.guild.channels.create({
                    name: 'welcome',
                    type: 0,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            allow: ['ViewChannel', 'ReadMessageHistory'],
                            deny: ['SendMessages']
                        }
                    ]
                });
                setupEmbed.fields.push({
                    name: '✨ Channel Created',
                    value: 'Created welcome channel'
                });
            }

            setupEmbed.description = 'Setup complete! Everything is ready desu~! (｡♥‿♥｡)';
            await statusMessage.edit({ embeds: [setupEmbed] });

        } catch (error) {
            console.error(error);
            message.reply('Gomen! Something went wrong during setup! (╥﹏╥)');
        }
    },
}; 