import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window'); 

export const mapTileSize = width / 3;

export const logicTileSize = 200; 