//캔버스 세팅

let canvas;
let ctx;    // 얘가 canvas에 그림을 그려주는 역할을 하게됨
// 캔버스를 생성해 canvas 변수에 저장
canvas = document.createElement("canvas")
// 캔버스에서 2d 환경을 가져와 ctx에 저장
ctx = canvas.getContext("2d")

// 캔버스 사이즈 정의
canvas.width=400;
canvas.height=700;

// 이 script를 html에 넣어서 사용하자~!
// 캔버스를 body태그에 자식으로 붙여주세용
document.body.appendChild(canvas)

// 1. 이미지를 불러오는 함수 생성
// 필요한 이미지들 변수로 지정
let backgroundImage, catImage, enemyImage, bulletImage, gameOverImage;
let gameOver=false  // true이면 게임이 끝남.
let score=0;

// 냥이 좌표 따로 빼놓기 --> 계속 위치가 바뀌기 때문에
// catImage 크기: (64x64)px
// 일단, 맨 아래 가운데에 셋팅
let catX = canvas.width/2-32    
let catY = canvas.height-64

let bulletList = [] //총알들을 저장하는 리스트
function Bullet() {
    this.x = 0;
    this.y = 0;
    this.init=function() {
        this.x = catX + 16;
        this.y = catY;
        this.alive=true // true면 살아있는 총알
        bulletList.push(this);
    };
    this.update = function() {
        this.y -= 7;
    };

    this.checkHit = function() {
        
        for(let i=0; i< enemyList.length;i++ ) {
            if(
                this.y <= enemyList[i].y && 
                this.x >=enemyList[i].x && 
                this.x <=enemyList[i].x +48
            ) {
                score++;
                this.alive = false // 죽은 총알
                enemyList.splice(i,1);
            }

        }

    };
}

function generateRandomValue(min,max) {
    let randomNum = Math.floor(Math.random()*(max-min+1))+min
    return randomNum
}

let enemyList=[]
function Enemy() {
    this.x = 0;
    this.y = 0;
    this.init=function() {
        this.x = generateRandomValue(0,canvas.width-48);
        this.y = 0;
        enemyList.push(this);
    };
    this.update = function () {
        this.y += 2;    // 적군의 속도 조절

        if(this.y >= canvas.height-48) {
            gameOver = true;
            console.log("gameover");
        }
    }
}


function loadImage() {
    backgroundImage = new Image();
    backgroundImage.src="/images/background.png";

    catImage = new Image();
    catImage.src = "/images/cat.png";

    enemyImage = new Image();
    enemyImage.src = "/images/mouse.png";

    bulletImage = new Image();
    bulletImage.src = "/images/cat_foot.png";

    gameOverImage = new Image();
    gameOverImage.src = "/images/gameOver.png";
}


// 4. 방향키 인식 - 객체에 값이 있으면 눌린거 없으면 뗀거!!

// 어떤 버튼들이 눌렸는지 저장
let keysDown={}
// 키보드의 이벤트들을 들어줄 함수 생성
function setupKeyboardListener() {
    document.addEventListener("keydown", function(event){
        keysDown[event.keyCode]=true;
        console.log("키다운객체에 들어간 값은?", keysDown)
    });
    // 키를 눌렀다 떼면 저장한 값이 사라지도록
    document.addEventListener("keyup",function() {
        delete keysDown[event.keyCode];
        console.log("버튼 클릭 후", keysDown)

        if(event.keyCode == 32) {
            createBullet()  // 스페이스바 누르면 총알을 생성하는 함수
        }
    });
}

function createBullet() {
    console.log("총알 생성");
    let b = new Bullet()
    b.init();
    console.log("새로운 총알 리스트", bulletList);
}

function createEnemy() { //setInterval(호출하고싶은함수,시간(1ms기준))
    const interval = setInterval(function() {
        let e = new Enemy();
        e.init();
    },1000)
}

// 5. 방향키 누르면 냥이 X좌표 바뀌게
function update() {
    if(39 in keysDown) {
        catX += 3;  // 냥이 속도
        // right
    }
    if(37 in keysDown) {
        catX -= 3;
        // left
    }

    console.log(catX);
    // 냥이의 좌표값이 무한대로 업데이트가 되는게 아닌! 경기장 안에서만 있게 하려면?
    if(catX <=0) {
        catX =0
    }
    if(catX >= canvas.width-64) {
        catX = canvas.width-64
    }

    // 총알의 y좌표 업데이트하는 함수 호출
    for(let i=0; i<bulletList.length; i++) {
        if(bulletList[i].alive) {
            bulletList[i].update();
            bulletList[i].checkHit();
        }
    }

    // 적군의 y좌표 업데이트하는 함수 호출
    for(let i=0; i<enemyList.length; i++) {
        enemyList[i].update();
    }
}

// 2. 이미지를 보여주는 함수 생성
function render() {
    // drawImage(image, dx, dy, dWidth, dHeight)
    ctx.drawImage(backgroundImage, 0,0,canvas.width,canvas.height);
    ctx.drawImage(catImage, catX, catY);
    
    // 점수 보여주기
    ctx.fillText(`Score:${score}`, 20, 20);
    ctx.fillStyle="white";
    
    for(let i=0; i<bulletList.length; i++) {
        if(bulletList[i].alive) {
            ctx.drawImage(bulletImage,bulletList[i].x,bulletList[i].y);
        }
    }

    for(let i=0;i<enemyList.length;i++) {
        ctx.drawImage(enemyImage,enemyList[i].x,enemyList[i].y);
    }

}

// 3. 함수를 호출해서 캔버스에 나타냄
// 한번 보여주고 끝나는게 아니라, 계속해서 보여줘야하기 때문에
// 함수를 계속해서 호출해야함
function main(){
    if(!gameOver) { 

    update(); // 좌표값을 업데이트하고
    render(); // 그려주고
    requestAnimationFrame(main);
    } else {    // 게임오버=true일 때
        ctx.drawImage(gameOverImage, 10, 100, 380, 380);
    }
}

loadImage();
setupKeyboardListener();
createEnemy();
main();


// 총알 만들기
// 1. 스페이스바를 누르면 발사
// 2. 총알이 발사 = 총알의 y값:  -- (왼쪽 상단 좌표가 0,0이기때문) 
//                  총알의 x값:  스페이스를 누른 순간의 우주선의 x좌표
// 3. 발사된 총알들은 총알 배열에 저장한다.
// 4. 총알들은 x,y 좌표값이 있어야 한다.
// 5. 총알 배열을 가지고 render 그려준다.


// 적군 만들기
// 1. 위치가 랜덤
// 2. 밑으로 내려옴
// 3. 1초마다 하나씩 생성
// 4. 적군이 바닥에 닿으면 게임 오버
// 5. 적군과 총알이 만나면 적군이 사라지고 점수 +1

// 적군이 죽는다 -> 총알이 적군에게 닿는다
// * 총알.y <= 적군.y 
// * 적군.x <= 총알.x <= 적군.x + 적군의 넓이