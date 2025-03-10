/**
 * DBSCAN - Density based clustering
 *
 * @author Lukasz Krawczyk <contact@lukaszkrawczyk.eu>
 * @copyright MIT
 */

/**
 * DBSCAN class construcotr
 * @constructor
 *
 * @param {Array} dataset
 * @param {number} epsilon
 * @param {number} minPts
 * @param {function} distanceFunction
 * @returns {DBSCAN}
 */
function DBSCAN(dataset, epsilon, minPts, distanceFunction) {
    /** @type {Array} */
    this.dataset = [];
    /** @type {number} */
    this.epsilon = 1;
    /** @type {number} */
    this.minPts = 2;
    /** @type {function} */
    this.distance = this._euclideanDistance;
    /** @type {Array} */
    this.clusters = [];
    /** @type {Array} */
    this.noise = [];

    // temporary variables used during computation

    /** @type {Array} */
    this._visited = [];
    /** @type {Array} */
    this._assigned = [];
    /** @type {number} */
    this._datasetLength = 0;

    this._init(dataset, epsilon, minPts, distanceFunction);
};

/******************************************************************************/
// public functions

/**
 * Start clustering
 *
 * @param {Array} dataset
 * @param {number} epsilon
 * @param {number} minPts
 * @param {function} distanceFunction
 * @returns {undefined}
 * @access public
 */
DBSCAN.prototype.run = function (dataset, epsilon, minPts, distanceFunction) {
    this._init(dataset, epsilon, minPts, distanceFunction);

    for (var pointId = 0; pointId < this._datasetLength; pointId++) {
        // if point is not visited, check if it forms a cluster
        if (this._visited[pointId] !== 1) {
            this._visited[pointId] = 1;

            // if closest neighborhood is too small to form a cluster, mark as noise
            var neighbors = this._regionQuery(pointId);

            if (neighbors.length < this.minPts) {
                this.noise.push(pointId);
            } else {
                // create new cluster and add point
                var clusterId = this.clusters.length;
                this.clusters.push([]);
                this._addToCluster(pointId, clusterId);

                this._expandCluster(clusterId, neighbors);
            }
        }
    }

    return this.clusters;
};

/******************************************************************************/
// protected functions

/**
 * Set object properties
 *
 * @param {Array} dataset
 * @param {number} epsilon
 * @param {number} minPts
 * @param {function} distance
 * @returns {undefined}
 * @access protected
 */
DBSCAN.prototype._init = function (dataset, epsilon, minPts, distance) {

    if (dataset) {

        if (!(dataset instanceof Array)) {
            throw Error('Dataset must be of type array, ' +
                typeof dataset + ' given');
        }

        this.dataset = dataset;
        this.clusters = [];
        this.noise = [];

        this._datasetLength = dataset.length;
        this._visited = new Array(this._datasetLength);
        this._assigned = new Array(this._datasetLength);
    }

    if (epsilon) {
        this.epsilon = epsilon;
    }

    if (minPts) {
        this.minPts = minPts;
    }

    if (distance) {
        this.distance = distance;
    }
};

/**
 * Expand cluster to closest points of given neighborhood
 *
 * @param {number} clusterId
 * @param {Array} neighbors
 * @returns {undefined}
 * @access protected
 */
DBSCAN.prototype._expandCluster = function (clusterId, neighbors) {

    /**
     * It's very important to calculate length of neighbors array each time,
     * as the number of elements changes over time
     */
    for (var i = 0; i < neighbors.length; i++) {
        var pointId2 = neighbors[i];

        if (this._visited[pointId2] !== 1) {
            this._visited[pointId2] = 1;
            var neighbors2 = this._regionQuery(pointId2);

            if (neighbors2.length >= this.minPts) {
                neighbors = this._mergeArrays(neighbors, neighbors2);
            }
        }

        // add to cluster
        if (this._assigned[pointId2] !== 1) {
            this._addToCluster(pointId2, clusterId);
        }
    }
};

/**
 * Add new point to cluster
 *
 * @param {number} pointId
 * @param {number} clusterId
 */
DBSCAN.prototype._addToCluster = function (pointId, clusterId) {
    this.clusters[clusterId].push(pointId);
    this._assigned[pointId] = 1;
};

/**
 * Find all neighbors around given point
 *
 * @param {number} pointId,
 * @param {number} epsilon
 * @returns {Array}
 * @access protected
 */
