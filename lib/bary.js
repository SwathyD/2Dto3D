var _p1  = new THREE.Vector2(0, 0)
var _p2  = new THREE.Vector2(0, 0)
var _mat = new THREE.Matrix3()

function transform(triangle){

    var elements = [0, 0, 0,   0, 0, 0,   0, 0, 0]

    elements[0] = (triangle.p2.x * triangle.p3.y) - (triangle.p3.x * triangle.p2.y)
    elements[1] = triangle.p2.y - triangle.p3.y
    elements[2] = triangle.p3.x - triangle.p2.x

    elements[3] = (triangle.p3.x * triangle.p1.y) - (triangle.p1.x * triangle.p3.y)
    elements[4] = triangle.p3.y - triangle.p1.y
    elements[5] = triangle.p1.x - triangle.p3.x
    
    elements[6] = (triangle.p1.x * triangle.p2.y) - (triangle.p2.x * triangle.p1.y)
    elements[7] = triangle.p1.y - triangle.p2.y
    elements[8] = triangle.p2.x - triangle.p1.x

    _mat.set(
            elements[0], elements[1], elements[2],
            elements[3], elements[4], elements[5],
            elements[6], elements[7], elements[8],
    )

    return _mat
}

function getSignedAreaOf(triangle){
    return triangle.p1.x * (triangle.p2.y - triangle.p3.y) + triangle.p2.x * (triangle.p3.y - triangle.p1.y) + triangle.p3.x * (triangle.p1.y - triangle.p2.y)
}

function getBaryOfCoord(triangle, pt){
    var bary = new THREE.Vector3(1, pt.x, pt.y)

    bary.applyMatrix3(transform(triangle))
    bary.multiplyScalar(1 / getSignedAreaOf(triangle) )

    return bary
}

var p1 = new THREE.Vector2(2,0)
var p2 = new THREE.Vector2(0,0)
var p3 = new THREE.Vector2(0,2)

var b = getBaryOfCoord({ p1, p2, p3 }, { x: 0.67, y: 0.67})

console.log("bary", b.x, b.y, b.z)