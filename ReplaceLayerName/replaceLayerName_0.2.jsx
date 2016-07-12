#target photoshop

var targetLayers = [];


function main(){
 
	var values = makeWindow();
    if (values.status == 2) { return };
    
    var layers = app.activeDocument.layers;
    pushLayers(layers);
    
    var cnt = targetLayers.length;
    for (var i = 0; i < cnt; i++) {
        var tgtLayer = targetLayers[i];
        var isVisible = tgtLayer.visible;
        var layerName = tgtLayer.name;
        var newName = layerName.replace(values.origText, values.repText);

        if (layerName != newName) {
            tgtLayer.name = newName;
            tgtLayer.visible = isVisible;
        }
	}
}


function makeWindow() {
    
    var winObj = new Window ("dialog", "Form"); 

    var origInputGroup = winObj.add ("group");
    origInputGroup.alignment = "right"
    origInputGroup.add ("statictext", undefined, "検索:");
    var origText = origInputGroup.add ("edittext", undefined, "");
    origText.characters = 20;
    origText.active = true;

    var repInputGroup = winObj.add ("group");
    repInputGroup.alignment = "right"
    repInputGroup.add ("statictext", undefined, "置換文字列:");
    var repText = repInputGroup.add ("edittext", undefined, "");
    repText.characters = 20;

    var btnGroup = winObj.add ("group");
    btnGroup.alignment = "right"; 
    btnGroup.add ("button", undefined, "Cancel");
    btnGroup.add ("button", undefined, "OK"); 
    
    var status = winObj.show()
    
    return {origText: origText.text, repText: repText.text, status: status};

}


function pushLayers(layers){
	var cnt = layers.length;
	for (var i = 0; i < cnt; i++) {
		var layer = layers[i];
		if (layer.typename == "LayerSet") {
			pushLayers(layer.layers);
		}
		targetLayers.push(layer);
	}
}

/*
function replaceAll(target, orgTxt, repTxt){
	var reg = new RegExp(orgTxt, "g");
	return target.replace(reg, repTxt);
}
*/


if (app.documents.length == 0) {
	alert("画像が開かれていません。"); 
} else {
	main();
}