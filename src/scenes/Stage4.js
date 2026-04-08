// Stage4.js — 4스테이지: 주택가 (어려움)

class Stage4 extends BaseStage {
  constructor() { super('Stage4'); }

  getStageData() {
    return {
      stageNum:    4,
      worldWidth:  5500,
      goalX:       5200,
      bgColor:     '#1a0d2e',  // 보라빛 어두운 배경
      zombieDelay: 2000,
      zombieSpeed: 180,
      nextScene:   'Stage5',
      platforms: [
        { x: 280,  y: 380, w: 120 },
        { x: 520,  y: 320, w: 110 },
        { x: 760,  y: 270, w: 100 },
        { x: 1000, y: 350, w: 120 },
        { x: 1240, y: 290, w: 100 },
        { x: 1480, y: 340, w: 110 },
        { x: 1720, y: 270, w: 100 },
        { x: 1980, y: 360, w: 120 },
        { x: 2240, y: 300, w: 100 },
        { x: 2500, y: 260, w: 100 },
        { x: 2760, y: 340, w: 110 },
        { x: 3020, y: 280, w: 100 },
        { x: 3280, y: 360, w: 120 },
        { x: 3540, y: 300, w: 110 },
        { x: 3800, y: 260, w: 100 },
        { x: 4060, y: 350, w: 120 },
        { x: 4320, y: 290, w: 110 },
        { x: 4580, y: 380, w: 130 },
        { x: 4850, y: 340, w: 110 },
      ],
      money: [
        { x: 400,  y: 470, type: 'coin500' },
        { x: 650,  y: 470, type: 'bill1000' },
        { x: 900,  y: 470, type: 'coin100' },
        { x: 1100, y: 470, type: 'bill1000' },
        { x: 1350, y: 470, type: 'coin500' },
        { x: 1600, y: 470, type: 'bill1000' },
        { x: 1800, y: 470, type: 'coin100' },
        { x: 2000, y: 330, type: 'bill1000' },
        { x: 2250, y: 470, type: 'coin500' },
        { x: 2500, y: 230, type: 'bill1000' },
        { x: 2700, y: 470, type: 'coin100' },
        { x: 2900, y: 470, type: 'bill1000' },
        { x: 3100, y: 470, type: 'coin500' },
        { x: 3300, y: 470, type: 'bill1000' },
        { x: 3550, y: 470, type: 'coin100' },
        { x: 3800, y: 230, type: 'bill1000' },
        { x: 4000, y: 470, type: 'coin500' },
        { x: 4250, y: 470, type: 'bill1000' },
        { x: 4500, y: 350, type: 'coin500' },
        { x: 4750, y: 470, type: 'bill1000' },
        { x: 5000, y: 470, type: 'coin100' },
      ],
    };
  }
}
