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

    // 현재 캐릭터 상태
    this.currentChar = 'taepyeong';
    this.jumpCount = 0;      // 태평 2단점프 카운트
    this.isGliding = false;  // 윤슬 활공 중 여부

    // 캐릭터 박스
    this.player = this.add.rectangle(100, 460, 40, 50, CHARS.taepyeong.color);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

    // 충돌
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.player, this.platforms);

    // 좀비 그룹 (동적 물리)
    this.zombies = this.physics.add.group();
    // 3초마다 좀비 스폰
    this.time.addEvent({
      delay: 3000,
      loop: true,
      callback: this.spawnZombie,
      callbackScope: this,
    });

    // 좀비-플레이어 충돌 → 게임오버
    this.physics.add.overlap(this.player, this.zombies, this.onGameOver, null, this);

    // 게임 진행 중 여부
    this.isGameOver = false;

    // 점프 키
    this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // --- UI (scrollFactor 0 = 화면 고정) ---

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

    // 능력 설명 (이름 아래)
    this.abilityLabel = this.add.text(20, 46, this.getAbilityLabel(), {
      fontSize: '14px', color: '#aaaaaa'
    }).setScrollFactor(0);

    // 카메라 팔로우
    this.cameras.main.startFollow(this.player, true, 1, 1);
  }

  getCharLabel()   { return `▶ ${CHARS[this.currentChar].label}`; }
  getAbilityLabel() {
    return this.currentChar === 'taepyeong' ? '2단 점프' : '활공 (점프 유지)';
  }

  doSwap() {
    if (this.isGameOver) return;
    this.currentChar = this.currentChar === 'taepyeong' ? 'yunseul' : 'taepyeong';
    this.player.fillColor = CHARS[this.currentChar].color;
    this.jumpCount = 0;
    this.isGliding = false;
    this.charLabel.setText(this.getCharLabel());
    this.abilityLabel.setText(this.getAbilityLabel());
  }

  doJump() {
    if (this.isGameOver) return;

    if (this.currentChar === 'taepyeong') {
      // 태평: 최대 2번 점프
      if (this.jumpCount < 2) {
        this.player.body.setVelocityY(-600);
        this.jumpCount++;
      }
    } else {
      // 윤슬: 바닥에서 1번 점프 + 공중에서 활공 시작
      if (this.player.body.blocked.down) {
        this.player.body.setVelocityY(-600);
      } else {
        // 공중에서 점프 버튼 → 활공 모드 진입
        this.isGliding = true;
      }
    }
  }

  spawnZombie() {
    if (this.isGameOver) return;

    // 플레이어 오른쪽 화면 끝 + 약간 밖에서 스폰
    const spawnX = this.player.x + 600;
    const zombie = this.add.rectangle(spawnX, 460, 36, 50, 0xff3333);
    this.physics.add.existing(zombie);
    zombie.body.setCollideWorldBounds(false);
    zombie.body.setGravityY(0); // 자체 중력 추가 없음 (월드 중력 그대로)

    // 바닥 위에 서도록 충돌
    this.physics.add.collider(zombie, this.ground);

    // 플레이어 방향으로 이동
    zombie.body.setVelocityX(-120);

    this.zombies.add(zombie);
  }

  onGameOver() {
    if (this.isGameOver) return;
    this.isGameOver = true;

    // 모든 움직임 정지
    this.player.body.setVelocityX(0);
    this.zombies.getChildren().forEach(z => z.body.setVelocityX(0));

    // 게임오버 텍스트
    this.add.text(480, 250, 'GAME OVER', {
      fontSize: '56px', color: '#ff3333', fontStyle: 'bold'
    }).setOrigin(0.5).setScrollFactor(0);

    this.add.text(480, 320, '화면을 탭하면 다시 시작', {
      fontSize: '22px', color: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0);

    // 탭/클릭으로 재시작
    this.input.once('pointerdown', () => this.scene.restart());
    this.input.keyboard.once('keydown', () => this.scene.restart());
  }

  update() {
    if (this.isGameOver) return;

    // 자동 우측 이동
    this.player.body.setVelocityX(200);

    // 바닥 착지 시 점프 카운트 리셋
    if (this.player.body.blocked.down) {
      this.jumpCount = 0;
      this.isGliding = false;
    }

    // 윤슬 활공: 공중에서 isGliding 중이면 낙하 속도를 느리게 유지
    if (this.currentChar === 'yunseul' && this.isGliding && !this.player.body.blocked.down) {
      if (this.player.body.velocity.y > 60) {
        this.player.body.setVelocityY(60); // 천천히 떠 있는 느낌
      }
    }

    // 스페이스바 점프
    if (Phaser.Input.Keyboard.JustDown(this.jumpKey)) {
      this.doJump();
    }
    // 스페이스바 떼면 활공 해제
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
