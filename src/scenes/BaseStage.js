// BaseStage.js — 공통 게임 로직

const CHARS = {
  taepyeong: { texture: 'taepyeong', label: '태평' },
  yunseul:   { texture: 'yunseul',   label: '윤슬' },
};

const MONEY_TYPES = {
  coin100:  { value: 100,  color: 0xd4d4d4, size: 16 },
  coin500:  { value: 500,  color: 0xffdd44, size: 20 },
  bill1000: { value: 1000, color: 0x66cc66, size: 24 },
};

class BaseStage extends Phaser.Scene {

  getStageData() {
    return {
      stageNum:    1,
      worldWidth:  4000,
      goalX:       3700,
      bgColor:     '#87ceeb',
      zombieDelay: 3000,
      zombieSpeed: 120,
      nextScene:   'Stage2',
      money:       [],
    };
  }

  preload() {
    this.load.spritesheet('taepyeong', 'assets/taepyeong_run.png', {
      frameWidth: 100, frameHeight: 100,
    });
    this.load.spritesheet('yunseul', 'assets/yunseul_run.png', {
      frameWidth: 81, frameHeight: 122,
    });
    this.load.spritesheet('yunseul_jump', 'assets/yunseul_jump.png', {
      frameWidth: 102, frameHeight: 122,
    });
    this.load.image('zombie', 'assets/zombie_1.png');
  }

  // ── 배경 텍스처 생성 ──────────────────────────────
  createBgTextures() {

    // 레이어1: 하늘 + 구름 + 먼 산 실루엣
    if (!this.textures.exists('bg1')) {
      const g = this.make.graphics({ add: false });
      g.fillStyle(0x87ceeb); g.fillRect(0, 0, 960, 540);
      // 먼 산 실루엣
      g.fillStyle(0xb8d4e8);
      [[0,300,120,240],[100,270,150,270],[200,290,130,250],[310,260,160,280],
       [440,280,140,260],[560,250,180,290],[710,270,150,270],[840,290,120,250]
      ].forEach(([x,y,w,h]) => g.fillRect(x, y, w, h));
      // 구름
      g.fillStyle(0xffffff, 0.85);
      [[60,60,110,30],[210,40,140,35],[420,70,100,28],[620,50,130,32],[820,65,90,26]
      ].forEach(([x,y,w,h]) => {
        g.fillRect(x, y, w, h);
        g.fillRect(x + 10, y - 12, w - 20, 16);
      });
      g.generateTexture('bg1', 960, 540);
      g.destroy();
    }

    // 레이어2: 중간 건물 (아파트/학교)
    if (!this.textures.exists('bg2')) {
      const g = this.make.graphics({ add: false });
      g.fillStyle(0, 0); g.fillRect(0, 0, 960, 540);
      const buildings = [
        [0,340,100,200,0xe8d5b0],[110,300,120,240,0xd4c49a],
        [240,360,80,180,0xe0cba0],[330,320,110,220,0xc8b888],
        [450,350,130,190,0xdac898],[590,310,100,230,0xcbb87a],
        [700,340,120,200,0xe2cf9e],[830,360,80,180,0xd0be90],
        [910,330,50,210,0xc6b27e],
      ];
      buildings.forEach(([x,y,w,h,c]) => {
        g.fillStyle(c); g.fillRect(x, y, w, h);
        // 지붕선
        g.fillStyle(0xaa9966); g.fillRect(x, y, w, 6);
        // 창문
        g.fillStyle(0x88bbdd, 0.8);
        for (let wy = y + 20; wy < y + h - 20; wy += 35) {
          for (let wx = x + 10; wx < x + w - 20; wx += 28) {
            g.fillRect(wx, wy, 16, 20);
          }
        }
      });
      g.generateTexture('bg2', 960, 540);
      g.destroy();
    }

    // 레이어3: 담장 + 전봇대
    if (!this.textures.exists('bg3')) {
      const g = this.make.graphics({ add: false });
      g.fillStyle(0, 0); g.fillRect(0, 0, 960, 540);
      // 담장
      g.fillStyle(0xd4b896); g.fillRect(0, 455, 960, 50);
      g.fillStyle(0xc0a070); g.fillRect(0, 455, 960, 5);
      // 담장 블록
      g.fillStyle(0xb89060, 0.5);
      for (let x = 0; x < 960; x += 55) g.fillRect(x, 455, 2, 50);
      for (let x = 28; x < 960; x += 55) g.fillRect(x, 475, 2, 30);
      // 전봇대
      g.fillStyle(0x7a6a55);
      [80, 240, 420, 600, 780, 940].forEach(x => {
        g.fillRect(x, 330, 7, 125);
        g.fillRect(x - 18, 335, 43, 5);
        g.fillRect(x - 8,  345, 23, 4);
      });
      // 전선
      g.lineStyle(1.5, 0x555555, 0.6);
      g.beginPath();
      g.moveTo(80, 337); g.lineTo(240, 340); g.lineTo(420, 337);
      g.lineTo(600, 340); g.lineTo(780, 337); g.lineTo(940, 340);
      g.strokePath();
      g.generateTexture('bg3', 960, 540);
      g.destroy();
    }
  }

