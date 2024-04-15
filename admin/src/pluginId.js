const pluginPkg = require('../../package.json')

const pluginId = pluginPkg.name.replace(/^(@[^-,.][\w,-]+\/|strapi-)plugin-/i, '');

console.log("CUSTOMFIELD LOG register pluginId", pluginId)

module.exports = pluginId;
