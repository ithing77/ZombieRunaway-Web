// GameScene.js — 메인 게임 씬
// 캐릭터, 지형, 좀비, UI가 모두 이 씬에서 동작

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    // 임시 텍스트 — 연결 확인용
    this.add.text(480, 270, '남매의 하교길\n준비 중...', {
      fontSize: '32px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
  }
}