DBSCAN.prototype._regionQuery = function (pointId) {
    var neighbors = [];

    for (var id = 0; id < this._datasetLength; id++) {
        var dist = this.distance(this.dataset[pointId], this.dataset[id]);
        if (dist < this.epsilon) {
            neighbors.push(id);
        }
    }

    return neighbors;
};

/******************************************************************************/
// helpers

/**
 * @param {Array} a
 * @param {Array} b
 * @returns {Array}
 * @access protected
 */
DBSCAN.prototype._mergeArrays = function (a, b) {
    var len = b.length;

    for (var i = 0; i < len; i++) {
        var P = b[i];
        if (a.indexOf(P) < 0) {
            a.push(P);
        }
    }

    return a;
};

/**
 * Calculate euclidean distance in multidimensional space
 *
 * @param {Array} p
 * @param {Array} q
 * @returns {number}
 * @access protected
 */
DBSCAN.prototype._euclideanDistance = function (p, q) {
    var sum = 0;
    var i = Math.min(p.length, q.length);

    while (i--) {
        sum += (p[i] - q[i]) * (p[i] - q[i]);
    }

    return Math.sqrt(sum);
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DBSCAN;
}

/**
 * KMEANS clustering
 *
 * @author Lukasz Krawczyk <contact@lukaszkrawczyk.eu>
 * @copyright MIT
 */

/**
 * KMEANS class constructor
 * @constructor
 *
 * @param {Array} dataset
 * @param {number} k - number of clusters
 * @param {function} distance - distance function
 * @returns {KMEANS}
 */
function KMEANS(dataset, k, distance) {
    this.k = 3; // number of clusters
    this.dataset = []; // set of feature vectors
    this.assignments = []; // set of associated clusters for each feature vector
    this.centroids = []; // vectors for our clusters

    this.init(dataset, k, distance);
}

/**
 * @returns {undefined}
 */
KMEANS.prototype.init = function (dataset, k, distance) {
    this.assignments = [];
    this.centroids = [];

    if (typeof dataset !== 'undefined') {
        this.dataset = dataset;
    }

    if (typeof k !== 'undefined') {
        this.k = k;
    }

    if (typeof distance !== 'undefined') {
        this.distance = distance;
    }
};

/**
 * @returns {undefined}
 */
KMEANS.prototype.run = function (dataset, k) {
    this.init(dataset, k);

    var len = this.dataset.length;

    // initialize centroids
    for (var i = 0; i < this.k; i++) {
        this.centroids[i] = this.randomCentroid();
    }

    var change = true;
    while (change) {

        // assign feature vectors to clusters
        change = this.assign();

        // adjust location of centroids
        for (var centroidId = 0; centroidId < this.k; centroidId++) {
            var mean = new Array(maxDim);
            var count = 0;

            // init mean vector
            for (var dim = 0; dim < maxDim; dim++) {
                mean[dim] = 0;
            }

            for (var j = 0; j < len; j++) {
                var maxDim = this.dataset[j].length;

                // if current cluster id is assigned to point
                if (centroidId === this.assignments[j]) {
                    for (var dim = 0; dim < maxDim; dim++) {
                        mean[dim] += this.dataset[j][dim];
                    }
                    count++;
                }
            }

            if (count > 0) {
                // if cluster contain points, adjust centroid position
                for (var dim = 0; dim < maxDim; dim++) {
                    mean[dim] /= count;
                }
                this.centroids[centroidId] = mean;
            } else {
                // if cluster is empty, generate new random centroid
                this.centroids[centroidId] = this.randomCentroid();
                change = true;
            }
        }
    }

    return this.getClusters();
};

/**
 * Generate random centroid
 *
 * @returns {Array}
 */
KMEANS.prototype.randomCentroid = function () {
    var maxId = this.dataset.length - 1;
    var centroid;
    var id;

    do {
        id = Math.round(Math.random() * maxId);
        centroid = this.dataset[id];
    } while (this.centroids.indexOf(centroid) >= 0);

    return centroid;
}

/**
 * Assign points to clusters
 *
 * @returns {boolean}
 */
KMEANS.prototype.assign = function () {
    var change = false;
    var len = this.dataset.length;
    var closestCentroid;

    for (var i = 0; i < len; i++) {
        closestCentroid = this.argmin(this.dataset[i], this.centroids, this.distance);

        if (closestCentroid != this.assignments[i]) {
            this.assignments[i] = closestCentroid;
            change = true;
        }
    }

    return change;
}

