import * as EssentialsPlugin from '@tweakpane/plugin-essentials'
import { Fireworks } from 'fireworks-js'
import { Pane } from 'tweakpane'
import {
  backgroundConfig,
  fireworksContainer,
  fireworksOptions,
  mainContainer
} from './config.js'
import type { FpsGraphBladeApi } from '@tweakpane/plugin-essentials/dist/types/fps-graph/api/fps-graph'
import '@r3-dev/brand'

declare global {
  interface Window {
    fireworks: Fireworks
  }
}

const fireworks = new Fireworks(fireworksContainer, fireworksOptions)
window.fireworks = fireworks
fireworks.start()

const fireworksGetters = {
  get traces(): number {
    // @ts-ignore
    return fireworks.traces.length
  },
  get particles(): number {
    // @ts-ignore
    return fireworks.explosions.length
  }
}

const isPcWidth = window.innerWidth > 1000
const tweakpane = new Pane({
  document,
  expanded: isPcWidth,
  title: document.title
})

tweakpane.registerPlugin(EssentialsPlugin)

tweakpane.on('fold', ({ expanded }) => {
  if (isPcWidth) return
  mainContainer.style.display = expanded ? 'none' : 'block'
})

/** options */
tweakpane.addBinding(fireworksOptions, 'hue', {
  label: '色相',
  min: 0,
  max: 360,
  step: 1
})

tweakpane.addBinding(fireworksOptions, 'acceleration', {
  label: '发射加速度',
  min: 1,
  max: 2
})

tweakpane.addBinding(fireworksOptions, 'brightness', {
  label: '亮度',
  min: 1,
  max: 100,
  step: 1
})

tweakpane.addBinding(fireworksOptions, 'decay', {
  label: '衰减速度',
  min: 0.001,
  max: 0.05
})

tweakpane.addBinding(fireworksOptions, 'delay', {
  label: '延迟',
  min: 10,
  max: 100
})

tweakpane.addBinding(fireworksOptions, 'explosion', {
  label: '爆炸数量',
  min: 1,
  max: 10,
  step: 1
})

tweakpane.addBinding(fireworksOptions, 'flickering', {
  label: '闪烁',
  min: 0,
  max: 100
})

tweakpane.addBinding(fireworksOptions, 'intensity', {
  label: '粒子数量',
  min: 1,
  max: 60
})

tweakpane.addBinding(fireworksOptions, 'friction', {
  label: '摩擦系数',
  min: 0.5,
  max: 3
})

tweakpane.addBinding(fireworksOptions, 'gravity', {
  label: '重力加速度',
  min: 0,
  max: 10
})

tweakpane.addBinding(fireworksOptions, 'opacity', {
  label: '颗粒不传导性',
  min: 0,
  max: 1,
  step: 0.1
})

tweakpane.addBinding(fireworksOptions, 'particles', {
  label: '爆炸时颗粒数量',
  step: 1,
  min: 1,
  max: 200
})

tweakpane.addBinding(fireworksOptions, 'traceLength', {
  label: '轨迹长度',
  min: 1,
  max: 10
})

tweakpane.addBinding(fireworksOptions, 'traceSpeed', {
  label: '轨迹速度',
  min: 1,
  max: 100,
  step: 1
})

tweakpane.addBinding(fireworksOptions, 'rocketsPoint', {
  label: '发射点数量',
  min: 0,
  max: 100,
  step: 1
})

tweakpane.addBinding(fireworksOptions.lineWidth!, 'explosion', {
  label: '线条宽度 (爆炸时)',
  min: 0,
  max: 10
})

tweakpane.addBinding(fireworksOptions.lineWidth!, 'trace', {
  label: '线条宽度 (上升时)',
  min: 0,
  max: 10
})

tweakpane.addBinding(fireworksOptions, 'lineStyle', {
  label: '线条风格',
  options: {
    round: 'round',
    square: 'square'
  }
})

/** mouse events */
const mouse = tweakpane.addFolder({
  title: '鼠标设置',
  expanded: false
})

mouse.addBinding(fireworksOptions.mouse!, 'click', {
  label: '单击鼠标'
})

mouse.addBinding(fireworksOptions.mouse!, 'max', {
  label: '烟花数量',
  min: 1,
  max: 15,
  step: 1
})

mouse.addBinding(fireworksOptions.mouse!, 'move', {
  label: '跟随鼠标'
})

/** sounds */
const sound = tweakpane.addFolder({
  title: '声音设置',
  expanded: false
})

sound.addBinding(fireworksOptions.sound!, 'enabled',{
  label: '启用'
})

sound.addBinding(fireworksOptions.sound!, 'volume', {
  label: '音量',
  min: 0,
  max: 100,
  step: 1
})

tweakpane.on('change', () => {
  fireworks.updateOptions(fireworksOptions)
})

/** background */
const background = tweakpane.addFolder({
  title: '背景设置',
  expanded: false
})

background.addBinding(backgroundConfig, 'container',{label: '容器'}).on('change', ({ value }) => {
  mainContainer.style.display = value ? 'none' : 'block'
})

background.addBinding(backgroundConfig, 'color', {label: '颜色'}).on('change', ({ value }) => {
  fireworksContainer.style.backgroundColor = value
})

background.addBinding(backgroundConfig, 'image', {label: '图片'}).on('change', ({ value }) => {
  fireworksContainer.style.backgroundImage = `url(${value})`
})

background.addBinding(backgroundConfig, 'size', {label: '大小'}).on('change', ({ value }) => {
  fireworksContainer.style.backgroundSize = value
})

background.addBinding(backgroundConfig, 'position', {label: '位置'}).on('change', ({ value }) => {
  fireworksContainer.style.backgroundPosition = value
})

background.addBinding(backgroundConfig, 'repeat', {label: '重复'}).on('change', ({ value }) => {
  fireworksContainer.style.backgroundRepeat = value
})

/** monitors */
const monitors = tweakpane.addFolder({
  title: '监控',
  expanded: false
})

const fpsGraph = monitors.addBlade({
  view: 'fpsgraph',
  label: '帧率'
}) as FpsGraphBladeApi

monitors.addBinding(fireworksGetters, 'particles', {
  view: 'graph',
  label: '颗粒数量',
  min: 0,
  max: 5000,
  readonly: true
})

monitors.addBinding(fireworksGetters, 'traces', {
  view: 'graph',
  label: '轨迹数量',
  min: 0,
  max: 50,
  readonly: true
})

const updateGraph = () => {
  fpsGraph.begin()
  fpsGraph.end()
  requestAnimationFrame(updateGraph)
}

requestAnimationFrame(updateGraph)

/** fullscreen */
declare global {
  interface Element {
    webkitRequestFullscreen?(): void
    mozRequestFullScreen?(): void
    msRequestFullscreen?(): void
  }
}

document.addEventListener('keydown', (event) => {
  if (event.code === 'F11') {
    event.preventDefault()

    if (fireworksContainer.requestFullscreen) {
      fireworksContainer.requestFullscreen()
    } else if (fireworksContainer.webkitRequestFullscreen) {
      fireworksContainer.webkitRequestFullscreen()
    } else if (fireworksContainer.mozRequestFullScreen) {
      fireworksContainer.mozRequestFullScreen()
    } else if (fireworksContainer.msRequestFullscreen) {
      fireworksContainer.msRequestFullscreen()
    }
  }
})
