// Stage1.js — 1스테이지: 하교길 시작 (쉬움)

class Stage1 extends BaseStage {
  constructor() { super('Stage1'); }

  getStageData() {
    return {
      stageNum:    1,
      worldWidth:  4000,
      goalX:       3700,
      bgColor:     '#87ceeb',
      zombieDelay: 3500,
      zombieSpeed: 110,
      nextScene:   'Stage2',
      money: [
        { x: 300,  y: 480, type: 'coin100' },
        { x: 600,  y: 480, type: 'coin500' },
        { x: 900,  y: 480, type: 'coin100' },
        { x: 1200, y: 480, type: 'bill1000' },
        { x: 1500, y: 480, type: 'coin100' },
        { x: 1800, y: 480, type: 'coin500' },
        { x: 2100, y: 480, type: 'bill1000' },
        { x: 2400, y: 480, type: 'coin100' },
        { x: 2700, y: 480, type: 'coin500' },
        { x: 3000, y: 480, type: 'bill1000' },
        { x: 3300, y: 480, type: 'coin100' },
        { x: 3600, y: 480, type: 'coin500' },
      ],
    };
  }
}
