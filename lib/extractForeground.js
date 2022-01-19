//use this function for black background and white foreground
function getSegments(path){
    let imgElement = document.createElement("img");
    imgElement.setAttribute("src", path)
    let src = cv.imread(imgElement);
    cv.cvtColor(src, src, cv.COLOR_RGBA2RGB, 0);
    let mask = new cv.Mat();
    let bgdModel = new cv.Mat();
    let fgdModel = new cv.Mat();
    let rect = new cv.Rect(0, 0, src.rows, src.cols);
    cv.grabCut(src, mask, rect, bgdModel, fgdModel, 1, cv.GC_INIT_WITH_RECT);
    for (let i = 0; i < src.rows; i++) {
        for (let j = 0; j < src.cols; j++) {
            if (mask.ucharPtr(i, j)[0] == 0 || mask.ucharPtr(i, j)[0] == 2) {
                src.ucharPtr(i, j)[0] = 0;
                src.ucharPtr(i, j)[1] = 0;
                src.ucharPtr(i, j)[2] = 0;
            }else{
                src.ucharPtr(i, j)[0] = 255;
                src.ucharPtr(i, j)[1] = 255;
                src.ucharPtr(i, j)[2] = 255;
            }
        }
    }
    mask.delete(); bgdModel.delete(); fgdModel.delete();
    return src;
}


function getForeground(path){
    let imgElement = document.createElement("img");
    imgElement.setAttribute("src", path)
    let src = cv.imread(imgElement);
    cv.cvtColor(src, src, cv.COLOR_RGBA2RGB, 0);
    let mask = new cv.Mat();
    let bgdModel = new cv.Mat();
    let fgdModel = new cv.Mat();
    let rect = new cv.Rect(0, 0, src.rows, src.cols);
    cv.grabCut(src, mask, rect, bgdModel, fgdModel, 1, cv.GC_INIT_WITH_RECT);
    for (let i = 0; i < src.rows; i++) {
        for (let j = 0; j < src.cols; j++) {
            if (mask.ucharPtr(i, j)[0] == 0 || mask.ucharPtr(i, j)[0] == 2) {
                src.ucharPtr(i, j)[0] = 255;
                src.ucharPtr(i, j)[1] = 255;
                src.ucharPtr(i, j)[2] = 255;
            }
        }
    }
    mask.delete(); bgdModel.delete(); fgdModel.delete();
    return src;
}