import Vue from 'vue'
import Router from 'vue-router'
import init from '@/page/init'
import connect from '@/page/connect'
import motionmode from '@/page/motion/motionmode'
import rocker from '@/page/motion/rocker'
import step from '@/page/motion/step'
import mapto from '@/page/motion/mapto'
import showmap from '@/page/map/showmap'
import relocation from '@/page/map/relocation'
import changemap from '@/page/map/changemap'
import updatemap from '@/page/map/updatemap'
import realpose from '@/page/map/realpose'
import poito from '@/page/motion/poito'
import multipoito from '@/page/motion/multipoito'
import gohome from '@/page/motion/gohome'
import currenttask from '@/page/task/currenttask'
import poiaction from '@/page/task/poiaction'
import numtask from '@/page/task/numtask'
import lightbelt from '@/page/hardware/lightbelt'
import boxdoor from '@/page/hardware/boxdoor'
import sprayer from '@/page/hardware/sprayer'
import setvolume from '@/page/motion/setvolume'
import setspeed from '@/page/motion/setspeed'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'init',
      component: init
    },
    {
      path: '/connect',
      name: 'connect',
      component: connect
    },
    {
      path: '/motionmode',
      name: 'motionmode',
      component: motionmode
    },
    {
      path: '/rocker',
      name: 'rocker',
      component: rocker
    },
    {
      path: '/step',
      name: 'step',
      component: step
    },
    {
      path: '/mapto',
      name: 'mapto',
      component: mapto
    },
    {
      path: '/showmap',
      name: 'showmap',
      component: showmap
    },
    {
      path: '/relocation',
      name: 'relocation',
      component: relocation
    },
    {
      path: '/changemap',
      name: 'changemap',
      component: changemap
    },
    {
      path: '/updatemap',
      name: 'updatemap',
      component: updatemap
    },
    {
      path: '/realpose',
      name: 'realpose',
      component: realpose
    },
    {
      path: '/poito',
      name: 'poito',
      component: poito
    },
    {
      path: '/multipoito',
      name: 'multipoito',
      component: multipoito
    },
    {
      path: '/gohome',
      name: 'gohome',
      component: gohome
    },
    {
      path: '/currenttask',
      name: 'currenttask',
      component: currenttask
    },
    {
      path: '/poiaction',
      name: 'poiaction',
      component: poiaction
    },
    {
      path: '/numtask',
      name: 'numtask',
      component: numtask
    },
    {
      path: '/lightbelt',
      name: 'lightbelt',
      component: lightbelt
    },
    {
      path: '/boxdoor',
      name: 'boxdoor',
      component: boxdoor
    },
    {
      path: '/sprayer',
      name: 'sprayer',
      component: sprayer
    },
    {
      path: '/setvolume',
      name: 'setvolume',
      component: setvolume
    },
    {
      path: '/setspeed',
      name: 'setspeed',
      component: setspeed
    }
  ]
})
