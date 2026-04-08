// Stage3.js — 3스테이지: 공원 (보통~어려움)

class Stage3 extends BaseStage {
  constructor() { super('Stage3'); }

  getStageData() {
    return {
      stageNum:    3,
      worldWidth:  5000,
      goalX:       4700,
      bgColor:     '#0d1a2e',  // 어두운 파란 배경
      zombieDelay: 2500,
      zombieSpeed: 160,
      nextScene:   'Stage4',
      platforms: [
        { x: 300,  y: 390, w: 130 },
        { x: 580,  y: 340, w: 130 },
        { x: 820,  y: 290, w: 110 },
        { x: 1060, y: 360, w: 130 },
        { x: 1300, y: 300, w: 110 },
        { x: 1560, y: 350, w: 130 },
        { x: 1820, y: 290, w: 110 },
        { x: 2100, y: 370, w: 150 },
        { x: 2400, y: 310, w: 110 },
        { x: 2680, y: 360, w: 130 },
        { x: 2960, y: 300, w: 110 },
        { x: 3240, y: 380, w: 150 },
        { x: 3540, y: 330, w: 130 },
        { x: 3820, y: 290, w: 110 },
        { x: 4100, y: 370, w: 150 },
        { x: 4400, y: 400, w: 130 },
      ],
      money: [
        { x: 250,  y: 470, type: 'coin100' },
        { x: 450,  y: 470, type: 'coin500' },
        { x: 650,  y: 470, type: 'coin100' },
        { x: 820,  y: 260, type: 'bill1000' },
        { x: 1000, y: 470, type: 'coin500' },
        { x: 1200, y: 470, type: 'coin100' },
        { x: 1400, y: 470, type: 'bill1000' },
        { x: 1600, y: 320, type: 'coin500' },
        { x: 1800, y: 470, type: 'coin100' },
        { x: 2000, y: 470, type: 'bill1000' },
        { x: 2200, y: 470, type: 'coin500' },
        { x: 2400, y: 280, type: 'bill1000' },
        { x: 2600, y: 470, type: 'coin100' },
        { x: 2800, y: 470, type: 'coin500' },
        { x: 3000, y: 470, type: 'bill1000' },
        { x: 3200, y: 470, type: 'coin100' },
        { x: 3400, y: 470, type: 'coin500' },
        { x: 3600, y: 470, type: 'bill1000' },
        { x: 3900, y: 470, type: 'coin500' },
        { x: 4200, y: 470, type: 'bill1000' },
        { x: 4500, y: 470, type: 'coin100' },
      ],
    };
  }
}
