module.exports = {
    async logAction(guild, options) {
        try {
            let logChannel = guild.channels.cache.find(channel => channel.name === 'mod-logs');
            
            if (!logChannel && guild.members.me.permissions.has('ManageChannels')) {
                try {
                    logChannel = await guild.channels.create({
                        name: 'mod-logs',
                        type: 0,
                        permissionOverwrites: [
                            {
                                id: guild.id,
                                deny: ['ViewChannel']
                            },
                            {
                                id: guild.members.me.id,
                                allow: ['ViewChannel', 'SendMessages', 'EmbedLinks']
                            }
                        ]
                    });

                    const adminRole = guild.roles.cache.find(role => role.permissions.has('Administrator'));
                    if (adminRole) {
                        await logChannel.permissionOverwrites.create(adminRole, {
                            ViewChannel: true,
                            SendMessages: true,
                            ReadMessageHistory: true
                        });
                    }
                } catch (error) {
                    console.error('Error creating log channel:', error);
                    logChannel = guild.channels.cache.find(channel => 
                        channel.name === 'general' || channel.name === 'logs'
                    );
                }
            }

            if (!logChannel) {
                console.error('No suitable logging channel found');
                return;
            }

            // Erweiterte Logging-Informationen
            const logEmbed = {
                color: options.color || 0xFFC0CB,
                title: `🌸 ${options.title} 🌸`,
                description: options.description,
                fields: [
                    ...options.fields || [],
                    {
                        name: '📅 Timestamp',
                        value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
                        inline: true
                    },
                    {
                        name: '🔍 Action ID',
                        value: Date.now().toString(),
                        inline: true
                    },
                    {
                        name: '📊 Server Info',
                        value: `Server: ${guild.name}\nTotal Members: ${guild.memberCount}`,
                        inline: true
                    }
                ],
                thumbnail: {
                    url: options.targetUser?.displayAvatarURL() || guild.iconURL()
                },
                footer: {
                    text: `Logged by ${options.moderator?.tag || 'System'} • Server ID: ${guild.id}`,
                    icon_url: options.moderator?.displayAvatarURL()
                },
                timestamp: new Date()
            };

            // Füge User-spezifische Informationen hinzu, wenn verfügbar
            if (options.targetUser) {
                logEmbed.fields.push(
                    {
                        name: '👤 User Information',
                        value: [
                            `**Tag:** ${options.targetUser.tag}`,
                            `**ID:** ${options.targetUser.id}`,
                            `**Account Created:** <t:${Math.floor(options.targetUser.createdTimestamp / 1000)}:R>`,
                            `**Joined Server:** ${options.targetMember ? `<t:${Math.floor(options.targetMember.joinedTimestamp / 1000)}:R>` : 'N/A'}`
                        ].join('\n'),
                        inline: false
                    }
                );
            }

            // Füge Moderator-spezifische Informationen hinzu
            if (options.moderator) {
                logEmbed.fields.push(
                    {
                        name: '👮 Moderator Information',
                        value: [
                            `**Tag:** ${options.moderator.tag}`,
                            `**ID:** ${options.moderator.id}`,
                            `**Roles:** ${options.moderatorMember?.roles.cache.size - 1 || 0}`
                        ].join('\n'),
                        inline: false
                    }
                );
            }

            await logChannel.send({ embeds: [logEmbed] });
        } catch (error) {
            console.error('Logging error:', error);
        }
    }
}; 