// main.js — 게임 설정 및 씬 등록
// 씬 파일들은 index.html에서 먼저 로드됨

const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  backgroundColor: '#1a1a2e',
  render: {
    pixelArt: true,    // 픽셀아트 안티앨리어싱 끄기
    roundPixels: true, // 떨림 방지
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 800 }, debug: false }
  },
  // TitleScene 먼저 → GameScene 순서로 등록
  scene: [TitleScene, GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

new Phaser.Game(config);
