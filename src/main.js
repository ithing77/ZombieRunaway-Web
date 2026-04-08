// main.js — 게임 설정 및 씬 등록
// Phaser CDN은 index.html에서 로드, 여기서 게임 초기화

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    // 바닥 생성 (초록 박스, 고정 물리 오브젝트)
    this.ground = this.physics.add.staticGroup();
    const groundBox = this.add.rectangle(480, 520, 960, 40, 0x44aa44);
    this.physics.add.existing(groundBox, true);
    this.ground.add(groundBox);

    // 캐릭터 생성 (파란 박스 = 태평, 동적 물리 오브젝트)
    this.player = this.add.rectangle(100, 460, 40, 50, 0x4488ff);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

    // 바닥 충돌 설정
    this.physics.add.collider(this.player, this.ground);

    // 점프 입력 — 스페이스바
    this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // UI 레이어: JUMP 버튼 (우하단 고정)
    // setScrollFactor(0) → 카메라 이동에 영향받지 않음
    this.jumpBtn = this.add.rectangle(880, 490, 120, 60, 0xffaa00)
      .setScrollFactor(0)
      .setInteractive();

    this.add.text(880, 490, 'JUMP', {
      fontSize: '22px',
      color: '#000000',
      fontStyle: 'bold'
    }).setOrigin(0.5).setScrollFactor(0);

    // JUMP 버튼 터치/클릭 이벤트
    this.jumpBtn.on('pointerdown', () => this.doJump());
  }

  doJump() {
    // 바닥에 닿아있을 때만 점프 허용
    if (this.player.body.blocked.down) {
      this.player.body.setVelocityY(-600);
    }
  }

  update() {
    // 캐릭터 자동 우측 이동
    this.player.body.setVelocityX(200);

    // 스페이스바 점프 (방금 눌린 순간만 감지)
    if (Phaser.Input.Keyboard.JustDown(this.jumpKey)) {
      this.doJump();
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  backgroundColor: '#1a1a2e',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 800 }, debug: true }
  },
  scene: [GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

new Phaser.Game(config);
