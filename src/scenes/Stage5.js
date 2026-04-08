// Stage5.js — 5스테이지: 집 앞 (최종, 매우 어려움)

class Stage5 extends BaseStage {
  constructor() { super('Stage5'); }

  getStageData() {
    return {
      stageNum:    5,
      worldWidth:  6000,
      goalX:       5700,
      bgColor:     '#2e0d0d',  // 붉은 어두운 배경 — 긴장감
      zombieDelay: 1500,
      zombieSpeed: 200,
      nextScene:   'TitleScene',  // 5스테이지 클리어 → 타이틀로
      platforms: [
        { x: 260,  y: 370, w: 110 },
        { x: 490,  y: 310, w: 100 },
        { x: 720,  y: 260, w: 90  },
        { x: 950,  y: 340, w: 110 },
        { x: 1180, y: 280, w: 90  },
        { x: 1410, y: 330, w: 100 },
        { x: 1640, y: 260, w: 90  },
        { x: 1900, y: 350, w: 110 },
        { x: 2160, y: 290, w: 90  },
        { x: 2420, y: 250, w: 90  },
        { x: 2680, y: 330, w: 100 },
        { x: 2940, y: 270, w: 90  },
        { x: 3200, y: 350, w: 110 },
        { x: 3460, y: 290, w: 90  },
        { x: 3720, y: 250, w: 90  },
        { x: 3980, y: 340, w: 100 },
        { x: 4240, y: 280, w: 90  },
        { x: 4500, y: 370, w: 110 },
        { x: 4760, y: 310, w: 90  },
        { x: 5020, y: 260, w: 90  },
        { x: 5280, y: 350, w: 110 },
        { x: 5500, y: 390, w: 130 },
      ],
      money: [
        { x: 350,  y: 470, type: 'bill1000' },
        { x: 600,  y: 470, type: 'bill1000' },
        { x: 850,  y: 470, type: 'coin500'  },
        { x: 1100, y: 470, type: 'bill1000' },
        { x: 1350, y: 470, type: 'bill1000' },
        { x: 1600, y: 230, type: 'bill1000' },
        { x: 1850, y: 470, type: 'coin500'  },
        { x: 2100, y: 470, type: 'bill1000' },
        { x: 2350, y: 470, type: 'bill1000' },
        { x: 2600, y: 470, type: 'coin500'  },
        { x: 2850, y: 470, type: 'bill1000' },
        { x: 3100, y: 470, type: 'bill1000' },
        { x: 3350, y: 470, type: 'coin500'  },
        { x: 3600, y: 230, type: 'bill1000' },
        { x: 3850, y: 470, type: 'bill1000' },
        { x: 4100, y: 470, type: 'coin500'  },
        { x: 4350, y: 470, type: 'bill1000' },
        { x: 4600, y: 470, type: 'bill1000' },
        { x: 4850, y: 470, type: 'coin500'  },
        { x: 5100, y: 470, type: 'bill1000' },
        { x: 5350, y: 470, type: 'bill1000' },
        { x: 5550, y: 360, type: 'bill1000' },
      ],
    };
  }
}
