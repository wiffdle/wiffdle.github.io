let siteWidth = 1280;
let scale = screen.width / siteWidth;
document.querySelector('meta[name="viewport"]').setAttribute('content', 'width='+siteWidth+', initial-scale='+scale+'');

const playerList = [
  "Alec Warda",
  "Ryan Kracht",
  "Brennan Russel",
  "Steven McGlade",
  "Mac Hawley",
  "Kyle Schultz",
  "Nick Saylor",
  "Jaxen Pearson",
  "Ty Smith",
  "Trevor Bonham",
  "Jack Aigner",
  "Jordan Kurdi",
  "Liam Jackson",
  "James Swanson",
  "Drew Davis",
  "Sean Flynn",
  "Andy Durand",
  "Sawyer Behen",
  "Brendan Baranoski",
  "Gus",
  "Brendan Szerlag",
  "Brendan Jorgensen",
  "Chris Cheetam",
  "Jason Chadwick",
  "Reese Harris",
  "Daniel Schultz",
  "Landon Yurgaites",
  "Zach Whalen",
  "Dallas Allen",
  "Blade Walker",
  "Jimmy Knorp",
  "Jonah Heath",
  "Michael Schema",
  "Casey Bennet",
  "Trey Flood",
  "Tommy Coughlin",
  "Jordan Robles",
  "Caden Irwin",
  "Ben Wilson",
  "Brendan Davenport"
];


function getRandomTeamId() {
    const teamIds = [1,2,4,5,6,7,8,9,10,11,14,15,16,17,19,20,21,22,23,24,25,26,27,28,29,30,31,38,40,41];
    let id = 3;
    while(!teamIds.includes(id)){
        min = Math.ceil(1);
        max = Math.floor(41);
        id = Math.floor(Math.random() * (41 - 1) + 1);
    }
    return id;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}


