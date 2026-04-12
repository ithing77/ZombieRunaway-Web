// Stage3.js — 3스테이지: 공원 (보통~어려움)

class Stage3 extends BaseStage {
  constructor() { super('Stage3'); }

  getStageData() {
    return {
      stageNum:    3,
      worldWidth:  5000,
      goalX:       4700,
      bgColor:     '#87ceeb',
      zombieDelay: 2500,
      zombieSpeed: 160,
      nextScene:   'Stage4',
      money: [
        { x: 300,  y: 480, type: 'coin100' },
        { x: 650,  y: 480, type: 'coin500' },
        { x: 1000, y: 480, type: 'bill1000' },
        { x: 1350, y: 480, type: 'coin100' },
        { x: 1700, y: 480, type: 'coin500' },
        { x: 2050, y: 480, type: 'bill1000' },
        { x: 2400, y: 480, type: 'coin100' },
        { x: 2750, y: 480, type: 'bill1000' },
        { x: 3100, y: 480, type: 'coin500' },
        { x: 3450, y: 480, type: 'bill1000' },
        { x: 3800, y: 480, type: 'coin100' },
        { x: 4150, y: 480, type: 'bill1000' },
        { x: 4500, y: 480, type: 'coin500' },
      ],
    };
  }
}
