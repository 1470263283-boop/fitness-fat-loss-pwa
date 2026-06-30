import type { Exercise, WorkoutPlan } from '../types';

const ex = (
  id: string,
  name: string,
  category: string,
  targetSets: number,
  targetRepsMin: number,
  targetRepsMax: number,
  restSeconds: number,
  notes: string,
  progressionType: Exercise['progressionType'],
): Exercise => ({
  id,
  name,
  category,
  targetSets,
  targetRepsMin,
  targetRepsMax,
  restSeconds,
  notes,
  progressionType,
});

export const workoutPlans: WorkoutPlan[] = [
  {
    id: 'upper-a',
    name: '上肢A',
    weekday: 1,
    warmup: '跑步机快走10分钟，坡度4-6%，速度4.5-5.2km/h',
    cardio: '跑步机爬坡走20分钟，坡度6-10%，速度4.5-5.5km/h',
    exercises: [
      ex('seated-chest-press', '坐姿推胸器械', '胸部复合', 4, 8, 12, 90, '肩胛后收，控制离心。', 'upper_compound'),
      ex('lat-pulldown', '高位下拉', '背部复合', 4, 8, 12, 90, '先下沉肩胛，再拉肘。', 'upper_compound'),
      ex('seated-row', '坐姿划船', '背部复合', 4, 10, 12, 90, '保持躯干稳定，不借力后仰。', 'upper_compound'),
      ex('incline-dumbbell-press', '上斜哑铃卧推', '胸部复合', 3, 8, 12, 90, '哑铃轨迹略向内收。', 'upper_compound'),
      ex('pec-deck', '蝴蝶机夹胸', '胸部孤立', 3, 12, 15, 60, '顶峰收缩1秒。', 'isolation'),
      ex('face-pull', '面拉 Face Pull', '肩后束', 3, 12, 15, 60, '拉向眉眼高度，肘部打开。', 'isolation'),
      ex('dumbbell-lateral-raise', '哑铃侧平举', '肩中束', 4, 12, 20, 60, '小重量高质量，避免耸肩。', 'isolation'),
      ex('rope-pushdown', '绳索下压', '肱三头肌', 3, 10, 15, 60, '手肘固定在身体两侧。', 'isolation'),
      ex('dumbbell-curl', '哑铃弯举', '肱二头肌', 3, 10, 15, 60, '全程控制，不甩动。', 'isolation'),
    ],
  },
  {
    id: 'lower-a',
    name: '下肢A',
    weekday: 2,
    warmup: '椭圆机8-10分钟',
    cardio: '椭圆机20-25分钟',
    exercises: [
      ex('leg-press', '腿举机', '下肢复合', 4, 10, 12, 120, '膝盖跟随脚尖方向。', 'lower_compound'),
      ex('smith-or-hack-squat', '史密斯深蹲或哈克深蹲', '下肢复合', 3, 8, 10, 120, '优先稳定动作深度。', 'lower_compound'),
      ex('romanian-deadlift', '罗马尼亚硬拉', '后链复合', 3, 8, 10, 120, '髋主导，背部保持中立。', 'lower_compound'),
      ex('seated-leg-curl', '坐姿腿弯举', '腘绳肌', 3, 10, 12, 90, '顶峰挤压，慢放回。', 'isolation'),
      ex('leg-extension', '腿屈伸', '股四头肌', 3, 12, 15, 75, '膝盖无痛范围内完成。', 'isolation'),
      ex('seated-calf-raise', '坐姿提踵', '小腿', 4, 12, 15, 60, '底部拉伸，顶部停顿。', 'isolation'),
      ex('dead-bug', '死虫 Dead Bug', '核心', 3, 10, 10, 45, '每侧10次，腰背贴地。', 'core'),
      ex('pallof-press', 'Pallof Press抗旋转', '核心', 3, 10, 12, 45, '每侧10-12次，骨盆稳定。', 'core'),
    ],
  },
  {
    id: 'cardio-shaping',
    name: '有氧塑型日',
    weekday: 3,
    warmup: '轻松活动5-8分钟，确认膝盖和腰部状态',
    cardio:
      '方案一：跑步机爬坡走40-50分钟，坡度6-10%，速度4.5-5.5km/h。方案二：椭圆机40-50分钟，中等阻力。方案三：爬楼机第1-4周8-12分钟，第5-8周12-18分钟，第9-12周15-25分钟。',
    exercises: [
      ex('treadmill-incline-walk', '跑步机爬坡走', '有氧', 1, 40, 50, 0, '按分钟记录，坡度6-10%。', 'cardio'),
      ex('elliptical-cardio', '椭圆机中等阻力', '有氧', 1, 40, 50, 0, '按分钟记录，保持可说短句的强度。', 'cardio'),
      ex('stair-climber', '爬楼机', '有氧', 1, 8, 25, 0, '按当前阶段选择时长。', 'cardio'),
      ex('plank', '平板支撑', '核心', 3, 30, 60, 45, '按秒记录。', 'core'),
      ex('bird-dog', '鸟狗 Bird Dog', '核心', 3, 10, 10, 45, '每侧10次，控制骨盆。', 'core'),
      ex('crunch', '仰卧卷腹', '核心', 3, 12, 15, 45, '不要用颈部发力。', 'core'),
      ex('hip-flexor-stretch', '髋屈肌拉伸', '拉伸', 1, 2, 2, 0, '按分钟记录。', 'core'),
      ex('thoracic-extension', '胸椎伸展', '拉伸', 1, 2, 2, 0, '按分钟记录。', 'core'),
    ],
  },
  {
    id: 'upper-b',
    name: '上肢B',
    weekday: 5,
    warmup: '跑步机快走8-10分钟',
    cardio: '跑步机爬坡走15-25分钟',
    exercises: [
      ex('assisted-pullup-or-close-pulldown', '辅助引体向上或窄握下拉', '背部复合', 4, 8, 12, 90, '全程控制肩胛。', 'upper_compound'),
      ex('chest-supported-row', '胸托划船或器械划船', '背部复合', 4, 8, 12, 90, '胸口贴稳，避免借力。', 'upper_compound'),
      ex('machine-shoulder-press', '器械肩推', '肩部复合', 3, 8, 12, 90, '肘部略在身体前侧。', 'upper_compound'),
      ex('seated-cable-row', '坐姿绳索划船', '背部复合', 3, 10, 12, 90, '拉到下腹，保持稳定。', 'upper_compound'),
      ex('reverse-fly', '反向飞鸟', '肩后束', 3, 12, 15, 60, '慢速控制。', 'isolation'),
      ex('dumbbell-lateral-raise', '哑铃侧平举', '肩中束', 4, 12, 20, 60, '先做够次数，再考虑加重量。', 'isolation'),
      ex('incline-pushup', '上斜俯卧撑或俯卧撑辅助', '胸部', 3, 8, 12, 60, '保持核心收紧。', 'upper_compound'),
      ex('hammer-curl', '锤式弯举', '肱二头肌', 3, 10, 15, 60, '手腕中立。', 'isolation'),
      ex('overhead-cable-extension', '过顶绳索臂屈伸', '肱三头肌', 3, 10, 15, 60, '肩部无痛范围内完成。', 'isolation'),
    ],
  },
  {
    id: 'lower-b',
    name: '下肢B',
    weekday: 6,
    warmup: '椭圆机10分钟',
    cardio: '椭圆机20-30分钟，或爬楼机10-15分钟',
    exercises: [
      ex('hip-thrust', '臀推机或杠铃臀推', '臀部复合', 4, 8, 12, 120, '顶峰骨盆后倾，臀部发力。', 'lower_compound'),
      ex('hack-or-smith-squat', '哈克深蹲或史密斯深蹲', '下肢复合', 4, 8, 12, 120, '动作稳定优先。', 'lower_compound'),
      ex('bulgarian-split-squat', '保加利亚分腿蹲或台阶上步', '单腿训练', 3, 8, 10, 90, '每侧8-10次，膝盖稳定。', 'lower_compound'),
      ex('lying-or-seated-leg-curl', '腿弯举', '腘绳肌', 3, 10, 12, 90, '控制离心。', 'isolation'),
      ex('leg-extension', '腿屈伸', '股四头肌', 3, 12, 15, 75, '避免锁死膝盖。', 'isolation'),
      ex('farmer-walk', '农夫行走', '全身稳定', 3, 30, 40, 90, '按米记录。', 'lower_compound'),
      ex('plank', '平板支撑', '核心', 3, 30, 60, 45, '按秒记录。', 'core'),
    ],
  },
];

export const weeklySchedule = [
  { weekday: 1, label: '周一', planId: 'upper-a', name: '上肢A' },
  { weekday: 2, label: '周二', planId: 'lower-a', name: '下肢A' },
  { weekday: 3, label: '周三', planId: 'cardio-shaping', name: '有氧塑型日（可选，第5练）' },
  { weekday: 4, label: '周四', planId: null, name: '休息日' },
  { weekday: 5, label: '周五', planId: 'upper-b', name: '上肢B' },
  { weekday: 6, label: '周六', planId: 'lower-b', name: '下肢B' },
  { weekday: 0, label: '周日', planId: null, name: '休息日' },
];

export const allExercises = workoutPlans
  .flatMap((plan) => plan.exercises)
  .filter((exercise, index, list) => list.findIndex((item) => item.id === exercise.id) === index);

export const getPlanById = (planId: string) => workoutPlans.find((plan) => plan.id === planId);

export const getPlanForWeekday = (weekday: number) =>
  workoutPlans.find((plan) => plan.weekday === weekday) ?? null;
