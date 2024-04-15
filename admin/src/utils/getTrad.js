import pluginId from '../pluginId';
console.log("CUSTOMFIELD LOG register getTrad", pluginId)

const getTrad = (id) => `${pluginId}.${id}`;

export default getTrad;
