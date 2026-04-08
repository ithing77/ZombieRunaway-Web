// main.js — 게임 설정 및 씬 등록
// Phaser CDN은 index.html에서 로드, 여기서 게임 초기화

// 캐릭터 정보 — texture키는 preload에서 로드한 이름과 일치
const CHARS = {
  taepyeong: { texture: 'taepyeong', label: '태평' },
  yunseul:   { texture: 'yunseul',   label: '윤슬' },
};

// 돈 아이템 종류 — value(원), color, size, label
const MONEY_TYPES = {
  coin100:  { value: 100,  color: 0xcccccc, size: 18, label: '100' },
  coin500:  { value: 500,  color: 0xffdd44, size: 24, label: '500' },
  bill1000: { value: 1000, color: 0x44cc66, size: 28, label: '1000' },
};

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    // 캐릭터 스프라이트 이미지 로드
    this.load.image('taepyeong', 'assets/taepyeong.png');
    this.load.image('yunseul',   'assets/yunseul.png');
  }

  create() {
    // 월드 크기 설정
    this.physics.world.setBounds(0, 0, 10000, 540);
    this.cameras.main.setBounds(0, 0, 10000, 540);

    // 바닥 (월드 전체 너비)
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

    // 돈 아이템 배치 — [x, y, type]
    // 바닥 위(y=470), 플랫폼 위, 공중 등 다양하게 배치
    const moneyData = [
      { x: 250,  y: 470, type: 'coin100' },
      { x: 350,  y: 470, type: 'coin100' },
      { x: 420,  y: 390, type: 'coin500' },  // 첫 플랫폼 위
      { x: 500,  y: 470, type: 'coin100' },
      { x: 600,  y: 470, type: 'coin100' },
      { x: 720,  y: 340, type: 'coin500' },  // 두번째 플랫폼 위
      { x: 800,  y: 470, type: 'bill1000' },
      { x: 1000, y: 290, type: 'coin500' },  // 세번째 플랫폼 위
      { x: 1100, y: 470, type: 'coin100' },
      { x: 1200, y: 470, type: 'coin100' },
      { x: 1300, y: 370, type: 'bill1000' }, // 네번째 플랫폼 위
      { x: 1450, y: 470, type: 'coin500' },
      { x: 1600, y: 320, type: 'bill1000' }, // 다섯번째 플랫폼 위
      { x: 1750, y: 470, type: 'coin100' },
      { x: 1900, y: 390, type: 'coin500' },  // 여섯번째 플랫폼 위
      { x: 2000, y: 470, type: 'bill1000' },
    ];

    this.moneyGroup = this.physics.add.staticGroup();
    moneyData.forEach(m => {
      const info = MONEY_TYPES[m.type];
      // 천원짜리는 직사각형, 동전은 원형 (원은 rectangle로 근사)
      const item = this.add.circle(m.x, m.y, info.size / 2, info.color);
      this.physics.add.existing(item, true);
      // 타입 정보 저장 (수집 시 value 참조)
      item.moneyValue = info.value;
      item.moneyLabel = info.label;
      this.moneyGroup.add(item);
    });

    // 현재 캐릭터 상태
    this.currentChar = 'taepyeong';
    this.jumpCount = 0;
    this.isGliding = false;
    this.totalMoney = 0; // 획득한 총 금액

    // 캐릭터 스프라이트 (physics.add.image → 물리 바디 자동 생성)
    this.player = this.physics.add.image(100, 460, 'taepyeong');
    this.player.setDisplaySize(48, 64);        // 화면 표시 크기
    this.player.body.setSize(36, 60);          // 물리 히트박스 (이미지보다 약간 작게)
    this.player.body.setCollideWorldBounds(true);

    // 충돌
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.player, this.platforms);

    // 돈 수집 overlap
    this.physics.add.overlap(this.player, this.moneyGroup, this.collectMoney, null, this);

    // 좀비 그룹
    this.zombies = this.physics.add.group();
    this.time.addEvent({
      delay: 3000,
      loop: true,
      callback: this.spawnZombie,
      callbackScope: this,
    });
    this.physics.add.overlap(this.player, this.zombies, this.onGameOver, null, this);

    this.isGameOver = false;

    // 점프 키
    this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // --- UI ---

    // JUMP 버튼 (우하단)
    this.jumpBtn = this.add.rectangle(880, 490, 120, 60, 0xffaa00)
      .setScrollFactor(0).setInteractive();
    this.add.text(880, 490, 'JUMP', { fontSize: '22px', color: '#000', fontStyle: 'bold' })
      .setOrigin(0.5).setScrollFactor(0);
    this.jumpBtn.on('pointerdown', () => this.doJump());
    this.jumpBtn.on('pointerup',   () => { this.isGliding = false; });

    // SWAP 버튼 (JUMP 위쪽)
    this.swapBtn = this.add.rectangle(880, 420, 120, 60, 0xaa44ff)
      .setScrollFactor(0).setInteractive();
    this.add.text(880, 420, 'SWAP', { fontSize: '22px', color: '#fff', fontStyle: 'bold' })
      .setOrigin(0.5).setScrollFactor(0);
    this.swapBtn.on('pointerdown', () => this.doSwap());

    // 캐릭터 이름 (좌상단)
    this.charLabel = this.add.text(20, 20, this.getCharLabel(), {
      fontSize: '20px', color: '#ffffff'
    }).setScrollFactor(0);

    // 능력 설명
    this.abilityLabel = this.add.text(20, 46, this.getAbilityLabel(), {
      fontSize: '14px', color: '#aaaaaa'
    }).setScrollFactor(0);

    // 보유 금액 (우상단)
    this.moneyLabel = this.add.text(940, 20, '💰 0원', {
      fontSize: '20px', color: '#ffdd44', fontStyle: 'bold'
    }).setOrigin(1, 0).setScrollFactor(0);

    // 카메라 팔로우
    this.cameras.main.startFollow(this.player, true, 1, 1);
  }

  getCharLabel()   { return `▶ ${CHARS[this.currentChar].label}`; }
  getAbilityLabel() {
    return this.currentChar === 'taepyeong' ? '2단 점프' : '활공 (점프 유지)';
  }

  collectMoney(player, item) {
    // 아이템 비활성화 (화면에서 제거)
    item.destroy();
    this.totalMoney += item.moneyValue;
    this.moneyLabel.setText(`💰 ${this.totalMoney.toLocaleString()}원`);
  }

  doSwap() {
    if (this.isGameOver) return;
    this.currentChar = this.currentChar === 'taepyeong' ? 'yunseul' : 'taepyeong';
    this.player.setTexture(CHARS[this.currentChar].texture);
    this.jumpCount = this.player.body.blocked.down ? 0 : 2;
    this.isGliding = false;
    this.charLabel.setText(this.getCharLabel());
    this.abilityLabel.setText(this.getAbilityLabel());
  }

  doJump() {
    if (this.isGameOver) return;
    if (this.currentChar === 'taepyeong') {
      if (this.jumpCount < 2) {
        this.player.body.setVelocityY(-600);
        this.jumpCount++;
      }
    } else {
      if (this.player.body.blocked.down) {
        this.player.body.setVelocityY(-600);
      } else {
        this.isGliding = true;
      }
    }
  }

  spawnZombie() {
    if (this.isGameOver) return;
    const spawnX = this.player.x + 600;
    const zombie = this.add.rectangle(spawnX, 460, 36, 50, 0xff3333);
    this.physics.add.existing(zombie);
    zombie.body.setCollideWorldBounds(false);
    this.physics.add.collider(zombie, this.ground);
    zombie.body.setVelocityX(-120);
    this.zombies.add(zombie);
  }

  onGameOver() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.player.body.setVelocityX(0);
    this.zombies.getChildren().forEach(z => z.body.setVelocityX(0));

    this.add.text(480, 220, 'GAME OVER', {
      fontSize: '56px', color: '#ff3333', fontStyle: 'bold'
    }).setOrigin(0.5).setScrollFactor(0);

    // 최종 획득 금액 표시
    this.add.text(480, 290, `획득 금액: ${this.totalMoney.toLocaleString()}원`, {
      fontSize: '28px', color: '#ffdd44'
    }).setOrigin(0.5).setScrollFactor(0);

    this.add.text(480, 340, '화면을 탭하면 다시 시작', {
      fontSize: '22px', color: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0);

    this.input.once('pointerdown', () => this.scene.restart());
    this.input.keyboard.once('keydown', () => this.scene.restart());
  }

  update() {
    if (this.isGameOver) return;
    this.player.body.setVelocityX(200);

    if (this.player.body.blocked.down) {
      this.jumpCount = 0;
      this.isGliding = false;
    }

    if (this.currentChar === 'yunseul' && this.isGliding && !this.player.body.blocked.down) {
      if (this.player.body.velocity.y > 60) {
        this.player.body.setVelocityY(60);
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.jumpKey)) {
      this.doJump();
    }
    if (Phaser.Input.Keyboard.JustUp(this.jumpKey)) {
      this.isGliding = false;
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
