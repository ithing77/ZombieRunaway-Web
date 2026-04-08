// BaseStage.js — 공통 게임 로직
// 각 Stage1~5는 이 클래스를 상속해서 getStageData()만 오버라이드

const CHARS = {
  taepyeong: { texture: 'taepyeong', label: '태평' },
  yunseul:   { texture: 'yunseul',   label: '윤슬' },
};

const MONEY_TYPES = {
  coin100:  { value: 100,  color: 0xcccccc, size: 18 },
  coin500:  { value: 500,  color: 0xffdd44, size: 24 },
  bill1000: { value: 1000, color: 0x44cc66, size: 28 },
};

class BaseStage extends Phaser.Scene {

  // 서브클래스에서 오버라이드 — 스테이지별 맵/난이도 데이터 반환
  getStageData() {
    return {
      stageNum:    1,
      worldWidth:  4000,
      goalX:       3700,      // 이 x에 도달하면 스테이지 클리어
      bgColor:     '#1a1a2e',
      zombieDelay: 3000,      // 좀비 스폰 간격(ms)
      zombieSpeed: 120,       // 좀비 이동 속도
      nextScene:   'Stage2',  // 클리어 후 이동할 씬
      platforms:   [],
      money:       [],
    };
  }

  preload() {
    this.load.image('taepyeong', 'assets/taepyeong.png');
    this.load.image('yunseul',   'assets/yunseul.png');
  }

  // 패럴랙스 배경 텍스처 생성 (플레이스홀더 — 나중에 실제 이미지로 교체)
  createBgTextures() {
    // 레이어1: 하늘 + 먼 건물 실루엣
    if (!this.textures.exists('bg_layer1')) {
      const g1 = this.make.graphics({ x: 0, y: 0, add: false });
      g1.fillStyle(0x0d0d2a); g1.fillRect(0, 0, 960, 540);
      // 별 점들
      g1.fillStyle(0xffffff, 0.6);
      [80,200,350,500,650,800,920,140,300,450,600,750,880].forEach((x, i) => {
        g1.fillRect(x, 20 + (i % 5) * 30, 2, 2);
      });
      // 먼 건물 실루엣 (단색 블록)
      g1.fillStyle(0x1a1a3a);
      [[50,320,60,180],[160,350,80,150],[280,300,50,220],[400,340,70,180],
       [520,310,60,210],[640,360,90,160],[760,330,55,190],[870,345,70,175]
      ].forEach(([x,y,w,h]) => g1.fillRect(x, y, w, h));
      g1.generateTexture('bg_layer1', 960, 540);
      g1.destroy();
    }

    // 레이어2: 주택/학교 건물
    if (!this.textures.exists('bg_layer2')) {
      const g2 = this.make.graphics({ x: 0, y: 0, add: false });
      g2.fillStyle(0x00000000, 0); g2.fillRect(0, 0, 960, 540); // 투명 배경
      g2.fillStyle(0x223322);
      [[0,380,120,160],[130,350,100,190],[240,400,80,140],[330,360,110,180],
       [450,370,130,170],[590,390,90,150],[690,355,115,185],[810,375,100,165],
       [915,360,45,180]
      ].forEach(([x,y,w,h]) => g2.fillRect(x, y, w, h));
      // 창문 (밝은 점)
      g2.fillStyle(0xffff88, 0.5);
      [[20,400,20,15],[60,400,20,15],[150,380,18,12],[200,380,18,12],
       [460,400,22,14],[510,400,22,14],[700,385,20,13],[750,385,20,13]
      ].forEach(([x,y,w,h]) => g2.fillRect(x, y, w, h));
      g2.generateTexture('bg_layer2', 960, 540);
      g2.destroy();
    }

    // 레이어3: 담장 + 전봇대 (가장 빠름)
    if (!this.textures.exists('bg_layer3')) {
      const g3 = this.make.graphics({ x: 0, y: 0, add: false });
      g3.fillStyle(0x00000000, 0); g3.fillRect(0, 0, 960, 540);
      // 담장
      g3.fillStyle(0x443322);
      g3.fillRect(0, 460, 960, 40);
      // 담장 블록 줄눈
      g3.fillStyle(0x332211);
      for (let x = 0; x < 960; x += 60) g3.fillRect(x, 460, 2, 40);
      for (let x = 30; x < 960; x += 60) g3.fillRect(x, 480, 2, 20);
      // 전봇대
      g3.fillStyle(0x222222);
      [100, 280, 480, 680, 860].forEach(x => {
        g3.fillRect(x, 340, 8, 120);   // 기둥
        g3.fillRect(x - 20, 345, 48, 5); // 횡대
      });
      g3.generateTexture('bg_layer3', 960, 540);
      g3.destroy();
    }
  }

