// Stage1.js — 1스테이지: 하교길 시작 (쉬움)

class Stage1 extends BaseStage {
  constructor() { super('Stage1'); }

  getStageData() {
    return {
      stageNum:    1,
      worldWidth:  4000,
      goalX:       3700,
      bgColor:     '#1a1a2e',
      zombieDelay: 3500,
      zombieSpeed: 110,
      nextScene:   'Stage2',
      platforms: [
        { x: 400,  y: 420, w: 160 },
        { x: 700,  y: 380, w: 160 },
        { x: 1000, y: 340, w: 160 },
        { x: 1300, y: 400, w: 200 },
        { x: 1600, y: 360, w: 160 },
        { x: 1900, y: 420, w: 200 },
        { x: 2200, y: 380, w: 160 },
        { x: 2500, y: 340, w: 200 },
        { x: 2800, y: 400, w: 160 },
        { x: 3100, y: 360, w: 200 },
        { x: 3400, y: 420, w: 160 },
      ],
      money: [
        { x: 250,  y: 470, type: 'coin100' },
        { x: 400,  y: 390, type: 'coin500' },
        { x: 550,  y: 470, type: 'coin100' },
        { x: 700,  y: 350, type: 'coin500' },
        { x: 900,  y: 470, type: 'bill1000' },
        { x: 1000, y: 310, type: 'coin500' },
        { x: 1150, y: 470, type: 'coin100' },
        { x: 1300, y: 370, type: 'bill1000' },
        { x: 1500, y: 470, type: 'coin100' },
        { x: 1600, y: 330, type: 'coin500' },
        { x: 1800, y: 470, type: 'bill1000' },
        { x: 2000, y: 470, type: 'coin100' },
        { x: 2200, y: 350, type: 'coin500' },
        { x: 2400, y: 470, type: 'bill1000' },
        { x: 2600, y: 470, type: 'coin100' },
        { x: 2800, y: 370, type: 'coin500' },
        { x: 3000, y: 470, type: 'bill1000' },
        { x: 3200, y: 470, type: 'coin100' },
        { x: 3400, y: 390, type: 'coin500' },
        { x: 3600, y: 470, type: 'bill1000' },
      ],
    };
  }
}