/**
 * Extract information about clusters
 *
 * @returns {undefined}
 */
KMEANS.prototype.getClusters = function () {
    var clusters = new Array(this.k);
    var centroidId;

    for (var pointId = 0; pointId < this.assignments.length; pointId++) {
        centroidId = this.assignments[pointId];

        // init empty cluster
        if (typeof clusters[centroidId] === 'undefined') {
            clusters[centroidId] = [];
        }

        clusters[centroidId].push(pointId);
    }

    return clusters;
};

// utils

/**
 * @params {Array} point
 * @params {Array.<Array>} set
 * @params {Function} f
 * @returns {number}
 */
KMEANS.prototype.argmin = function (point, set, f) {
    var min = Number.MAX_VALUE;
    var arg = 0;
    var len = set.length;
    var d;

    for (var i = 0; i < len; i++) {
        d = f(point, set[i]);
        if (d < min) {
            min = d;
            arg = i;
        }
    }

    return arg;
};

/**
 * Euclidean distance
 *
 * @params {number} p
 * @params {number} q
 * @returns {number}
 */
KMEANS.prototype.distance = function (p, q) {
    var sum = 0;
    var i = Math.min(p.length, q.length);

    while (i--) {
        var diff = p[i] - q[i];
        sum += diff * diff;
    }

    return Math.sqrt(sum);
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = KMEANS;
}

/**
 * PriorityQueue
 * Elements in this queue are sorted according to their value
 *
 * @author Lukasz Krawczyk <contact@lukaszkrawczyk.eu>
 * @copyright MIT
 */

/**
 * PriorityQueue class construcotr
 * @constructor
 *
 * @example
 * queue: [1,2,3,4]
 * priorities: [4,1,2,3]
 * > result = [1,4,2,3]
 *
 * @param {Array} elements
 * @param {Array} priorities
 * @param {string} sorting - asc / desc
 * @returns {PriorityQueue}
 */
function PriorityQueue(elements, priorities, sorting) {
    /** @type {Array} */
    this._queue = [];
    /** @type {Array} */
    this._priorities = [];
    /** @type {string} */
    this._sorting = 'desc';

    this._init(elements, priorities, sorting);
};

/**
 * Insert element
 *
 * @param {Object} ele
 * @param {Object} priority
 * @returns {undefined}
 * @access public
 */
PriorityQueue.prototype.insert = function (ele, priority) {
    var indexToInsert = this._queue.length;
    var index = indexToInsert;

    while (index--) {
        var priority2 = this._priorities[index];
        if (this._sorting === 'desc') {
            if (priority > priority2) {
                indexToInsert = index;
            }
        } else {
            if (priority < priority2) {
                indexToInsert = index;
            }
        }
    }

    this._insertAt(ele, priority, indexToInsert);
};

/**
 * Remove element
 *
 * @param {Object} ele
 * @returns {undefined}
 * @access public
 */
PriorityQueue.prototype.remove = function (ele) {
    var index = this._queue.length;

    while (index--) {
        var ele2 = this._queue[index];
        if (ele === ele2) {
            this._queue.splice(index, 1);
            this._priorities.splice(index, 1);
            break;
        }
    }
};

/**
 * For each loop wrapper
 *
 * @param {function} func
 * @returs {undefined}
 * @access public
 */
PriorityQueue.prototype.forEach = function (func) {
    this._queue.forEach(func);
};

/**
 * @returns {Array}
 * @access public
 */
PriorityQueue.prototype.getElements = function () {
    return this._queue;
};

/**
 * @param {number} index
 * @returns {Object}
 * @access public
 */
PriorityQueue.prototype.getElementPriority = function (index) {
    return this._priorities[index];
};

/**
 * @returns {Array}
 * @access public
 */
PriorityQueue.prototype.getPriorities = function () {
    return this._priorities;
};

/**
 * @returns {Array}
 * @access public
 */
PriorityQueue.prototype.getElementsWithPriorities = function () {
    var result = [];

    for (var i = 0, l = this._queue.length; i < l; i++) {
        result.push([this._queue[i], this._priorities[i]]);
    }

    return result;
};

/**
 * Set object properties
 *
 * @param {Array} elements
 * @param {Array} priorities
 * @returns {undefined}
 * @access protected
 */
