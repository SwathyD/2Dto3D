// var dataset = [
//   [1,1,0],[0,1,0],[1,0,0],
//   [10,10,0],[10,11,0],[11,10,0],
//   [50,50,0],[51,50,0],[50,51,0],
//   [100,100,0]
// ];
 
var clustering = require('density-clustering');
var optics = new clustering.OPTICS();

var data = require('./external_pruned.json')

var dataset = data.map((obj) =>{ 
    var pt = [obj.x, obj.y, obj.z] 

    pt['ref'] = obj

    return pt
})
console.time("time")
// parameters: 2 - neighborhood radius, 2 - number of points in neighborhood to form a cluster
var clusters = optics.run(dataset, 0.2, 4);
var plot = optics.getReachabilityPlot();

var op_data = []

var biggest_i = 0

for(var i = 1; i < clusters.length; i++){
    if(clusters[i].length > clusters[biggest_i].length){
        biggest_i = i
    }
}

var clone = []

for (var idx of clusters[biggest_i]) {
    clone.push(dataset[idx])
}

op_data.push(clone)


console.timeEnd("time")
// console.log("var clusteredPointCloud = " + JSON.stringify(op_data, undefined, 4))