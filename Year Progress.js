// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: spinner;
const cdate = new Date()
console.log(cdate)

const hour = cdate.getHours()
const day = cdate.getDay() == 0 ? 6 : cdate.getDay() - 1
const date = cdate.getDate() - 1
const month = cdate.getMonth() + 1
const year = cdate.getFullYear()

let isLeap = false

if (year%4 == 0) {
	isLeap = true
	if (year%100 == 0) {
		isLeap = false
		if (year%400 == 0) {
			isLeap = true
		}
	}
}

let dayProgress = 0
let weekProgress = 0
let monthProgress = 0
let yearProgress = 0
let daysElapsed = 0

function progress(value, total) {
	let percent = value*100/total
	return (Math.floor(percent))
}

dayProgress = progress((hour)*60 + (cdate.getMinutes()), 24*60)
weekProgress = progress(day, 7)

switch(month) {
	case 1 :
	case 3 :
	case 5 :
	case 7 :
	case 8 :
	case 10 :
	case 12 :
		monthProgress = progress(date, 31)
		break
	
	case 4 :
	case 6 :
	case 9 :
	case 11 :
		monthProgress = progress(date, 30)
		break
		
	case 2 :
		if(isLeap) {
			monthProgress = progress(date, 29)
		} else {
			monthProgress = progress(date, 28)
		}
}

switch(month) {
	case 1 :
		daysElapsed = date
		break
	case 2 :
		daysElapsed = date + 31*1 + 30*0
		break
	case 3 :
		daysElapsed = date + 31*1 + 30*0 + 28
		break
	case 4 :
		daysElapsed = date + 31*2 + 30*0 + 28
		break
	case 5 :
		daysElapsed = date + 31*2 + 30*1 + 28
		break
	case 6 :
		daysElapsed = date + 31*3 + 30*1 + 28
		break
	case 7 :
		daysElapsed = date + 31*3 + 30*2 + 28
		break
	case 8 :
		daysElapsed = date + 31*4 + 30*2 + 28
		break
	case 9 :
		daysElapsed = date + 31*5 + 30*2 + 28
		break
	case 10 :
		daysElapsed = date + 31*5 + 30*3 + 28
		break
	case 11 :
		daysElapsed = date + 31*6 + 30*3 + 28
		break
	case 12 :
		daysElapsed = date + 31*6 + 30*4 + 28
		break
}

if(isLeap && (month > 2)) {
	daysElapsed = daysElapsed + 1
}

if(isLeap) {
	yearProgress = progress(daysElapsed, 366)
} else {
	yearProgress = progress(daysElapsed, 365)
}

let myWidget = new ListWidget()
myWidget.backgroundColor = new Color("#222222")

makeElememt(dayProgress, "Today")
makeElememt(weekProgress, "This Week")
makeElememt(monthProgress, "This Month")
makeElememt(yearProgress, "This Year")


myWidget.presentSmall()
Script.setWidget(myWidget)
Script.complete()

function progressBar(percent) {
	const canvas = new DrawContext()
	canvas.opaque = false
	canvas.respectScreenScale = true
	canvas.size = new Size(240, 5)
	
	canvas.setFillColor(new Color("#48484b"))
	const path1 = new Path()
	path1.addRoundedRect(new Rect(0, 0, 240, 5), 3, 2)
	canvas.addPath(path1)
	canvas.fillPath()
// 	e04483
	canvas.setFillColor(new Color("#e04483"))
	const path2 = new Path()
	path2.addRoundedRect(new Rect(0, 0, 2.4*percent, 5), 3, 2)
	canvas.addPath(path2)
	canvas.fillPath()
	
	return canvas.getImage()
}
// console.log(dayProgress)
// console.log(weekProgress)
// console.log(monthProgress)
// console.log(yearProgress)

// adc241
function makeElememt(percent, text) {
	const title = myWidget.addText(text)
	title.font = Font.boldSystemFont(13)
	title.textColor = new Color("#e4e2ef")
	myWidget.addSpacer(6)
	const bar = myWidget.addImage(progressBar(percent))
	bar.size = new Size(240, 5)
	myWidget.addSpacer(6)
}