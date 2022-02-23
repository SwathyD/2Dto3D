function XYZ(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
}

var EPS = 0;

function LineLineIntersect(p1, p2, p3, p4) {
    var p13 = new XYZ()
    var p43 = new XYZ()
    var p21 = new XYZ();
    var d1343, d4321, d1321, d4343, d2121;
    var numer, denom;

    p13.x = p1.x - p3.x;
    p13.y = p1.y - p3.y;
    p13.z = p1.z - p3.z;
    p43.x = p4.x - p3.x;
    p43.y = p4.y - p3.y;
    p43.z = p4.z - p3.z;
    if (Math.abs(p43.x) < EPS && Math.abs(p43.y) < EPS && Math.abs(p43.z) < EPS)
        return { status: false };

    p21.x = p2.x - p1.x;
    p21.y = p2.y - p1.y;
    p21.z = p2.z - p1.z;
    if (Math.abs(p21.x) < EPS && Math.abs(p21.y) < EPS && Math.abs(p21.z) < EPS)
        return { status: false };

    d1343 = p13.x * p43.x + p13.y * p43.y + p13.z * p43.z;
    d4321 = p43.x * p21.x + p43.y * p21.y + p43.z * p21.z;
    d1321 = p13.x * p21.x + p13.y * p21.y + p13.z * p21.z;
    d4343 = p43.x * p43.x + p43.y * p43.y + p43.z * p43.z;
    d2121 = p21.x * p21.x + p21.y * p21.y + p21.z * p21.z;

    denom = d2121 * d4343 - d4321 * d4321;
    if (Math.abs(denom) < EPS)
        return { status: false };

    numer = d1343 * d4321 - d1321 * d4343;

    var mua = numer / denom;
    var mub = (d1343 + d4321 * mua) / d4343;

    var pa = new XYZ()
    var pb = new XYZ()

    pa.x = p1.x + mua * p21.x;
    pa.y = p1.y + mua * p21.y;
    pa.z = p1.z + mua * p21.z;
    pb.x = p3.x + mub * p43.x;
    pb.y = p3.y + mub * p43.y;
    pb.z = p3.z + mub * p43.z;

    return { status: true, pa, pb, mua, mub };
}

function intersectionHelper(l1start, l1end, l2start, l2end) {
    var vertical_line_start   = l1start;
    var vertical_line_end     = l1end;
    var horizontal_line_start = l2start;
    var horizontal_line_end   = l2end;

    // createLine(l1start, l1end, getRandomInt(0, 16777215 + 1), true)
    // createLine(l2start, l2end, getRandomInt(0, 16777215 + 1), true)

    var { status, pa, pb, mua, mub } = LineLineIntersect(vertical_line_start, vertical_line_end, horizontal_line_start, horizontal_line_end);

    // if (status) {
        // createLine(pa, pb, getRandomInt(0, 16777215 + 1), true)
        // console.log("Nearest Points Distance: ", (pa.x - pb.x) ** 2 + (pa.y - pb.y) ** 2 + (pa.z - pb.z) ** 2)
    // }

    return {dist: (pa.x - pb.x) ** 2 + (pa.y - pb.y) ** 2 + (pa.z - pb.z) ** 2, pa, pb}
}
