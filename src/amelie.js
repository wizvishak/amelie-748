import { Client } from 'klasa';
// eslint-disable-next-line import/no-unresolved
import config from '../config/properties.json';
// eslint-disable-next-line import/no-unresolved
import secret from '../config/secrets.json';
import { checkEnvironment } from './lib/util/general';
import ServiceStore from './lib/structures/service-store';
import Logger from './lib/plugins/winston';

// Check if system is ready to run the bot
checkEnvironment();

class BotClient extends Client {
	constructor(...args) {
		super(...args);

		// Setup the logger
		this.initializeLogger();

		// Register the 'Service' piece store
		this.services = new ServiceStore(this);
		this.registerStore(this.services);
	}

	initializeLogger() {
		Logger.info('Initialized logger');
	}
}

const Amelie = new BotClient({
	fetchAllMembers: false,
	prefix: config.bot.prefix,
	commandEditing: true,
	commandLogging: true,
	consoleEvents: {
		log: true,
		error: true
	},
	typing: true,
	pieceDefaults: {
		monitors: {
			ignoreBots: config.bot.ignoreBots
		},
		// Custom piece defaults
		services: {
			enabled: true
		}
	},
	disabledCorePieces: ['commands'],
	readyMessage: (client) => `Successfully initialized. Ready to serve ${client.guilds.cache.size} guilds.`
}).login(secret.token);

export default Amelie;