PriorityQueue.prototype._init = function (elements, priorities, sorting) {

    if (elements && priorities) {
        this._queue = [];
        this._priorities = [];

        if (elements.length !== priorities.length) {
            throw new Error('Arrays must have the same length');
        }

        for (var i = 0; i < elements.length; i++) {
            this.insert(elements[i], priorities[i]);
        }
    }

    if (sorting) {
        this._sorting = sorting;
    }
};

/**
 * Insert element at given position
 *
 * @param {Object} ele
 * @param {number} index
 * @returns {undefined}
 * @access protected
 */
PriorityQueue.prototype._insertAt = function (ele, priority, index) {
    if (this._queue.length === index) {
        this._queue.push(ele);
        this._priorities.push(priority);
    } else {
        this._queue.splice(index, 0, ele);
        this._priorities.splice(index, 0, priority);
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PriorityQueue;
}


/**
 * @requires ./PriorityQueue.js
 */

if (typeof module !== 'undefined' && module.exports) {
    var PriorityQueue = require('./PriorityQueue.js');
}

/**
 * OPTICS - Ordering points to identify the clustering structure
 *
 * @author Lukasz Krawczyk <contact@lukaszkrawczyk.eu>
 * @copyright MIT
 */

/**
 * OPTICS class constructor
 * @constructor
 *
 * @param {Array} dataset
 * @param {number} epsilon
 * @param {number} minPts
 * @param {function} distanceFunction
 * @returns {OPTICS}
 */
function OPTICS(dataset, epsilon, minPts, distanceFunction) {
    /** @type {number} */
    this.epsilon = 1;
    /** @type {number} */
    this.minPts = 1;
    /** @type {function} */
    this.distance = this._euclideanDistance;

    // temporary variables used during computation

    /** @type {Array} */
    this._reachability = [];
    /** @type {Array} */
    this._processed = [];
    /** @type {number} */
    this._coreDistance = 0;
    /** @type {Array} */
    this._orderedList = [];

    this._init(dataset, epsilon, minPts, distanceFunction);
}

/******************************************************************************/
// pulic functions

/**
 * Start clustering
 *
 * @param {Array} dataset
 * @returns {undefined}
 * @access public
 */
OPTICS.prototype.run = function (dataset, epsilon, minPts, distanceFunction) {
    this._init(dataset, epsilon, minPts, distanceFunction);

    for (var pointId = 0, l = this.dataset.length; pointId < l; pointId++) {
        if (this._processed[pointId] !== 1) {
            this._processed[pointId] = 1;
            this.clusters.push([pointId]);
            var clusterId = this.clusters.length - 1;

            this._orderedList.push(pointId);
            var priorityQueue = new PriorityQueue(null, null, 'asc');
            var neighbors = this._regionQuery(pointId);

            // using priority queue assign elements to new cluster
            if (this._distanceToCore(pointId) !== undefined) {
                this._updateQueue(pointId, neighbors, priorityQueue);
                this._expandCluster(clusterId, priorityQueue);
            }
        }
    }

    return this.clusters;
};

/**
 * Generate reachability plot for all points
 *
 * @returns {array}
 * @access public
 */
OPTICS.prototype.getReachabilityPlot = function () {
    var reachabilityPlot = [];

    for (var i = 0, l = this._orderedList.length; i < l; i++) {
        var pointId = this._orderedList[i];
        var distance = this._reachability[pointId];

        reachabilityPlot.push([pointId, distance]);
    }

    return reachabilityPlot;
};

/******************************************************************************/
// protected functions

/**
 * Set object properties
 *
 * @param {Array} dataset
 * @param {number} epsilon
 * @param {number} minPts
 * @param {function} distance
 * @returns {undefined}
 * @access protected
 */
OPTICS.prototype._init = function (dataset, epsilon, minPts, distance) {

    if (dataset) {

        if (!(dataset instanceof Array)) {
            throw Error('Dataset must be of type array, ' +
                typeof dataset + ' given');
        }

        this.dataset = dataset;
        this.clusters = [];
        this._reachability = new Array(this.dataset.length);
        this._processed = new Array(this.dataset.length);
        this._coreDistance = 0;
        this._orderedList = [];
    }

    if (epsilon) {
        this.epsilon = epsilon;
    }

    if (minPts) {
        this.minPts = minPts;
    }

    if (distance) {
        this.distance = distance;
    }
};

/**
 * Update information in queue
 *
 * @param {number} pointId
 * @param {Array} neighbors
 * @param {PriorityQueue} queue
 * @returns {undefined}
 * @access protected
 */
OPTICS.prototype._updateQueue = function (pointId, neighbors, queue) {
    var self = this;

    this._coreDistance = this._distanceToCore(pointId);
    neighbors.forEach(function (pointId2) {
        if (self._processed[pointId2] === undefined) {
            var dist = self.distance(self.dataset[pointId], self.dataset[pointId2]);
            var newReachableDistance = Math.max(self._coreDistance, dist);

            if (self._reachability[pointId2] === undefined) {
                self._reachability[pointId2] = newReachableDistance;
                queue.insert(pointId2, newReachableDistance);
            } else {
                if (newReachableDistance < self._reachability[pointId2]) {
                    self._reachability[pointId2] = newReachableDistance;
                    queue.remove(pointId2);
                    queue.insert(pointId2, newReachableDistance);
                }
            }
        }
    });
};

/**
 * Expand cluster
 *
 * @param {number} clusterId
 * @param {PriorityQueue} queue
 * @returns {undefined}
 * @access protected
 */
OPTICS.prototype._expandCluster = function (clusterId, queue) {
    var queueElements = queue.getElements();

    for (var p = 0, l = queueElements.length; p < l; p++) {
        var pointId = queueElements[p];
        if (this._processed[pointId] === undefined) {
            var neighbors = this._regionQuery(pointId);
            this._processed[pointId] = 1;

            this.clusters[clusterId].push(pointId);
            this._orderedList.push(pointId);

            if (this._distanceToCore(pointId) !== undefined) {
                this._updateQueue(pointId, neighbors, queue);
                this._expandCluster(clusterId, queue);
            }
        }
    }
};

/**
 * Calculating distance to cluster core
 *
 * @param {number} pointId
 * @returns {number}
 * @access protected
 */
OPTICS.prototype._distanceToCore = function (pointId) {
    var l = this.epsilon;
    for (var coreDistCand = 0; coreDistCand < l; coreDistCand++) {
        var neighbors = this._regionQuery(pointId, coreDistCand);
        if (neighbors.length >= this.minPts) {
            return coreDistCand;
        }
    }

    return;
};

/**
 * Find all neighbors around given point
 *
 * @param {number} pointId
 * @param {number} epsilon
 * @returns {Array}
 * @access protected
 */
OPTICS.prototype._regionQuery = function (pointId, epsilon) {
    epsilon = epsilon || this.epsilon;
    var neighbors = [];

    for (var id = 0, l = this.dataset.length; id < l; id++) {
        if (this.distance(this.dataset[pointId], this.dataset[id]) < epsilon) {
            neighbors.push(id);
        }
    }

    return neighbors;
};

/******************************************************************************/
// helpers

/**
 * Calculate euclidean distance in multidimensional space
 *
 * @param {Array} p
 * @param {Array} q
 * @returns {number}
 * @access protected
 */
OPTICS.prototype._euclideanDistance = function (p, q) {
    var sum = 0;
    var i = Math.min(p.length, q.length);

    while (i--) {
        sum += (p[i] - q[i]) * (p[i] - q[i]);
    }

    return Math.sqrt(sum);
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = OPTICS;
}

function Utils() {

}


KMEANS.prototype.getRandomVector = function (extremes) {
    var maxDim = extremes.length;
    var x = [];
    var r = 0;

    // calculate radius of n-sphere which covers all points in dataset
    var nSphereRadius = 0;
    for (var i = 0; i < maxDim; i++) {
        var extreme = extremes[i];
        var er = Math.max(extreme.center - extreme.min, extreme.center - extreme.max);
        if (er > nSphereRadius)
            nSphereRadius = er;
    }

    for (var i = 0; i < maxDim; i++) {
        var val = (Math.random() * 2) - 1;
        // adjust to radius of n-sphere
        x.push(val);
        r += val * val;
    }

    r = Math.sqrt(r);

    for (var i = 0; i < maxDim; i++) {
        x[i] /= r;
        // resize to fit n-sphere
        x[i] *= nSphereRadius;
        x[i] += extremes[i].center;
    }

    return x;
}


if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DBSCAN: require('./clustering.js'),
        KMEANS: require('./KMEANS.js'),
        OPTICS: require('./OPTICS.js'),
        PriorityQueue: require('./PriorityQueue.js')
    };
}