function getRandomPlayer(){
    let pName = playerList[getRandomInt(0,playerList.length)].replace(/\s/g, "").replace(/\'/g,'').replace(/\./g,'').replace(/\-/g,'');
    let fn = window[pName];
    if(typeof fn === "function"){
        actual = fn();
        if(actual.number < "0") getRandomPlayer();
    }
}


function getPlayer(guessName){
    let pName = guessName.replace(/\s/g, "").replace(/\'/g,'').replace(/\./g,'').replace(/\-/g,'');
    let fn = window[pName];
    if(typeof fn === "function"){
        guesses.push(fn());
    }
}

function DarkMode()
{
  Background = document.querySelector("body");
  if(Background.classList.contains("Dark")){
    Background.classList.add("Light");
    Background.classList.remove("Dark");
  }
  else{
    Background.classList.add("Dark");
    Background.classList.remove("Light");
  }
}

function createLabel(){
    for(let c = 0; c < 7; c++){
        let tile = document.createElement("span");
        if(c == 0){
            tile.classList.add("label-tile-first");
            tile.innerText = "NAME";
        }
        else{
            tile.classList.add("label-tile");
            if(c == 1) tile.innerText = "TEAM";
            else if(c == 2) tile.innerText = "NUMBER";
            else if(c == 3) tile.innerText = "LEAGUE";
            else if(c == 4) tile.innerText = "ASG APP 2017+";
            else if(c == 5) tile.innerText = "WS WINS";
            else if(c == 6) tile.innerText = "STARTED";
        }
        document.getElementById("label").appendChild(tile);
    }
}

function createRow(rowNum){
    document.getElementById("board").style.height += 100;
    let r = rowNum;
    for(let c = 0; c < 7; c++){
        let tile = document.createElement("span");
        tile.id = r.toString() + "-" + c.toString();
        if(c == 0){
            tile.classList.add("name-tile");
        }
        else{
            tile.classList.add("tile");
        }
        tile.innerText = "";
        document.getElementById("board").appendChild(tile);
    }
}

let actual = {};
let player = {};
const guesses = [];
let canPlay = true;
let currGuess = 0;
let playersArray = [];


window.onload = function(){
    init();
}

function init(){
  getRandomPlayer();
  document.getElementById("message").remove()
  document.querySelector(".guess").classList.remove("hidden");
  document.querySelector(".btn").classList.remove("hidden");
  createLabel();
  document.querySelector(".guess").addEventListener("keydown", (e) => {
      processInput(e);
  });


  document.querySelector(".guess").addEventListener("input", (e) => {
      playersArray = [];
      if(e.target.value){
          playersArray = playerList.filter(p => p.toLowerCase().replace(/\s/g,"").replace(/\'/g,'').replace(/\./g,'').replace(/\-/g,'').includes(e.target.value.toLowerCase().replace(/\s/g,"").replace(/\'/g,'').replace(/\./g,'').replace(/\-/g,'')));
          playersArray = playersArray.map(p => `<li><button id="p${playersArray.indexOf(p)}" class="option" onclick="clickGuess('${p}')">${p}</button></li>`);
      }
      showPlayersArray(playersArray.slice(0,5));
  });
}

function clickGuess(desired){
  let guessedName = desired;
  showPlayersArray([]);
  getPlayer(guessedName);
  guess();
  if(canPlay) document.querySelector(".guess").value = "";
}

function showPlayersArray(playersArray){
    const html = !playersArray.length ? "" : playersArray.join("");
    document.getElementById("results").innerHTML = html;
}

function processInput(e){
    if(currGuess > 7) return;

    if(e.code == "Enter" && document.querySelector(".guess").value != "" && playersArray.length !== 0){ 
      let guessedName;
      if(document.querySelector(".selected") == null){
        guessedName = playersArray[0].slice(playersArray[0].indexOf(">",6) + 1, playersArray[0].indexOf("<",6));
      }
      else{
        let selectedId = Number(document.querySelector(".selected").id.slice(1,2));
        guessedName = playersArray[selectedId].slice(playersArray[selectedId].indexOf(">",6) + 1, playersArray[selectedId].indexOf("<",6));
      }
      showPlayersArray([]);
      getPlayer(guessedName);
      guess();
      if(canPlay) document.querySelector(".guess").value = "";
    }

    if(e.code == "ArrowDown" && document.querySelector(".guess").value != "" && playersArray.length !== 0){
      if(document.querySelector(".selected") == null){
        document.getElementById("p0").classList.add("selected");
      }
      else{
        if(document.querySelector(".selected").id == "p4"){
          document.getElementById("p4").classList.remove("selected");
          document.getElementById("p0").classList.add("selected");
        }
        else{
          let currId = document.querySelector(".selected").id;
          let newId = "p" + (Number(currId.slice(1,2)) + 1).toString();
          document.getElementById(currId).classList.remove("selected");
          document.getElementById(newId).classList.add("selected");
        }
      }
    }

    if(e.code == "ArrowUp" && document.querySelector(".guess").value != "" && playersArray.length !== 0){
      if(document.querySelector(".selected") == null){
        document.getElementById("p4").classList.add("selected");
      }
      else{
        if(document.querySelector(".selected").id == "p0"){
          document.getElementById("p0").classList.remove("selected");
          document.getElementById("p4").classList.add("selected");
        }
        else{
          let currId = document.querySelector(".selected").id;
          let newId = "p" + (Number(currId.slice(1,2)) - 1).toString();
          document.getElementById(currId).classList.remove("selected");
          document.getElementById(newId).classList.add("selected");
        }
      }
    }
}

function guess(){
  Explainer = document.getElementById("explainer");
  Explainer.style.display="none";
    if(currGuess <= 7){
        let guessed = guesses[currGuess];
        createRow(currGuess);
        
        //NAME
        document.getElementById(`${currGuess}-0`).innerText = guessed.name;

        //TEAM
        document.getElementById(`${currGuess}-1`).innerText = guessed.team;
        if(guessed.team === actual.team) document.getElementById(`${currGuess}-1`).classList.add("correct");

        //NUMBER
        document.getElementById(`${currGuess}-2`).innerText = guessed.number;
        if(guessed.number === actual.number) document.getElementById(`${currGuess}-2`).classList.add("correct");

        //LEAGUE
        document.getElementById(`${currGuess}-3`).innerText = guessed.league;
        if(guessed.league === actual.league) document.getElementById(`${currGuess}-3`).classList.add("correct");

        //ALL STAR GAME APPEARANCES
        document.getElementById(`${currGuess}-4`).innerText = guessed.allstargameappearances;
        if(guessed.allstargameappearances === actual.allstargameappearances) document.getElementById(`${currGuess}-4`).classList.add("correct");

        //WORLD SERIES WINS
        document.getElementById(`${currGuess}-5`).innerText = guessed.worldserieswins;
        if(guessed.worldserieswins === actual.worldserieswins) document.getElementById(`${currGuess}-5`).classList.add("correct");

        //YEAR STARTED
        document.getElementById(`${currGuess}-6`).innerText = guessed.started;
        if(guessed.started === actual.started) document.getElementById(`${currGuess}-6`).classList.add("correct");



        if(guessed.name === actual.name) {
          document.getElementById(`${currGuess}-0`).classList.add("correct");
          canPlay = false;
          document.querySelector(".guess").classList.add("locked");
          document.querySelector(".guess").value = `You guessed it in ${currGuess+1} tries!`;
          document.getElementById("playAgain").setAttribute("onclick", "window.location.reload();");
          document.query("guess")
       }
        
        currGuess++;
    }
    else{
        //SHOW ACTUAL PLAYER AND FILL RED
        createRow(7);
        document.getElementById("7-0").innerText = actual.name;
        document.getElementById("7-0").classList.add("incorrect");
        document.getElementById("7-1").innerText = actual.team;
        document.getElementById("7-1").classList.add("incorrect");
        document.getElementById("7-2").innerText = actual.number;
        document.getElementById("7-2").classList.add("incorrect");
        document.getElementById("7-3").innerText = actual.league;
        document.getElementById("7-3").classList.add("incorrect");
        document.getElementById("7-4").innerText = actual.allstargameappearances;
        document.getElementById("7-4").classList.add("incorrect");
        document.getElementById("7-5").innerText = actual.worldserieswins;
        document.getElementById("7-5").classList.add("incorrect");
        document.getElementById("7-6").innerText = actual.started;
        document.getElementById("7-6").classList.add("incorrect");
        canPlay = false;
        document.querySelector(".guess").classList.add("locked");
        document.querySelector(".guess").value = "Game Over";
        document.getElementById("playAgain").setAttribute("onclick", "window.location.reload();");
    }
}




//PLAYER LIST


function AlecWarda() {
    return {
      name: "Alec Warda",
      team: "Preds",
      number: 25,
      league: "AL",
      allstargameappearances: 6,
      worldserieswins: 1,
      started:2013
    };
}
function RyanKracht() {
  return {
    name: "Ryan Kratch",
    team: "Preds",
    number: 7,
    league: "AL",
    allstargameappearances: 5,
    worldserieswins: 2,
    started:2015
  };
}
function BrennanRussel(){
  return {
    name: "Brennan Russel",
    team: "Preds",
    number: 5,
    league: "AL",
    allstargameappearances: 1,
    worldserieswins: 1,
    started:2015
  };
}
function StevenMcGlade(){
  return {
    name: "Steven McGlade",
    team: "Preds",
    number: 2,
    league: "AL",
    allstargameappearances: 0,
    worldserieswins: 0,
    started:2021
  };
}
function MacHawley(){
  return {
    name: "Mac Hawley",
    team: "Preds",
    number: 9,
    league: "AL",
    allstargameappearances: 0,
    worldserieswins: 0,
    started:2022
  };
}
function KyleSchultz(){
  return {
    name: "Kyle Schultz",
    team: "Wildcats",
    number: 28,
    league: "AL",
    allstargameappearances: 6,
    worldserieswins: 6,
    started:2010
  };
}
function NickSaylor(){
  return {
    name: "Nick Saylor",
    team: "Wildcats",
    number: 9,
    league: "AL",
    allstargameappearances: 3,
    worldserieswins: 0,
    started:2020
  };
}
function JaxenPearson(){
  return {
    name: "Jaxen Pearson",
    team: "Wildcats",
    number: 41,
    league: "AL",
    allstargameappearances: 1,
    worldserieswins: 0,
    started:2021
  };
}
function TySmith(){
  return {
    name: "Ty Smith",
    team: "Wildcats",
    number: 1,
    league: "AL",
    allstargameappearances: 0,
    worldserieswins: 0,
    started:2022
  };
}
function TrevorBonham(){
  return {
    name: "Trevor Bonham",
    team: "Magic",
    number: 2,
    league: "AL",
    allstargameappearances: 3,
    worldserieswins: 0,
    started:2020
  };
}
function JackAigner(){
  return {
    name: "Jack Aigner",
    team: "Magic",
    number: 92,
    league: "AL",
    allstargameappearances: 2,
    worldserieswins: 0,
    started:2016
  };
}
function JordanKurdi(){
  return {
    name: "Jordan Kurdi",
    team: "Magic",
    number: 1,
    league: "AL",
    allstargameappearances: 0,
    worldserieswins: 0,
    started:2021
  };
}
function LiamJackson(){
  return {
    name: "Liam Jackson",
    team: "Magic",
    number: 15,
    league: "AL",
    allstargameappearances: 0,
    worldserieswins: 0,
    started:2020
  };
}
function JamesSwanson(){
  return {
    name: "James Swanson",
    team: "Magic",
    number: 10,
    league: "AL",
    allstargameappearances: 0,
    worldserieswins: 0,
    started:2020
  };
}
function DrewDavis(){
  return {
    name: "Drew Davis",
    team: "Cobras",
    number: 2,
    league: "AL",
    allstargameappearances: 6,
    worldserieswins: 0,
    started:2016
  };
}
function SeanFlynn(){
  return {
    name: "Sean Flynn",
    team: "Cobras",
    number: 3,
    league: "AL",
    allstargameappearances: 2,
    worldserieswins: 0,
    started:2019
  };
}
function AndyDurand(){
  return {
    name: "Andy Durand",
    team: "Cobras",
    number: 4,
    league: "AL",
    allstargameappearances: 2,
    worldserieswins: 0,
    started:2017
  };
}
function SawyerBehen(){
  return {
    name: "Sawyer Behen",
    team: "Cobras",
    number: 16,
    league: "AL",
    allstargameappearances: 0,
    worldserieswins: 0,
    started:2022
  };
}
function BrendanBaranoski(){
  return {
    name: "Brendan Baranoski",
    team: "Cobras",
    number: 10,
    league: "AL",
    allstargameappearances: 1,
    worldserieswins: 0,
    started:2021
  };
}
function Gus(){
  return {
    name: "Gus",
    team: "Cobras",
    number: 12,
    league: "AL",
    allstargameappearances: 0,
    worldserieswins: 0,
    started:2021
  };
}

function BrendanSzerlag(){
  return {
    name: "Brendan Szerlag",
    team: "Gators",
    number: 12,
    league: "NL",
    allstargameappearances: 0,
    worldserieswins: 1,
    started:2018
  };
}
function BrendanJorgensen(){
  return {
    name: "Brendan Jorgensen",
    team: "Gators",
    number: 14,
    league: "NL",
    allstargameappearances: 1,
    worldserieswins: 1,
    started:2020
  };
}
function ChrisCheetam(){
  return {
    name: "Chris Cheetam",
    team: "Gators",
    number: 27,
    league: "NL",
    allstargameappearances: 3,
    worldserieswins: 1,
    started:2020
  };
}
function JasonChadwick(){
  return {
    name: "Jason Chadwick",
    team: "Gators",
    number: 5,
    league: "NL",
    allstargameappearances: 2,
    worldserieswins: 0,
    started:2020
  };
}
function ReeseHarris(){
  return {
    name: "Reese Harris",
    team: "Gators",
    number: 23,
    league: "NL",
    allstargameappearances: 0,
    worldserieswins: 0,
    started:2022
  };
}
function DanielSchultz(){
  return {
    name: "Daniel Schultz",
    team: "Eagles",
    number: 10,
    league: "NL",
    allstargameappearances: 6,
    worldserieswins: 1,
    started:2010
  };
}
function LandonYurgaites(){
  return {
    name: "Landon Yurgaites",
    team: "Eagles",
    number: 0,
    league: "NL",
    allstargameappearances: 0,
    worldserieswins: 0,
    started:2022
  };
}
function ZachWhalen(){
  return {
    name: "Zach Whalen",
    team: "Eagles",
    number: 3,
    league: "NL",
    allstargameappearances: 1,
    worldserieswins: 0,
    started:2016
  };
}
function DallasAllen(){
  return {
    name: "Dallas Allen",
    team: "Eagles",
    number: 13,
    league: "NL",
    allstargameappearances: 2,
    worldserieswins: 0,
    started:2021
  };
}
function BladeWalker(){
  return {
    name: "Blade Walker",
    team: "Eagles",
    number: 37,
    league: "NL",
    allstargameappearances: 0,
    worldserieswins: 0,
    started:2021
  };
}
function JimmyKnorp(){
  return {
    name: "Jimmy Knorp",
    team: "Dbacks",
    number: 7,
    league: "NL",
    allstargameappearances: 3,
    worldserieswins: 2,
    started:2020
  };
}
function JonahHeath(){
  return {
    name: "Jonah Heath",
    team: "Dbacks",
    number: 7,
    league: "NL",
    allstargameappearances: 3,
    worldserieswins: 2,
    started:2020
  };
}
function MichaelSchema(){
  return {
    name: "Michael Schema",
    team: "Dbacks",
    number: 31,
    league: "NL",
    allstargameappearances: 0,
    worldserieswins: 2,
    started:2021
  };
}
function CaseyBennet(){
  return {
    name: "Casey Bennet",
    team: "Dbacks",
    number: 4,
    league: "NL",
    allstargameappearances: 0,
    worldserieswins: 1,
    started:2022
  };
}
function TreyFlood(){
  return {
    name: "Trey Flood",
    team: "Dbacks",
    number: 3,
    league: "NL",
    allstargameappearances: 0,
    worldserieswins: 1,
    started:2022
  };
}
function TommyCoughlin(){
  return {
    name: "Tommy Coughlin",
    team: "Mallards",
    number: 32,
    league: "NL",
    allstargameappearances: 6,
    worldserieswins: 4,
    started:2010
  };
}
function JordanRobles(){
  return {
    name: "Jordan Robles",
    team: "Mallards",
    number: 1,
    league: "NL",
    allstargameappearances: 1,
    worldserieswins: 0,
    started:2022
  };
}
function CadenIrwin(){
  return {
    name: "Caden Irwin",
    team: "Mallards",
    number: 22,
    league: "NL",
    allstargameappearances: 0,
    worldserieswins: 0,
    started:2021
  };
}
function BenWilson(){
  return {
    name: "Ben Wilson",
    team: "Mallards",
    number: 14,
    league: "NL",
    allstargameappearances: 0,
    worldserieswins: 1,
    started:2020
  };
}
function BrendanDavenport(){
  return {
    name: "Brendan Davenport",
    team: "Mallards",
    number: 6,
    league: "NL",
    allstargameappearances: 0,
    worldserieswins: 0,
    started:2021
  };
}
