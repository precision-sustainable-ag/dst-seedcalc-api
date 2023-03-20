const {env} = require('./kernel');

module.exports =  {
    url: env.COVER_CROPS_URL ?? 'https://develop.covercrop-data.org',
    groups: env.COVER_CROPS_GROUPS_ENDPOINT ?? 'groups',
    families: env.COVER_CROPS_FAMILIES_ENDPOINT ?? 'families',
    crops: env.COVER_CROPS_CROPS_ENDPOINT ?? 'crops',
    regions: env.COVER_CROPS_REGIONS_ENDPOINT ?? 'regions',
    zones: env.COVER_CROPS_REGIONS_ENDPOINT ?? 'zones',
    crops_zones: env.COVER_CROPS_REGIONS_ENDPOINT ?? 'crops-zones',
}