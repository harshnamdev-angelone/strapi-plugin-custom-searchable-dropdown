"use strict";
const plugin = require("../admin/src/pluginId");

module.exports = ({ strapi }) => {
  console.log("CUSTOMFIELD LOG register plugin", plugin);
  strapi.customFields.register({
    name: "custom-dropdown",
    plugin,
    type: "string",
  });
};