  // ── create ────────────────────────────────────────
  create() {
    const d = this.getStageData();
    this.stageData = d;

    this.cameras.main.setBackgroundColor(d.bgColor);
    this.createBgTextures();

    // 배경 레이어 (화면 고정 + 패럴랙스)
    this.bgLayer1 = this.add.tileSprite(480, 270, 960, 540, 'bg1').setScrollFactor(0).setDepth(0);
    this.bgLayer2 = this.add.tileSprite(480, 270, 960, 540, 'bg2').setScrollFactor(0).setDepth(1);
    this.bgLayer3 = this.add.tileSprite(480, 270, 960, 540, 'bg3').setScrollFactor(0).setDepth(2);

    // 월드 크기
    this.physics.world.setBounds(0, 0, d.worldWidth, 540);
    this.cameras.main.setBounds(0, 0, d.worldWidth, 540);

    // 바닥 — 물리 + 시각
    this.ground = this.physics.add.staticGroup();
    const groundBox = this.add.rectangle(d.worldWidth / 2, 523, d.worldWidth, 34, 0x000000, 0);
    this.physics.add.existing(groundBox, true);
    this.ground.add(groundBox);
    // 바닥 시각 (간단한 색 띠)
    this.add.rectangle(d.worldWidth / 2, 514, d.worldWidth, 52, 0x8ab870).setDepth(3); // 풀
    this.add.rectangle(d.worldWidth / 2, 534, d.worldWidth, 12, 0x6a9850).setDepth(3); // 풀 어두운 선

    // 돈 아이템
    this.moneyGroup = this.physics.add.staticGroup();
    d.money.forEach(m => {
      const info = MONEY_TYPES[m.type];
      const item = this.add.circle(m.x, m.y, info.size / 2, info.color).setDepth(4);
      this.physics.add.existing(item, true);
      item.moneyValue = info.value;
      this.moneyGroup.add(item);
    });

    // 캐릭터 상태
    this.currentChar = 'taepyeong';
    this.jumpCount   = 0;
    this.isGliding   = false;
    this.totalMoney  = 0;
    this.isGameOver  = false;
    this.isCleared   = false;

    // 애니메이션 등록
    if (!this.anims.exists('taepyeong_run')) {
      this.anims.create({
        key: 'taepyeong_run',
        frames: this.anims.generateFrameNumbers('taepyeong', { start: 1, end: 24 }),
        frameRate: 14, repeat: -1,
      });
    }
    if (!this.anims.exists('yunseul_run')) {
      this.anims.create({
        key: 'yunseul_run',
        frames: this.anims.generateFrameNumbers('yunseul', { start: 0, end: 24 }),
        frameRate: 14, repeat: -1,
      });
    }
    if (!this.anims.exists('yunseul_jump')) {
      this.anims.create({
        key: 'yunseul_jump',
        frames: this.anims.generateFrameNumbers('yunseul_jump', { start: 0, end: 19 }),
        frameRate: 14, repeat: -1,
      });
    }

    // 플레이어
    this.player = this.physics.add.sprite(100, 460, 'taepyeong')
      .setDisplaySize(72, 72).setDepth(5);
    this.player.body.setSize(38, 60, true);
    this.player.body.setCollideWorldBounds(true);

    // 충돌
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.overlap(this.player, this.moneyGroup, this.collectMoney, null, this);

    // 좀비
    this.zombies = this.physics.add.group();
    this.time.addEvent({
      delay: d.zombieDelay, loop: true,
      callback: this.spawnZombie, callbackScope: this,
    });
    this.physics.add.overlap(this.player, this.zombies, this.onGameOver, null, this);

    // 키
    this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // ── UI ──
    this.jumpBtn = this.add.rectangle(880, 490, 120, 60, 0xffaa00)
      .setScrollFactor(0).setDepth(10).setInteractive();
    this.add.text(880, 490, 'JUMP', { fontSize: '22px', color: '#000', fontStyle: 'bold' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(10);
    this.jumpBtn.on('pointerdown', () => this.doJump());
    this.jumpBtn.on('pointerup',   () => { this.isGliding = false; });

    this.swapBtn = this.add.rectangle(880, 420, 120, 60, 0xaa44ff)
      .setScrollFactor(0).setDepth(10).setInteractive();
    this.add.text(880, 420, 'SWAP', { fontSize: '22px', color: '#fff', fontStyle: 'bold' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(10);
    this.swapBtn.on('pointerdown', () => this.doSwap());

    this.add.text(940, 46, `STAGE ${d.stageNum}`, { fontSize: '16px', color: '#555' })
      .setOrigin(1, 0).setScrollFactor(0).setDepth(10);
    this.charLabel = this.add.text(20, 20, this.getCharLabel(), { fontSize: '20px', color: '#333', fontStyle: 'bold' })
      .setScrollFactor(0).setDepth(10);
    this.abilityLabel = this.add.text(20, 46, this.getAbilityLabel(), { fontSize: '14px', color: '#555' })
      .setScrollFactor(0).setDepth(10);
    this.moneyLabel = this.add.text(940, 20, '💰 0원', { fontSize: '20px', color: '#cc8800', fontStyle: 'bold' })
      .setOrigin(1, 0).setScrollFactor(0).setDepth(10);

    // 카메라
    this.cameras.main.startFollow(this.player, true, 1, 1);

    // 디버그 (D키)
    this.debugMode = false;
    this.debugGraphic = this.physics.world.createDebugGraphic();
    this.debugGraphic.setVisible(false);
    this.debugText = this.add.text(10, 100, '', {
      fontSize: '13px', color: '#00ff00',
      backgroundColor: '#000000aa', padding: { x: 6, y: 4 },
    }).setScrollFactor(0).setDepth(999).setVisible(false);
    this.input.keyboard.on('keydown-D', () => {
      this.debugMode = !this.debugMode;
      this.debugGraphic.setVisible(this.debugMode);
      this.debugText.setVisible(this.debugMode);
    });

    this.player.play('taepyeong_run');
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
    this.jumpCount   = this.player.body.blocked.down ? 0 : 2;
    this.isGliding   = false;
    this.updateCharVisual();
    this.charLabel.setText(this.getCharLabel());
    this.abilityLabel.setText(this.getAbilityLabel());
  }

  updateCharVisual() {
    if (this.currentChar === 'taepyeong') {
      this.player.setTexture('taepyeong').setDisplaySize(72, 72);
      this.player.body.setSize(38, 60, true);
      this.player.play('taepyeong_run');
    } else {
      this.player.setTexture('yunseul').setDisplaySize(48, 58);
      this.player.body.setSize(36, 60, true);
      this.player.play('yunseul_run');
    }
  }

  doJump() {
    if (this.isGameOver || this.isCleared) return;
    if (this.currentChar === 'taepyeong') {
      if (this.jumpCount < 2) { this.player.body.setVelocityY(-360); this.jumpCount++; }
    } else {
      if (this.player.body.blocked.down) { this.player.body.setVelocityY(-360); }
      else { this.isGliding = true; }
    }
  }

  spawnZombie() {
    if (this.isGameOver || this.isCleared) return;
    const zombie = this.physics.add.image(this.player.x + 640, 468, 'zombie')
      .setDisplaySize(82, 100).setDepth(5);
    zombie.body.setCollideWorldBounds(false);
    zombie.body.setSize(50, 88, true);
    this.physics.add.collider(zombie, this.ground);
    this.zombies.add(zombie);
  }

  onStageClear() {
    if (this.isCleared || this.isGameOver) return;
    this.isCleared = true;
    this.player.body.setVelocityX(0);

    this.add.rectangle(480, 270, 500, 220, 0x000000, 0.6).setScrollFactor(0).setDepth(20);
    this.add.text(480, 190, 'STAGE CLEAR!', { fontSize: '48px', color: '#ffff00', fontStyle: 'bold' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(21);
    this.add.text(480, 255, `획득: ${this.totalMoney.toLocaleString()}원`, { fontSize: '26px', color: '#ffdd44' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(21);
    const nextLabel = this.stageData.nextScene === 'TitleScene'
      ? '🏆 모든 스테이지 클리어!' : `▶ ${this.stageData.stageNum + 1}스테이지로`;
    this.add.text(480, 305, nextLabel, { fontSize: '22px', color: '#fff' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(21);
    this.add.text(480, 345, '화면을 탭하면 계속', { fontSize: '16px', color: '#aaa' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(21);

    this.input.once('pointerdown', () => this.scene.start(this.stageData.nextScene));
    this.input.keyboard.once('keydown', () => this.scene.start(this.stageData.nextScene));
  }

  onGameOver() {
    if (this.isGameOver || this.isCleared) return;
    this.isGameOver = true;
    this.player.body.setVelocityX(0);
    this.zombies.getChildren().forEach(z => z.body?.setVelocityX(0));

    this.add.rectangle(480, 270, 500, 220, 0x000000, 0.7).setScrollFactor(0).setDepth(20);
    this.add.text(480, 200, 'GAME OVER', { fontSize: '52px', color: '#ff4444', fontStyle: 'bold' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(21);
    this.add.text(480, 265, `획득: ${this.totalMoney.toLocaleString()}원`, { fontSize: '24px', color: '#ffdd44' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(21);
    this.add.text(480, 315, '화면을 탭하면 타이틀로', { fontSize: '18px', color: '#fff' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(21);

    this.input.once('pointerdown', () => this.scene.start('TitleScene'));
    this.input.keyboard.once('keydown', () => this.scene.start('TitleScene'));
  }

  update() {
    if (this.isGameOver || this.isCleared) return;
    this.player.body.setVelocityX(200);

    // 패럴랙스
    const sx = this.cameras.main.scrollX;
    this.bgLayer1.tilePositionX = sx * 0.15;
    this.bgLayer2.tilePositionX = sx * 0.4;
    this.bgLayer3.tilePositionX = sx * 0.75;

    if (this.player.body.blocked.down) { this.jumpCount = 0; this.isGliding = false; }

    if (this.currentChar === 'yunseul' && this.isGliding && !this.player.body.blocked.down) {
      if (this.player.body.velocity.y > 60) this.player.body.setVelocityY(60);
    }


    if (Phaser.Input.Keyboard.JustDown(this.jumpKey)) this.doJump();
    if (Phaser.Input.Keyboard.JustUp(this.jumpKey))   this.isGliding = false;

    // 좀비 AI: 근처(400px)면 플레이어 추적, 멀면 천천히 왼쪽 이동
    const chaseSpeed = 100; // 플레이어 속도(200)의 절반
    this.zombies.getChildren().forEach(z => {
      if (!z.body) return;
      const dist = this.player.x - z.x;
      if (Math.abs(dist) < 400) {
        // 추적
        z.body.setVelocityX(dist > 0 ? chaseSpeed : -chaseSpeed);
      } else {
        // 기본: 왼쪽으로 천천히
        z.body.setVelocityX(-this.stageData.zombieSpeed);
      }
    });

    if (this.player.x >= this.stageData.goalX) this.onStageClear();

    // 디버그
    if (this.debugMode) {
      const b = this.player.body;
      this.debugText.setText([
        `캐릭터: ${this.currentChar}`,
        `위치: (${Math.round(b.x)}, ${Math.round(b.y)})`,
        `속도: vx=${Math.round(b.velocity.x)} vy=${Math.round(b.velocity.y)}`,
        `점프: ${this.jumpCount}  착지: ${b.blocked.down}  활공: ${this.isGliding}`,
        `히트박스: ${Math.round(b.width)}×${Math.round(b.height)}`,
      ]);
    }
  }
}
