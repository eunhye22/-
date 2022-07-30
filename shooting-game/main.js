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
let backgroundImage, catImage, mouseImage, bulletImage, gameOverImage;

// 냥이 좌표 따로 빼놓기 --> 계속 위치가 바뀌기 때문에
// catImage 크기: (64x64)px
// 일단, 맨 아래 가운데에 셋팅
let catX = canvas.width/2-32    
let catY = canvas.height-64

function loadImage() {
    backgroundImage = new Image();
    backgroundImage.src="/images/background.png";

    catImage = new Image();
    catImage.src = "/images/cat.png";

    mouseImage = new Image();
    mouseImage.src = "/images/mouse.png";

    bulletImage = new Image();
    bulletImage.src = "/images/bulletImage.png";

    gameOverImage = new Image();
    gameOverImage.src = "/images/gameOver.png";
}

// 2. 이미지를 보여주는 함수 생성
function render() {
    // drawImage(image, dx, dy, dWidth, dHeight)
    ctx.drawImage(backgroundImage, 0,0,canvas.width,canvas.height);
    ctx.drawImage(catImage, catX, catY)
}

// 3. 함수를 호출해서 캔버스에 나타냄
// 한번 보여주고 끝나는게 아니라, 계속해서 보여줘야하기 때문에
// 함수를 계속해서 호출해야함
function main(){
    render()
    requestAnimationFrame(main)
}

loadImage();
main();