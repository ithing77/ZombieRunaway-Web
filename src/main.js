// main.js — 게임 설정 및 씬 등록
// Phaser CDN은 index.html에서 로드, 여기서 게임 초기화

// 캐릭터 정보 — 색상과 이름 (나중에 스프라이트로 교체)
const CHARS = {
  taepyeong: { color: 0x4488ff, label: '태평' },
  yunseul:   { color: 0xff88aa, label: '윤슬' },
};

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    // 월드 크기 설정 (가로 10000px, 세로 540px)
    this.physics.world.setBounds(0, 0, 10000, 540);
    this.cameras.main.setBounds(0, 0, 10000, 540);

    // 바닥 생성 (월드 전체 너비 고정)
    this.ground = this.physics.add.staticGroup();
    const groundBox = this.add.rectangle(5000, 520, 10000, 40, 0x44aa44);
    this.physics.add.existing(groundBox, true);
    this.ground.add(groundBox);

    // 공중 플랫폼 배치
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

    // 현재 활성 캐릭터 — 'taepyeong' 또는 'yunseul'
    this.currentChar = 'taepyeong';

    // 캐릭터 박스 생성 (색상은 currentChar에 따라 변경)
    this.player = this.add.rectangle(100, 460, 40, 50, CHARS.taepyeong.color);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

    // 충돌 설정
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.player, this.platforms);

    // 점프 입력 — 스페이스바
    this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // --- UI (setScrollFactor(0) → 카메라 이동 무관하게 화면에 고정) ---

    // JUMP 버튼 (우하단)
    this.jumpBtn = this.add.rectangle(880, 490, 120, 60, 0xffaa00)
      .setScrollFactor(0).setInteractive();
    this.add.text(880, 490, 'JUMP', { fontSize: '22px', color: '#000', fontStyle: 'bold' })
      .setOrigin(0.5).setScrollFactor(0);
    this.jumpBtn.on('pointerdown', () => this.doJump());

    // SWAP 버튼 (좌하단)
    this.swapBtn = this.add.rectangle(80, 490, 120, 60, 0xaa44ff)
      .setScrollFactor(0).setInteractive();
    this.add.text(80, 490, 'SWAP', { fontSize: '22px', color: '#fff', fontStyle: 'bold' })
      .setOrigin(0.5).setScrollFactor(0);
    this.swapBtn.on('pointerdown', () => this.doSwap());

    // 현재 캐릭터 이름 표시 (좌상단)
    this.charLabel = this.add.text(20, 20, this.getCharLabel(), {
      fontSize: '20px', color: '#ffffff'
    }).setScrollFactor(0);

    // 카메라 팔로우
    this.cameras.main.startFollow(this.player, true, 1, 1);
  }

  getCharLabel() {
    return `▶ ${CHARS[this.currentChar].label}`;
  }

  doSwap() {
    // 캐릭터 전환 — 색상과 레이블 업데이트
    this.currentChar = this.currentChar === 'taepyeong' ? 'yunseul' : 'taepyeong';
    this.player.fillColor = CHARS[this.currentChar].color;
    this.charLabel.setText(this.getCharLabel());
  }

  doJump() {
    if (this.player.body.blocked.down) {
      this.player.body.setVelocityY(-600);
    }
  }

  update() {
    // 자동 우측 이동
    this.player.body.setVelocityX(200);

    // 스페이스바 점프
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