  create() {
    const d = this.getStageData();
    this.stageData = d;

    // 배경색 적용
    this.cameras.main.setBackgroundColor(d.bgColor);

    // 패럴랙스 배경 텍스처 생성 및 레이어 배치
    // setScrollFactor(0) → 카메라 이동에 고정, tilePositionX로 직접 제어
    this.createBgTextures();
    this.bgLayer1 = this.add.tileSprite(480, 270, 960, 540, 'bg_layer1').setScrollFactor(0);
    this.bgLayer2 = this.add.tileSprite(480, 270, 960, 540, 'bg_layer2').setScrollFactor(0);
    this.bgLayer3 = this.add.tileSprite(480, 270, 960, 540, 'bg_layer3').setScrollFactor(0);

    // 월드 크기
    this.physics.world.setBounds(0, 0, d.worldWidth, 540);
    this.cameras.main.setBounds(0, 0, d.worldWidth, 540);

    // 바닥
    this.ground = this.physics.add.staticGroup();
    const groundBox = this.add.rectangle(d.worldWidth / 2, 520, d.worldWidth, 40, 0x44aa44);
    this.physics.add.existing(groundBox, true);
    this.ground.add(groundBox);

    // 플랫폼
    this.platforms = this.physics.add.staticGroup();
    d.platforms.forEach(p => {
      const box = this.add.rectangle(p.x, p.y, p.w, 20, 0x888844);
      this.physics.add.existing(box, true);
      this.platforms.add(box);
    });

    // 돈 아이템
    this.moneyGroup = this.physics.add.staticGroup();
    d.money.forEach(m => {
      const info = MONEY_TYPES[m.type];
      const item = this.add.circle(m.x, m.y, info.size / 2, info.color);
      this.physics.add.existing(item, true);
      item.moneyValue = info.value;
      this.moneyGroup.add(item);
    });

    // 골 마커 — 도착 지점 (노란 깃발 느낌)
    this.goalMarker = this.add.rectangle(d.goalX, 450, 20, 120, 0xffff00, 0.6);
    this.physics.add.existing(this.goalMarker, true);

    // 캐릭터 상태
    this.currentChar = 'taepyeong';
    this.jumpCount   = 0;
    this.isGliding   = false;
    this.totalMoney  = 0;
    this.isGameOver  = false;
    this.isCleared   = false;

    // 플레이어
    this.player = this.physics.add.image(100, 460, 'taepyeong');
    this.player.setDisplaySize(48, 64);
    this.player.body.setSize(36, 60);
    this.player.body.setCollideWorldBounds(true);

    // 충돌 / 수집 / 골
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(this.player, this.moneyGroup,  this.collectMoney, null, this);
    this.physics.add.overlap(this.player, this.goalMarker,  this.onStageClear, null, this);

    // 좀비
    this.zombies = this.physics.add.group();
    this.time.addEvent({
      delay: d.zombieDelay,
      loop: true,
      callback: this.spawnZombie,
      callbackScope: this,
    });
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

    // 스테이지 번호 (우상단 두 번째 줄)
    this.add.text(940, 46, `STAGE ${d.stageNum}`, { fontSize: '16px', color: '#888888' })
      .setOrigin(1, 0).setScrollFactor(0);

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
    if (this.isGameOver || this.isCleared) return;
    this.currentChar = this.currentChar === 'taepyeong' ? 'yunseul' : 'taepyeong';
    this.player.setTexture(CHARS[this.currentChar].texture);
    this.jumpCount = this.player.body.blocked.down ? 0 : 2;
    this.isGliding = false;
    this.charLabel.setText(this.getCharLabel());
    this.abilityLabel.setText(this.getAbilityLabel());
  }

