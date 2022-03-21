// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: wifi;
// This widget basically displays the current song that you are listening to
// it also takes care of cases like when you are not connected to internet and the request fails
// by saving the last succesful JSON
const clientId = "<clientId here>";
const clientSecret = "<clientSecret here>";
const userId = "me";

let fm = FileManager.local();
let dir = fm.documentsDirectory()+"/spotifyWidget/";

let path1 = fm.joinPath(dir, "accessToken.txt");
let authToken = Data.fromFile(path1);
let path2 = fm.joinPath(dir,"refreshToken.txt");
let refToken = Data.fromFile(path2);

let path3 = fm.joinPath(dir, "obtainedJS");
let obtainedJS = {};
let path4 = fm.joinPath(dir, "coverImage");
let res = {};


let url = "https://api.spotify.com/v1/"+userId+"/player/currently-playing?market=IN";

try{
	let req = new Request(url);
	req.headers = {"Authorization":"Bearer "+authToken.toRawString(), "Accept":"application/json", "Content-Type":"application/json"};
	res = await req.loadJSON();
	obtainedJS = res;
	if (res.error != null) {
		let req2 = new Request("https://accounts.spotify.com/api/token");
		req2.method = "POST";
		req2.headers = {Authorization: "Basic " + btoa(clientId +":"+clientSecret),"Content-Type":"application/x-www-form-urlencoded"};
		req2.body = "grant_type=refresh_token&refresh_token="+refToken.toRawString();
		let res2 = await req2.loadJSON();
		fm.writeString(path1, res2.access_token);
		const newToken = Data.fromFile(path1);
		req = new Request(url);
		req.headers = {"Authorization":"Bearer  "+newToken.toRawString(), "Accept":"application/json", "Content-Type":"application/json"};
		obtainedJS = await req.loadJSON();
	}
	// 	To escape ads
	if (typeof(res.item.name) != null) {
		fm.writeString(path3, JSON.stringify(res));
	}
}catch{
	obtainedJS = JSON.parse(fm.readString(path3));
}
console.log(obtainedJS)

const songName = obtainedJS.item.name;
const artistName = obtainedJS.item.album.artists[0].name;

let coverImage = ""

try {
	let reqI = new Request(obtainedJS.item.album.images[0].url);
	coverImage = await reqI.loadImage();
	fm.writeImage(path4, coverImage);
}catch {
	coverImage = fm.readImage(path4)
}

// console.log(obtainedJS.item.album.images[0].url)

let widget = createWidget();

Script.setWidget(widget);
Script.complete();


function createWidget() {
	
	let myWidget = new ListWidget();
	
	myWidget.backgroundImage = fm.readImage(dir + "backgroundSpotify");
	
	myWidget.addSpacer(4);
	
	let stack = myWidget.addStack();
	stack.backgroundImage = fm.readImage(dir + "backgroundSpotify");
	let cover = stack.addImage(coverImage);
	cover.imageSize = new Size(108, 108);
	cover.leftAlignImage();
	cover.cornerRadius = 5;
	
	stack.addSpacer(8);
	
	let icon = stack.addImage(fm.readImage(dir + "iconSpotify"));
	icon.imageSize = new Size(30, 30);
	
	myWidget.addSpacer(5);
	
	let song = myWidget.addText(songName+"-"+artistName);
	
	song.font = Font.mediumRoundedSystemFont(14);
	song.textColor = new Color("#ffffff");
	song.leftAlignText();	
	return myWidget;
}
