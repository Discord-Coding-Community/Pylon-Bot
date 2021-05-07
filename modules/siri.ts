discord.on('MESSAGE_CREATE', async (message) => {
    if (
        message.content.toLowerCase().startsWith('hey siri') ||
        message.content.toLowerCase().startsWith('siri')
    ) {
        const siriResponses = [
            'Searching for nearby sushi restaraunts...',
            'Sending images of Google search "butt" to grandmother',
            'The coin landed heads.',
            'The coin landed tails.',
            'The square root of 27 is 5.196152423.',
            'Setting alarm for "11:00 PM snack"',
            'Calling 911...',
            'Launching intercontinental ballistic missile. Target: Northwest Syria',
            "Yes, I'm Siri.",
            'Buying $GME Stock...',
            'Preordering tickets to Disney\'s 2021 "Cruella"',
            'Search results show you may have the black plague.',
            "This is Mission Control to Alpha Niner..\nWe've got confirmation.\nYou're mum has found your secret porn stash... Abort mission!"
        ];
        const randSiriResponse =
            Math.floor(Math.random() * siriResponses.length) + 1;
        await message.reply(siriResponses[randSiriResponse]);
    }
});
