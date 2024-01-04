import getDistance from 'geolib/es/getPreciseDistance'
import { GeolibInputCoordinates } from 'geolib/es/types'

/**
 * Given current location and target location, 
 * Format for daata EX:  {latitude: 37.421998333333335, longitude: -122.08400000000002}
 * returns the distance between two locations
 * @param currLocation 
 * @param targetLocation 
 */

const proximityCalculator = (currentLocation:GeolibInputCoordinates,currenttargetLocation : GeolibInputCoordinates) => {
  let distance = 0;
  distance =  getDistance(currentLocation, currenttargetLocation) * 0.000621371192; //converting meters to miles
  return Math.round((distance + Number.EPSILON) * 100)/ 100;
  // return distance;

};


export default proximityCalculator