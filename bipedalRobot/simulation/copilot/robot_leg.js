const canvas = document.getElementById("robotCanvas");
const ctx = canvas.getContext("2d");

const upperServoSlider = document.getElementById("upperServo");
const lowerServoSlider = document.getElementById("lowerServo");

function drawLeg() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const originX = 300;
  const originY = 200;

  // 腰関節
  const A1 = { x: originX - 15, y: originY };
  const B1 = { x: originX + 15, y: originY };

  // 上サーボモーター
  const upperAngle = (parseInt(upperServoSlider.value) - 90) * Math.PI / 180;
  const upperServo = { x: B1.x - 30, y: B1.y };
  const upperArmEnd = {
    x: upperServo.x + 20 * Math.cos(upperAngle),
    y: upperServo.y - 20 * Math.sin(upperAngle)
  };

  // A21 → A1
  const A21 = { x: A1.x - 30, y: A1.y };
  const A21ArmEnd = {
    x: A21.x + 20 * Math.cos(upperAngle),
    y: A21.y - 20 * Math.sin(upperAngle)
  };

  // 下サーボモーター
  const lowerAngle = (parseInt(lowerServoSlider.value) - 90) * Math.PI / 180;
  const lowerServo = { x: B1.x, y: B1.y + 60 };
  const B3 = {
    x: lowerServo.x + 20 * Math.cos(lowerAngle),
    y: lowerServo.y + 20 * Math.sin(lowerAngle)
  };

  const A3 = { x: A1.x, y: A1.y + 60 };
  const A22 = { x: A3.x - 30, y: A3.y };
  const A22ArmEnd = {
    x: A22.x + 20 * Math.cos(lowerAngle),
    y: A22.y + 20 * Math.sin(lowerAngle)
  };

  // 描画
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;

  // 腰関節
  ctx.beginPath();
  ctx.arc(A1.x, A1.y, 4, 0, 2 * Math.PI);
  ctx.arc(B1.x, B1.y, 4, 0, 2 * Math.PI);
  ctx.stroke();

  // 上サーボアーム
  ctx.beginPath();
  ctx.moveTo(upperServo.x, upperServo.y);
  ctx.lineTo(upperArmEnd.x, upperArmEnd.y);
  ctx.lineTo(B1.x, B1.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(A21.x, A21.y);
  ctx.lineTo(A21ArmEnd.x, A21ArmEnd.y);
  ctx.lineTo(A1.x, A1.y);
  ctx.stroke();

  // 下サーボアーム
  ctx.beginPath();
  ctx.moveTo(lowerServo.x, lowerServo.y);
  ctx.lineTo(B3.x, B3.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(A22.x, A22.y);
  ctx.lineTo(A22ArmEnd.x, A22ArmEnd.y);
  ctx.lineTo(A3.x, A3.y);
  ctx.stroke();

  // 足首関節
  ctx.beginPath();
  ctx.arc(A3.x, A3.y, 4, 0, 2 * Math.PI);
  ctx.arc(B3.x, B3.y, 4, 0, 2 * Math.PI);
  ctx.stroke();
}

upperServoSlider.addEventListener("input", drawLeg);
lowerServoSlider.addEventListener("input", drawLeg);

drawLeg();
