const Wiki = require('wikijs').default;

module.exports = function (config, auth) {
	return {
		commands: [
			'wiki'
		],
		wiki: {
			usage: '<search terms>',
			description: 'Returns the summary of the first matching search result from Wikipedia',
			process: (msg, suffix, isEdit, cb) => {
				var query = suffix;
				if (!query) {
					cb(`Usage: ${config.commandPrefix}wiki search terms`, msg);
					return;
				}
		
				new Wiki().search(query, 1).then(function (data) {
					new Wiki().page(data.results[0]).then(function (page) {
						page.summary().then(function (summary) {
							var sumText = summary.toString().split('\n');
							var continuation = function () {
								var paragraph = sumText.shift();
								if (paragraph) {
									cb({
										embed: {
											color: config.discord.defaultEmbedColor,
											title: page.title,
											description: `${paragraph}\n\n${page.fullurl}`
										}
									}, msg);
								}
							};
							continuation();
						});
					});
				}, function (err) {
					cb(err, msg);
				});
			}
		}
	};
};