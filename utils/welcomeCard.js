const Canvas = require('canvas');

async function createWelcomeCard(member) {
    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    // Erstelle einen schönen Farbverlauf als Hintergrund
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#ffd1dc');   // Pastellrosa
    gradient.addColorStop(1, '#fff0f5');   // Helles Rosa
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Füge dekorative Elemente hinzu
    // Sakura Blüten
    function drawSakura(x, y, size) {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 2 * Math.PI) / 5;
            const px = x + size * Math.cos(angle);
            const py = y + size * Math.sin(angle);
            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.closePath();
        ctx.fillStyle = '#ffb7c5';
        ctx.fill();
        
        // Blütenmitte
        ctx.beginPath();
        ctx.arc(x, y, size/4, 0, Math.PI * 2);
        ctx.fillStyle = '#ff9cad';
        ctx.fill();
    }

    // Zeichne mehrere Sakura Blüten
    for (let i = 0; i < 10; i++) {
        drawSakura(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            10 + Math.random() * 10
        );
    }

    // Füge dekorative Linien hinzu
    ctx.strokeStyle = '#ffc0cb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(250, 0);
    ctx.lineTo(250, canvas.height);
    ctx.stroke();

    // Füge geschwungene Linien hinzu
    ctx.beginPath();
    ctx.moveTo(260, 20);
    ctx.quadraticCurveTo(350, 125, 260, 230);
    ctx.strokeStyle = '#ffb7c5';
    ctx.stroke();

    // Setze Schriftart und Stil
    ctx.font = 'bold 36px "Arial"';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ff69b4';
    
    // Füge Schatten zum Text hinzu
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // Zeichne Willkommenstext
    ctx.fillText('Welcome!', canvas.width / 1.5, 60);
    
    // Username
    ctx.font = '28px "Arial"';
    ctx.fillStyle = '#db7093';
    ctx.fillText(member.user.tag, canvas.width / 1.5, 120);

    // Server Name
    ctx.font = '24px "Arial"';
    ctx.fillText(`to ${member.guild.name}`, canvas.width / 1.5, 160);

    // Member Count
    ctx.font = '20px "Arial"';
    ctx.fillStyle = '#c71585';
    ctx.fillText(`Member #${member.guild.memberCount}`, canvas.width / 1.5, 200);

    // Füge Avatar in einem Kreis hinzu
    ctx.shadowBlur = 0;  // Reset shadow für Avatar
    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: 'png' }));
    
    // Erstelle einen kreisförmigen Clip
    ctx.beginPath();
    ctx.arc(125, 125, 80, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    // Füge einen weißen Hintergrund für den Avatar hinzu
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(45, 45, 160, 160);

    // Zeichne den Avatar
    ctx.drawImage(avatar, 45, 45, 160, 160);

    return canvas;
}

module.exports = createWelcomeCard; 