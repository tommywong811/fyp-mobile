import throttle from 'lodash.throttle';
import {api} from '../../../backend';
import {Platform, Image} from 'react-native';
import { connectors } from '../../../backend/api';

const MAP_TILE_WIDTH = 200;
const MAP_TILE_HEIGHT = 200;

/**
 * @typedef MapTileNumber
 * @property {number} x - coordinate x of the top left of this map tile number
 * @property {number} y - coordinate y of the top left of this map tile number
 */
/**
 * Given an coordinate, return the number of the map tile containing this coordinate
 * @param {number} x
 * @param {number} y
 * @return {MapTileNumber}
 */
function getMapTileNumber(x, y) {
    const tileX = Math.floor(x / MAP_TILE_WIDTH) * MAP_TILE_WIDTH;
    const tileY = Math.floor(y / MAP_TILE_HEIGHT) * MAP_TILE_HEIGHT;
    return {
      x: tileX,
      y: tileY,
    };
}

function getMapTileDir(x, y, floor, level) {
    return api.mapTiles({
        floor: floor,
        x: x,
        y: y,
        zoomLevel: level
    });
}

export function dirToUri(dir){
    const extension = (Platform.OS === 'android') ? 'file://' : '';
    const uri = `${extension}${dir}`;
    return uri;
}

export function createImage(uri){
    return <Image source={{uri: uri}} />
}

export function generateMapTiles(offsetX, offsetY, width, height, floor, level){
    const {x, y} = getMapTileNumber(offsetX, offsetY);
    const mapTiles = [];
    let nextTileX = x;
    do{
        mapTiles.push({
            floorId: floor,
            x: nextTileX,
            y,
            zoomLevel: level
        });

        let nextTileY = y;

        do{
            nextTileY += MAP_TILE_HEIGHT;
            mapTiles.push({
                floorId: floor,
                x: nextTileX,
                y: nextTileY,
                zoomLevel: level
            });
        }while(nextTileY - y < height + MAP_TILE_HEIGHT)

        nextTileX += MAP_TILE_WIDTH;
    }while(nextTileX - x < width + MAP_TILE_WIDTH)


    for(i = 0; i < mapTiles.length; i++){
        try{
            let dir = api.mapTiles({
                floorId: mapTiles[i].floorId,
                x: mapTiles[i].x,
                y: mapTiles[i].y,
                zoomLevel: mapTiles[i].zoomLevel
            });
            mapTiles[i] = {...mapTiles[i], uri: dirToUri(dir)};
        }catch(err){
            mapTiles.splice(i, 1);
            i--;
        }
    }

    var tempMapTiles = mapTilesRefactor(mapTiles);
    var w = tempMapTiles[0].length;
    var h = tempMapTiles.length;
    var result = []
    for(i = 0; i < tempMapTiles[0].length; i++){
        for(j = 0; j < tempMapTiles.length; j++){
            result.push(tempMapTiles[j][i]);
        }
    }


    return {result: result, dimension: {width: w, height: h}};
}

export function getFloorDimension(offsetX, offsetY, width, height){
    const {x, y} = getMapTileNumber(offsetX, offsetY);
    const w = Math.ceil(width / MAP_TILE_WIDTH);
    const h = Math.ceil(height / MAP_TILE_HEIGHT);
    //console.log(`w:${w} h:${h} x:${x} y${y}`);
    return {
        left: x,
        top: y,
        width: w,
        height: h
    }
}

export function mapTilesRefactor(mapTiles){
    const result = []
    const firstItem = mapTiles[0];
    var x = firstItem.x;
    var row = []

    for(i = 0; i < mapTiles.length; i++){
        if(mapTiles[i].x == x){
            row.push(mapTiles[i]);
        }else{
            result.push(row);
            row = [];
            x = mapTiles[i].x;
            row.push(mapTiles[i]);
        }
    }
    result.push(row);
    
    return result;
}

export function getMapTileDim(mapTiles){
    const firstItem = mapTiles[0];
    var x = firstItem.x;
    var height = 0, width;
    for(i = 0; i < mapTiles.length; i++){
        if(mapTiles[i].x == x){
            height++;
        }else{
            break;
        }
    }
    width = mapTiles.length / height;
    return{
        width: width,
        height: height
    };
}

