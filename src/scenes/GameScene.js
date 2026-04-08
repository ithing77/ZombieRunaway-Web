// GameScene.js — 메인 게임 씬 (스테이지 1)
// 캐릭터, 지형, 좀비, 돈 아이템, UI 포함

// 캐릭터 정보 — texture키는 preload에서 로드한 이름과 일치
const CHARS = {
  taepyeong: { texture: 'taepyeong', label: '태평' },
  yunseul:   { texture: 'yunseul',   label: '윤슬' },
};

// 돈 아이템 종류
const MONEY_TYPES = {
  coin100:  { value: 100,  color: 0xcccccc, size: 18 },
  coin500:  { value: 500,  color: 0xffdd44, size: 24 },
  bill1000: { value: 1000, color: 0x44cc66, size: 28 },
};

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    // 캐릭터 스프라이트
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

    // 돈 아이템 배치
    const moneyData = [
      { x: 250,  y: 470, type: 'coin100' },
      { x: 350,  y: 470, type: 'coin100' },
      { x: 420,  y: 390, type: 'coin500' },
      { x: 500,  y: 470, type: 'coin100' },
      { x: 600,  y: 470, type: 'coin100' },
      { x: 720,  y: 340, type: 'coin500' },
      { x: 800,  y: 470, type: 'bill1000' },
      { x: 1000, y: 290, type: 'coin500' },
      { x: 1100, y: 470, type: 'coin100' },
      { x: 1200, y: 470, type: 'coin100' },
      { x: 1300, y: 370, type: 'bill1000' },
      { x: 1450, y: 470, type: 'coin500' },
      { x: 1600, y: 320, type: 'bill1000' },
      { x: 1750, y: 470, type: 'coin100' },
      { x: 1900, y: 390, type: 'coin500' },
      { x: 2000, y: 470, type: 'bill1000' },
    ];
    this.moneyGroup = this.physics.add.staticGroup();
    moneyData.forEach(m => {
      const info = MONEY_TYPES[m.type];
      const item = this.add.circle(m.x, m.y, info.size / 2, info.color);
      this.physics.add.existing(item, true);
      item.moneyValue = info.value;
      this.moneyGroup.add(item);
    });

    // 캐릭터 상태 초기화
    this.currentChar = 'taepyeong';
    this.jumpCount = 0;
    this.isGliding = false;
    this.totalMoney = 0;
    this.isGameOver = false;

    // 캐릭터 스프라이트
    this.player = this.physics.add.image(100, 460, 'taepyeong');
    this.player.setDisplaySize(48, 64);
    this.player.body.setSize(36, 60);
    this.player.body.setCollideWorldBounds(true);

    // 충돌 / 수집
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(this.player, this.moneyGroup, this.collectMoney, null, this);

    // 좀비 그룹 — 3초마다 스폰
    this.zombies = this.physics.add.group();
    this.time.addEvent({ delay: 3000, loop: true, callback: this.spawnZombie, callbackScope: this });
    this.physics.add.overlap(this.player, this.zombies, this.onGameOver, null, this);

    // 점프 키
    this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // --- UI ---
    this.jumpBtn = this.add.rectangle(880, 490, 120, 60, 0xffaa00)
      .setScrollFactor(0).setInteractive();
    this.add.text(880, 490, 'JUMP', { fontSize: '22px', color: '#000', fontStyle: 'bold' })
      .setOrigin(0.5).setScrollFactor(0);
    this.jumpBtn.on('pointerdown', () => this.doJump());
    this.jumpBtn.on('pointerup',   () => { this.isGliding = false; });

    this.swapBtn = this.add.rectangle(880, 420, 120, 60, 0xaa44ff)
      .setScrollFactor(0).setInteractive();
    this.add.text(880, 420, 'SWAP', { fontSize: '22px', color: '#fff', fontStyle: 'bold' })
      .setOrigin(0.5).setScrollFactor(0);
    this.swapBtn.on('pointerdown', () => this.doSwap());

    this.charLabel = this.add.text(20, 20, this.getCharLabel(), { fontSize: '20px', color: '#fff' })
      .setScrollFactor(0);
    this.abilityLabel = this.add.text(20, 46, this.getAbilityLabel(), { fontSize: '14px', color: '#aaa' })
      .setScrollFactor(0);
    this.moneyLabel = this.add.text(940, 20, '💰 0원', { fontSize: '20px', color: '#ffdd44', fontStyle: 'bold' })
      .setOrigin(1, 0).setScrollFactor(0);

    // 카메라 팔로우
    this.cameras.main.startFollow(this.player, true, 1, 1);
  }

  getCharLabel()    { return `▶ ${CHARS[this.currentChar].label}`; }
  getAbilityLabel() { return this.currentChar === 'taepyeong' ? '2단 점프' : '활공 (점프 유지)'; }

  collectMoney(player, item) {
    this.totalMoney += item.moneyValue;
    item.destroy();
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
      if (this.jumpCount < 2) { this.player.body.setVelocityY(-600); this.jumpCount++; }
    } else {
      if (this.player.body.blocked.down) { this.player.body.setVelocityY(-600); }
      else { this.isGliding = true; }
    }
  }

  spawnZombie() {
    if (this.isGameOver) return;
    const zombie = this.add.rectangle(this.player.x + 600, 460, 36, 50, 0xff3333);
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

    this.add.text(480, 220, 'GAME OVER', { fontSize: '56px', color: '#ff3333', fontStyle: 'bold' })
      .setOrigin(0.5).setScrollFactor(0);
    this.add.text(480, 290, `획득 금액: ${this.totalMoney.toLocaleString()}원`, { fontSize: '28px', color: '#ffdd44' })
      .setOrigin(0.5).setScrollFactor(0);
    this.add.text(480, 340, '화면을 탭하면 타이틀로', { fontSize: '22px', color: '#ffffff' })
      .setOrigin(0.5).setScrollFactor(0);

    // 게임오버 후 타이틀로 복귀
    this.input.once('pointerdown', () => this.scene.start('TitleScene'));
    this.input.keyboard.once('keydown', () => this.scene.start('TitleScene'));
  }

  update() {
    if (this.isGameOver) return;
    this.player.body.setVelocityX(200);

    if (this.player.body.blocked.down) {
      this.jumpCount = 0;
      this.isGliding = false;
    }

    if (this.currentChar === 'yunseul' && this.isGliding && !this.player.body.blocked.down) {
      if (this.player.body.velocity.y > 60) this.player.body.setVelocityY(60);
    }

    if (Phaser.Input.Keyboard.JustDown(this.jumpKey)) this.doJump();
    if (Phaser.Input.Keyboard.JustUp(this.jumpKey))   this.isGliding = false;
  }
}
