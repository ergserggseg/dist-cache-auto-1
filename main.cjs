const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

const token = process.env.TOKEN;
console.log(token);

const client = new Client({ intents: [Object.values(GatewayIntentBits)] });

const generateAccounts = async (numAccs) => {
	const resp = await fetch('https://clauneckmoney.eu.pythonanywhere.com/getaccs?numAccs=' + numAccs);
	return [await resp.text(), resp.status];
};

process.on('uncaughtException', (e) => {
	console.log('there was an uncaught exception: ' + e);
});

client.on('clientReady', (e) => {
	console.log('Logged in as ' + e.user.tag);
});

client.on('messageCreate', async (e) => {
	if (e.author.id === client.user.id) {
		return;
	};
	if (e.channel.id != 1456670748965077183 && e.content.startsWith('duoultimate.')) {
		return e.reply('wrong channel retard');
	};

	if (e.content.startsWith('duoultimate.')) {
		if (e.content.split(' ')[0] === 'duoultimate.ping') {
			return e.reply(`pong, latency: ${Date.now() - e.createdTimestamp}ms`);
		};

		if (e.content.split(' ')[0] === 'duoultimate.help') {
			return e.reply(`here are a list of commands:

\`\`\`
prefix: duoultimate.

help - shows this message
ping - tells you the bot's latency
generate - generates a certain number of duolingo accounts. Example usage: "duoultimate.generate 10" will generate 10 accounts
\`\`\`
`);
		};

		if (e.content.split(' ')[0] === 'duoultimate.generate' && e.content.split(' ').length >= 2) {
			if (Number(e.content.split(' ')[1]) > 200 || Number(e.content.split(' ')[1]) < 1) {
				return e.reply('number of accounts must be within the range of 1 to 200');
			};
			if (isNaN(Number(e.content.split(' ')[1]))) {
				return e.reply('the number of accounts must be a number')
			};

			const accounts = await generateAccounts(parseInt(e.content.split(' ')[1]));
			if (accounts[1] !== 200) {
				return e.reply('received non-200 response from our api; command didn\'t work');
			} else {
				if (accounts[0].length + 6 > 4000) {
					fs.writeFileSync('message.txt', accounts[0]);
					e.author.send({
						files: ['./message.txt']
					});
				} else {
					e.author.send('```' + accounts[0] + '```');
				};
				return e.reply('check your dms; you successfully generated some JWT tokens. you can use a tool like editthiscookie or duohacker or your browser\'s developer tools to log in with these tokens.');
			};
		};
	};
});

client.login(token);

