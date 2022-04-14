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

function multiply(mat1, mat2, res)
{
    for(var row_of_a = 0; row_of_a < mat1.length; row_of_a++){
        for(var col_of_b = 0; col_of_b < mat2[0].length; col_of_b++){
            for(var elem = 0; elem < mat1[0].length; elem++){
                res[row_of_a] += mat1[row_of_a][elem] * mat2[elem][col_of_b]
            }
        }    
    }

    return res
}

function getCartesianOfBary(triangle, barypt){
    var cartesian = [0, 0]

    cartesian = multiply([[triangle.p1.x, triangle.p2.x, triangle.p3.x], [triangle.p1.y, triangle.p2.y, triangle.p3.y]], [[barypt.x], [barypt.y], [barypt.z]], cartesian)

    return cartesian
}

function distanceSq(x1, y1, x2, y2){
    return (x2 - x1) **2 + (y2 - y1) ** 2
}

var black = [0, 0, 0, 0]

function hideSubjectAt(seed, buffer, ksq){

    var k = ksq ** (1/2)

    for(var row = Math.max(0, seed.row - k); row < Math.min(RenderingHeight, seed.row + k); row++){
        for (var col = Math.max(0, seed.col - k); col < Math.min(RenderingWidth, seed.col + k); col++) {

            if( distanceSq(row, col, seed.row, seed.col) <= ksq ){
                setPixelOfRGBABuffer(col, row, buffer, black)
            }

        }
    }

}

function addNPoints(buffer, meta, k){
    var n = k
    
    while(n){
        
        var row = getRandomInt(meta.bb.first_row, meta.bb.last_row + 1)
        var col = getRandomInt(meta.bb.first_col, meta.bb.last_col + 1)
        
        var pix = getPixelsFromRGBABuffer(col, row, buffer)

        while(pix[0] == 0 && pix[1] == 0 && pix[2] == 0){
            var row = getRandomInt(meta.bb.first_row, meta.bb.last_row + 1)
            var col = getRandomInt(meta.bb.first_col, meta.bb.last_col + 1)

            pix = getPixelsFromRGBABuffer(col, row, buffer)
        }

        hideSubjectAt({row, col}, buffer, 900)

        n--
    }
}

var p1 = new THREE.Vector2(2,0)
var p2 = new THREE.Vector2(0,0)
var p3 = new THREE.Vector2(0,2)

var b = getBaryOfCoord({ p1, p2, p3 }, { x: -2, y: -2})

console.log("bary", b.x, b.y, b.z)
console.log("cartesian", getCartesianOfBary({p1, p2, p3}, b))