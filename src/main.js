// main.js — 게임 설정 및 씬 등록
// Phaser는 index.html에서 CDN으로 미리 로드됨

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    // 연결 확인용 텍스트
    this.add.text(480, 270, '남매의 하교길\n준비 중...', {
      fontSize: '32px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
  }
}

// Phaser 게임 설정
// 960x540 가로 모드, 픽셀 아트, 아케이드 물리
const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  backgroundColor: '#1a1a2e',
  pixelArt: true,
  roundPixels: true,
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
