// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: trophy;
const fm = FileManager.local();

const playerTag = args.widgetParameter;

const path1 = fm.joinPath(fm.documentsDirectory(), "cardIcon"+playerTag.slice(1));
const path2 = fm.joinPath(fm.documentsDirectory(), playerTag.slice(1) + ".txt");

const key = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImViNzVhNThkLTAxZGMtNGM0Ni05Y2JmLWI3ZTA5MmQyZmMyZSIsImlhdCI6MTYwMzgxNTg4MCwic3ViIjoiZGV2ZWxvcGVyLzIxYzQ3MTcyLTFlZGEtMzRiZC0wM2NiLTViNzgyOWJkMmI2MiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIxMjguMTI4LjEyOC4xMjgiXSwidHlwZSI6ImNsaWVudCJ9XX0.429Dcum1O_0Mepd0A4oYbKhFL7BZlnPZ1fOTo6me2-ePAY5-M-4FOcazP2v0tpRg7BGn4j1g82bdSTd0FnmQvA";

let res = "";
let im = "";
const req = new Request("https://proxy.royaleapi.dev/v1/players/%23"+playerTag.slice(1));

req.headers = {"Accept":"application/json", "Authorization":"Bearer " + key};
try {
	res = await req.loadJSON();
	const img = new Request(res.currentFavouriteCard.iconUrls.medium);
	im = await img.loadImage();
	fm.writeImage(path1, im)
	fm.writeString(path2, JSON.stringify(res))
}catch {
	res = JSON.parse(fm.readString(path2));
	im = fm.readImage(path1);
}

const playerName = res.name;
const cardName = res.currentFavouriteCard.name;


const widget = createWidget();


Script.setWidget(widget);
Script.complete();

function createWidget() {
	const myWidget = new ListWidget();
	
	const player = myWidget.addText(playerName)
	player.font = new Font("Supercell-Magic", 13);
	player.centerAlignText();
	
	myWidget.addSpacer(4);
	
	const icon = myWidget.addImage(im);
	icon.centerAlignImage();
	const color1 = new Color("#c31432");
	const color2 = new Color("#240b36");
	
	myWidget.addSpacer(3);
	
	const name = myWidget.addText(cardName);
	name.centerAlignText();
	name.font = new Font("Supercell-Magic", 13);
	
	const gradient = new LinearGradient();
	gradient.colors = [color1, color2];
	gradient.locations = [0, 1];
	
	myWidget.backgroundGradient = gradient;
	
	myWidget.presentSmall();
	return myWidget;
}