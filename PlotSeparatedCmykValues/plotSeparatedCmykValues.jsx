#target Photoshop

function setRgb(r, g, b){
	colObj = new SolidColor()
	colObj.rgb.red = r;
	colObj.rgb.green = g;
	colObj.rgb.blue = b;
	return colObj;
}

function plotColor(c_val, plot_color){
	c_val *=  plot_ratio;
	doc.selection.select([[510-i*2, 290-c_val-1.5], [510-i*2+2, 290-c_val-1.5], [510-i*2+2, 290-c_val+1], [510-i*2, 290-c_val+1]]);
	doc.selection.fill(plot_color, ColorBlendMode.NORMAL, 100, false);
}

function makeText(props) {
	lay = doc.artLayers.add();
	lay.kind = LayerKind.TEXT;
	ti = lay.textItem
	ti.font = 'HiraMinPro-W6';
	ti.contents = props.contents;
	ti.size = props.size;
	ti.color = props.color;
	ti.position = props.position;	
}

var ru = app.preferences.rulerUnits;
app.preferences.rulerUnits = Units.PIXELS;
var doc = app.documents.add(512, 320, 72, "CMYK Separation Curves", NewDocumentMode.CMYK);
var profile_name = doc.colorProfileName;
doc.changeMode(ChangeMode.RGB);

var colors = {
	'cyan': setRgb(0, 255, 255),
	'magenta': setRgb(255, 0, 255),
	'yellow': setRgb(255, 255, 0),
	'black': setRgb(0, 0, 0),
	'gray': setRgb(128, 128, 128),
	'white': setRgb(255, 255, 255),
	'line': setRgb(116, 116, 116)
};

var plot_ratio = 2.5;

doc.selection.selectAll();
doc.selection.fill(colors.gray, ColorBlendMode.NORMAL, 100, false);

for (var i=40; i<290; i+=25) {
	doc.selection.select([[0, i],[512, i],[512, i+1],[0, i+1]]);
	doc.selection.fill(colors.line, ColorBlendMode.NORMAL, 100, false);
}
var tgt_color = new SolidColor();

for (var i=255; i>-1; i--) {
	doc.selection.select([[510-i*2, 290], [510-i*2+2, 290], [510-i*2+2, 320], [510-i*2, 320]]);
	tgt_color.rgb.red = i;
	tgt_color.rgb.green = i;
	tgt_color.rgb.blue = i;
	doc.selection.fill(tgt_color, ColorBlendMode.NORMAL, 100, false);
	plotColor(tgt_color.cmyk.cyan, colors.cyan);
	plotColor(tgt_color.cmyk.magenta, colors.magenta);
	plotColor(tgt_color.cmyk.yellow, colors.yellow);
	plotColor(tgt_color.cmyk.black, colors.black);
}

doc.selection.deselect();
var max_cmyk = tgt_color.cmyk;
var total = max_cmyk.cyan + max_cmyk.magenta + max_cmyk.yellow + max_cmyk.black;
var ink_info = 'Max\r'
			+ 'Cyan : ' + Math.round(max_cmyk.cyan) + '%\r'
			+ 'Magenta : ' + Math.round(max_cmyk.magenta) + '%\r'
			+ 'Yellow : ' + Math.round(max_cmyk.yellow) + '%\r'
			+ 'Black : ' + Math.round(max_cmyk.black) + '%';
			
makeText({'contents': profile_name, 'size': 20, 'color': colors.white, 'position': [10, 30]});
makeText({'contents': ink_info, 'size': 12, 'color': colors.white, 'position': [10, 55]});
makeText({'contents': 'Total\r' + Math.round(total) + '%', 'size': 12, 'color': colors.white, 'position': [120, 55]});

app.preferences.rulerUnits = ru;