  doJump() {
    if (this.isGameOver || this.isCleared) return;
    if (this.currentChar === 'taepyeong') {
      if (this.jumpCount < 2) { this.player.body.setVelocityY(-600); this.jumpCount++; }
    } else {
      if (this.player.body.blocked.down) { this.player.body.setVelocityY(-600); }
      else { this.isGliding = true; }
    }
  }

  spawnZombie() {
    if (this.isGameOver || this.isCleared) return;
    const zombie = this.add.rectangle(this.player.x + 600, 460, 36, 50, 0xff3333);
    this.physics.add.existing(zombie);
    zombie.body.setCollideWorldBounds(false);
    this.physics.add.collider(zombie, this.ground);
    zombie.body.setVelocityX(-this.stageData.zombieSpeed);
    this.zombies.add(zombie);
  }

  onStageClear() {
    if (this.isCleared || this.isGameOver) return;
    this.isCleared = true;
    this.player.body.setVelocityX(0);

    this.add.text(480, 200, 'STAGE CLEAR!', { fontSize: '52px', color: '#ffff00', fontStyle: 'bold' })
      .setOrigin(0.5).setScrollFactor(0);
    this.add.text(480, 270, `획득 금액: ${this.totalMoney.toLocaleString()}원`, { fontSize: '26px', color: '#ffdd44' })
      .setOrigin(0.5).setScrollFactor(0);

    const nextLabel = this.stageData.nextScene === 'TitleScene'
      ? '🏆 모든 스테이지 클리어!'
      : `▶ ${this.stageData.stageNum + 1}스테이지로`;

    this.add.text(480, 330, nextLabel, { fontSize: '24px', color: '#ffffff' })
      .setOrigin(0.5).setScrollFactor(0);
    this.add.text(480, 375, '화면을 탭하면 계속', { fontSize: '18px', color: '#aaaaaa' })
      .setOrigin(0.5).setScrollFactor(0);

    this.input.once('pointerdown', () => this.scene.start(this.stageData.nextScene));
    this.input.keyboard.once('keydown', () => this.scene.start(this.stageData.nextScene));
  }

  onGameOver() {
    if (this.isGameOver || this.isCleared) return;
    this.isGameOver = true;
    this.player.body.setVelocityX(0);
    this.zombies.getChildren().forEach(z => z.body.setVelocityX(0));

    this.add.text(480, 210, 'GAME OVER', { fontSize: '56px', color: '#ff3333', fontStyle: 'bold' })
      .setOrigin(0.5).setScrollFactor(0);
    this.add.text(480, 280, `획득 금액: ${this.totalMoney.toLocaleString()}원`, { fontSize: '26px', color: '#ffdd44' })
      .setOrigin(0.5).setScrollFactor(0);
    this.add.text(480, 335, '화면을 탭하면 타이틀로', { fontSize: '20px', color: '#ffffff' })
      .setOrigin(0.5).setScrollFactor(0);

    this.input.once('pointerdown', () => this.scene.start('TitleScene'));
    this.input.keyboard.once('keydown', () => this.scene.start('TitleScene'));
  }

  update() {
    if (this.isGameOver || this.isCleared) return;
    this.player.body.setVelocityX(200);

    // 패럴랙스 스크롤 — 카메라 위치에 비례해 각 레이어를 다른 속도로 이동
    const scrollX = this.cameras.main.scrollX;
    this.bgLayer1.tilePositionX = scrollX * 0.2; // 뒤 (가장 느림)
    this.bgLayer2.tilePositionX = scrollX * 0.5; // 중간
    this.bgLayer3.tilePositionX = scrollX * 0.8; // 앞 (가장 빠름)

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
