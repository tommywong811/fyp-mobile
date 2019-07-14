import RNFetchBlob from 'rn-fetch-blob';

const docDir = RNFetchBlob.fs.dirs.DocumentDir;

const config = {
    db: {
        buildings: {
            name: 'buildings',
            file: 'buildings.bson'
        },
        connectors: {
            name: 'connectors',
            file: 'connectors.bson'
        },
        edges: {
            name: 'edges',
            file: 'edges.bson'
        },
        floors: {
            name: 'floors',
            file: 'floors.bson'
        },
        images: {
            name: 'images',
            file: 'images.bson'
        },
        // mapImages: {
        //     name: 'mapImages',
        //     file: 'mapImages.bson'
        // },
        mapTiles: {
            name: 'mapTiles',
            file: 'mapTiles.bson'
        },
        meta: {
            name: 'meta',
            file: 'meta.bson'
        },
        nodes: {
            name: 'nodes',
            file: 'nodes.bson'
        },
        settings: {
            name: 'settings',
            file: 'settings.bson'
        },
        // suggestions: {
        //     name: 'suggestions',
        //     file: 'suggestions.bson'
        // },
        tags: {
            name: 'tags',
            file: 'tags.bson'
        }
    },
    download: {
        dirs: {
            archiveFile: `${docDir}/database.zip`,
            archiveExtracted: `${docDir}/pathadvisor_staging`,
            archiveExtractTarget: docDir
        },
        url: {
            database: 'http://10.89.226.226:5000/database.zip',
            metadata: 'http://10.89.226.226:5000/meta.json',
        }
    }
}

export default config;