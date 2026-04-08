// main.js — 게임 설정 및 씬 등록
// Phaser CDN은 index.html에서 로드, 여기서 게임 초기화

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    // 월드 크기 설정 (가로 10000px, 세로 540px) — 카메라가 이 범위 안에서 이동
    this.physics.world.setBounds(0, 0, 10000, 540);
    this.cameras.main.setBounds(0, 0, 10000, 540);

    // 바닥 생성 (초록 박스, 월드 전체 너비로 고정)
    this.ground = this.physics.add.staticGroup();
    const groundBox = this.add.rectangle(5000, 520, 10000, 40, 0x44aa44);
    this.physics.add.existing(groundBox, true);
    this.ground.add(groundBox);

    // 캐릭터 생성 (파란 박스 = 태평, 동적 물리 오브젝트)
    this.player = this.add.rectangle(100, 460, 40, 50, 0x4488ff);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

    // 공중 플랫폼 배치 — [x, y, 너비] 배열로 관리
    const platformData = [
      { x: 400,  y: 420, w: 160 },
      { x: 700,  y: 370, w: 160 },
      { x: 1000, y: 320, w: 160 },
      { x: 1300, y: 400, w: 200 },
      { x: 1600, y: 350, w: 160 },
      { x: 1900, y: 420, w: 200 },
    ];

    this.platforms = this.physics.add.staticGroup();
    platformData.forEach(p => {
      const box = this.add.rectangle(p.x, p.y, p.w, 20, 0x888844);
      this.physics.add.existing(box, true);
      this.platforms.add(box);
    });

    // 바닥 충돌 설정
    this.physics.add.collider(this.player, this.ground);
    // 플랫폼 충돌 설정
    this.physics.add.collider(this.player, this.platforms);

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

    // 카메라가 플레이어를 따라가도록 설정
    this.cameras.main.startFollow(this.player, true, 1, 1);
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
