// ------------------------------------------------------------------------------------
// Change the rectange number according to your group,
// this is for R1,
// for R2, it should be "R2"
// for R3, it should be "R3"
// and so on.
// ------------------------------------------------------------------------------------
var rect_string = ee.String("R1");

// ------------------------------------------------------------------------------------
// Do not change the following code
// ------------------------------------------------------------------------------------

// var rect_route = ee.String();
var rect = ee.FeatureCollection("users/nahian_ahmed/" + rect_string.getInfo());

// Sentinel-2 Level-2A images
var sentinel_2 = ee.ImageCollection("COPERNICUS/S2_SR");

// Bangladesh terrestrial and marine area
var bgd = ee.FeatureCollection("users/nahian_ahmed/bgd_with_marine");


// Sentinel-2 Level-2A images covering Bangladesh
var spatial = sentinel_2.filterBounds(bgd);

// Sentinel-2 Level-2A images covering Bangladesh
// with less than 1% cloud coverage and quality checking
var filtered = spatial.filterMetadata('CLOUDY_PIXEL_PERCENTAGE','less_than',1)
  .filterMetadata('GENERAL_QUALITY','equals','PASSED')
  .filterMetadata('SENSOR_QUALITY','equals','PASSED')
  .filterMetadata('RADIOMETRIC_QUALITY','equals','PASSED')
  .filterMetadata('GEOMETRIC_QUALITY','equals','PASSED');

// Images for 2020
var filtered_2020 = filtered.filterDate('2020-01-01','2020-02-28');

// Create a composite of pixel-wise mean
var bgd_2020 = filtered_2020.mean().select('B4', 'B3', 'B2').clip(bgd);

// Center the map to rectangle
Map.centerObject(rect,8);

// Visualization parameters
var visualization = {
  gain: '0.1, 0.1, 0.1', 
  scale:10
};

// Add image layer to map
Map.addLayer(bgd_2020.clip(rect), 
             visualization, 
             'Jan-Feb 2020 RGB');
             
Map.addLayer(rect,
             {},
             'Extent',
             0);
// ------------------------------------------------------------------------------------

//   -------------------------------------------------
//   |     Land cover  | Variable name | Class value |
//   |------------------------------------------------
//   |      Built      |     built     |      0      |
//   |     Dense Veg   |   dense_veg   |      1      |
//   |    Sparse Veg   |  sparse_veg   |      2      | 
//   |      Open       |     open      |      3      |
//   |      Water      |     water     |      4      |
//   -------------------------------------------------

// ------------------------------------------------------------------------------------
// EXPORT LABELS
// Uncomment the following code after labeling is complete and run again
// ------------------------------------------------------------------------------------

// Export.table.toDrive({
//   collection: built,
//   description:'built-'+rect_string.getInfo(),
//   fileFormat: 'SHP',
//   folder: 'labels_S2L2_2020'
// });

// Export.table.toDrive({
//   collection: dense_veg,
//   description:'dense_veg-'+rect_string.getInfo(),
//   fileFormat: 'SHP',
//   folder: 'labels_S2L2_2020'
// });

// Export.table.toDrive({
//   collection: sparse_veg,
//   description:'sparse_veg-'+rect_string.getInfo(),
//   fileFormat: 'SHP',
//   folder: 'labels_S2L2_2020'
// });

// Export.table.toDrive({
//   collection: open,
//   description:'open-'+rect_string.getInfo(),
//   fileFormat: 'SHP',
//   folder: 'labels_S2L2_2020'
// });

// Export.table.toDrive({
//   collection: water,
//   description:'water-'+rect_string.getInfo(),
//   fileFormat: 'SHP',
//   folder: 'labels'
// });
// ------------------------------------------------------------------------------------
