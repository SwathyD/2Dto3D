// var dataset = [
//   [1,1,0],[0,1,0],[1,0,0],
//   [10,10,0],[10,11,0],[11,10,0],
//   [50,50,0],[51,50,0],[50,51,0],
//   [100,100,0]
// ];
 
var clustering = require('density-clustering');
var optics = new clustering.OPTICS();

var data = require('./pc.json')

var dataset = data.map((obj) => [obj.x, obj.y, obj.z] )

// parameters: 2 - neighborhood radius, 2 - number of points in neighborhood to form a cluster
var clusters = optics.run(dataset, 0.5, 4);
var plot = optics.getReachabilityPlot();

var op_data = []

for(var cluster of clusters){
    var clone = []

    for(var idx of cluster){
        clone.push(dataset[idx])
    }

    op_data.push(clone)
}

console.log("var clusteredPointCloud = " + JSON.stringify(op_data, undefined, 4))