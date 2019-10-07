'use strict';

function validatePoint(point) {
    if (!point || !Number.isFinite(point[0]) || point.length !== 2) {
        throw new Error('Invalid point format');
    }
}

function validateBox(box) {
    if (!box || !box[0] || !Number.isFinite(box[0][0])) {
        throw new Error('Invalid box format');
    }
    if (box.length !== 2) {
        throw new Error('Box must have exactly 2 vertices (bottom left & top right)');
    }
}

function validatePolygon(polygon) {
    if (!polygon || !polygon[0] || !Number.isFinite(polygon[0][0])) {
        throw new Error('Invalid polygon format');
    }
    if (polygon.length < 3) {
        throw new Error('Polygon must have at least 3 vertices');
    }
}

function validateGeoLocs(geoLocs) {
    if (!geoLocs || !geoLocs.coordinates || !geoLocs.coordinates[0]) {
    // if (!geoLocs || !geoLocs.coordinates || !geoLocs.coordinates[0] || !Number.isFinite(geoLocs.coordinates[0][0])) {
        throw new Error('Invalid geoLocs format');
    }
}

export { validatePoint, validateBox, validatePolygon, validateGeoLocs };
