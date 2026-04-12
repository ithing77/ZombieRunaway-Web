// Stage5.js — 5스테이지: 집 앞 (최종, 매우 어려움)

class Stage5 extends BaseStage {
  constructor() { super('Stage5'); }

  getStageData() {
    return {
      stageNum:    5,
      worldWidth:  6000,
      goalX:       5700,
      bgColor:     '#f0c8a0',
      zombieDelay: 1500,
      zombieSpeed: 200,
      nextScene:   'TitleScene',
      money: [
        { x: 400,  y: 480, type: 'bill1000' },
        { x: 800,  y: 480, type: 'bill1000' },
        { x: 1200, y: 480, type: 'coin500' },
        { x: 1600, y: 480, type: 'bill1000' },
        { x: 2000, y: 480, type: 'bill1000' },
        { x: 2400, y: 480, type: 'coin500' },
        { x: 2800, y: 480, type: 'bill1000' },
        { x: 3200, y: 480, type: 'bill1000' },
        { x: 3600, y: 480, type: 'coin500' },
        { x: 4000, y: 480, type: 'bill1000' },
        { x: 4400, y: 480, type: 'bill1000' },
        { x: 4800, y: 480, type: 'coin500' },
        { x: 5200, y: 480, type: 'bill1000' },
        { x: 5500, y: 480, type: 'bill1000' },
      ],
    };
  }
}
