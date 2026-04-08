// Stage2.js — 2스테이지: 골목길 (보통)

class Stage2 extends BaseStage {
  constructor() { super('Stage2'); }

  getStageData() {
    return {
      stageNum:    2,
      worldWidth:  4500,
      goalX:       4200,
      bgColor:     '#1a2a1a',  // 초록빛 어두운 배경
      zombieDelay: 2800,
      zombieSpeed: 140,
      nextScene:   'Stage3',
      platforms: [
        { x: 350,  y: 400, w: 140 },
        { x: 650,  y: 350, w: 140 },
        { x: 900,  y: 300, w: 120 },
        { x: 1150, y: 370, w: 160 },
        { x: 1450, y: 320, w: 140 },
        { x: 1700, y: 380, w: 160 },
        { x: 2000, y: 340, w: 140 },
        { x: 2300, y: 300, w: 120 },
        { x: 2550, y: 380, w: 160 },
        { x: 2850, y: 340, w: 140 },
        { x: 3150, y: 300, w: 120 },
        { x: 3450, y: 370, w: 160 },
        { x: 3750, y: 400, w: 140 },
      ],
      money: [
        { x: 300,  y: 470, type: 'coin100' },
        { x: 500,  y: 470, type: 'coin500' },
        { x: 650,  y: 320, type: 'bill1000' },
        { x: 850,  y: 470, type: 'coin100' },
        { x: 1000, y: 470, type: 'coin500' },
        { x: 1150, y: 340, type: 'bill1000' },
        { x: 1350, y: 470, type: 'coin100' },
        { x: 1550, y: 470, type: 'coin500' },
        { x: 1700, y: 350, type: 'bill1000' },
        { x: 1900, y: 470, type: 'coin100' },
        { x: 2100, y: 470, type: 'coin500' },
        { x: 2300, y: 270, type: 'bill1000' },
        { x: 2500, y: 470, type: 'coin100' },
        { x: 2700, y: 470, type: 'bill1000' },
        { x: 2900, y: 470, type: 'coin500' },
        { x: 3100, y: 270, type: 'bill1000' },
        { x: 3300, y: 470, type: 'coin100' },
        { x: 3500, y: 470, type: 'coin500' },
        { x: 3700, y: 370, type: 'bill1000' },
        { x: 3900, y: 470, type: 'coin100' },
      ],
    };
  }
}