export function getDefualtView(left, top, numOfRow, numOfCol, floorId, zoomLevel, cacheImage){
    for(i = 0; i < numOfRow; i++){
        for(j = 0; j < numOfCol; j++){
            try{
                var dir = api.mapTiles({
                    floorId: floorId,
                    x: left + j * MAP_TILE_WIDTH,
                    y: top + i * MAP_TILE_HEIGHT,
                    zoomLevel: zoomLevel
                });
                uri = dirToUri(dir);
                cacheImage[i][j] = {uri: uri};
            }catch(error){}
        }
    }
}

export function getNodeOffsetForEachFloor(floorId) {
    switch(floorId) {
        // Academic Building
        case '1':
        case '5':
        case '6':
            return {
                'x': 70,
                'y': 0,
            };
        case '2':
            return {
                'x': 35,
                'y': 70,
            };
        case '3':
            return {
                'x': 65,
                'y': 30
            }
        case '4':
            return {
                'x': 70,
                'y': 20,
            }
        case 'G':
            return {
                'x': 35,
                'y': 50,
            }

        case 'LG1':
            return {
                'x': 70,
                'y': 60,
            }

        case 'LG2':
            return {
                'x': 70,
                'y': 60,
            }

        case 'LG3':
            return {
                'x': 70,
                'y': 5,
            }

        case 'LG4':
            return {
                'x': 20,
                'y': 60,
            }

        case 'LG5':
            return {
                'x': 25,
                'y': 75,
            }

        case 'LG7':
            return {
                'x': 5,
                'y': 20,
            }

        // CYT
        case 'CYT2':
        case 'CYT3':
        case 'CYT4':
        case 'CYT5':
        case 'CYT6':
        case 'CYTG':
        case 'CYTUG':
            return {
                'x': 50,
                'y': 60,
            };
        case 'CYT1':
            return {
                'x': 70,
                'y': 60,
            }
        case 'CYT7':
            return {
                'x': 55,
                'y': 65,
            }

        // IAS
        case 'IAS1':
            return {
                'x': 35,
                'y': 40,
            };
        case 'IAS2':
            return {
                'x': 35,
                'y': 45,
            };
        case 'IAS3':
            return {
                'x': 38,
                'y': 40,
            };
        case 'IAS4':
            return {
                'x': 40,
                'y': 45,
            };
        case 'IAS5':
            return {
                'x': 60,
                'y': 45,
            };
        case 'IASG':
            return {
                'x': 75,
                'y': 25,
            };

        // LSK
        case 'LSK1':
            return {
                'x': 60,
                'y': 80,
            };
        case 'LSK2':
            return {
                'x': 60,
                'y': 0,
            };
        case 'LSK3':
            return {
                'x': 50,
                'y': 70,
            };
        case 'LSK4':
            return {
                'x': 70,
                'y': 70,
            };
        case 'LSK5':
            return {
                'x': 55,
                'y': 60,
            };
        case 'LSK6':
            return {
                'x': 55,
                'y': 50,
            };

        // University Center
        case 'UC1':
            return {
                'x': 50,
                'y': 40,
            }
        case 'UCG':
            return {
                'x': 45,
                'y': 45,
            }
        default:
            return {
                'x': 0,
                'y': 0,
            }
    }
}

export function getNodeImageByConnectorId(connectorId) {
    if (connectorId.includes('LIFT')) {
        return require('../../../res/tags/lift.png');
    } else if (connectorId.includes('STAIR')) {
        return require('../../../res/tags/stair.png');
    } else if (connectorId.includes('ESCALATOR')) {
        return require('../../../res/tags/escalator.png');
    } else if (connectorId.includes('Entrance')) {
        return require('../../../res/tags/crossBuildingConnector.png');
    }
    
    else {
        return false;
    }
}

export function getNodeImageByTagId(tagId) {
    switch(tagId) {
        case 'restaurant':
            return require('../../../res/tags/restaurant.png');
        case 'femaleToilet':
            return require('../../../res/tags/femaleToilet.png');
        case 'maleToilet':
            return require('../../../res/tags/maleToilet.png');
        case 'ATM':
            return require('../../../res/tags/atm.png');
        case 'drinkingFountain': 
            return require('../../../res/tags/drinkingFountain.png');
        case 'virtualBarnWorkstation':
            return require('../../../res/tags/virtualBarnWorkstation.png');
        case 'satellitePrinter':
            return require('../../../res/tags/satellitePrinter.png');
        default:
            return false;
    }
}