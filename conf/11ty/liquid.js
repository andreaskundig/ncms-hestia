var Liquid = require('liquidjs');
var engine = new Liquid();

function extractAttribute(attributeName, data) {
    const attribute = data[attributeName];
    if(typeof attribute === 'string'){
        return attribute;
    }
    if(attribute?.path){
        const pathArray = attribute.path.split('.');
        return pathArray.reduce((o, attr)=> o[attr], data);
    }
    return undefined;
}

async function renderLiquid(attributeName, data) {
    if (data[attributeName] === undefined) {
        console.error(`page ${data.page.inputPath} does not have an attribute "${attributeName}"`);
        return undefined;
    }
    const template = extractAttribute(attributeName, data);
    const rendered = await engine.parseAndRender(template, data);
    return rendered;
}

module.exports = { renderLiquid };
