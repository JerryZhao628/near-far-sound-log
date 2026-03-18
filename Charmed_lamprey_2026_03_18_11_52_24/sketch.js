let events = [
  {t:0, type:"outside"},
  {t:6, type:"outside"},
  {t:21, type:"outside"},
  {t:32, type:"outside"},
  {t:66, type:"corridor"},
  {t:124, type:"outside"},
  {t:142, type:"unknown"},
  {t:165, type:"corridor"},
  {t:170, type:"corridor"},
  {t:187, type:"unknown"},
  {t:204, type:"unknown"},
  {t:231, type:"outside"},
  {t:242, type:"self"},
  {t:244, type:"self"},
  {t:280, type:"unknown"}
];

let started = false;
let startTime = 0;
let button;
let appearedAt = [];

function setup(){
  createCanvas(windowWidth, 520);
  textFont("Helvetica");

  button = createButton("START");
  styleButton(button);
  positionButton();
  button.mousePressed(startExperience);

  for (let i = 0; i < events.length; i++){
    appearedAt[i] = null;
  }
}

function windowResized(){
  resizeCanvas(windowWidth, 520);
  positionButton();
}

function positionButton(){
  if(button){
    button.position(width/2 - 40, height/2 + 10);
  }
}

function styleButton(btn){
  btn.style("padding", "10px 20px");
  btn.style("border-radius", "999px");
  btn.style("border", "1px solid rgba(255,255,255,0.4)");
  btn.style("background", "rgba(0,0,0,0.4)");
  btn.style("color", "white");
  btn.style("font-size", "14px");
  btn.style("letter-spacing", "0.1em");
}

function startExperience(){
  started = true;
  startTime = millis();
  button.hide();
}

function draw(){
  drawCleanBackground();

  if(!started){
    drawIntro();
    return;
  }

  let elapsed = (millis() - startTime) / 1000;

  drawHeader(elapsed);
  drawAxes();

  for(let i = 0; i < events.length; i++){
    if(events[i].t <= elapsed){
      if(appearedAt[i] === null){
        appearedAt[i] = millis();
      }
      drawEvent(i);
    }
  }

  if(elapsed > 300){
    drawEnd();
  }
}

function drawCleanBackground(){
  background(12, 14, 20);

  for(let y = 0; y < height; y += 2){
    stroke(255, 8);
    line(0, y, width, y);
  }

  noStroke();
  for(let i = 0; i < 80; i++){
    fill(255, 6);
    rect(random(width), random(height), 1, 1);
  }
}

function drawIntro(){
  noStroke();
  fill(0, 170);
  rectMode(CENTER);
  rect(width/2, height/2 - 40, 520, 220, 20);
  rectMode(CORNER);

  fill(255);
  textAlign(CENTER, CENTER);

  textSize(26);
  text("Near / Far", width/2, height/2 - 95);

  textSize(14);
  fill(255, 180);
  text(
    "5-minute real sound observation in my dormitory\nCategorised by perceived distance",
    width/2,
    height/2 - 55
  );

  drawLegend(width/2 - 80, height/2 + 50);
}

function drawHeader(elapsed){
  fill(255);
  textAlign(LEFT, TOP);
  textSize(18);
  text("Near / Far — Dormitory Sound Log", 28, 18);

  textSize(12);
  fill(255, 170);
  let shown = min(elapsed, 300);
  text("Time: " + nf(shown,1,1) + " / 300.0 s", 28, 44);

  fill(255, 40);
  rect(28, 66, width - 56, 6, 999);

  fill(255, 140);
  rect(28, 66, (width - 56) * (shown/300), 6, 999);
}

function drawAxes(){
  stroke(255, 60);
  line(60, height - 80, width - 60, height - 80);

  let ys = levelYs();
  for(let k = 0; k < ys.length; k++){
    stroke(255, 30);
    line(60, ys[k], width - 60, ys[k]);
  }

  noStroke();
  fill(255, 150);
  textSize(12);
  textAlign(LEFT, CENTER);

  text("outside", 60, ys[0] - 14);
  text("corridor", 60, ys[1] - 14);
  text("self", 60, ys[2] - 14);
  text("unknown", 60, ys[3] - 14);

  drawLegend(width - 170, 110);
}

function drawLegend(x, y){
  let items = [
    {label:"outside", c:colorFor("outside")},
    {label:"corridor", c:colorFor("corridor")},
    {label:"self", c:colorFor("self")},
    {label:"unknown", c:colorFor("unknown")}
  ];

  textAlign(LEFT, CENTER);
  textSize(12);

  for(let i = 0; i < items.length; i++){
    fill(items[i].c);
    circle(x, y + i*20, 8);
    fill(255, 170);
    text(items[i].label, x + 14, y + i*20);
  }
}

function drawEvent(i){
  let e = events[i];
  let x = map(e.t, 0, 300, 60, width - 60);
  let y = yForType(e.type);

  let age = (millis() - appearedAt[i]) / 1000;
  let anim = constrain(age / 0.8, 0, 1);

  let base = colorFor(e.type);

  // 固定圆环
  noFill();
  stroke(red(base), green(base), blue(base), 140);
  strokeWeight(1.5);
  circle(x, y, 64);

  // 扩散动画
  if(anim < 1){
    stroke(red(base), green(base), blue(base), 120 * (1 - anim));
    circle(x, y, 20 + anim * 60);
  }

  // 核心点
  noStroke();
  fill(red(base), green(base), blue(base), 230);
  circle(x, y, 10);
}

function drawEnd(){
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(16);
  text("END OF 5 MINUTES", width/2, height - 34);
}

function levelYs(){
  return [
    height * 0.28,
    height * 0.45,
    height * 0.62,
    height * 0.76
  ];
}

function yForType(type){
  let ys = levelYs();
  if(type === "outside") return ys[0];
  if(type === "corridor") return ys[1];
  if(type === "self") return ys[2];
  return ys[3];
}

function colorFor(type){
  if(type === "outside") return color(120,210,255);
  if(type === "corridor") return color(255,210,120);
  if(type === "self") return color(140,255,200);
  return color(255,140,190);
}