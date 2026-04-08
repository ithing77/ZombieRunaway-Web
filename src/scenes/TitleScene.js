// TitleScene.js — 타이틀 화면
// 메뉴: 게임 시작 / 만든 사람 / 랭킹 / 게임 종료

class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create() {
    const cx = 480; // 화면 중앙 x

    // 배경색은 config에서 설정됨 (#1a1a2e)

    // 게임 타이틀
    this.add.text(cx, 120, '남매의 하교길', {
      fontSize: '52px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(cx, 185, '🧟 좀비를 피해 집으로!', {
      fontSize: '22px',
      color: '#aaaaaa',
    }).setOrigin(0.5);

    // 메뉴 항목 정의 — label, callback
    const menuItems = [
      { label: '▶  게임 시작',  action: () => this.scene.start('Stage1') },
      { label: '👤  만든 사람', action: () => this.showCredits() },
      { label: '🏆  랭킹',      action: () => this.showRanking() },
      { label: '✕  게임 종료',  action: () => this.showExit() },
    ];

    // 메뉴 버튼 생성
    menuItems.forEach((item, i) => {
      const y = 290 + i * 62;

      const btn = this.add.rectangle(cx, y, 320, 48, 0x2a2a4a)
        .setInteractive()
        .setStrokeStyle(2, 0x5555aa);

      const label = this.add.text(cx, y, item.label, {
        fontSize: '24px',
        color: '#ddddff',
      }).setOrigin(0.5);

      // 호버 효과
      btn.on('pointerover', () => {
        btn.setFillStyle(0x4444aa);
        label.setColor('#ffffff');
      });
      btn.on('pointerout', () => {
        btn.setFillStyle(0x2a2a4a);
        label.setColor('#ddddff');
      });
      btn.on('pointerdown', item.action);
    });

    // 하단 버전 표시
    this.add.text(cx, 520, 'v0.1 prototype', {
      fontSize: '14px',
      color: '#555577',
    }).setOrigin(0.5);

    // 안내 오버레이 (만든 사람 / 랭킹 / 종료 공용)
    this.overlay = this.add.rectangle(cx, 270, 500, 300, 0x111133)
      .setStrokeStyle(2, 0x8888cc)
      .setVisible(false);

    this.overlayText = this.add.text(cx, 220, '', {
      fontSize: '18px',
      color: '#ffffff',
      align: 'center',
    }).setOrigin(0.5).setVisible(false);

    this.overlayClose = this.add.text(cx, 360, '[ 닫기 ]', {
      fontSize: '20px',
      color: '#ffaa00',
    }).setOrigin(0.5).setVisible(false).setInteractive();

    this.overlayClose.on('pointerdown', () => this.closeOverlay());
  }

  showCredits() {
    this.showOverlay('만든 사람\n\n기획 · 개발: bob\n캐릭터 디자인: bob\n\nPhaser 3 기반 웹게임');
  }

  showRanking() {
    this.showOverlay('랭킹\n\n준비 중입니다 🏆\n\n(추후 온라인 랭킹 추가 예정)');
  }

  showExit() {
    this.showOverlay('게임 종료\n\n브라우저 탭을 닫아주세요 👋');
  }

  showOverlay(text) {
    this.overlay.setVisible(true);
    this.overlayText.setText(text).setVisible(true);
    this.overlayClose.setVisible(true);
  }

  closeOverlay() {
    this.overlay.setVisible(false);
    this.overlayText.setVisible(false);
    this.overlayClose.setVisible(false);
  }
}
