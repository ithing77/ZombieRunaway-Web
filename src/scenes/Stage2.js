// Stage2.js — 2스테이지: 골목길 (보통)

class Stage2 extends BaseStage {
  constructor() { super('Stage2'); }

  getStageData() {
    return {
      stageNum:    2,
      worldWidth:  4500,
      goalX:       4200,
      bgColor:     '#a8d8a8',
      zombieDelay: 2800,
      zombieSpeed: 140,
      nextScene:   'Stage3',
      money: [
        { x: 300,  y: 480, type: 'coin100' },
        { x: 650,  y: 480, type: 'coin500' },
        { x: 1000, y: 480, type: 'bill1000' },
        { x: 1350, y: 480, type: 'coin100' },
        { x: 1700, y: 480, type: 'coin500' },
        { x: 2050, y: 480, type: 'bill1000' },
        { x: 2400, y: 480, type: 'coin100' },
        { x: 2750, y: 480, type: 'coin500' },
        { x: 3100, y: 480, type: 'bill1000' },
        { x: 3450, y: 480, type: 'coin100' },
        { x: 3800, y: 480, type: 'coin500' },
        { x: 4100, y: 480, type: 'bill1000' },
      ],
    };
  }
}
