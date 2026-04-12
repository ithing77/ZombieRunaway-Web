// Stage4.js — 4스테이지: 주택가 (어려움)

class Stage4 extends BaseStage {
  constructor() { super('Stage4'); }

  getStageData() {
    return {
      stageNum:    4,
      worldWidth:  5500,
      goalX:       5200,
      bgColor:     '#c8b8e8',
      zombieDelay: 2000,
      zombieSpeed: 180,
      nextScene:   'Stage5',
      money: [
        { x: 350,  y: 480, type: 'coin500' },
        { x: 750,  y: 480, type: 'bill1000' },
        { x: 1150, y: 480, type: 'coin100' },
        { x: 1550, y: 480, type: 'bill1000' },
        { x: 1950, y: 480, type: 'coin500' },
        { x: 2350, y: 480, type: 'bill1000' },
        { x: 2750, y: 480, type: 'coin100' },
        { x: 3150, y: 480, type: 'bill1000' },
        { x: 3550, y: 480, type: 'coin500' },
        { x: 3950, y: 480, type: 'bill1000' },
        { x: 4350, y: 480, type: 'coin100' },
        { x: 4750, y: 480, type: 'bill1000' },
        { x: 5100, y: 480, type: 'coin500' },
      ],
    };
  }
}
